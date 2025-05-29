const forms = document.querySelectorAll(".form");
const tasksContainers = document.querySelectorAll(".tasks");
const addBtns = document.querySelectorAll(".add-btn");

let dragged = null;

addBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const form = btn.nextElementSibling;
    form.classList.toggle("hidden");
  });
});

forms.forEach((form) => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = this.querySelector("input:nth-child(1)").value;
    const desc = this.querySelector("input:nth-child(2)").value;
    const priority = this.querySelector("select").value;

    const createdAt = new Date();

    const task = createTaskElement(title, desc, priority, createdAt);
    this.parentElement.querySelector(".tasks").appendChild(task);
    this.reset();
  });
});

function createTaskElement(title, desc, priority, createdAt) {
  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;
  task.dataset.timestamp = createdAt.toISOString();

  task.style.setProperty("--priority-color", getPriorityColor(priority));

  task.innerHTML = `
    <div>
      <strong class="task-title">${title}</strong><br>
      <span class="task-desc">${desc}</span>
    </div>
    <div class="task-meta">
      <span class="priority ${priority.toLowerCase()}">${capitalize(
    priority
  )}</span>
      <div class="date-time">
        <span class="calendar-icon">🕒</span>
        <span class="created-date">${formatDate(createdAt)}</span>
        <span class="time-ago">${timeAgo(createdAt)}</span>
      </div>
    </div>
    <div class="task-buttons">
      <button class="edit-btn">✏️</button>
      <button class="delete-btn">🗑️</button>
    </div>
  `;

  addTaskListeners(task);
  return task;
}

function addTaskListeners(task) {
  addDragEvents(task);

  task
    .querySelector(".delete-btn")
    .addEventListener("click", () => task.remove());

  task.querySelector(".edit-btn").addEventListener("click", () => {
    const title = task.querySelector(".task-title").innerText;
    const desc = task.querySelector(".task-desc").innerText;
    const priority = task.querySelector(".priority").innerText.toLowerCase();

    const container = task.closest(".column");
    const form = container.querySelector(".form");

    task.remove();

    form.querySelector("input:nth-child(1)").value = title;
    form.querySelector("input:nth-child(2)").value = desc;
    form.querySelector("select").value = priority;

    form.classList.remove("hidden");
  });
}

function getPriorityColor(priority) {
  switch (priority) {
    case "high":
    case "urgent":
      return "#e53e3e";
    case "medium":
      return "#ed8936";
    case "low":
      return "#38a169";
  }
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // in seconds

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function addDragEvents(task) {
  task.addEventListener("dragstart", () => {
    dragged = task;
    task.classList.add("dragging");
  });
  task.addEventListener("dragend", () => {
    dragged = null;
    task.classList.remove("dragging");
    tasksContainers.forEach((c) =>
      c.parentElement.classList.remove("drag-over")
    );
  });
}

tasksContainers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    container.appendChild(dragged);
  });
  container.addEventListener("dragenter", () => {
    container.parentElement.classList.add("drag-over");
  });
  container.addEventListener("dragleave", () => {
    container.parentElement.classList.remove("drag-over");
  });
});

setInterval(() => {
  document.querySelectorAll(".task").forEach((task) => {
    const createdAt = new Date(task.dataset.timestamp);
    task.querySelector(".time-ago").textContent = timeAgo(createdAt);
  });
}, 60000);
