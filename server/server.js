const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DB_FILE = "./database.json";

app.use(cors());

let connectedClients = []; //pentru a vedea nr de clienti conectati

app.use(express.json());

function readDatabase() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function getNextId(items) {
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.id)) + 1;
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    balance: user.balance
  };
}

app.get("/", function (req, res) {
  res.send("Hotel Management API is running");
});

app.post("/signup", function (req, res) {
  const db = readDatabase();

  const username = req.body.username;
  const password = req.body.password;
  const role = "guest";
  const balance = 0;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const existingUser = db.users.find(user => user.username === username);

  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const newUser = {
    id: getNextId(db.users),
    username: username,
    password: password,
    role: role,
    balance: Number(balance)
  };

  db.users.push(newUser);
  writeDatabase(db);

  res.status(201).json({
    message: "User created successfully",
    user: publicUser(newUser)
  });
});

app.post("/login", function (req, res) {
  const db = readDatabase();
  const username = req.body.username;
  const password = req.body.password;

  const user = db.users.find(user =>
    user.username === username && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  res.json({
    message: "Login successful",
    user: publicUser(user)
  });
});

app.get("/users", function (req, res) {
  const db = readDatabase();
  res.json(db.users.map(user => publicUser(user)));
});

app.put("/users/:id", function (req, res) {
  const db = readDatabase();
  const id = Number(req.params.id);

  const user = db.users.find(user => user.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.body.username !== undefined) {
    user.username = req.body.username;
  }

  if (req.body.password !== undefined) {
    user.password = req.body.password;
  }

  writeDatabase(db);

  res.json({
    message: "User updated successfully",
    user: publicUser(user)
  });
});

// DELETE USER
// Admin can delete any user.
// Regular users can delete only their own account.
app.delete("/users/:id", function (req, res) {
  const db = readDatabase();

  const userIdToDelete = Number(req.params.id);
  const loggedUserId = Number(req.body.loggedUserId);

  const loggedUser = db.users.find(function (user) {
    return user.id === loggedUserId;
  });

  if (!loggedUser) {
    return res.status(401).json({
      message: "You must be logged in"
    });
  }

  const userToDelete = db.users.find(function (user) {
    return user.id === userIdToDelete;
  });

  if (!userToDelete) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  if (loggedUser.role !== "admin" && loggedUser.id !== userIdToDelete) {
    return res.status(403).json({
      message: "You can delete only your own account"
    });
  }

  db.users = db.users.filter(function (user) {
    return user.id !== userIdToDelete;
  });

  writeDatabase(db);

  res.json({
    message: "User deleted successfully"
  });
});

// UPDATE BALANCE
// User can change only their own balance.
// Admin can change any user's balance.
app.put("/users/:id/balance", function (req, res) {
  const db = readDatabase();

  const userIdToUpdate = Number(req.params.id);
  const loggedUserId = Number(req.body.loggedUserId);
  const newBalance = Number(req.body.balance);

  const loggedUser = db.users.find(function (user) {
    return user.id === loggedUserId;
  });

  if (!loggedUser) {
    return res.status(401).json({
      message: "You must be logged in"
    });
  }

  const userToUpdate = db.users.find(function (user) {
    return user.id === userIdToUpdate;
  });

  if (!userToUpdate) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  if (loggedUser.role !== "admin" && loggedUser.id !== userIdToUpdate) {
    return res.status(403).json({
      message: "You can update only your own balance"
    });
  }

  if (isNaN(newBalance) || newBalance < 0) {
    return res.status(400).json({
      message: "Balance must be a positive number"
    });
  }

  userToUpdate.balance = newBalance;

  writeDatabase(db);

  res.json({
    message: "Balance updated successfully",
    user: publicUser(userToUpdate)
  });
});


//clients visualisation
app.post("/clients/connect", function (req, res) {
  const clientId = req.body.clientId;

  if (!clientId) {
    return res.status(400).json({ message: "clientId is required" });
  }

  const alreadyConnected = connectedClients.find(function (client) {
    return client.id === clientId;
  });

  if (!alreadyConnected) {
    connectedClients.push({
      id: clientId,
      connectedAt: new Date().toLocaleString()
    });
  }

  res.json({
    message: "Client connected",
    connectedClients: connectedClients.length,
    clients: connectedClients
  });
});

app.get("/clients", function (req, res) {
  res.json({
    connectedClients: connectedClients.length,
    clients: connectedClients
  });
});

app.listen(PORT, function () {
  console.log("Server running on http://localhost:" + PORT);
});