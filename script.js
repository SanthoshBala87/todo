const toggleBtn = document.querySelector(".toggle-btn");
const themeBtn = document.querySelector(".theme-btn");
const modeType = document.querySelector(".mode-type");

const hamMenuOpen = document.querySelector(".ham-menu-btn");
const hamMenuClose = document.querySelector(".ham-menu-close");
const navBar = document.querySelector(".nav-bar");

const addTaskBtn = document.querySelector("#addTaskBtn");
const closeBtn = document.querySelector(".add-container-close-btn");
const addTaskContainer = document.querySelector(".add-Task-Container");

const profile = document.querySelector(".profile p");
const usernameContainer = document.querySelector(".username-container");
const closeNameBtn = document.querySelector("#close-name-btn");
const getInputUserName = document.querySelector("#userName");
const nameError = document.querySelector(".name-error");
const saveUserNameBtn = document.querySelector("#addUserNameBtn");

const changeDeleteProfileContainer = document.querySelector(".change-delete-profile-container");
const closeEditDelNameBtn = document.querySelector("#close-edit-del-name-btn");
const setName = document.querySelector(".setName");
const username = document.querySelector(".username");
const greeting = document.querySelector(".greeting");
const editUserNameBtn = document.querySelector("#editUserNameBtn");
const delUserNameBtn = document.querySelector("#delUserNameBtn");
const confirmSection = document.querySelector(".confirm-section");
const yes = document.querySelector("#yes");
const no = document.querySelector("#no");

const messageSection = document.querySelector(".message-section");
const message = document.querySelector(".message");

const toDoUserName=JSON.parse(localStorage.getItem("todoUser")) || "";
username.textContent = toDoUserName;

const now=new Date();
const hour=now.getHours();
if(hour>=0 && hour<=11){
    greeting.textContent="Good Morning";
}else if (hour >= 12 && hour <=16){
    greeting.textContent="Good Afternoon";
}else if (hour >= 17 && hour <=18){
    greeting.textContent="Good Evening";
}else if (hour >= 19 && hour <=23){
    greeting.textContent="Good Night";
}

if (toDoUserName === "") {
  displayFlex(usernameContainer);
}

// Function to check User exists or not
function checkUser(userLoged) {
  if (userLoged === "") {
    displayFlex(usernameContainer);
    displayNone(changeDeleteProfileContainer);
  } else {
    displayFlexNone(usernameContainer);
    setName.textContent = userLoged;
    username.textContent =userLoged;
    displayBlock(changeDeleteProfileContainer);
  }
}

// Delete user Name
delUserNameBtn.addEventListener("click",()=>{
    displayBlock(confirmSection);
});

// confirm no
no.addEventListener("click",()=>{
    displayNone(confirmSection);
});

// Confirm yes
yes.addEventListener("click",()=>{
    localStorage.removeItem("todoUser");
    displayNone(confirmSection);
    displayNone(changeDeleteProfileContainer);

    const userLoged = JSON.parse(localStorage.getItem("todoUser")) || "";

    displayBlock(messageSection);
    message.textContent = "User Deleted Successfully";

    setTimeout(() => {
      displayNone(messageSection);
    }, 3000);

    username.textContent="";
});

// Edit Username button
editUserNameBtn.addEventListener("click",()=>{
    displayFlex(usernameContainer);
    displayNone(changeDeleteProfileContainer);
    getInputUserName.value = username.textContent;
});

profile.addEventListener("click",()=>{
    const userLoged = JSON.parse(localStorage.getItem("todoUser")) || "";
    checkUser(userLoged);
});

// close geting user name container
closeNameBtn.addEventListener("click",()=>{
    displayFlexNone(usernameContainer);;
});

// close user name container
closeEditDelNameBtn.addEventListener("click",()=>{
    displayNone(changeDeleteProfileContainer);
});

// Function to set userName
function setUser(){
    const name = getInputUserName.value.trim();
    const isCorrectName=/^[a-zA-Z ]{3,18}$/.test(name);
    if(!isCorrectName){
        nameError.textContent="Only ( a-z, A-Z and space with 3-18 Characters) !";
        getInputUserName.focus();
        return;
    }

    nameError.textContent="";
    
    localStorage.setItem("todoUser",JSON.stringify(name));
    const userLoged = JSON.parse(localStorage.getItem("todoUser")) || "";

    displayBlock(messageSection);
    message.textContent = "User Added Successfully";

    setTimeout(() => {
      displayNone(messageSection);
    }, 3000);
    getInputUserName.value="";
    checkUser(userLoged);
}

// Listener to save user name
saveUserNameBtn.addEventListener("click",setUser);

// Dark Light Mode Button
toggleBtn.addEventListener("click",()=>{
    toggleBtn.classList.toggle("toggle-right");
    if(toggleBtn.classList.contains("toggle-right")){
        const theme = localStorage.setItem("theme","light");
        setTheme();
        modeType.textContent="Light Mode";
        themeBtn.classList.add("toggle-theme");
        toggleBtn.classList.add("toggle-theme-btn");
    }else{
        const theme = localStorage.setItem("theme", "dark");
        setTheme();
        modeType.textContent = "Dark Mode";
        themeBtn.classList.remove("toggle-theme");
        toggleBtn.classList.remove("toggle-theme-btn");
    }
});

// To toggle light and dark theme
function themePreference(theme){
    if (theme === "light") {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "./UtilityFiles/themepreferrence.css";
      link.id="theme-link";
      document.head.appendChild(link);
      modeType.textContent = "Light Mode";
      toggleBtn.classList.add("toggle-right");
      themeBtn.classList.add("toggle-theme");
      toggleBtn.classList.add("toggle-theme-btn");

    } else if(theme==="dark"){
        const link = document.querySelector("#theme-link");
        if(link){
            link.remove();
            toggleBtn.classList.remove("toggle-right");
            themeBtn.classList.remove("toggle-theme");
            toggleBtn.classList.remove("toggle-theme-btn");
        }
    }
}

// to set default theme
function setTheme(){
    const theme = localStorage.getItem("theme") || "";
    if(theme!==""){
        themePreference(theme);
    }
}
setTheme();


// Open Add task  container
addTaskBtn.addEventListener("click",()=>{
    displayBlock(addTaskContainer);
});

// close add task container
closeBtn.addEventListener("click", () => {
    displayNone(addTaskContainer);
});

// Ham-burger menu open
hamMenuOpen.addEventListener("click",()=>{
    displayBlock(navBar);
});

// Ham burger menu close
hamMenuClose.addEventListener("click", () => {
    displayNone(navBar);
});

// Function to display Block
function displayBlock(element){
    element.classList.add("display-block");
    element.classList.remove("display-none");
}

// Function to display None
function displayNone(element){
    element.classList.add("display-none");
    element.classList.remove("display-block");
}

// Function to display Flex
function displayFlex(element){
    element.classList.add("display-flex");
    element.classList.remove("display-none");
}

// Function to display Flex
function displayFlexNone(element){
    element.classList.add("display-none");
    element.classList.remove("display-flex");
}
