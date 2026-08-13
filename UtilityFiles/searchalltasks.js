import { dashboardInitialize } from "./dashboard.js";
import { initialize } from "../AddTasks/addtask.js";

const navBar = document.querySelector(".nav-bar");

const searchContainer = document.querySelector(".search-container");
const searchCloseBtn = document.querySelector("#search-close-btn");
const searchLists = document.querySelector(".search-container ul");
const getSearchInput = document.querySelector("#search");
const searchError = document.querySelector(".search-error");

const filterContainer = document.querySelector(".filter-container");
const filterLists = document.querySelector(".filter-container ul");
const filterCloseBtn = document.querySelector("#filter-close-btn");
const filterPriority = document.querySelector("#filter-priority");
const filterStatus = document.querySelector("#filter-status");
const filterCategory = document.querySelector("#filter-category");
const filterBtn = document.querySelector("#filter-btn");
const filterError = document.querySelector(".filter-error");

const sortContainer = document.querySelector(".sort-container");
const sortLists = document.querySelector(".sort-container ul");
const sortCloseBtn = document.querySelector("#sort-close-btn");
const sortPriority = document.querySelector("#sort-priority");
const sortTitle = document.querySelector("#sort-title");
const sortError = document.querySelector(".sort-error");
const sortBtn = document.querySelector("#sort-btn");

const viewOldTasksContainer = document.querySelector(".view-old-tasks-container");
const oldTaskLists = document.querySelector(".view-old-tasks-container ul");
const viewOldTaskContainerCloseBtn = document.querySelector("#view-old-task-container-close-btn");
const viewOldTaskDate = document.querySelector("#view-old-task-date");
const viewOldTaskError = document.querySelector(".view-old-task-error");
const viewOldTaskBtn = document.querySelector("#view-old-task-btn");

const confirmDeleteSection = document.querySelector(".confirm-deleteall-section");
const confirmBtn = document.querySelector("#confirmallBtn");
const dontBtn = document.querySelector("#dontallBtn");

const messageSection = document.querySelector(".message-section");
const message = document.querySelector(".message");

const searchSemplate = document.querySelector(".search-template");

let timeoutId;

// Close search Container
searchCloseBtn.addEventListener("click", () => {
  displayNone(searchContainer);
  getSearchInput.value = "";
  searchLists.innerHTML = "";
});

// Close filter container
filterCloseBtn.addEventListener("click", () => {
  displayNone(filterContainer);
  filterPriority.value = "";
  filterStatus.value = "";
  filterCategory.value = "";
  filterLists.innerHTML = "";
});

// Close sort button
sortPriority.addEventListener("change", () => {
  sortTitle.value = "";
});
sortTitle.addEventListener("click", () => {
  sortPriority.value = "";
});

sortCloseBtn.addEventListener("click", () => {
  displayNone(sortContainer);
  sortPriority.value = "";
  sortTitle.value = "";
  sortLists.innerHTML = "";
});

// Close view old task container
viewOldTaskContainerCloseBtn.addEventListener("click",()=>{
  displayNone(viewOldTasksContainer);
  displayNone(navBar);
  oldTaskLists.innerHTML = "";
  viewOldTaskDate.value="";
})

navBar.addEventListener("click", search);

function search() {
  if (event.target.textContent === "Search") {
    displayBlock(searchContainer);
    getSearchInput.focus();
    displayNone(navBar);
  } else if (event.target.textContent === "Filter") {
    displayBlock(filterContainer);
    displayNone(navBar);
  } else if (event.target.textContent === "Sort") {
    displayBlock(sortContainer);
    displayNone(navBar);
  } else if (event.target.textContent === "Delete All Tasks") {
    deleteAllTasks();
    displayNone(navBar);
  } else if (event.target.textContent === "View Old Tasks") {
    displayBlock(viewOldTasksContainer);
    displayNone(navBar);
  }
}

// Listener to view old tasks
viewOldTaskBtn.addEventListener("click",()=>{
  if(viewOldTaskDate.value){
    oldTaskLists.innerHTML="";
    displayNone(viewOldTaskError);
    viewOldTasks(viewOldTaskDate.value);
  }else{
    displayBlock(viewOldTaskError);
  }
})

// Function to view Old tasks
function viewOldTasks(taskDate){
  const oldTasks=JSON.parse(localStorage.getItem("oldTasks")) || [];
  const date=new Date(taskDate);
  const oldTaskDay=(date.toDateString().split(" ")[2]);
  const oldTaskMonth=(date.toDateString().split(" ")[1]);
  const oldTaskYear=(date.toDateString().split(" ")[3]);
  const fullDate = `${oldTaskDay} ${oldTaskMonth} ${oldTaskYear}`;
  for(let task of oldTasks){
    if(task[fullDate]){
      task[fullDate].forEach((oldtask) => {
        displayResult(oldtask, oldTaskLists);
      });
      break;
    }
  }
}

