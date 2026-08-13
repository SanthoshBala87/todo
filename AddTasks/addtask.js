import { dashboardInitialize } from "../UtilityFiles/dashboard.js";

const taskTitle = document.querySelector("#add-task-title");
const taskDescription = document.querySelector("#add-task-description");
const taskPriority = document.querySelector("#add-task-priority");
const taskCategory = document.querySelector("#add-task-category");

const error = document.querySelectorAll(".error");
const titleError = document.querySelector(".add-title-error");
const descriptionError = document.querySelector(".add-description-error");
const priorityError = document.querySelector(".add-priority-error");
const categoryError = document.querySelector(".add-category-error");

const addTaskButton = document.querySelector("#add-Task-button");

const noTask = document.querySelector(".no-task");
const todoTaskBody = document.querySelector(".todo-task-body");
const taskLists = document.querySelector(".todo-task-body ul");

const messageSection = document.querySelector(".message-section");
const message = document.querySelector(".message");

const taskTemplate = document.querySelector(".task-template");

initialize();
// Function to initialize all tasks when loaded
export function initialize() {
  const tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
  if (tasks.length === 0) {
    displayBlock(noTask);
    displayNone(todoTaskBody);
  } else {
    displayNone(noTask);
    displayBlock(todoTaskBody);

    createElement();

    const todoLists = document.querySelectorAll(".todo-task-body ul li");

    priority(todoLists);

    category(todoLists);

    status(todoLists);

    dashboardInitialize();
  }
}

// Creating list items dynamically
export function createElement() {
  taskLists.innerHTML = "";

  const tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

  tasks.forEach((task, index) => {
    const clone = taskTemplate.content.cloneNode(true);
    const li = clone.querySelector("li");

    const title = li.querySelector(".task-title");
    title.textContent = task.title;
    const description = li.querySelector(".task-description");
    description.textContent = task.description;
    const category = li.querySelector(".category");
    category.textContent = task.category;
    const date = li.querySelector(".date");
    date.textContent = task.date;
    const priority = li.querySelector(".priority");
    priority.textContent = task.priority;
    const status = li.querySelector(".status");
    status.textContent = task.status;
    const time = li.querySelector(".time");
    time.textContent = task.time;
    const overdue = li.querySelector(".overdue");
    overdue.textContent = task.overDue;
    const edit = li.querySelector(".edit");
    edit.setAttribute("data-edit-index", index);
    const deleteIndex = li.querySelector(".delete");
    deleteIndex.setAttribute("data-delete-index", index);

    taskLists.appendChild(li);
  });
}

// Function to highlight priority Dynamically
export function priority(todoLists) {
  todoLists.forEach((task) => {
    const priorityContainer =
      task.firstElementChild.children[1].lastElementChild.children[2];
    const priorityText =
      task.firstElementChild.children[1].lastElementChild.children[2]
        .textContent;
    if (priorityText === "Low") {
      priorityContainer.classList.add("low-priority");
    } else if (priorityText === "Medium") {
      priorityContainer.classList.add("medium-priority");
    } else if (priorityText === "High") {
      priorityContainer.classList.add("high-priority");
    }
  });
}

// Function to highlight category dynamically each time while refresh
export function category(todoLists) {
  todoLists.forEach((task) => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const categoryContainer =
      task.firstElementChild.children[1].lastElementChild.firstElementChild;

    categoryContainer.style.border = `1px solid rgb(${r}, ${g}, ${b})`;
  });
}

// Function to Change Style for completed tasks dynamically
function status(todoLists) {
  todoLists.forEach((task) => {
    if (
      task.firstElementChild.children[1].lastElementChild.children[3]
        .textContent === "Completed"
    ) {
      task.firstElementChild.classList.add("taskCompleted");
      task.firstElementChild.children[1].firstElementChild.classList.add(
        "taskCompleted-content",
      );
      task.firstElementChild.firstElementChild.firstElementChild.firstElementChild.classList.add(
        "display-flex",
      );
      task.firstElementChild.lastElementChild.classList.add(
        "visibility-hidden",
      );
    }

    if (
      task.firstElementChild.children[1].lastElementChild.children[3]
        .textContent === "In Progress"
    ) {
      task.classList.add("styleInProgress");
      task.firstElementChild.lastElementChild.classList.add(
        "visibility-hidden",
      );
    }
  });
}

