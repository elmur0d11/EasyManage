const API_URL = 'http://localhost:8081/api/v1/room/create';
const DASHBOARD_URL = '/Dashboard/dashboard.html';
const LOGIN_URL = '../login.html';

const form = document.getElementById('createRoomForm');
const roomNameInput = document.getElementById('roomName');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

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
    
    const roomName = roomNameInput.value.trim();
    
    if (!roomName) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Iltimos, xona nomini kiriting';
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Yaratilmoqda...';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ roomName: roomName })
        });
        
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = LOGIN_URL;
            return;
        }
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Xatolik yuz berdi');
        }
        
        const data = await response.json();
        console.log('Xona yaratildi:', data);
        
        successMessage.style.display = 'block';
        successMessage.textContent = 'Xona muvaffaqiyatli yaratildi!';
        
        setTimeout(() => {
            window.location.href = DASHBOARD_URL;
        }, 500);
        
    } catch (error) {
        console.error('Xatolik:', error);
        errorMessage.style.display = 'block';
        errorMessage.textContent = error.message || 'Xatolik yuz berdi';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Xona Yaratish';
    }
});