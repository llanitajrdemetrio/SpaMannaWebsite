// 👁️ Toggle password visibility
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("togglePassword");
  const password = document.getElementById("password");

  toggle.addEventListener("click", () => {
    const isHidden = password.type === "password";
    password.type = isHidden ? "text" : "password";
    toggle.textContent = isHidden ? "🙈" : "👁️";
  });
});
