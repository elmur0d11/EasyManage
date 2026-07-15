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
            `https://localhost:7235/api/v1/task/tasks?roomCode=${encodeURIComponent(roomCode)}`,
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

            const createdDate = new Date(task.createdAt)
                .toLocaleDateString();

            tasksContainer.innerHTML += `
                <div class="task-card">

                    <h3>${task.title}</h3>

                    <p class="description">
                        ${task.description}
                    </p>

                    <div class="task-info">
                        <p><strong style="color: #2a5298;">Status:</strong> ${task.status}</p>
                        <p><strong style="color: #2a5298;">Priority:</strong> ${task.priority}</p>
                        <p><strong style="color: #2a5298;">Created:</strong> ${createdDate}</p>
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