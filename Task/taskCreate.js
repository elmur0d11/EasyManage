const API_URL = 'https://easymanage-api-b8gpdnhvfucteddc.centralindia-01.azurewebsites.net/api/v1/task/create';
const DASHBOARD_URL = `/Room/room.html?roomCode=${roomCode}`;
const LOGIN_URL = '../login.html';

const form = document.getElementById('createTaskForm');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const prioritySelect = document.getElementById('priority');
const statusSelect = document.getElementById('status');
const roomCodeInput = document.getElementById('roomCode');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// URL dan roomCode ni olish
function getRoomCodeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('roomCode');
}

// Sahifa yuklanganda roomCode ni avtomatik to'ldirish
document.addEventListener('DOMContentLoaded', () => {
    const roomCode = getRoomCodeFromUrl();
    if (roomCode) {
        roomCodeInput.value = roomCode;
        roomCodeInput.readOnly = true; 
    }
});

function getToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = LOGIN_URL;
        return null;
    }
    return token;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = getToken();
    if (!token) return;
    
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const priority = prioritySelect.value;
    const status = statusSelect.value;
    const roomCode = roomCodeInput.value.trim();
    
    if (!title) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Please enter tasks title';
        return;
    }

    if (!roomCode) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Room code not found';
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: title,
                description: description,
                priority: priority,
                status: status,
                roomCode: roomCode
            })
        });
        
        if (response.status === 401) {
            alert("Please login again!");
            window.location.href = LOGIN_URL;
            return;
        }

        if (response.status === 403) {
             alert("You don't have permission!");
             return;
         }
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Error occured');
        }
        
        const data = await response.json();
        console.log('Task created:', data);
        
        successMessage.style.display = 'block';
        successMessage.textContent = 'Task created successfully';
        
        setTimeout(() => {
            const roomCode = roomCodeInput.value;
            window.location.href = `/Room/room.html?roomCode=${encodeURIComponent(roomCode)}`;
        }, 500);
        
    } catch (error) {
        console.error('Error:', error);
        errorMessage.style.display = 'block';
        errorMessage.textContent = error.message || 'Error occured!';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Task';
    }
});