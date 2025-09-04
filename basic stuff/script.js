
const form = document.querySelector("form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const message = document.querySelector("#message");

form.addEventListener("submit", function(event) {
  event.preventDefault(); 

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username === "admin" && password === "1234") {
    message.textContent = "✅ Login Successful!";
    message.style.color = "green";
  } else {
    message.textContent = "❌ Invalid credentials. Try again.";
    message.style.color = "red";
  }
});
