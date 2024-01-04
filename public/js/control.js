const socket = io();
var statusLight = false;
var statusPump = false;
var statusRem = false;
var checkAuto;
const deviceIdElement = document.getElementById("deviceId");
// Lấy nội dung của phần tử và chuyển đổi thành số nếu cần
const deviceId = parseInt(deviceIdElement.textContent.trim(), 10);

socket.on("temp_" + deviceId, function (data_received) {
  let nhietdo = data_received;
  document.getElementById("currentTemp").innerHTML = nhietdo + "°C";
  if (checkAuto) {
    if (nhietdo > 30) {
      socket.emit("rem_change", deviceId + ",1");
      document.getElementById("rem-icon").src =
        "/public/images/icon/rem-off.gif";
      document.getElementById("rem-container").style.backgroundColor =
        "#f5f0eb";
      document.getElementById("text-rem").style.color = "black";
      statusRem = true;
    } else {
      socket.emit("rem_change", deviceId + ",0");
      document.getElementById("rem-icon").src =
        "/public/images/icon/rem-mo.png";
      document.getElementById("rem-container").style.backgroundColor = null;
      document.getElementById("text-rem").style.color = null;
      statusRem = false;
    }
  }
  // //thêm giá trị vào biểu đồ
  var x = new Date().getTime(); // Thời gian hiện tại
  var temperatureSeries = chart.series[0]; // Chọn series "Temperature"
  var temperatureY = parseFloat(nhietdo); // Giá trị nhiệt độ
  temperatureSeries.addPoint([x, temperatureY], true, true); // Thêm điểm vào series
  chart.redraw();
});

socket.on("humi_" + deviceId, function (data_received) {
  let doam = data_received;
  document.getElementById("currentHumi").innerHTML = doam + " %";
  var x = new Date().getTime(); // Thời gian hiện tại
  var humiditySeries = chart.series[1]; // Chọn series "Humidity"
  var humidityY = parseFloat(doam); // Giá trị độ ẩm
  humiditySeries.addPoint([x, humidityY], true, true); // Thêm điểm vào series
  chart.redraw();
});

socket.on("light_" + deviceId, function (data_received) {
  let anhsang = data_received;
  document.getElementById("currentLight").innerHTML = anhsang + " %";
  if (checkAuto) {
    if (anhsang < 30) {
      socket.emit("light_change", deviceId + ",1");
      document.getElementById("light-icon").src =
        "/public/images/icon/light-on.png";
      document.getElementById("device-light").style.backgroundColor = "#ffef99";
      document.getElementById("text-light").style.color = "black";
      statusLight = true;
    } else {
      socket.emit("light_change", deviceId + ",0");
      document.getElementById("light-icon").src =
        "/public/images/icon/light-off.png";
      document.getElementById("device-light").style.backgroundColor = null;
      document.getElementById("text-light").style.color = null;
      statusLight = false;
    }
  }
  var x = new Date().getTime(); // Thời gian hiện tại
  var lightSeries = chart.series[2]; // Chọn series "Light"
  var lightY = parseFloat(anhsang); // Giá trị ánh sáng
  lightSeries.addPoint([x, lightY], true, true); // Thêm điểm vào series
  chart.redraw();
});
socket.on("soil_" + deviceId, function (data_received) {
  let soil = data_received;
  document.getElementById("currentSoil").innerHTML = soil + " %";
  if (checkAuto) {
    if (soil < 50) {
      socket.emit("pump_change", deviceId + ",1");
      document.getElementById("pump-icon").src =
        "/public/images/icon/pump-on.gif";
      document.getElementById("device-pump").style.backgroundColor = "#7fcde7";
      document.getElementById("text-pump").style.color = "black";
      statusPump = true;
    } else {
      socket.emit("pump_change", deviceId + ",0");
      document.getElementById("pump-icon").src =
        "/public/images/icon/pump-off.png";
      document.getElementById("device-pump").style.backgroundColor = null;
      document.getElementById("text-light").style.color = null;
      statusPump = false;
    }
  }
  var x = new Date().getTime(); // Thời gian hiện tại
  var soilSeries = chart.series[3]; // Chọn series "Light"
  var soilY = parseFloat(soil); // Giá trị ánh sáng
  soilSeries.addPoint([x, soilY], true, true); // Thêm điểm vào series
  chart.redraw();
});
socket.on("Rssi_" + deviceId, function (data_received) {
  let Rssi = data_received;
  document.getElementById("currentRssi").innerHTML = Rssi + " dB";
});
socket.on("SNR_" + deviceId, function (data_received) {
  let SNR = data_received;
  document.getElementById("currentSNR").innerHTML = SNR ;
  // if (Pin < 15) {
  //   document.getElementById("Pin-icon").src =
  //     "/public/images/icon/battery-low.png";
  // } else if (Pin >= 15 && Pin <= 30) {
  //   document.getElementById("Pin-icon").src =
  //     "/public/images/icon/battery-tb1.png";
  // } else if (Pin > 30 && Pin <= 70) {
  //   document.getElementById("Pin-icon").src =
  //     "/public/images/icon/battery-tb2.png";
  // } else {
  //   document.getElementById("Pin-icon").src =
  //     "/public/images/icon/battery-full.png";
  // }
});
//===================== Control device ======================//

