let currentTaskElement = null;
let tasks = [];

const TaskUi = (taskText = "", status = "pending") => {
    return `
    <div class="taskBlock" data-status="${status}">
        <input type="checkbox" class="task-checkbox" ${status === 'completed' ? 'checked' : ''}>
        <input class="giveHereData" type="text" value="${taskText}" readonly>
        <div class="controlButtons">
            <button class="delete"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
            <button class="edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
        </div>
    </div>
    `;
};

const updateTaskDisplay = () => {
    let addHere = document.querySelector("#addHere");
    addHere.innerHTML = tasks.map(task => TaskUi(task.text, task.status)).join('');
    setupEventListeners();
};

const setupEventListeners = () => {
    document.querySelectorAll(".delete").forEach(btn => {
        btn.addEventListener("click", (e) => {
            let taskBlock = e.target.closest(".taskBlock");
            tasks = tasks.filter(task => taskBlock.querySelector(".giveHereData").value !== task.text);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            taskBlock.remove();
            currentTaskElement = null;
        });
    });

    document.querySelectorAll(".edit").forEach(btn => {
        btn.addEventListener("click", (e) => {
            let input = e.target.closest(".taskBlock").querySelector(".giveHereData");
            document.querySelector("#task").value = input.value;
            currentTaskElement = e.target.closest(".taskBlock");
        });
    });

    document.querySelectorAll(".task-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            let taskBlock = e.target.closest(".taskBlock");
            let isChecked = e.target.checked;
            taskBlock.setAttribute("data-status", isChecked ? "completed" : "pending");
            tasks.find(task => taskBlock.querySelector(".giveHereData").value === task.text).status = isChecked ? "completed" : "pending";
            localStorage.setItem("tasks", JSON.stringify(tasks));
            filterTasks();
        });
    });
};

const AddNewTaskFunction = () => {
    let addNewTask = document.querySelector("#add");
    addNewTask.addEventListener("click", () => {
        let inputValue = document.querySelector("#task").value;
        if (currentTaskElement) {
            let taskData = tasks.find(task => task.text === currentTaskElement.querySelector(".giveHereData").value);
            taskData.text = inputValue;
            currentTaskElement.querySelector(".giveHereData").value = inputValue;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            currentTaskElement = null;
        } else {
            let taskStatus = "pending";
            tasks.push({ text: inputValue, status: taskStatus });
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
        document.querySelector("#task").value = "";
        updateTaskDisplay();
    });
};

const filterTasks = (filter = "all") => {
    document.querySelectorAll(".taskBlock").forEach(taskBlock => {
        let status = taskBlock.getAttribute("data-status");
        if (filter === "all" || status === filter) {
            taskBlock.style.display = "flex";
        } else {
            taskBlock.style.display = "none";
        }
    });


    document.querySelectorAll(".filter button").forEach(button => {
        button.classList.remove("active");
    });
    document.querySelector(`#${filter}Filter`).classList.add("active");
};

const loadTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        updateTaskDisplay();
    }
};

document.querySelector("#allFilter").addEventListener("click", () => {
    filterTasks("all");
});

document.querySelector("#pendingFilter").addEventListener("click", () => {
    filterTasks("pending");
});

document.querySelector("#completedFilter").addEventListener("click", () => {
    filterTasks("completed");
});

AddNewTaskFunction();
loadTasksFromLocalStorage();