const token = localStorage.getItem("accessToken");

if (!token) {
    window.location.href = "../login.html";
}

document.getElementById("updateProfileBtn").addEventListener("click", () => {
    window.location.href = "../AccountCenter/accountUpdate.html";
});

document.getElementById("changePasswordBtn").addEventListener("click", () => {
    window.location.href = "../AccountCenter/changePassword.html";
});