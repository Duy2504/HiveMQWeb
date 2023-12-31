var mysql = require("mysql");
var express = require("express");
var mqtt = require("mqtt");
const options = {
  username: "Duy2504",
  password: "Duy1002452",
};
const client = mqtt.connect(
  "tls://0ee29c0de112499cb84bcc2b3f5667dd.s2.eu.hivemq.cloud:8883",
  options
);
var app = express();
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "datn",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("mysql connected");
});
con.query(
  "CREATE TABLE IF NOT EXISTS datasensors(id int(10) AUTO_INCREMENT,deviceId int(10),temp int(10),humid int(10),light int(10),soil int(10),Rssi int(10),SNR int(10),created_at timestamp DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(id))"
);
con.query(
  "CREATE TABLE IF NOT EXISTS user(id int(10) AUTO_INCREMENT,user varchar(255),password varchar(255),created_at timestamp DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(id))"
);
con.query(
  "CREATE TABLE IF NOT EXISTS relays(id int(10) AUTO_INCREMENT,relay_id varchar(255),state varchar(255),created_at timestamp DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(id))"
);
con.query(
  "CREATE TABLE IF NOT EXISTS autoMode(id int(10) AUTO_INCREMENT,DeviceId varchar(255),state varchar(255),created_at timestamp DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(id))"
);
app.use("/public", express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

app.get("/", function (req, res) {
  res.render("login");
});
// app.get("/", function (req, res) {
//   res.render("base");
// });
app.post("/login", (req, res) => {
  res.render("login");
});

app.get("/base", function (req, res) {
  res.render("base");
});
app.get("/timer", function (req, res) {
  res.render("timer");
});
app.get("/dashboard", function (req, res) {
  res.render("control");
});
app.get("/control", function (req, res) {
  res.render("control");
});

app.get("/controller/:id", async (req, res) => {
  const deviceId = req.params.id;
  Sensordata = {
    deviceId: deviceId,
  };
  res.render("control", { Sensordata });
  // var sqlchart = `SELECT * FROM datasensors WHERE DeviceId = ${con.escape(
  //   deviceId
  // )} ORDER BY created_at DESC LIMIT 1`;
  // con.query(sqlchart, function (err, result, fields) {
  //   if (err) throw err;
  //   var chart = [];
  //   result.forEach(function (value) {
  //     var m_time = value.created_at.toString().slice(4, 24);
  //     chart.unshift({
  //       id: value.id,
  //       time: m_time,
  //       deviceId: value.deviceId,
  //       temp: value.temp,
  //       humid: value.humid,
  //       light: value.light,
  //       soil: value.soil,
  //       Rssi: value.Rssi,
  //       Pin: value.Pin,
  //     });
  //   });
  //   console.log(chart);
  //   io.emit("AutoMode_" + deviceId, chart);
  // });
});
app.get("/history", function (req, res) {
  res.render("history");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/signup", function (req, res) {
  res.render("signup");
});

// client.on("connect", function () {
//   console.log("mqtt connected");
//   client.subscribe("sensor");
// });
client.on("connect", () => {
  console.log("Connected!");
  client.subscribe("sensor");
});
const topic = "sensor";
client.on("message", function (topic, message) {
  const data = JSON.parse(message);
  var deviceId = data.deviceId;
  var state_1 = data.state_1;
  var state_2 = data.state_2;
  var state_3 = data.state_3;
  var temp_data = data.temperature.toFixed(2);
  // var temp_data = data.temperature;
  var humi_data = data.humidity.toFixed(2);
  var light_data = data.light.toFixed(2);
  var soil_data = data.soil.toFixed(2);
  var Rssi = data.Rssi;
  var SNR = data.SNR;

  var sql =
    "insert into datasensors(deviceId,temp,humid,light,soil,Rssi,SNR) value ( " +
    deviceId +
    " , " +
    temp_data +
    " , " +
    humi_data +
    " ," +
    light_data +
    " ," +
    soil_data +
    " ," +
    Rssi +
    " ," +
    SNR +
    ")";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(
      " deviceId: " +
        deviceId +
        " ,temp: " +
        temp_data +
        " ,humi: " +
        humi_data +
        ", light: " +
        light_data +
        ", soil: " +
        soil_data +
        ", Rssi: " +
        Rssi +
        ", SNR: " +
        SNR +
        " "
    );
  });

  io.emit("temp_" + deviceId, temp_data);
  io.emit("humi_" + deviceId, humi_data);
  io.emit("light_" + deviceId, light_data);
  io.emit("soil_" + deviceId, soil_data);
  io.emit("Rssi_" + deviceId, Rssi);
  io.emit("SNR_" + deviceId, SNR);

  io.emit("light_state_" + deviceId, state_1);
  io.emit("pump_state_" + deviceId, state_2);
  io.emit("rem_state_" + deviceId, state_3);
  // Send autoMode
  var sqlAutoMode = `SELECT * FROM automode WHERE DeviceId = ${con.escape(
    deviceId
  )} ORDER BY created_at DESC LIMIT 1`;
  con.query(sqlAutoMode, function (err, result, fields) {
    if (err) throw err;
    var AutoModeData = [];
    result.forEach(function (value) {
      AutoModeData.unshift({
        Id: value.DeviceId,
        state: value.state,
      });
    });
    console.log(AutoModeData);
    io.emit("AutoMode_" + deviceId, AutoModeData);
  });
});