socket.on("AutoMode_" + deviceId, function (data_received) {
  data_received.forEach(function (item) {
    console.log(item.state);
    if (item.state == 1) {
      checkAuto = true;
      document.getElementById("auto-icon").src =
        "/public/images/icon/auto-mode-on.gif";
      document.getElementById("autoSection").style.backgroundColor =
        "lightgreen";
    } else {
      checkAuto = false;
      document.getElementById("auto-icon").src =
        "/public/images/icon/auto-mode-off.png";
      document.getElementById("autoSection").style.backgroundColor = "violet";
    }
  });
});

// EX BUTTON
function controlAuto() {
  document.getElementById("auto").addEventListener("change", function () {
    if (this.checked) {
      socket.emit("autoMode", deviceId + ",1");
      checkAuto = true;
      document.getElementById("auto-icon").src =
        "/public/images/icon/auto-mode-on.gif";
      document.getElementById("autoSection").style.backgroundColor =
        "lightgreen";
    } else {
      socket.emit("autoMode", deviceId + ",0");
      checkAuto = false;
      document.getElementById("auto-icon").src =
        "/public/images/icon/auto-mode-off.png";
      document.getElementById("autoSection").style.backgroundColor = "violet";
    }
  });
}

function controlLight() {
  var checkBox = document.getElementById("deviceLight");
  if (checkBox.checked) {
    if (!statusLight) {
      var userResponse = confirm("Bạn có muốn bật đèn không?");
      if (userResponse) {
        document.getElementById("light-icon").src =
          "/public/images/icon/light-on.png";
        document.getElementById("device-light").style.backgroundColor =
          "#ffef99";
        document.getElementById("text-light").style.color = "black";
        socket.emit("light_change", deviceId + ",1");
        statusLight = true;
      } else {
        checkBox.checked = false;
      }
    } else {
      var userResponse = confirm("Bạn muốn tắt đèn không?");
      if (userResponse) {
        document.getElementById("light-icon").src =
          "/public/images/icon/light-off.png";
        document.getElementById("device-light").style.backgroundColor = null;
        document.getElementById("text-light").style.color = null;
        socket.emit("light_change", deviceId + ",0");
        statusLight = false;
      } else {
        checkBox.checked = true;
      }
    }
  }
}
function controlPump() {
  var checkBox = document.getElementById("devicePump");
  if (checkBox.checked) {
    if (!statusPump) {
      var userResponse = confirm("Bạn có muốn bật bơm không?");
      if (userResponse) {
        document.getElementById("pump-icon").src =
          "/public/images/icon/pump-on.gif";
        document.getElementById("device-pump").style.backgroundColor =
          "#7fcde7";
        document.getElementById("text-pump").style.color = "black";
        socket.emit("pump_change", deviceId + ",1");
        statusPump = true;
      } else {
        checkBox.checked = false;
      }
    } else {
      var userResponse = confirm("Bạn muốn tắt bơm không?");
      if (userResponse) {
        document.getElementById("pump-icon").src =
          "/public/images/icon/pump-off.png";
        document.getElementById("device-pump").style.backgroundColor = null;
        document.getElementById("text-light").style.color = null;
        socket.emit("pump_change", deviceId + ",0");
        statusPump = false;
      } else {
        checkBox.checked = true;
      }
    }
  }
}
function controlRem() {
  var checkBox = document.getElementById("deviceRem");
  if (checkBox.checked) {
    if (!statusRem) {
      var userResponse = confirm("Bạn có muốn che rèm không?");
      if (userResponse) {
        document.getElementById("rem-icon").src =
          "/public/images/icon/rem-off.gif";
        document.getElementById("rem-container").style.backgroundColor =
          "#f5f0eb";
        document.getElementById("text-rem").style.color = "black";
        socket.emit("rem_change", deviceId + ",1");
        statusRem = true;
      } else {
        checkBox.checked = false;
      }
    } else {
      var userResponse = confirm("Bạn muốn mở rèm không?");
      if (userResponse) {
        document.getElementById("rem-icon").src =
          "/public/images/icon/rem-mo.png";
        document.getElementById("rem-container").style.backgroundColor = null;
        document.getElementById("text-rem").style.color = null;
        socket.emit("rem_change", deviceId + ",0");
        statusRem = false;
      } else {
        checkBox.checked = true;
      }
    }
  }
}

