const token = localStorage.getItem("accessToken");

if (!token) {
    window.location.href = "login.html";
}

const API_URL = "https://easymanage-api-b8gpdnhvfucteddc.centralindia-01.azurewebsites.net/api/v1/room/rooms";
const roomsContainer = document.getElementById("roomsContainer");
const logoutBtn = document.getElementById("logoutBtn");
const createRoomBtn = document.getElementById("createRoomBtn");
const joinRoomBtn = document.getElementById("joinRoomBtn");
const updateRoomBtn = document.getElementById("updateRoomBtn");
const deleteRoomBtn = document.getElementById("deleteRoomBtn");
const accountBtn = document.getElementById("accountBtn");

accountBtn.addEventListener("click", () => {
    window.location.href = "../AccountCenter/accountCenter.html";
});

// Custom Confirmation Dialog
function showLogoutConfirmation() {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
        <div class="confirm-dialog">
            <div class="confirm-icon">⚠️</div>
            <h3>Logout Confirmation</h3>
            <p>Are you sure you want to logout from your account?</p>
            <div class="confirm-actions">
                <button class="confirm-btn cancel" id="cancelLogout">Cancel</button>
                <button class="confirm-btn confirm" id="confirmLogout">Logout</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .confirm-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .confirm-dialog {
            background: rgba(22, 27, 34, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 35px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
            animation: slideUp 0.3s ease;
            position: relative;
        }
        
        .confirm-dialog::before {
            content: "";
            position: absolute;
            inset: -1px;
            border-radius: 20px;
            padding: 1px;
            background: linear-gradient(135deg, #ef4444, #dc2626, #f87171);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
        }
        
        .confirm-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        .confirm-dialog h3 {
            color: #fff;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .confirm-dialog p {
            color: #9ca3af;
            font-size: 14px;
            margin-bottom: 25px;
            line-height: 1.5;
        }
        
        .confirm-actions {
            display: flex;
            gap: 12px;
        }
        
        .confirm-btn {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .confirm-btn.cancel {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .confirm-btn.cancel:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
        }
        
        .confirm-btn.confirm {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
        }
        
        .confirm-btn.confirm:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }
            to { 
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Event listeners
    document.getElementById('cancelLogout').addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.head.removeChild(style);
    });
    
    document.getElementById('confirmLogout').addEventListener('click', () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        location.replace("../login.html");
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            document.head.removeChild(style);
        }
    });
}

// Copy to clipboard function
function copyRoomCode(event, roomCode) {
    event.stopPropagation(); // Prevent card click event
    
    navigator.clipboard.writeText(roomCode).then(() => {
        // Change button text temporarily
        const codeElement = event.target;
        const originalText = codeElement.textContent;
        
        codeElement.textContent = "✓ Copied!";
        codeElement.style.background = "rgba(34, 197, 94, 0.2)";
        codeElement.style.color = "#4ade80";
        codeElement.style.border = "1px solid rgba(34, 197, 94, 0.3)";
        
        // Reset after 2 seconds
        setTimeout(() => {
            codeElement.textContent = originalText;
            codeElement.style.background = "rgba(59, 130, 246, 0.15)";
            codeElement.style.color = "#60a5fa";
            codeElement.style.border = "1px solid rgba(59, 130, 246, 0.25)";
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}

logoutBtn.addEventListener("click", showLogoutConfirmation);

loadRooms();

function enterRoom(roomCode) {
    window.location.href = `../room/room.html?roomCode=${encodeURIComponent(roomCode)}`;
}

createRoomBtn.addEventListener("click", () => {
    window.location.href = "../Room/roomCreate.html";
});

joinRoomBtn.addEventListener("click", () => {
    window.location.href = "../Room/roomJoin.html";
});

updateRoomBtn.addEventListener("click", () => {
    window.location.href = "../Room/roomUpdate.html";
});

deleteRoomBtn.addEventListener("click", () => {
    window.location.href = "../Room/roomDelete.html";
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
            throw new Error("Failed to load rooms.");
        }

        const rooms = await response.json();

        roomsContainer.innerHTML = "";

        if (rooms.length === 0) {
            roomsContainer.innerHTML = `
                <div class="no-rooms-card">
                    <h3>No Rooms Yet</h3>
                    <p>You haven't created any rooms yet. Click "Create Room" to get started.</p>
                </div>
            `;
            return;
        }

        rooms.forEach((room, index) => {
            roomsContainer.innerHTML += `
                <div class="room-card">
                    <h3>${room.roomName}</h3>
                    <h4 class="created-at">${new Date(room.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</h4>
                    <h4 class="created-at-time">${new Date(room.createdAt).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })}</h4>
                    <span class="room-code-badge" 
                          onclick="copyRoomCode(event, '${room.uniqueCode}')"
                          title="Click to copy">
                        ${room.uniqueCode}
                    </span>
                    
                    <button class="enter-btn"
                          onclick="enterRoom('${room.uniqueCode}')">
                      Enter
                    </button>
                </div>
            `;
        });

        // Add copy animation styles
        const copyStyle = document.createElement('style');
        copyStyle.textContent = `
            .room-code-badge {
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }
            
            .room-code-badge:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            }
            
            .room-code-badge:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(copyStyle);

    } catch (error) {
        console.error(error);

        roomsContainer.innerHTML = `
            <div class="no-rooms-card">
                <h3>⚠️ Error</h3>
                <p>Failed to load rooms. Please try again later.</p>
            </div>
        `;
    }
}