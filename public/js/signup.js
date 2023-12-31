const socket = io('http://localhost:3000');
const inputUsernameRegister = document.querySelector(".input-signup-username");
const inputPasswordRegister = document.querySelector(".input-signup-password");
const inputConfirmPassword = document.querySelector(".input-sigup-confirmPass");
const btnRegister = document.querySelector(".signup__signInButton");

// Initialize variables to store user and password
let user = "";
let pass = "";

// validation form register and register user local storage
btnRegister.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    inputUsernameRegister.value == "" ||
    inputPasswordRegister.value == "" ||
    inputConfirmPassword.value == ""
  ) {
    alert("Vui lòng không để trống");
  } else if (inputPasswordRegister.value != inputConfirmPassword.value) {
    alert("Xác thực lại mật khẩu");
  } else {
    // Update the user and pass variables
    user = inputUsernameRegister.value;
    pass = inputPasswordRegister.value;

    // Create an object with user and pass
    const userData = {
      username: user,
      password: pass,
    };

    // Convert the object to JSON and store it in localStorage
    let json = JSON.stringify(userData);
    localStorage.setItem(user, json);

    // Emit a socket event with the user and password
    socket.emit("taikhoan", { user, pass });

    alert("Đăng Ký Thành Công");
    window.location.href = "login";
  }
});