addTaskButton.addEventListener("click", validate);

// Function To Validate Inputs
function validate() {
  const title = taskTitle.value.trim();
  const description = taskDescription.value.trim();
  const priority = taskPriority.value;
  const category = taskCategory.value;

  const isWrong = validateInputs(title, description, priority, category);
  if (isWrong) {
    return;
  }

  error.forEach((msg) => {
    displayNone(msg);
  });

  addTask(title, description, priority, category);

  taskTitle.value = "";
  taskDescription.value = "";
  taskPriority.value = "";
  taskCategory.value = "";

  displayNone(addTaskContainer);
}

export function validateInputs(title, description, priority, category) {
  if (
    title === "" ||
    title.length > 50 ||
    description.length > 250 ||
    priority === "" ||
    category === ""
  ) {
    if (title === "" || title.length > 50) {
      displayBlock(titleError);
    } else {
      displayNone(titleError);
    }

    if (description.length > 250) {
      displayBlock(descriptionError);
    } else {
      displayNone(descriptionError);
    }

    if (priority === "") {
      displayBlock(priorityError);
    } else {
      displayNone(priorityError);
    }

    if (category === "") {
      displayBlock(categoryError);
    } else {
      displayNone(categoryError);
    }

    return true;
  }
}

// Funtion To Add Tasks
function addTask(title, description, priority, category) {
  const taskDetails = {};
  let taskId;
  const tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

  if (tasks.length === 0) {
    taskId = 1;
  } else {
    taskId = tasks[tasks.length - 1].id + 1;
  }

  for (let task of tasks) {
    if (task.title.toLowerCase() === title.toLowerCase()) {
      displayBlock(messageSection);
      message.textContent = "Task Allready Exists";

      setTimeout(() => {
        displayNone(messageSection);
      }, 3000);
      return;
    }
  }

  taskDetails.id = taskId;
  taskDetails.title = title;
  taskDetails.description = description;
  taskDetails.priority = priority;
  taskDetails.category = category;
  taskDetails.status = "Pending";
  taskDetails.overDue = "No";

  const now = new Date();
  const date = now.toDateString().split(" ");
  const time = now.toLocaleTimeString();

  taskDetails.date = `${date[2]} ${date[1]} ${date[3]}`;
  taskDetails.time = time;

  taskDetails.updatedDate = `${date[2]} ${date[1]} ${date[3]}`;
  taskDetails.updatedTime = time;

  tasks.push(taskDetails);

  localStorage.setItem("todoTasks", JSON.stringify(tasks));

  displayBlock(messageSection);
  message.textContent = "Task Added Successfully";

  setTimeout(() => {
    displayNone(messageSection);
  }, 3000);

  initialize();
}

// Mark finished
taskLists.addEventListener("click", (event) => {
  const tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
  const markCompleted = event.target.classList.contains("mark-completed");
  if (markCompleted) {
    event.target.closest(".task-div").classList.add("taskCompleted");
    event.target.parentElement.nextElementSibling.firstElementChild.classList.add(
      "taskCompleted-content",
    );
    event.target.firstElementChild.classList.add("display-flex");

    const index = Number(
      event.target.closest(".task-div").lastElementChild.lastElementChild
        .firstElementChild.dataset.editIndex,
    );
    tasks[index].status = "Completed";
    localStorage.setItem("todoTasks", JSON.stringify(tasks));

    initialize();
  }
});

// Remove finished
taskLists.addEventListener("click", (event) => {
  const tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
  const removeCompleted = event.target.classList.contains("display-flex");
  if (removeCompleted) {
    event.target.closest(".task-div").classList.remove("taskCompleted");
    event.target
      .closest(".checkbox-section")
      .nextElementSibling.firstElementChild.classList.remove(
        "taskCompleted-content",
      );
    event.target.classList.remove("display-flex");

    const index = Number(
      event.target.closest(".task-div").lastElementChild.lastElementChild
        .firstElementChild.dataset.editIndex,
    );
    tasks[index].status = "Pending";
    localStorage.setItem("todoTasks", JSON.stringify(tasks));

    initialize();
  }
});
