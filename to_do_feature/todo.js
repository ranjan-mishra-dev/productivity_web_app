// Select elements
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

taskInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') addTask(); // Add task on Enter key
  });  

// Add a new task
addTaskButton.addEventListener('click', addTask);

// Handle task filtering
filterButtons.forEach(button => {
  button.addEventListener('click', filterTasks);
});

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => renderTask(task));
}

// Add a task to the list
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
    date: new Date().toLocaleString(), // Store creation date and time
  };

  renderTask(task);
  saveTask(task);
  taskInput.value = '';
}

// Render a single task
function renderTask(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;
  li.className = task.completed ? 'completed' : '';

  li.innerHTML = `
    <div class="task-text">${task.text}</div> 
    <div class="task-footer">
      <small>${task.date}</small>
      <div class="task-actions">
        <button onclick="toggleComplete(${task.id})">✔️</button>
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    </div>
  `;

  taskList.prepend(li); // Add the task to the top of the list
}

// Save task to localStorage
function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Toggle task completion
function toggleComplete(id) {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const task = tasks.find(task => task.id === id);
  task.completed = !task.completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  refreshTaskList();
}

// Edit a task
function editTask(id) {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const task = tasks.find(task => task.id === id);
  const newText = prompt('Edit task:', task.text);
  if (newText) task.text = newText;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  refreshTaskList();
}

// Delete a task
function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  refreshTaskList();
}

// Filter tasks based on category
function filterTasks(event) {
  const filter = event.target.dataset.filter;
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  let filteredTasks;
  const today = new Date().toDateString();

  switch (filter) {
    case 'today':
      filteredTasks = tasks.filter(task => new Date(task.date).toDateString() === today);
      break;
    case 'week':
      filteredTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        const now = new Date();
        return taskDate >= now && taskDate <= new Date(now.setDate(now.getDate() + 7));
      });
      break;
    case 'completed':
      filteredTasks = tasks.filter(task => task.completed);
      break;
    default:
      filteredTasks = tasks;
  }

  taskList.innerHTML = '';
  filteredTasks.forEach(task => renderTask(task));
}

// Refresh the task list
function refreshTaskList() {
  taskList.innerHTML = '';
  loadTasks();
}
