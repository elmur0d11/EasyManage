const API_URL = "http://localhost:8081/api/v1/room/delete";

const deleteBtn = document.getElementById("deleteBtn");
const message = document.getElementById("message");

deleteBtn.addEventListener("click", deleteRoom);

document.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
        deleteRoom();
    }

});

async function deleteRoom() {

    const roomCode = document.getElementById("roomCode").value.trim();
    const roomNameReply = document.getElementById("roomNameReply").value.trim();

    if (roomCode === "" || roomNameReply === "") {

        message.style.color = "#dc3545";
        message.textContent = "Please fill in all fields.";

        return;
    }

    const confirmed = confirm(
        "Are you sure you want to permanently delete this room?"
    );

    if (!confirmed)
        return;

    const token = localStorage.getItem("accessToken");

    if (!token) {

        message.style.color = "#dc3545";
        message.textContent = "Please login first.";

        return;
    }

    deleteBtn.disabled = true;
    deleteBtn.textContent = "Deleting...";

    try {

        const response = await fetch(API_URL, {

            method: "DELETE",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },

            body: JSON.stringify({
                roomCode: roomCode,
                roomNameReply: roomNameReply
            })

        });

        if (response.ok) {

            message.style.color = "#28a745";
            message.textContent = "Room deleted successfully.";

            document.getElementById("roomCode").value = "";
            document.getElementById("roomNameReply").value = "";

            setTimeout(() => {
                window.location.href = "../Dashboard/dashboard.html";
            }, 1500);

        }
        else {

            const data = await response.json();

            message.style.color = "#dc3545";
            message.textContent = data.message || "Unable to delete room.";

        }

    }
    catch {

        message.style.color = "#dc3545";
        message.textContent = "Server connection failed.";

    }

    deleteBtn.disabled = false;
    deleteBtn.textContent = "Delete Room";

}

function goDashboard() {

    window.location.href = "../Dashboard/dashboard.html";

}