io.on("connection", function (socket) {
  console.log("user " + socket.id + " connected");
  socket.on("taikhoan", (data) => {
    console.log("register:", data);
    const sqlUser = "INSERT INTO user (user, password) VALUES (?, ?)";
    const values = [data.user, data.pass];
    con.query(sqlUser, values, (err, results) => {
      if (err) {
        console.error("Error inserting data into MySQL:", err);
        return;
      }
      console.log("User registered in the database");
    });
  });
  socket.on("xacthuc", (data) => {
    console.log("Xacthuc:", data);
    const sqlLogin = 'SELECT * FROM user WHERE user = ? AND password = ?';
    const values = [data.username, data.password];
    con.query(sqlLogin, values, (err, results) => {
      if (err) {
        console.error('Error querying MySQL:', err);
        return;
      }
      if (results.length > 0) {
        io.emit('checkLogin',1);
      } else {
        console.log('Invalid username or password');
        io.emit('checkLogin',0);
      }
    });
  });
  socket.on("autoMode", (data) => {
    const values = data.split(",");
    const relayId = values[0];
    const state = values[1];
    const relayIdEscaped = con.escape(relayId);
    const sqlAutoMode = "INSERT INTO autoMode (DeviceId, state) VALUES (?, ?)";
    con.query(
      sqlAutoMode,
      [relayId.replace(/'/g, ""), state],
      (err, result) => {
        if (err) {
          console.error("Error inserting data into MySQL:", err);
        } else {
          console.log("Data inserted successfully:", result);
        }
      }
    );
  });

  socket.on("light_change", (data) => {
    client.publish("light_state", "light" + "," + data);
    console.log("Đèn: ", data);
    const sqlRelay1 = "INSERT INTO relays(relay_id, state) VALUES (?, ?)";
    const values = ["Đèn", data];

    con.query(sqlRelay1, values, (err, results) => {
      if (err) {
        console.error("Error inserting data into relays table:", err);
        return;
      }
      console.log("Data inserted into relays table");
    });
  });
  socket.on("pump_change", (data) => {
    client.publish("pump_state", "pump" + "," + data);
    console.log("Bơm: ", data);
    const sqlRelay2 = "INSERT INTO relays(relay_id, state) VALUES (?, ?)";
    const values = ["Bơm", data];
    con.query(sqlRelay2, values, (err, results) => {
      if (err) {
        console.error("Error inserting data into relays table:", err);
        return;
      }
      console.log("Data inserted into relays table");
    });
  });
  socket.on("rem_change", (data) => {
    client.publish("rem_state", "rem" + "," + data);
    console.log("Rèm: ", data);
    const sqlRelay3 = "INSERT INTO relays(relay_id, state) VALUES (?, ?)";
    const values = ["Rèm", data];

    con.query(sqlRelay3, values, (err, results) => {
      if (err) {
        console.error("Error inserting data into relays table:", err);
        return;
      }
      console.log("Data inserted into relays table");
    });
  });
  // Send data to History page
  var sqlHistory = "SELECT * FROM datasensors ORDER BY id DESC LIMIT 50";
  con.query(sqlHistory, function (err, result, fields) {
    if (err) throw err;
    console.log("Full Data selected");
    var fullData = [];
    result.forEach(function (value) {
      var m_time = value.created_at.toString().slice(4, 24);
      var t = parseFloat(value.light).toFixed(0);
      // Tăng dần
      fullData.unshift({
        id: value.id,
        time: m_time,
        deviceId: value.deviceId,
        temp: value.temp,
        humid: value.humid,
        light: value.light,
        soil: value.soil,
        Rssi: value.Rssi,
        SNR: value.SNR,
      });
      // // Giảm dần
      // fullData.push({
      //   id: value.id,
      //   time: m_time,
      //   deviceId: value.deviceId,
      //   temp: value.temp,
      //   humid: value.humid,
      //   light: value.light,
      //   soil: value.soil,
      //   Rssi: value.Rssi,
      //   Pin: value.Pin,
      // });
    });
    // console.log(fullData);
    // console.log(result);
    io.emit("send-full", fullData);
  });
});
