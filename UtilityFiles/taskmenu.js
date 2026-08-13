import { dashboardInitialize } from "./dashboard.js";

import { initialize } from "../AddTasks/addtask.js";

const taskLists = document.querySelector(".todo-task-body ul");

const editTaskContainer = document.querySelector(".edit-Task-Container");
const editContainerCloseBtn = document.querySelector(
  ".edit-container-close-btn",
);

const taskTitle = document.querySelector("#edit-task-title");
const taskDescription = document.querySelector("#edit-task-description");
const taskPriority = document.querySelector("#edit-task-priority");
const taskCategory = document.querySelector("#edit-task-category");

const error = document.querySelectorAll(".error");
const titleError = document.querySelector(".edit-title-error");
const descriptionError = document.querySelector(".edit-description-error");
const priorityError = document.querySelector(".edit-priority-error");
const categoryError = document.querySelector(".edit-category-error");

const editTaskButton = document.querySelector("#edit-task-btn");

const messageSection = document.querySelector(".message-section");
const message = document.querySelector(".message");

const confirmSectionDelete = document.querySelector(".confirm-delete-section");
const confirmDelete = document.querySelector("#confirmBtn");
const dontDelete = document.querySelector("#dontBtn");

const highPriorityTasks = document.querySelector("#high-priority-tasks");

let delTaskIndex;
let delTaskContainer;
taskLists.addEventListener("click", (event) => {
  if (event.target.classList.contains("task-menu-btn")) {
    const menu = event.target.parentElement.lastElementChild;
    menu.classList.toggle("display-block");
  }
  if (event.target.classList.contains("edit")) {
    event.target.parentElement.classList.toggle("display-block");
    const index = event.target.dataset.editIndex;
    edit(index);
  }
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.classList.toggle("display-block");
    const index = event.target.dataset.deleteIndex;
    delTaskIndex = Number(index);
    delTaskContainer = event.target.closest(".task-div");
    displayBlock(confirmSectionDelete);
  }
  if (event.target.classList.contains("in-progress")) {
    inProgress(event);
  }
});

dontDelete.addEventListener("click", () => {
  displayNone(confirmSectionDelete);
});

confirmDelete.addEventListener("click", () => {
  displayNone(confirmSectionDelete);
  deleteTask();
  dashboardInitialize();
  initialize();
});

let taskIndex;
// Function to edit
function edit(index) {
  const allTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
  taskIndex = Number(index);

  displayBlock(editTaskContainer);

  taskTitle.value = allTasks[taskIndex].title;
  taskDescription.value = allTasks[taskIndex].description;
  taskPriority.value = allTasks[taskIndex].priority;
  taskCategory.value = allTasks[taskIndex].category;
}

editTaskButton.addEventListener("click", validate);

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

  editTask(title, description, priority, category);

  taskTitle.value = "";
  taskDescription.value = "";
  taskPriority.value = "";
  taskCategory.value = "";

  displayNone(editTaskContainer);
}

function validateInputs(title, description, priority, category) {
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
function editTask(title, description, priority, category) {
  const allTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

  const now = new Date();
  const time = now.toLocaleTimeString();

  allTasks[taskIndex].title = title;
  allTasks[taskIndex].description = description;
  allTasks[taskIndex].priority = priority;
  allTasks[taskIndex].category = category;
  allTasks[taskIndex].updatedTime = time;

  localStorage.setItem("todoTasks", JSON.stringify(allTasks));

  displayBlock(messageSection);

  message.textContent = "Task Updated Successfully";

  setTimeout(() => {
    displayNone(messageSection);
  }, 3000);

  dashboardInitialize();
  initialize();
}

//to close edit task container
editContainerCloseBtn.addEventListener("click", () => {
  displayNone(editTaskContainer);
});

// Function to delete tasks
function deleteTask() {
  const allTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

  allTasks.splice(delTaskIndex, 1);
  localStorage.setItem("todoTasks", JSON.stringify(allTasks));

  delTaskContainer.parentElement.remove();

  displayBlock(messageSection);

  message.textContent = "Task Deleted Successfully";

  setTimeout(() => {
    displayNone(messageSection);
  }, 3000);
}

// To highlight In progress tasks
function inProgress(event) {
  const allTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

  const index = event.target.parentElement.children[0].dataset.editIndex;
  allTasks[index].status = "In Progress";
  localStorage.setItem("todoTasks", JSON.stringify(allTasks));

  dashboardInitialize();
  initialize();
}
