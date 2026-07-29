const API_URL = "https://easymanage-api-b8gpdnhvfucteddc.centralindia-01.azurewebsites.net/api/v1/room/rename";

const renameBtn = document.getElementById("renameBtn");
const message = document.getElementById("message");

renameBtn.addEventListener("click", renameRoom);

document.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        renameRoom();
    }
});

async function renameRoom() {

    const roomCode = document.getElementById("roomCode").value.trim();
    const roomName = document.getElementById("roomName").value.trim();

    if (roomCode === "" || roomName === "") {
        message.style.color = "#dc3545";
        message.textContent = "Please fill in all fields.";
        return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
        message.style.color = "#dc3545";
        message.textContent = "Please login first.";
        return;
    }

    renameBtn.disabled = true;
    renameBtn.textContent = "Renaming...";

    try {

        const response = await fetch(API_URL, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },

            body: JSON.stringify({
                uniqueCode: roomCode,
                roomName: roomName
            })

        });

        const data = await response.json();

        if (response.ok) {

            message.style.color = "#28a745";
            message.textContent = "Room renamed successfully.";

            document.getElementById("roomCode").value = "";
            document.getElementById("roomName").value = "";

        } else {

            message.style.color = "#dc3545";
            message.textContent = data.message || "Rename failed.";

        }

    } catch {

        message.style.color = "#dc3545";
        message.textContent = "Server connection failed.";

    }

    renameBtn.disabled = false;
    renameBtn.textContent = "Rename Room";

}

function goDashboard() {
    window.location.href = "../Dashboard/dashboard.html";
}