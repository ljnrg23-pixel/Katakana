// To-Do List App with Local Storage

const STORAGE_KEY = 'todo-list-items';
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const taskCount = document.getElementById('taskCount');
const clearBtn = document.getElementById('clearBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = [];
let currentFilter = 'all';

// Initialize app
function init() {
  loadTodos();
  render();
  setupEventListeners();
}

// Load todos from localStorage
function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  todos = stored ? JSON.parse(stored) : [];
}

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Setup event listeners
function setupEventListeners() {
  todoForm.addEventListener('submit', addTodo);
  clearBtn.addEventListener('click', clearCompleted);
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });
}

// Add a new todo
function addTodo(e) {
  e.preventDefault();
  const text = todoInput.value.trim();

  if (text === '') {
    alert('Please enter a task');
    return;
  }

  const todo = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(todo);
  saveTodos();
  todoInput.value = '';
  todoInput.focus();
  render();
}

// Toggle todo completion
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    render();
  }
}

// Delete a todo
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  render();
}

// Clear completed todos
function clearCompleted() {
  const completedCount = todos.filter(t => t.completed).length;
  if (completedCount === 0) {
    alert('No completed tasks to clear');
    return;
  }
  if (confirm(`Clear ${completedCount} completed task(s)?`)) {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    render();
  }
}

// Set filter
function setFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
  render();
}

// Get filtered todos
function getFilteredTodos() {
  switch (currentFilter) {
    case 'active':
      return todos.filter(t => !t.completed);
    case 'completed':
      return todos.filter(t => t.completed);
    case 'all':
    default:
      return todos;
  }
}

// Render the todo list
function render() {
  const filtered = getFilteredTodos();
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <p>No tasks yet. Add one to get started!</p>
      </div>
    `;
    taskCount.textContent = '0 tasks';
    clearBtn.disabled = true;
    return;
  }

  if (filtered.length === 0) {
    todoList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🎉</div>
        <p>
          ${currentFilter === 'completed' ? 'No completed tasks yet!' : 'No active tasks!'}
        </p>
      </div>
    `;
    taskCount.textContent = `${todos.length} task${todos.length !== 1 ? 's' : ''}`;
    clearBtn.disabled = todos.some(t => t.completed) === false;
    return;
  }

  // Render filtered todos
  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <input
        type="checkbox"
        class="checkbox"
        ${todo.completed ? 'checked' : ''}
        onchange="toggleTodo(${todo.id})"
      />
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    todoList.appendChild(li);
  });

  // Update task count
  const activeCount = todos.filter(t => !t.completed).length;
  taskCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''}`;

  // Enable/disable clear button
  clearBtn.disabled = !todos.some(t => t.completed);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}