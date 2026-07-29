const token = localStorage.getItem("accessToken");

if (!token) {
    window.location.href = "../login.html";
}

const API_URL = "https://easymanage-api-b8gpdnhvfucteddc.centralindia-01.azurewebsites.net/api/v1/account";

// Load current user data
async function loadCurrentUserData() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load user data.");
        }

        const userData = await response.json();
        
        // Fill form with current data
        document.getElementById("username").value = userData.username || "";
        document.getElementById("fullName").value = userData.fullName || "";
        document.getElementById("email").value = userData.email || "";
        document.getElementById("role").value = userData.role || "User";

    } catch (error) {
        console.error("Error loading user data:", error);
        // Continue with empty form if can't load
    }
}

// Load data when page opens
loadCurrentUserData();

// Form submission
document.getElementById("updateAccountForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const username = document.getElementById("username").value.trim();
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const role = document.getElementById("role").value;
    
    const errorDiv = document.getElementById("errorMessage");
    const successDiv = document.getElementById("successMessage");
    const submitBtn = document.getElementById("submitBtn");
    
    // Hide messages
    errorDiv.style.display = "none";
    successDiv.style.display = "none";
    
    // Validation
    if (!username || !fullName || !email) {
        errorDiv.textContent = "Please fill in all required fields.";
        errorDiv.style.display = "block";
        return;
    }
    
    if (!isValidEmail(email)) {
        errorDiv.textContent = "Please enter a valid email address.";
        errorDiv.style.display = "block";
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
                username: username,
                fullName: fullName,
                email: email,
                role: role
            })
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to update account.");
        }
        
        const result = await response.json();
        
        successDiv.textContent = "Account updated successfully!";
        successDiv.style.display = "block";
        
        // Update local storage if needed
        if (result.username) {
            localStorage.setItem("username", result.username);
        }
        
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = "../Dashboard/dashboard.html";
        }, 2000);
        
    } catch (error) {
        console.error("Update error:", error);
        errorDiv.textContent = error.message || "An error occurred. Please try again.";
        errorDiv.style.display = "block";
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Update Account";
    }
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Real-time validation
document.getElementById("email").addEventListener("input", function() {
    const email = this.value.trim();
    if (email && !isValidEmail(email)) {
        this.style.borderColor = "#ef4444";
    } else {
        this.style.borderColor = "rgba(255,255,255,.08)";
    }
});

document.getElementById("username").addEventListener("input", function() {
    const username = this.value.trim();
    if (username && username.length < 3) {
        this.style.borderColor = "#ef4444";
    } else {
        this.style.borderColor = "rgba(255,255,255,.08)";
    }
});