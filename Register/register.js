const API_URL = "http://localhost:8081/api/v1/auth/register";

const form = document.getElementById("registerForm");
const message = document.getElementById("message");
const button = document.getElementById("registerButton");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    message.innerHTML = "";

    const username = document.getElementById("username").value.trim();
    const fullName = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if (username.length < 3) {

        showError("Username must be at least 3 characters.");
        return;
    }

    if (fullName.length < 3) {

        showError("Full name must be at least 3 characters.");
        return;
    }

    if (!validateEmail(email)) {

        showError("Invalid email.");
        return;
    }

    if (password.length < 8) {

        showError("Password must be at least 8 characters.");
        return;
    }

    if (role === "") {

        showError("Please select a role.");
        return;
    }

    const user = {

        username: username,
        fullName: fullName,
        email: email,
        password: password,
        role: Number(role)
    };

    button.disabled = true;
    button.innerHTML = "Registering...";

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)

        });

        if (response.ok) {

            message.style.color = "green";
            message.innerHTML = "Registration successful.";

            setTimeout(() => {

                window.location.href = "../login.html";

            }, 1500);

        }
        else {

            let error = "Registration failed.";

            try {

                const result = await response.json();

                if (result.message)
                    error = result.message;

                else if (result.title)
                    error = result.title;

            }
            catch {

                error = await response.text();
            }

            showError(error);
        }

    }
    catch {

        showError("Cannot connect to server.");
    }
    finally {

        button.disabled = false;
        button.innerHTML = "Register";
    }

});

function showError(text) {

    message.style.color = "red";
    message.innerHTML = text;
}

function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}