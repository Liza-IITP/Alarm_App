let clock_time = document.getElementById("clock");
let currentTime = new Date();
let update_time = document.getElementById("update");

//  Update the clock every second
function updateClock() {
    currentTime = new Date();
    clock_time.innerHTML = currentTime.toLocaleTimeString();
}
// On page load, set the clock and start the interval
window.onload = () => {
    updateClock(); // run once immediately
    setInterval(updateClock, 1000); // then every second
};

// Notification for 5 seconds
let message = document.getElementById("message");

function showMessage(html) {
    message.innerHTML = html;
    setTimeout(() => {
        message.innerHTML = '';
    }, 5000);
}

// Check alarm time format and validity using regex
function checkalarmtime() {
    let input = document.getElementById("alarmTime");
    let ampm = document.getElementById("ampm");
    let alarmTime = input.value.trim();
    let regex = /^(\d{1,2}):(\d{1,2})(:(\d{1,2}))?$/;
    let match = alarmTime.match(regex);
    if (match) {
        let hour = parseInt(match[1], 10);
        let minute = parseInt(match[2], 10);
        let second = match[4] ? parseInt(match[4], 10) : 0;
        if (hour > 23 || minute > 59 || second > 59) {
            showMessage(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Invalid time value. Please use valid hour, minute, and second.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`);
            return null;
        }
        // Allow 24-hour format if hour > 12 and no AM/PM selected
        if (!match[4] && ampm.value === "" && hour > 12) {
            // Accept as 24-hour format
        } else if (!match[4] && ampm.value === "") {
            showMessage(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Please select AM or PM for 12-hour format, or choose 24h for 24-hour format.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`);
            return null;
        }
        if (ampm.value === "AM" && hour === 12) hour = 0;
        if (ampm.value === "PM" && hour < 12) hour += 12;
        let formatted = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
        showMessage(`<div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Success!</strong> Alarm time set to ${formatted}.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`);
        return formatted;
    } else {
        showMessage(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error!</strong> Invalid time format. Please use HH:MM or HH:MM:SS.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`);
        return null;
    }
}

// Alarm sound

let alarmTimeout = null;
let alarmSound = document.getElementById("alarmSound");

// Set alarm function
function setAlarm() {
    let alarmTime = checkalarmtime();
    if (alarmTime) {
        let alarmTimeParts = alarmTime.split(":");
        let alarmDate = new Date();
        alarmDate.setHours(parseInt(alarmTimeParts[0], 10));
        alarmDate.setMinutes(parseInt(alarmTimeParts[1], 10));
        alarmDate.setSeconds(alarmTimeParts[2] ? parseInt(alarmTimeParts[2], 10) : 0);
        let currentTime = new Date();
        if (alarmDate <= currentTime) {
            alarmDate.setDate(alarmDate.getDate() + 1);
        }
        let timeout = alarmDate - currentTime;
        if (timeout > 0) {
            // Show countdown
            let countdownElem = document.getElementById("alarmCountdown");
            if (!countdownElem) {
                countdownElem = document.createElement("div");
                countdownElem.id = "alarmCountdown";
                countdownElem.className = "text-center mt-2 text-primary";
                document.querySelector(".container").appendChild(countdownElem);
            }
            function updateCountdown() {
                let now = new Date();
                let diff = alarmDate - now;
                if (diff <= 0) {
                    countdownElem.innerText = "Alarm!";
                    return;
                }
                let hours = Math.floor(diff / (1000 * 60 * 60));
                let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((diff % (1000 * 60)) / 1000);
                countdownElem.innerText = `Time to alarm: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                countdownElem.style.fontWeight = 'bold';
                countdownElem.style.fontSize = '1.2rem';
                countdownElem.style.letterSpacing = '1px';
                countdownElem.style.fontFamily = 'monospace';
                countdownElem.style.color = '#0d6efd';
                countdownElem.style.transition = 'color 0.3s';
                countdownElem.style.marginBottom = '10px';
                countdownElem.style.marginTop = '10px';
                countdownElem.style.background = '#e7f1ff';
                countdownElem.style.borderRadius = '8px';
                countdownElem.style.padding = '6px 0';
                setTimeout(updateCountdown, 1000);
            }
            updateCountdown();
            alarmTimeout = setTimeout(function() {
                alarmSound.currentTime = 0;
                alarmSound.play();
                document.getElementById("alarmStatus").innerText = "Alarm ringing!";
                if (countdownElem) countdownElem.innerText = "Alarm!";
                alarmTimeout = setTimeout(clearAlarm, 60000);
            }, timeout);
        } else {
            showMessage(`<div id="Nope!" class ="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Error!</strong> Alarm time must be in the future.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`);
        }
    }
}
// Clear alarm function
function clearAlarm() {
    if (alarmTimeout) {
        clearTimeout(alarmTimeout);
        alarmTimeout = null;
    }
    if (alarmSound) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }
    document.getElementById("alarmStatus").innerText = "Alarm cleared.";
    // Remove countdown
    let countdownElem = document.getElementById("alarmCountdown");
    if (countdownElem) countdownElem.remove();
    setTimeout(function() {
        document.getElementById("alarmStatus").innerText = "Set a new alarm.🔔";
    }, 1000);
    showMessage(`<div id="Success!" class ="alert alert-success alert-dismissible fade show" role="alert">
      <strong>Success!</strong> Alarm cleared.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`);
    document.getElementById("alarmTime").value = "";
}