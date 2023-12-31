
//================= Search ===============//
function Search_Timer() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("Search_Timer");
  filter = input.value.toUpperCase();
  table = document.getElementById("timerTable");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1]; // Thay đổi số 1 thành chỉ số của cột bạn muốn tìm kiếm
      if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
          } else {
              tr[i].style.display = "none";
          }
      }
  }
}
//================ time ===============//
function updateTime() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var year = now.getFullYear();
  var month = now.getMonth() + 1; // Tháng bắt đầu từ 0
  var day = now.getDate();
  var timeString =
    hours +
    ":" +
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds +
    "  " +
    " " +
    (day < 10 ? "0" : "") +
    day +
    "-" +
    (month < 10 ? "0" : "") +
    month +
    "-" +
    year;
  // var dateString = day + "-" + (day < 10 ? "0" : "") + month + (month < 10 ? "0" : "") + "-" + year;
  document.getElementById("time").textContent = timeString;
  
}

function updateRowColors() {
  const now = new Date();
  const rows = timerTable.rows;

  for (let i = 0; i < rows.length; i++) {
    const startTimeCell = rows[i].cells[2].innerHTML;
    const endTimeCell = rows[i].cells[3].innerHTML;
    const startTime = new Date().setHours(
      parseInt(startTimeCell.split(":")[0]),
      parseInt(startTimeCell.split(":")[1])
    );
    const endTime = new Date().setHours(
      parseInt(endTimeCell.split(":")[0]),
      parseInt(endTimeCell.split(":")[1])
    );

    if (now >= startTime && now < endTime) {
      rows[i].classList.remove("inSuccess");
      rows[i].classList.add("Success");
    } else {
      rows[i].classList.remove("Success");
      rows[i].classList.add("inSuccess");
    }
  }
}

function update() {
  updateTime(); // Gọi lần đầu
  setInterval(updateTime, 1000); // Cập nhật thời gian mỗi giây
  setInterval(updateRowColors, 1000); // Cập nhật màu sắc hàng mỗi giây
}

//================== ADD TIMER ========================//
function addRow() {
  const addTimerButton = document.getElementById("addTimerButton");
  const timerForm = document.getElementById("timerForm");
  const timerDevice = document.getElementById("timerDevice");
  const timerName = document.getElementById("timerName");
  const timerStartTime = document.getElementById("timerStartTime");
  const timerEndTime = document.getElementById("timerEndTime");
  const saveTimerButton = document.getElementById("saveTimerButton");
  const timerTable = document
    .getElementById("timerTable")
    .getElementsByTagName("tbody")[0];

  addTimerButton.addEventListener("click", () => {
    timerForm.style.display = "block";
  });

  saveTimerButton.addEventListener("click", () => {
    // Lấy thông tin từ các input
    const name = timerName.value;
    const deviceName = timerDevice.value;
    const startTime = timerStartTime.value;
    const endTime = timerEndTime.value;

    // Tạo một hàng mới trong bảng
    const newRow = timerTable.insertRow(timerTable.rows.length);

    // Tạo các ô dữ liệu cho hàng mới
    const deviceCell = newRow.insertCell(0);
    const nameCell = newRow.insertCell(1);
    const startTimeCell = newRow.insertCell(2);
    const endTimeCell = newRow.insertCell(3);
    const deleteCell = newRow.insertCell(4);

    deviceCell.innerHTML = deviceName;
    nameCell.innerHTML = name;
    startTimeCell.innerHTML = startTime;
    endTimeCell.innerHTML = endTime;

    // Tạo nút xóa và thêm sự kiện xóa
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteCell.appendChild(deleteButton);
    deleteButton.addEventListener("click", () => {
      // Lấy hàng cha của nút xóa (đã bấm)
      const rowToDelete = deleteButton.parentNode.parentNode;
      // Xóa hàng khỏi bảng
      timerTable.removeChild(rowToDelete);
    });

    // Xóa nội dung input và ẩn form
    timerName.value = "";
    timerStartTime.value = "";
    timerEndTime.value = "";
    timerForm.style.display = "none";
  });

  function updateRowColors() {
    const now = new Date();
    const rows = timerTable.rows;

    for (let i = 0; i < rows.length; i++) {
      const startTimeCell = rows[i].cells[2].innerHTML;
      const endTimeCell = rows[i].cells[3].innerHTML;
      const startTime = new Date().setHours(
        parseInt(startTimeCell.split(":")[0]),
        parseInt(startTimeCell.split(":")[1].split(":")[0])
      );
      const endTime = new Date().setHours(
        parseInt(endTimeCell.split(":")[0]),
        parseInt(endTimeCell.split(":")[1].split(":")[0])
      );
      const endMinute = parseInt(endTimeCell.split(":")[1].split(":")[1]);

      if (now >= startTime && now < endTime) {
        if (now >= endTime - endMinute * 60000) {
          rows[i].classList.remove("active");
          rows[i].classList.add("inactive");
        } else {
          rows[i].classList.remove("inactive");
          rows[i].classList.add("active");
        }
      } else {
        rows[i].classList.remove("active");
        rows[i].classList.add("inactive");
      }
    }
  }

  addTimerButton.addEventListener("click", () => {
    timerForm.style.display = "block";
  });
}

