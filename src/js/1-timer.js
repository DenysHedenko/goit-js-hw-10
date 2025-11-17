import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const startBtn = document.querySelector("[data-start]");
const dateInput = document.querySelector("#datetime-picker");

startBtn.disabled = true;

let userSelectedDate = null;
let intervalId = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,

    onClose(selectedDates) {
    const selected = selectedDates[0];

    if (selected <= new Date()) {
        startBtn.disabled = true;
        iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        });
        return;
    }

    userSelectedDate = selected;
    startBtn.disabled = false;
    },
};

flatpickr("#datetime-picker", options);

startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    dateInput.disabled = true;

    intervalId = setInterval(() => {
    const delta = userSelectedDate - new Date();

    if (delta <= 0) {
        clearInterval(intervalId);
        updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        dateInput.disabled = false;
        return;
    }

    const time = convertMs(delta);
    updateTimerUI(time);
    }, 1000);
});

function updateTimerUI({ days, hours, minutes, seconds }) {
    document.querySelector("[data-days]").textContent = days;
    document.querySelector("[data-hours]").textContent = addLeadingZero(hours);
    document.querySelector("[data-minutes]").textContent = addLeadingZero(minutes);
    document.querySelector("[data-seconds]").textContent = addLeadingZero(seconds);
    }

    function addLeadingZero(value) {
    return String(value).padStart(2, "0");
    }

    function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}