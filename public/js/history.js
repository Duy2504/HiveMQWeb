const socket = io('http://localhost:3000');
socket.on("send-full", function (data) {
  // Xóa dữ liệu hiện có (nếu cần)
  $("#id-content").html("");
  $("#time-content").html("");
  $("#deviceId-content").html("");
  $("#temp-content").html("");
  $("#humi-content").html("");
  $("#light-content").html("");
  $("#soil-content").html("");
  $("#Rssi-content").html("");
  $("#SNR-content").html("");
  console.log(data);
  data.forEach(function (item) {
    $("#id-content").prepend("<div class='h-para'>" + item.id + "</div>");
    $("#time-content").prepend("<div class='h-para'>" + item.time + "</div>");
    $("#devicecId-content").prepend("<div class='h-para'>" + item.deviceId + "</div>");
    $("#temp-content").prepend("<div class='h-para'>" + item.temp + "</div>");
    $("#humi-content").prepend("<div class='h-para'>" + item.humid + "</div>");
    $("#light-content").prepend("<div class='h-para'>" + item.light + "</div>");
    $("#soil-content").prepend("<div class='h-para'>" + item.soil + "</div>");
    $("#Rssi-content").prepend("<div class='h-para'>" + item.Rssi + "</div>");
    $("#SNR-content").prepend("<div class='h-para'>" + item.SNR + "</div>");
  });
});

function Search_On_History() {
  var input, filter, id,deviceId, time, temp, humi, light,soil, Rssi,SNR, i, txtValue;
  input = document.getElementById("Search_History");
  keyword = input.value.toUpperCase();
  console.log(keyword);
  id = document.querySelectorAll("#id-content .h-para");
  time = document.querySelectorAll("#time-content .h-para");
  deviceId = document.querySelectorAll("#devicecId-content .h-para");
  temp = document.querySelectorAll("#temp-content .h-para");
  humi = document.querySelectorAll("#humi-content .h-para");
  light = document.querySelectorAll("#light-content .h-para");
  soil = document.querySelectorAll("#soil-content .h-para");
  Rssi = document.querySelectorAll("#Rssi-content .h-para");
  SNR = document.querySelectorAll("#SNR-content .h-para");
  
  for (i = 0; i < id.length; i++) {
    var idText = id[i].textContent || id[i].innerText;
    var timeText = time[i].textContent || time[i].innerText;
    var deviceIdText = deviceId[i].textContent || deviceId[i].innerText;
    var tempText = temp[i].textContent || temp[i].innerText;
    var humiText = humi[i].textContent || humi[i].innerText;
    var lightText = light[i].textContent || light[i].innerText;
    var soilText = soil[i].textContent || soil[i].innerText;
    var RssiText = Rssi[i].textContent || Rssi[i].innerText;
    var SNRText = SNR[i].textContent || SNR[i].innerText;

    if (
      idText.toUpperCase().indexOf(keyword) > -1 ||
      timeText.toUpperCase().indexOf(keyword) > -1 ||
      deviceIdText.toUpperCase().indexOf(keyword) > -1 ||
      tempText.toUpperCase().indexOf(keyword) > -1 ||
      humiText.toUpperCase().indexOf(keyword) > -1 ||
      lightText.toUpperCase().indexOf(keyword) > -1 ||
      soilText.toUpperCase().indexOf(keyword) > -1 ||
      RssiText.toUpperCase().indexOf(keyword) > -1 ||
      SNRText.toUpperCase().indexOf(keyword) > -1
    ) {
      id[i].style.display = "";
      time[i].style.display = "";
      deviceId[i].style.display = "";
      temp[i].style.display = "";
      humi[i].style.display = "";
      light[i].style.display = "";
      soil[i].style.display = "";
      Rssi[i].style.display = "";
      SNR[i].style.display = "";
    } else {
      id[i].style.display = "none";
      deviceId[i].style.display = "none";
      time[i].style.display = "none";
      temp[i].style.display = "none";
      humi[i].style.display = "none";
      light[i].style.display = "none";
      soil[i].style.display = "none";
      Rssi[i].style.display = "none";
      SNR[i].style.display = "none";
    }
  }
}
