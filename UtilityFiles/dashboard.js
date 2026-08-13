import { initialize } from "../AddTasks/addtask.js";

const totalTasks = document.querySelector("#total-tasks");
const pendingTasks = document.querySelector("#pending-tasks");
const inProgressTasks = document.querySelector("#in-progress-tasks");
const completedTasks = document.querySelector("#completed-tasks");
const highPriorityTasks = document.querySelector("#high-priority-tasks");
const overdueTasks = document.querySelector("#overdue-tasks");

dashboardInitialize();

export function dashboardInitialize() {
  totalTasks.lastElementChild.lastElementChild.textContent = "";
  pendingTasks.lastElementChild.lastElementChild.textContent = "";
  inProgressTasks.lastElementChild.lastElementChild.textContent = "";
  completedTasks.lastElementChild.lastElementChild.textContent = "";
  highPriorityTasks.lastElementChild.lastElementChild.textContent = "";
  overdueTasks.lastElementChild.lastElementChild.textContent = "";

  const tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

  calcTotalTasks(tasks);

  calcPendingTasks(tasks);

  calcInProgressTasks(tasks);

  calcCompletedTasks(tasks);

  calcHighPriorityTasks(tasks);

  calcOverdueTasks();

  checkTasks();
}

// Function to calculate total tasks
function calcTotalTasks(tasks) {
  totalTasks.lastElementChild.lastElementChild.textContent = tasks.length;
}

// Function to calculate pending tasks
function calcPendingTasks(tasks) {
  const total = calcTasks("Pending", tasks, "status");
  pendingTasks.lastElementChild.lastElementChild.textContent = total;
}

// Function to calculate in progress Tasks
function calcInProgressTasks(tasks) {
  const total = calcTasks("In Progress", tasks, "status");
  inProgressTasks.lastElementChild.lastElementChild.textContent = total;
}

// Function to calculate completed tasks
function calcCompletedTasks(tasks) {
  const total = calcTasks("Completed", tasks, "status");
  completedTasks.lastElementChild.lastElementChild.textContent = total;
}

// Function to calculate high priority tasks
function calcHighPriorityTasks(tasks) {
  const total = calcTasks("High", tasks, "priority");
  highPriorityTasks.lastElementChild.lastElementChild.textContent = total;
}

// function to calculate required tasks
function calcTasks(details, tasks, action) {
  let total = 0;
  tasks.forEach((task) => {
    if (task[action] === details) total += 1;
  });
  return total;
}

// Function to calculate overdue tasks
function calcOverdueTasks() {
  const tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

  const today = new Date();
  const date = today.toDateString().split(" ");
  const checkDueDate = `${date[2]} ${date[1]} ${date[3]}`;

  let total = 0;
  tasks.forEach((task) => {
    if (task.date < checkDueDate && task.status !== "Completed") {
      total += 1;
      task.overDue = "Yes";
    }
  });

  localStorage.setItem("todoTasks", JSON.stringify(tasks));

  dueTasks();

  overdueTasks.lastElementChild.lastElementChild.textContent = total;
}

// Function to highlight Due Tasks
function dueTasks() {
  const todoLists = document.querySelectorAll(".todo-task-body ul li");
  todoLists.forEach((task) => {
    const dueTaskContainer = task.firstElementChild;
    const dueTaskText =
      task.firstElementChild.children[1].lastElementChild.children[5]
        .textContent;
    const checkboxSection = task.firstElementChild.firstElementChild;

    if (dueTaskText === "Yes") {
      dueTaskContainer.classList.add("due-task");
      checkboxSection.classList.add("visibility-hidden");
    }
  });
}

// Function to disable Yesterday Task
function checkTasks() {
  const tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

  const today = new Date();
  const date = today.toDateString().split(" ");
  const checkDueDate = `${date[2]} ${date[1]} ${date[3]}`;

  const todoLists = document.querySelectorAll(".todo-task-body ul li");
  let total = 0;
  todoLists.forEach((task) => {
    const oldTaskStatusText =
      task.firstElementChild.children[1].lastElementChild.children[1]
        .textContent;
    const checkboxSection = task.firstElementChild.firstElementChild;

    if (oldTaskStatusText < checkDueDate) {
      checkboxSection.classList.add("visibility-hidden");
      total += 1;
    }
  });

  if (tasks.length === total && tasks.length > 0) {
    const oldTasks = JSON.parse(localStorage.getItem("oldTasks")) || [];
    console.log(oldTasks);
    const allTasks = {};
    allTasks[tasks[0].date] = tasks;
    oldTasks.push(allTasks);

    localStorage.setItem("oldTasks", JSON.stringify(oldTasks));

    localStorage.removeItem("todoTasks");

    totalTasks.lastElementChild.lastElementChild.textContent = "0";
    pendingTasks.lastElementChild.lastElementChild.textContent = "0";
    inProgressTasks.lastElementChild.lastElementChild.textContent = "0";
    completedTasks.lastElementChild.lastElementChild.textContent = "0";
    highPriorityTasks.lastElementChild.lastElementChild.textContent = "0";
    overdueTasks.lastElementChild.lastElementChild.textContent = "0";

    initialize();
  }
}
