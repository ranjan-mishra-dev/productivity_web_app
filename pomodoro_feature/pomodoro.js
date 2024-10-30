let timer;
let cyclesCompleted = 0;
let totalCycles = 0;
let currentMode = 'work'; // 'work' or 'break'
let customSettings = { cycles: 1, workDuration: 25, breakDuration: 5 };
let timeLeft; // Remaining time in seconds
let isPaused = false; // Flag to track if the timer is paused

const timerDisplay = document.getElementById('timerDisplay');
const progressDisplay = document.getElementById('progressDisplay');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const customSettingsDiv = document.getElementById('customSettings');

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function showNotification(message) {
  if (Notification.permission === 'granted') {
    new Notification(message);
  } else {
    alert(message)
  }
}

function startTimer(duration, isBreak = false) {
  timeLeft = duration * 60; // Set the initial time left

  timer = setInterval(() => {
    if (!isPaused) {
      if (timeLeft <= 0) {
        clearInterval(timer);
        if (isBreak) {
          cyclesCompleted++;
          showNotification(`Break finished! Cycle ${cyclesCompleted} complete.`);
        } else {
          showNotification('Work session finished! Take a break.');
        }
        updateProgress();
        handleNextSession();
      } else {
        timeLeft--;
        updateTimerDisplay();
      }
    }
  }, 1000);
}

function handleNextSession() {
  if (cyclesCompleted < totalCycles) {
    currentMode = currentMode === 'work' ? 'break' : 'work';
    const nextDuration = currentMode === 'work' ? customSettings.workDuration : customSettings.breakDuration;
    startTimer(nextDuration, currentMode === 'break');
  } else {
    showNotification('All cycles completed! Great job!');
    resetUI();
  }
}

function updateProgress() {
  progressDisplay.textContent = `Cycles Completed: ${cyclesCompleted}/${totalCycles}`;
}

function startStandardPomodoro() {
  totalCycles = 1; // Default 4 cycles of 25m work, 5m break
  customSettings = { cycles: 1, workDuration: 1, breakDuration: 1 };
  startTimer(customSettings.workDuration);
  showControlButtons();
}

function startCustomPomodoro() {
  totalCycles = parseInt(document.getElementById('cycles').value) || 1;
  customSettings.workDuration = parseInt(document.getElementById('workDuration').value) || 25;
  customSettings.breakDuration = parseInt(document.getElementById('breakDuration').value) || 5;

  cyclesCompleted = 0;
  updateProgress();
  startTimer(customSettings.workDuration);
  showControlButtons();
}

function showControlButtons() {
  stopButton.style.display = 'inline-block';
  resetButton.style.display = 'inline-block';
}

function resetUI() {
  clearInterval(timer);
  timeLeft = 0; // Reset time left to 0
  updateTimerDisplay();
  cyclesCompleted = 0;
  progressDisplay.textContent = '';
  stopButton.style.display = 'none';
  resetButton.style.display = 'none';
  isPaused = false; // Reset pause flag
  stopButton.textContent = 'Stop'; // Reset button text
}

function toggleStopResume() {
  if (isPaused) {
    isPaused = false; // Resume the timer
    stopButton.textContent = 'Stop'; // Change button text to Stop
  } else {
    isPaused = true; // Pause the timer
    stopButton.textContent = 'Resume'; // Change button text to Resume
  }
}

document.getElementById('startStandard').addEventListener('click', startStandardPomodoro);

document.getElementById('customPomodoro').addEventListener('click', () => {
  customSettingsDiv.style.display = 'block';
});

document.getElementById('startCustom').addEventListener('click', startCustomPomodoro);

stopButton.addEventListener('click', toggleStopResume);
resetButton.addEventListener('click', resetUI);

if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}