// Function to Delete All Tasks
dontBtn.addEventListener("click", () => {
  displayNone(confirmDeleteSection);
});

confirmBtn.addEventListener("click", () => {
  displayNone(confirmDeleteSection);
  displayNone(navBar);

  const allTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
  if (allTasks.length > 0) {
    localStorage.removeItem("todoTasks");
    initialize();
    dashboardInitialize();
    displayBlock(messageSection);
    message.textContent = "All Tasks Deleted Successfully !";
    setTimeout(() => {
      displayNone(messageSection);
    }, 3000);
  } else {
    displayBlock(messageSection);
    message.textContent = "No tasks to delete";
    setTimeout(() => {
      displayNone(messageSection);
    }, 3000);
  }
});

function deleteAllTasks() {
  console.log("Delete All Tasks");
  displayBlock(confirmDeleteSection);
}

getSearchInput.addEventListener("input", (event) => {
  clearTimeout(timeoutId);
  const taskDetails = getSearchInput.value.trim();
  if (taskDetails === "") {
    searchLists.innerHTML = "";
    displayBlock(searchError);
    return;
  }

  displayNone(searchError);
  timeoutId = setTimeout(() => {
    searchTasks(taskDetails);
  }, 300);
});

function searchTasks(taskDetails) {
  searchLists.innerHTML = "";
  const taskLists = JSON.parse(localStorage.getItem("todoTasks")) || [];
  taskLists.forEach((taskDet) => {
    const compareTitle = taskDet.title
      .toLowerCase()
      .includes(taskDetails.toLowerCase());
    const compareCategory = taskDet.category
      .toLowerCase()
      .includes(taskDetails.toLowerCase());
    if (compareTitle || compareCategory) {
      displayNone(searchError);
      const task = taskDet;
      displayResult(task, searchLists);
    }
  });
}

// Listeners sort Filter tasks
filterBtn.addEventListener("click", () => {
  if (
    filterPriority.value !== "" &&
    filterStatus.value !== "" &&
    filterCategory.value !== ""
  ) {
    filterTasks(filterPriority.value, filterStatus.value, filterCategory.value);
  } else {
    displayBlock(filterError);
  }
});

function filterTasks(filterPriority, filterStatus, filterCategory) {
  filterLists.innerHTML = "";
  const taskLists = JSON.parse(localStorage.getItem("todoTasks")) || [];
  taskLists.forEach((taskDet) => {
    const comparePriority = taskDet.priority === filterPriority;
    const compareStatus = taskDet.status === filterStatus;
    const compareCategory = taskDet.category === filterCategory;
    if (comparePriority && compareStatus && compareCategory) {
      displayNone(filterError);
      const task = taskDet;
      displayResult(task, filterLists);
    }
  });
}

// Listener sort sort tasks
sortBtn.addEventListener("click", () => {
  if (sortPriority.value !== "" || sortTitle.value !== "") {
    sortLists.innerHTML = "";
    displayNone(sortError);
    sortBy(sortPriority.value || sortTitle.value);
  } else {
    displayBlock(sortError);
  }
});

// Function sort taks by priority
function sortBy(sortby) {
  if (sortby === "fromhigh") {
    const taskPriority = sortingPriority();
    taskPriority.forEach((task) => {
      displayResult(task, sortLists);
    });
  } else if (sortby === "fromlow") {
    const taskPriority = sortingPriority();
    taskPriority.reverse().forEach((task) => {
      displayResult(task, sortLists);
    });
  } else if (sortby === "Ascending") {
    const taskTitle = sortingTitle();
    taskTitle.forEach((task) => {
      displayResult(task, sortLists);
    });
  } else if (sortby === "Descending") {
    const taskTitle = sortingTitle();
    taskTitle.reverse().forEach((task) => {
      displayResult(task, sortLists);
    });
  }
}

// Function sort by title
function sortingTitle() {
  const tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
  const taskTitle = tasks.sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
  return taskTitle;
}

// Function sorting priority
function sortingPriority() {
  const highpriority = [];
  const lowpriority = [];
  const mediumpriority = [];

  const tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

  tasks.forEach((task) => {
    if (task.priority === "High") {
      highpriority.push(task);
    } else if (task.priority === "Medium") {
      lowpriority.push(task);
    } else if (task.priority === "Low") {
      mediumpriority.push(task);
    }
  });
  const priority = [...highpriority, ...lowpriority, ...mediumpriority];
  return priority;
}

// Function sort display result
function displayResult(task, lists) {
    const clone = searchSemplate.content.cloneNode(true);
    const li=clone.querySelector("li");

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

    lists.appendChild(li);
}
