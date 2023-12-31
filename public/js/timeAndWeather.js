// Date and time

function Time() {
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
      seconds;
    // var dateString = year + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;
    var dateString =
      (day < 10 ? "0" : "") +
      day +
      "-" +
      (month < 10 ? "0" : "") +
      month +
      "-" +
      year;
    document.getElementById("time").textContent = timeString;
    document.getElementById("date").textContent = dateString;
    if ((hours >= 18 && hours <= 23) || (hours >= 0 && hours < 6)) {
      document.getElementById("time-icon").src = "/public/images/icon/night.png";
    } else {
      document.getElementById("time-icon").src = "/public/images/icon/sun.png";
    }
  }
  // Weather
  // Function to fetch weather forecast for tomorrow
  function getWeatherForecast() {
    const city = "Hanoi"; // Tên thành phố Hà Nội
    const apiKey = "f7c0ae3acf7773be0f90ffb71e64b7a7"; // Thay thế bằng khóa API của bạn từ OpenWeatherMap
  
    // Tạo URL yêu cầu dự báo thời tiết
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  
    // Gửi yêu cầu HTTP để lấy dự báo thời tiết
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Lấy danh sách dự báo thời tiết
        const forecasts = data.list;
  
        // Tìm dự báo thời tiết cho ngày mai (12h từ hiện tại)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);
  
        // Tìm dự báo thời tiết gần nhất cho ngày mai
        let tomorrowForecast = null;
        for (let i = 0; i < forecasts.length; i++) {
          const forecastTime = new Date(forecasts[i].dt * 1000);
          if (forecastTime >= tomorrow) {
            tomorrowForecast = forecasts[i];
            break;
          }
        }
  
        if (tomorrowForecast) {
          // Hiển thị thông tin dự báo thời tiết cho ngày mai
          const temperature = (tomorrowForecast.main.temp - 273.15).toFixed(2); // Chuyển đổi từ K sang °C
          const humidity = tomorrowForecast.main.humidity;
          const windSpeed = tomorrowForecast.wind.speed;
          const description = tomorrowForecast.weather[0].description;
          const icon = tomorrowForecast.weather[0].icon;
  
          const weatherForecast = document.getElementById("weatherForecast");
          weatherForecast.innerHTML = `
                                               <p>Nhiệt độ: ${temperature}°C</p>
                                               <p>Độ ẩm: ${humidity}%</p>
                                               <p>Sức gió: ${windSpeed}km/h</p>
                                               
                                               <img style="margin:0px 0px 15% 5px" src="https://openweathermap.org/img/w/${icon}.png" alt="Biểu tượng thời tiết">`;
        } else {
          const weatherForecast = document.getElementById("weatherForecast");
          weatherForecast.innerHTML = `<h2>Dự báo thời tiết cho ngày mai</h2>
                                               <p>Không có thông tin dự báo thời tiết.</p>`;
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dự báo thời tiết:", error);
      });
  }
  
  function updateTime() {
    Time(); // Gọi lần đầu
    // Gọi hàm để lấy dự báo thời tiết khi trang được tải
    getWeatherForecast();
    setInterval(Time, 1000); // Cập nhật mỗi giây
  }