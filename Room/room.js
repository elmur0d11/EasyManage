const token = localStorage.getItem("accessToken");

if (!token) {
    window.location.href = "../login.html";
}

const params = new URLSearchParams(window.location.search);
const roomCode = params.get("roomCode");

if (!roomCode) {
    alert("Room topilmadi.");
    window.location.href = "dashboard.html";
}

loadTasks();

const backBtn = document.getElementById("backBtn");
const addBtn = document.getElementsByClassName("add-btn");

backBtn.addEventListener("click", () => {
    window.location.href = "../Dashboard/dashboard.html";
});
addBtn[0].addEventListener("click", () => {
    window.location.href = `../Task/taskCreate.html?roomCode=${roomCode}`;
});



async function loadTasks() {
    try {

        const response = await fetch(
            `https://easymanage-api-b8gpdnhvfucteddc.centralindia-01.azurewebsites.net/api/v1/task/tasks?roomCode=${encodeURIComponent(roomCode)}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Tasklarni yuklab bo'lmadi.");
        }

        const tasks = await response.json();

        console.log(tasks);

        tasksContainer.innerHTML = "";

        if (tasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty">
                    No tasks found.
                </div>
            `;
            return;
        }

      tasks.forEach(task => {

    const createdDate = new Date(task.createdAt).toLocaleDateString();

    tasksContainer.innerHTML += `
        <div class="task-card">

            <h3>${task.title}</h3>

            <p class="description">
                ${task.description}
            </p>

            <div class="task-info">

                <p>
                    <strong style="color:#2a5298;">Status:</strong>
                    <span id="status-${task.title}">
                        ${task.status}
                    </span>
                </p>

                <p>
                    <strong style="color:#2a5298;">Priority:</strong>
                    <span id="priority-${task.title}">
                        ${task.priority}
                    </span>
                </p>

                <p>
                    <strong style="color:#2a5298;">Created:</strong>
                    ${createdDate}
                </p>

            </div>

            <div class="task-actions">
            <div class="priority-update">

                <select id="priority-select-${task.title}" class="priority-select">
                    <option value="Low" ${task.priority === "Low" ? "selected" : ""}>Low</option>
                    <option value="Medium" ${task.priority === "Medium" ? "selected" : ""}>Medium</option>
                    <option value="High" ${task.priority === "High" ? "selected" : ""}>High</option>
                    <option value="Critical" ${task.priority === "Critical" ? "selected" : ""}>Critical</option>
                </select>

                <button
                    class="priority-btn"
                    onclick="updatePriority('${task.title}')">
                    Update Priority
                </button>

            </div>

            <div class="priority-update">

                <select id="status-select-${task.title}" class="priority-select">
                    <option value="Todo" ${task.status === "Todo" ? "selected" : ""}>Todo</option>
                    <option value="InProgress" ${task.status === "InProgress" ? "selected" : ""}>In Progress</option>
                    <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
                </select>

                <button
                    class="status-btn"
                    onclick="updateStatus('${task.title}')">
                    Update Status
                </button>

            </div>
            
        </div>
    `;
});

    } catch (error) {
        console.error(error);

        tasksContainer.innerHTML = `
            <div class="empty">
                Failed to load tasks.
            </div>
        `;
    }
}

async function updatePriority(taskTitle) {

    const priority =
        document.getElementById(`priority-select-${taskTitle}`).value;

    try {

        const response = await fetch(
            `https://easymanage-api-b8gpdnhvfucteddc.centralindia-01.azurewebsites.net/api/v1/task/updatePriority?roomCode=${encodeURIComponent(roomCode)}&taskTitle=${encodeURIComponent(taskTitle)}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    priority: priority
                })
            }
        );

        if (!response.ok) {

            const error = await response.text();
            alert(error + " You dont have permission!");
            return;
        }

        document.getElementById(`priority-${taskTitle}`).innerText = priority;

    }
    catch (err) {

        console.error(err);
        alert("Server error.");
    }
}

async function updateStatus(taskTitle) {

    const status = document.getElementById(`status-select-${taskTitle}`).value;

    try {

        const response = await fetch(
            `https://easymanage-api-b8gpdnhvfucteddc.centralindia-01.azurewebsites.net/api/v1/task/updateStatus?roomCode=${encodeURIComponent(roomCode)}&taskTitle=${encodeURIComponent(taskTitle)}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: status
                })
            }
        );

        if (!response.ok) {
            const error = await response.text();
            alert(error + " You don't have permission!");
            return;
        }

        document.getElementById(`status-${taskTitle}`).innerText = status;

    } catch (err) {
        console.error(err);
        alert("Server error.");
    }
}