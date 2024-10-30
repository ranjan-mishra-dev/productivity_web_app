// Select DOM Elements
const habitNameInput = document.getElementById('habitName');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const addHabitButton = document.getElementById('addHabit');
const habitList = document.getElementById('habitList');

// Utility Function to Generate Date Range
function generateDateRange(start, end) {
  const dates = [];
  let currentDate = new Date(start);

  while (currentDate <= new Date(end)) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

// Load Habits from Local Storage on Page Load
window.addEventListener('load', () => {
  const habits = JSON.parse(localStorage.getItem('habits')) || [];
  habits.forEach(displayHabit);
});

// Add Habit on Button Click
addHabitButton.addEventListener('click', () => {
  const habitName = habitNameInput.value.trim();
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (!habitName || !startDate || !endDate) {
    alert('Please fill all fields!');
    return;
  }

  if (new Date(startDate) > new Date(endDate)) {
    alert('Start date cannot be after end date!');
    return;
  }

  const habit = { habitName, startDate, endDate };
  saveHabitToLocalStorage(habit);
  displayHabit(habit);

  // Clear Inputs
  habitNameInput.value = '';
  startDateInput.value = '';
  endDateInput.value = '';
});

// Save Habit to Local Storage
function saveHabitToLocalStorage(habit) {
  const habits = JSON.parse(localStorage.getItem('habits')) || [];
  habits.push(habit);
  localStorage.setItem('habits', JSON.stringify(habits));
}

// Remove Habit from Local Storage
function removeHabitFromLocalStorage(habitName) {
  const habits = JSON.parse(localStorage.getItem('habits')) || [];
  const updatedHabits = habits.filter(habit => habit.habitName !== habitName);
  localStorage.setItem('habits', JSON.stringify(updatedHabits));
}

// Display Habit Function
function displayHabit({ habitName, startDate, endDate }) {
  const dates = generateDateRange(startDate, endDate);
  const habitItem = document.createElement('div');
  habitItem.className = 'habit-item';

  // Habit Name Section
  const habitNameEl = document.createElement('div');
  habitNameEl.className = 'habit-name';
  habitNameEl.textContent = habitName;
  habitItem.appendChild(habitNameEl);

  // Delete Button
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    habitItem.remove();
    removeHabitFromLocalStorage(habitName);
  });
  habitItem.appendChild(deleteButton);

  // Streak Line with Circles
  const streakLine = document.createElement('div');
  streakLine.className = 'streak-line';

  let completedDays = 0;
  let missedDays = 0;
  const today = new Date();

  // Create Day Circles
  dates.forEach((date) => {
    const dayCircle = document.createElement('div');
    dayCircle.className = 'day-circle';
    dayCircle.textContent = date.getDate(); // Display day number only

    // Make the first day of each month larger
    if (date.getDate() === 1) {
      dayCircle.classList.add('first-day');
    }

    // Disable Future Dates from Interaction
    if (date > today) {
      dayCircle.classList.add('future');
    } else {
      // Toggle Check on Click
      dayCircle.addEventListener('click', () => {
        if (dayCircle.classList.toggle('checked')) {
          completedDays++;
          if (dayCircle.classList.contains('missed')) {
            dayCircle.classList.remove('missed');
            missedDays--;
          }
        } else {
          completedDays--;
          if (date < today) {
            dayCircle.classList.add('missed');
            missedDays++;
          }
        }
        updateStreakInfo();
      });
    }

    streakLine.appendChild(dayCircle);
  });

  habitItem.appendChild(streakLine);

  // Streak Info Section
  const streakInfo = document.createElement('div');
  streakInfo.className = 'streak-info';
  habitItem.appendChild(streakInfo);

  // Calculate Initial Missed Days
  missedDays = calculateMissedDays(dates);

  // Update Streak Info Initially
  updateStreakInfo();

  // Function to Update Streak Info
  function updateStreakInfo() {
    streakInfo.textContent = `Winning Days 🎉: ${completedDays}`;
  }

  habitList.appendChild(habitItem);
}

// Calculate Missed Days from Start Date to Today
function calculateMissedDays(dates) {
  const today = new Date();
  let missedCount = 0;

  dates.forEach((date) => {
    if (date < today) {
      missedCount++;
    }
  });

  return missedCount;
}
