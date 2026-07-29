const token = localStorage.getItem("accessToken");

if (!token) {
    window.location.href = "../login.html";
}

const API_URL = "https://easymanage-api-b8gpdnhvfucteddc.centralindia-01.azurewebsites.net/api/v1/account/password";

// ==================== Toggle Password Visibility ====================
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const passwordInput = document.getElementById(targetId);
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            this.textContent = '👁️';
        }
    });
});

// ==================== Password Strength Checker ====================
document.getElementById('newPassword').addEventListener('input', function() {
    const password = this.value;
    const strengthDiv = document.getElementById('passwordStrength');
    
    if (password.length === 0) {
        strengthDiv.textContent = '';
        strengthDiv.className = 'password-strength';
        return;
    }
    
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    
    switch(strength) {
        case 0:
        case 1:
            strengthDiv.textContent = 'Weak password';
            strengthDiv.className = 'password-strength weak';
            break;
        case 2:
        case 3:
            strengthDiv.textContent = 'Medium password';
            strengthDiv.className = 'password-strength medium';
            break;
        case 4:
            strengthDiv.textContent = 'Strong password';
            strengthDiv.className = 'password-strength strong';
            break;
    }
});

// ==================== Password Match Checker ====================
document.getElementById('confirmPassword').addEventListener('input', function() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = this.value;
    const matchDiv = document.getElementById('passwordMatch');
    
    if (confirmPassword.length === 0) {
        matchDiv.textContent = '';
        matchDiv.className = 'password-match';
        return;
    }
    
    if (newPassword === confirmPassword) {
        matchDiv.textContent = '✓ Passwords match';
        matchDiv.className = 'password-match success';
    } else {
        matchDiv.textContent = '✗ Passwords do not match';
        matchDiv.className = 'password-match error';
    }
});

// ==================== Form Submission ====================
document.getElementById("changePasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    
    const messageDiv = document.getElementById("message");
    const submitBtn = document.getElementById("submitBtn");
    
    // Hide previous messages
    messageDiv.style.display = "none";
    messageDiv.className = "message-alert";
    
    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
        showMessage(messageDiv, "Please fill in all password fields.", "error");
        return;
    }
    
    if (newPassword.length < 8) {
        showMessage(messageDiv, "New password must be at least 8 characters.", "error");
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showMessage(messageDiv, "Passwords do not match.", "error");
        return;
    }
    
    if (oldPassword === newPassword) {
        showMessage(messageDiv, "New password must be different from current password.", "error");
        return;
    }
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Updating...";
        
        const response = await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                OldPassword: oldPassword,
                NewPassword: newPassword
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "Failed to change password.";
            
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorJson.title || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }
            
            throw new Error(errorMessage);
        }
        
        // Show success message
        showMessage(messageDiv, "✅ Password changed successfully! Redirecting to login...", "success");
        
        // Clear tokens and redirect to login after 3 seconds
        setTimeout(() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "../login.html";
        }, 3000);
        
    } catch (error) {
        console.error("Password change error:", error);
        showMessage(messageDiv, error.message || "An error occurred.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "🔐 Change Password";
    }
});

// ==================== Helper Function ====================
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message-alert ${type}`;
    element.style.display = "block";
}