// socket.on("chart_"+deviceId, function (data_received) {
//   data_received.forEach(function (value) {
//     console.log(value.temp);
//     console.log(value.humid);
//     // Thêm điểm dữ liệu mới vào series
//     chart.series[0].addPoint([Date.now(), item.temp], true, true);
//     chart.series[1].addPoint([Date.now(), item.humid], true, true);
//     chart.series[2].addPoint([Date.now(), item.light], true, true);
//     chart.series[3].addPoint([Date.now(), item.soil], true, true);
//   });
// });


Highcharts.setOptions({
  global: {
    timezoneOffset: -7 * 60, // Time +7
  },
});
//thiết lập chart ban đầu
const chart = Highcharts.chart("container", {
  
  chart: {
    type: "spline",
  },
  title: {
    text: "Sensor Data",
  },
  // xAxis: {
  //   type: "datetime",
  //   title: {
  //     text: "Time",
  //   },
  // },
  xAxis: {
    type: "datetime",
    title: {
      text: "Time",
    },
  },
  yAxis: {
    labels: {
      format: "{value:.2f}",
    },
    title: {
      text: "Value",
    },
  },
  tooltip: {
    crosshairs: true,
    shared: true,
  },
  plotOptions: {
    spline: {
      marker: {
        radius: 4,
        lineColor: "#666666",
        lineWidth: 1,
      },
    },
  },
  series: [
    {
      name: "Temperature",
      marker: {
        Symbol: "cross",
      },
      data: [0],
    },
    {
      name: "Humidity",
      marker: {
        symbol: "diamond",
      },
      data: [0],
    },
    {
      name: "Light",
      marker: {
        symbol: "circle",
      },
      data: [0],
    },
    {
      name: "Soil",
      marker: {
        symbol: "triangle",
      },
      data: [0],
    },
  ],
});

function fetchDataAndUpdateChart(deviceId) {
  fetch(`/get-5-last-data/${deviceId}`)
    .then(response => response.json())
    .then(data => {
      // Update the chart series with the fetched data
      chart.series[0].setData(data.map(item => [new Date(item.created_at).getTime(), item.temp]));
      chart.series[1].setData(data.map(item => [new Date(item.created_at).getTime(), item.humid]));
      chart.series[2].setData(data.map(item => [new Date(item.created_at).getTime(), item.light]));
      chart.series[3].setData(data.map(item => [new Date(item.created_at).getTime(), item.soil]));
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}
fetchDataAndUpdateChart(deviceId);

