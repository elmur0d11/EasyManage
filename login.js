const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const loginButton = document.querySelector(".login-btn");

const API_URL = "https://localhost:7235/api/v1/auth/login";

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorMessage.textContent = "";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
        errorMessage.textContent = "Iltimos, barcha maydonlarni to'ldiring.";
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        console.log("Status:", response.status);
        console.log("OK:", response.ok);

        if (!response.ok) {
            let message = "Login muvaffaqiyatsiz yakunlandi! Iltimos, foydalanuvchi nomi yoki parolni tekshiring.";

            try {
                const error = await response.json();
                message = error.message || error.title || message;
            } catch {
                message = await response.text();
            }

            errorMessage.textContent = message;
            return;
        }

        const data = await response.json();

        if (!data.accessToken || !data.refreshToken) {
            errorMessage.textContent = "Server noto'g'ri javob qaytardi.";
            return;
        }

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        window.location.href = "Dashboard/dashboard.html";
    }
    catch (error) {
        console.error("Login Error:", error);
        errorMessage.textContent = "Server bilan bog'lanib bo'lmadi.";
    }
    finally {
        loginButton.disabled = false;
        loginButton.textContent = "LOGIN";
    }
});