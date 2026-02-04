const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    // Create li
    const li = document.createElement("li");

    // Create task text
    const span = document.createElement("span");
    span.textContent = taskText;

    // Mark complete on click
    span.onclick = function() {
        span.classList.toggle("completed");
    };

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "delete-btn";

    deleteBtn.onclick = function() {
        li.remove();
    };

    li.appendChild(span);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);

    taskInput.value = "";
}