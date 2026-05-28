const express = require("express");
const cors = require("cors");
const fs = require("fs");

const userController = require("./controllers/userController");
const clientController = require("./controllers/clientController");
const roomController = require("./controllers/roomController");
const reservationController = require("./controllers/reservationController");
const balanceRequestController = require("./controllers/balanceRequestController");

const app = express();
const PORT = 3000;
const DB_FILE = "./database.json";

app.use(cors());
app.use(express.json());

let connectedClients = [];

function readDatabase() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function getNextId(items) {
  if (items.length === 0) return 1;
  return Math.max(...items.map(function (item) {
    return item.id;
  })) + 1;
}

app.get("/", function (req, res) {
  res.send("Hotel Management API is running");
});

userController(app, readDatabase, writeDatabase, getNextId);
clientController(app, connectedClients);
roomController(app, readDatabase, writeDatabase, getNextId);
reservationController(app, readDatabase, writeDatabase, getNextId);
balanceRequestController(app, readDatabase, writeDatabase, getNextId);

app.listen(PORT, function () {
  console.log("Server running on http://localhost:" + PORT);
});