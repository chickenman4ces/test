// ── State ──────────────────────────────────────────────────────────────────
let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let nextId = parseInt(localStorage.getItem('nextId') || '1', 10);

// ── DOM refs ────────────────────────────────────────────────────────────────
const form         = document.getElementById('todo-form');
const input        = document.getElementById('todo-input');
const list         = document.getElementById('todo-list');
const emptyMsg     = document.getElementById('empty-msg');
const clearBtn     = document.getElementById('clear-completed');
const taskCount    = document.getElementById('task-count');

// ── Persistence ─────────────────────────────────────────────────────────────
function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
  localStorage.setItem('nextId', String(nextId));
}

// ── Render ───────────────────────────────────────────────────────────────────
function render() {
  list.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' done' : '');
    li.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type    = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.setAttribute('aria-label', 'Mark as done');

    const label = document.createElement('span');
    label.className   = 'label';
    label.textContent = todo.text;

    const delBtn = document.createElement('button');
    delBtn.className   = 'delete-btn';
    delBtn.textContent = '✕';
    delBtn.setAttribute('aria-label', 'Delete task');

    // Events
    checkbox.addEventListener('change', () => toggleDone(todo.id));
    delBtn.addEventListener('click',    () => deleteTask(todo.id));

    li.append(checkbox, label, delBtn);
    list.appendChild(li);
  });

  const remaining = todos.filter(t => !t.done).length;
  emptyMsg.hidden  = todos.length > 0;
  taskCount.textContent =
    todos.length === 0
      ? ''
      : `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
}

// ── Actions ──────────────────────────────────────────────────────────────────
function addTask(text) {
  todos.push({ id: nextId++, text: text.trim(), done: false });
  save();
  render();
}

function toggleDone(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    save();
    render();
  }
}

function deleteTask(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

function clearCompleted() {
  todos = todos.filter(t => !t.done);
  save();
  render();
}

// ── Event listeners ──────────────────────────────────────────────────────────
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    addTask(text);
    input.value = '';
  }
});

clearBtn.addEventListener('click', clearCompleted);

// ── Initial render ───────────────────────────────────────────────────────────
render();
