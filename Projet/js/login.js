document.addEventListener("DOMContentLoaded", function () {


  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginError = document.getElementById("loginError");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    loginError.textContent = ""; // clear old message [web:271]

    if (username === "admin" && password === "admin") {
      location.href = "./Dashboard.html";
    } else {
      loginError.textContent = "Wrong username or password"; // show message [web:271]
    }
  });


  
});
