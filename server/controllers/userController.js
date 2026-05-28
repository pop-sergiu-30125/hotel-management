const multer = require("multer");
const path = require("path");
const { createUser, publicUser } = require("../models/userModel");

//added for image stuff
const profilePhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const uploadProfilePhoto = multer({
  storage: profilePhotoStorage
});

function userController(app, readDatabase, writeDatabase, getNextId) {
  // SIGN UP
  app.post("/signup", function (req, res) {
  const db = readDatabase();

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  const existingUser = db.users.find(function (user) {
    return user.username === username;
  });

  if (existingUser) {
    return res.status(409).json({
      message: "Username already exists"
    });
  }

  const newUser = createUser(
    getNextId(db.users),
    username,
    password
  );

  db.users.push(newUser);
  writeDatabase(db);

  res.status(201).json({
    message: "User created successfully",
    user: publicUser(newUser)
  });
});

  // LOGIN
  app.post("/login", function (req, res) {
    const db = readDatabase();

    const username = req.body.username;
    const password = req.body.password;

    const user = db.users.find(function (user) {
      return user.username === username && user.password === password;
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    res.json({
      message: "Login successful",
      user: publicUser(user)
    });
  });

  // GET USERS
  app.get("/users", function (req, res) {
    const db = readDatabase();

    res.json(db.users.map(function (user) {
      return publicUser(user);
    }));
  });

  // UPDATE USER
app.put("/users/:id", function (req, res) {
  const db = readDatabase();

  const id = Number(req.params.id);

  const user = db.users.find(function (user) {
    return user.id === id;
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  if (req.body.username !== undefined) {
    user.username = req.body.username;
  }

  if (req.body.password !== undefined) {
    user.password = req.body.password;
  }

  if (req.body.email !== undefined) {
    user.email = req.body.email;
  }

  if (req.body.profilePhoto !== undefined) {
    user.profilePhoto = req.body.profilePhoto;
  }

  writeDatabase(db);

  res.json({
    message: "User updated successfully",
    user: publicUser(user)
        });
});

  // DELETE USER
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

  // UPLOAD PROFILE PHOTO
app.post("/users/:id/profile-photo", uploadProfilePhoto.single("image"), function (req, res) {
  const db = readDatabase();

  const userId = Number(req.params.id);
  const loggedUserId = Number(req.body.loggedUserId);

  const loggedUser = db.users.find(function (user) {
    return user.id === loggedUserId;
  });

  if (!loggedUser) {
    return res.status(401).json({
      message: "You must be logged in"
    });
  }

  if (loggedUser.role !== "admin" && loggedUser.id !== userId) {
    return res.status(403).json({
      message: "You can update only your own profile photo"
    });
  }

  const user = db.users.find(function (user) {
    return user.id === userId;
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: "No image selected"
    });
  }

  const imagePath = "uploads/profiles/" + req.file.filename;

  user.profilePhoto = imagePath;

  writeDatabase(db);

  res.json({
    message: "Profile photo uploaded successfully",
    user: publicUser(user)
  });
});
}

module.exports = userController;