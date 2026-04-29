let selectedColor = "#000000";
let timeMode = "none";
let timerInterval = null;
let stopwatchInterval = null;
let stopwatchTime = 0;
let stopwatchRunning = false;
let timerTime = 300; // 5 minutes in seconds

const colorPicker = document.getElementById("colorPicker");
const hexInput = document.getElementById("hexInput");
const colorDisplay = document.getElementById("colorDisplay");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const fullscreenView = document.getElementById("fullscreenView");
const closeBtn = document.getElementById("closeBtn");
const timeDisplay = document.getElementById("timeDisplay");
const timeBtns = document.querySelectorAll(".time-btn");
const presetColors = document.querySelectorAll(".preset-color");
const stopwatchControls = document.getElementById("stopwatchControls");
const startStopBtn = document.getElementById("startStop");
const resetBtn = document.getElementById("reset");

function updateColor(color) {
  selectedColor = color;
  colorPicker.value = color;
  hexInput.value = color.toUpperCase();
  colorDisplay.style.background = color;
  fullscreenView.style.background = color;
}

colorPicker.addEventListener("input", (e) => updateColor(e.target.value));

hexInput.addEventListener("input", (e) => {
  let value = e.target.value;
  if (!value.startsWith("#")) value = "#" + value;
  if (/^#[0-9A-F]{6}$/i.test(value)) {
    updateColor(value);
  }
});

presetColors.forEach((preset) => {
  preset.addEventListener("click", () => {
    updateColor(preset.dataset.color);
  });
});

timeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    timeBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    timeMode = btn.dataset.mode;
    stopTimer();
    stopStopwatch();
  });
});

function updateClock() {
  const now = new Date();
  // const hours = String(now.getHours()).padStart(2, "0");
  const hours = "02";
  const minutes = "00"; //String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  timeDisplay.textContent = `${hours}:${minutes}:${seconds} AM`;
}

function updateTimer() {
  if (timerTime <= 0) {
    stopTimer();
    timeDisplay.textContent = "00:00";
    return;
  }
  const minutes = Math.floor(timerTime / 60);
  const seconds = timerTime % 60;
  timeDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  timerTime--;
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    timerTime = 300;
  }
}

function updateStopwatch() {
  const hours = Math.floor(stopwatchTime / 3600);
  const minutes = Math.floor((stopwatchTime % 3600) / 60);
  const seconds = stopwatchTime % 60;
  timeDisplay.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startStopwatch() {
  stopwatchRunning = true;
  startStopBtn.textContent = "Pause";
  stopwatchInterval = setInterval(() => {
    stopwatchTime++;
    updateStopwatch();
  }, 1000);
}

function pauseStopwatch() {
  stopwatchRunning = false;
  startStopBtn.textContent = "Resume";
  clearInterval(stopwatchInterval);
}

function stopStopwatch() {
  stopwatchRunning = false;
  startStopBtn.textContent = "Start";
  if (stopwatchInterval) {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
  }
}

function resetStopwatch() {
  stopStopwatch();
  stopwatchTime = 0;
  updateStopwatch();
}

startStopBtn.addEventListener("click", () => {
  if (stopwatchRunning) {
    pauseStopwatch();
  } else {
    startStopwatch();
  }
});

resetBtn.addEventListener("click", resetStopwatch);

fullscreenBtn.addEventListener("click", () => {
  fullscreenView.classList.add("active");

  if (timeMode === "clock") {
    timeDisplay.classList.add("active");
    updateClock();
    timerInterval = setInterval(updateClock, 1000);
    stopwatchControls.classList.remove("active");
  } else if (timeMode === "timer") {
    timeDisplay.classList.add("active");
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
    stopwatchControls.classList.remove("active");
  } else if (timeMode === "stopwatch") {
    timeDisplay.classList.add("active");
    updateStopwatch();
    stopwatchControls.classList.add("active");
  } else {
    timeDisplay.classList.remove("active");
    stopwatchControls.classList.remove("active");
  }

  if (fullscreenView.requestFullscreen) {
    fullscreenView.requestFullscreen();
  } else if (fullscreenView.webkitRequestFullscreen) {
    fullscreenView.webkitRequestFullscreen();
  } else if (fullscreenView.msRequestFullscreen) {
    fullscreenView.msRequestFullscreen();
  }
});

function exitFullscreen() {
  fullscreenView.classList.remove("active");
  timeDisplay.classList.remove("active");
  stopwatchControls.classList.remove("active");
  stopTimer();
  stopStopwatch();

  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

closeBtn.addEventListener("click", exitFullscreen);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && fullscreenView.classList.contains("active")) {
    exitFullscreen();
  }
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    fullscreenView.classList.remove("active");
    timeDisplay.classList.remove("active");
    stopwatchControls.classList.remove("active");
    stopTimer();
    stopStopwatch();
  }
});

updateColor("#000000");
