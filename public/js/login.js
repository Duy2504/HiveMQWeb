const socket = io('http://localhost:3000');
socket.on("checkLogin", function (data_received) {
  let checkLogin = data_received;
  if (checkLogin == 1) {
    window.location.href = "/controller/:id";
  }
  else{
    alert("Sai thông tin đăng nhập!")
  }
});
function login() {
  var username = document.querySelector('.input-login-username').value;
  var password = document.querySelector('.input-login-password').value;
  socket.emit("xacthuc", { username, password });
}
