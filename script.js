const taskInput = document.getElementById("taskInput")
const addBtn = document.getElementById("addBtn")
const tasksList = document.getElementById("tasksList")
const emptyState = document.getElementById("emptyState")
const totalTasksEl = document.getElementById("totalTasks")
const pendingTasksEl = document.getElementById("pendingTasks")
const completedTasksEl = document.getElementById("completedTasks")

function getTasksFromStorage() {
  const tasks = localStorage.getItem("tasks")
  return tasks ? JSON.parse(tasks) : []
}

function saveTasksToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function addTask(text) {
  if (!text.trim()) {
    shakeInput()
    return
  }

  const task = {
    id: generateId(),
    text: text.trim(),
    completed: false,
  }

  const tasks = getTasksFromStorage()
  tasks.unshift(task)
  saveTasksToStorage(tasks)

  taskInput.value = ""
  renderTasks()
  addRippleEffect()
}

function completeTask(taskId) {
  const tasks = getTasksFromStorage()
  const taskIndex = tasks.findIndex((t) => t.id === taskId)

  if (taskIndex !== -1) {
    const taskElement = document.querySelector(`[data-id="${taskId}"]`)
    if (taskElement) {
      taskElement.classList.add("completing")

      setTimeout(() => {
        tasks[taskIndex].completed = true
        saveTasksToStorage(tasks)
        renderTasks()
      }, 500)
    }
  }
}

function renderTasks() {
  const tasks = getTasksFromStorage()

  if (tasks.length === 0) {
    emptyState.classList.remove("hidden")
    tasksList.innerHTML = ""
  } else {
    emptyState.classList.add("hidden")

    tasksList.innerHTML = tasks
      .map(
        (task) => `
      <div class="task-item ${task.completed ? "completed" : ""}" data-id="${task.id}">
        <div class="task-content">
          <p class="task-text">${escapeHtml(task.text)}</p>
          <span class="status-badge ${task.completed ? "completed" : "pending"}">
            <span class="status-dot"></span>
            ${task.completed ? "Completed" : "Pending"}
          </span>
        </div>
        ${
          !task.completed
            ? `
          <button class="complete-btn" onclick="completeTask('${task.id}')">
            Complete
          </button>
        `
            : ""
        }
      </div>
    `,
      )
      .join("")
  }

  updateStats(tasks)
}

function updateStats(tasks) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.completed).length
  const pending = total - completed

  animateValue(totalTasksEl, total)
  animateValue(pendingTasksEl, pending)
  animateValue(completedTasksEl, completed)
}

function animateValue(element, value) {
  element.style.transform = "scale(1.2)"
  element.textContent = value
  setTimeout(() => {
    element.style.transform = "scale(1)"
  }, 150)
}

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

function shakeInput() {
  taskInput.style.animation = "none"
  taskInput.offsetHeight
  taskInput.style.animation = "shake 0.4s ease"
  taskInput.style.borderColor = "#ef4444"

  setTimeout(() => {
    taskInput.style.borderColor = ""
  }, 1000)
}

function addRippleEffect() {
  addBtn.classList.add("ripple")
  setTimeout(() => {
    addBtn.classList.remove("ripple")
  }, 400)
}

addBtn.addEventListener("click", () => {
  addTask(taskInput.value)
})

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask(taskInput.value)
  }
})

document.addEventListener("DOMContentLoaded", () => {
  renderTasks()

  setTimeout(() => {
    taskInput.focus()
  }, 800)
})

const shakeStyle = document.createElement("style")
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-8px); }
    80% { transform: translateX(8px); }
  }
`
document.head.appendChild(shakeStyle)
