// Мини-приложение "Список дел"
// Чистый JavaScript, без фреймворков. Все с комментариями.

// Массив всех задач.
// Каждая задача - это объект: { text: строка, done: true/false }
let tasks = [];

// Какой фильтр сейчас включен: 'all', 'active' или 'done'
let currentFilter = 'all';

// Находим нужные элементы на странице
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const counter = document.getElementById('counter');
const clearBtn = document.getElementById('clearBtn');
const filterButtons = document.querySelectorAll('.filters button');

// Загрузка задач из localStorage при старте
function loadTasks() {
  const saved = localStorage.getItem('myTasks');
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

// Сохранение задач в localStorage
function saveTasks() {
  localStorage.setItem('myTasks', JSON.stringify(tasks));
}

// Добавить новую задачу
function addTask() {
  const text = taskInput.value.trim();

  // Не добавляем пустую строку
  if (text === '') {
    alert('Введите текст задачи!');
    return;
  }

  // Кладем задачу в массив
  tasks.push({ text: text, done: false });

  // Очищаем поле ввода
  taskInput.value = '';
  taskInput.focus();

  saveTasks();
  render();
}

// Поменять статус задачи (выполнена / не выполнена)
function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  render();
}

// Удалить задачу по номеру
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  render();
}

// Удалить все выполненные задачи
function clearDone() {
  // Оставляем только невыполненные
  tasks = tasks.filter(function (task) {
    return !task.done;
  });
  saveTasks();
  render();
}

// Показать задачи на странице
function render() {
  // Очищаем список
  taskList.innerHTML = '';

  // Считаем, сколько осталось невыполненных
  let activeCount = 0;
  for (const task of tasks) {
    if (!task.done) {
      activeCount++;
    }
  }
  counter.textContent = 'Осталось: ' + activeCount;

  // Проходим по всем задачам
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    // Пропускаем задачи, которые не подходят под фильтр
    if (currentFilter === 'active' && task.done) {
      continue;
    }
    if (currentFilter === 'done' && !task.done) {
      continue;
    }

    // Создаем элемент списка
    const li = document.createElement('li');
    if (task.done) {
      li.className = 'done';
    }

    // Галочка (checkbox)
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    // При клике меняем статус именно этой задачи
    checkbox.onclick = function () {
      toggleTask(i);
    };

    // Текст задачи
    const span = document.createElement('span');
    span.textContent = task.text;

    // Кнопка удаления (крестик)
    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.className = 'delete-btn';
    delBtn.onclick = function () {
      deleteTask(i);
    };

    // Собираем все вместе
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  }

  // Если список пустой, показываем подсказку
  if (taskList.innerHTML === '') {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'Задач пока нет';
    taskList.appendChild(li);
  }
}

// --- Подключаем кнопки ---

// Кнопка "Добавить"
addBtn.onclick = addTask;

// Клавиша Enter в поле ввода тоже добавляет задачу
taskInput.onkeydown = function (event) {
  if (event.key === 'Enter') {
    addTask();
  }
};

// Кнопка "Очистить выполненные"
clearBtn.onclick = clearDone;

// Кнопки фильтров
for (const btn of filterButtons) {
  btn.onclick = function () {
    // Убираем подсветку у всех кнопок
    for (const b of filterButtons) {
      b.classList.remove('active');
    }
    // Подсвечиваем нажатую
    btn.classList.add('active');
    // Запоминаем выбранный фильтр
    currentFilter = btn.getAttribute('data-filter');
    render();
  };
}

// Старт программы: загрузить и показать задачи
loadTasks();
render();
