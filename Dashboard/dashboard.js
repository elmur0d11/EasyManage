const token = localStorage.getItem("accessToken");

if (!token) {
    window.location.href = "login.html";
}

const API_URL = "https://localhost:7235/api/v1/room/rooms";
const roomsContainer = document.getElementById("roomsContainer");
const logoutBtn = document.getElementById("logoutBtn");
const createRoomBtn = document.getElementById("createRoomBtn");

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    location.replace("../login.html");
});

loadRooms();

function enterRoom(roomCode) {
    window.location.href = `../room/room.html?roomCode=${encodeURIComponent(roomCode)}`;
}

createRoomBtn.addEventListener("click", () => {
    window.location.href = "../Room/roomCreate.html";
});

async function loadRooms() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Roomlarni yuklab bo'lmadi.");
        }

        const rooms = await response.json();

        roomsContainer.innerHTML = "";

        if (rooms.length === 0) {
            roomsContainer.innerHTML = `
                <div class="room-card">
                    <h3>No Rooms</h3>
                    <p>Siz hali birorta room yaratmagansiz.</p>
                </div>
            `;
            return;
        }

        rooms.forEach(room => {
            roomsContainer.innerHTML += `
                <div class="room-card">
                    <h3>${room.roomName}</h3>
                    <h4 class="created-at">${new Date(room.createdAt).toLocaleDateString()}</h4>
                    <h4 class="created-at-time">${new Date(room.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</h4>
                    <span>${room.uniqueCode}</span>
                    
                     <button class="enter-btn"
                          onclick="enterRoom('${room.uniqueCode}')">
                      Enter
                    </button>
                </div>
            `;
        });

    } catch (error) {
        console.error(error);

        roomsContainer.innerHTML = `
            <div class="room-card">
                <h3>Xatolik</h3>
                <p>Roomlarni yuklashda xatolik yuz berdi.</p>
            </div>
        `;
    }
}