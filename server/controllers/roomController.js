const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { createRoom } = require("../models/roomModel");

const roomImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/rooms");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const uploadRoomImage = multer({
  storage: roomImageStorage
});

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/videos");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const uploadRoomVideo = multer({
  storage: videoStorage
});

function roomController(app, readDatabase, writeDatabase, getNextId) {
  // GET ALL ROOMS
  app.get("/rooms", function (req, res) {
    const db = readDatabase();
    res.json(db.rooms);
  });

  // GET ONE ROOM
  app.get("/rooms/:id", function (req, res) {
    const db = readDatabase();
    const id = Number(req.params.id);

    const room = db.rooms.find(function (room) {
      return room.id === id;
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    res.json(room);
  });

  // CREATE ROOM - admin only
  app.post("/rooms", function (req, res) {
    const db = readDatabase();

    const loggedUserId = Number(req.body.loggedUserId);

    const loggedUser = db.users.find(function (user) {
      return user.id === loggedUserId;
    });

    if (!loggedUser || loggedUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can add rooms"
      });
    }

    const newRoom = createRoom(
      getNextId(db.rooms),
      req.body.name,
      req.body.roomNumber,
      req.body.numberOfRooms,
      req.body.capacity,
      req.body.price,
      req.body.description,
      req.body.images,
      req.body.video
    );

    db.rooms.push(newRoom);
    writeDatabase(db);

    res.status(201).json({
      message: "Room created successfully",
      room: newRoom
    });
  });

  // UPDATE ROOM - admin only
  app.put("/rooms/:id", function (req, res) {
    const db = readDatabase();

    const roomId = Number(req.params.id);
    const loggedUserId = Number(req.body.loggedUserId);

    const loggedUser = db.users.find(function (user) {
      return user.id === loggedUserId;
    });

    if (!loggedUser || loggedUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can update rooms"
      });
    }

    const room = db.rooms.find(function (room) {
      return room.id === roomId;
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    if (req.body.name !== undefined) {
      room.name = req.body.name;
    }

    if (req.body.roomNumber !== undefined) {
      room.roomNumber = req.body.roomNumber;
    }

    if (req.body.numberOfRooms !== undefined) {
      room.numberOfRooms = Number(req.body.numberOfRooms);
    }

    if (req.body.capacity !== undefined) {
      room.capacity = Number(req.body.capacity);
    }

    if (req.body.price !== undefined) {
      room.price = Number(req.body.price);
    }

    if (req.body.description !== undefined) {
      room.description = req.body.description;
    }

    if (req.body.status !== undefined) {
      room.status = req.body.status;
    }

    if (req.body.video !== undefined) {
      room.video = req.body.video;
    }

    writeDatabase(db);

    res.json({
      message: "Room updated successfully",
      room: room
    });
  });

  // DELETE ROOM - admin only
  app.delete("/rooms/:id", function (req, res) {
    const db = readDatabase();

    const roomId = Number(req.params.id);
    const loggedUserId = Number(req.body.loggedUserId);

    const loggedUser = db.users.find(function (user) {
      return user.id === loggedUserId;
    });

    if (!loggedUser || loggedUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete rooms"
      });
    }

    const roomToDelete = db.rooms.find(function (room) {
      return room.id === roomId;
    });

    if (!roomToDelete) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    // --- PHYSICAL FILE DELETION ---
    try {
        // Delete Images
        if (roomToDelete.images && Array.isArray(roomToDelete.images)) {
            roomToDelete.images.forEach(function(imagePath) {
                // imagePath is like "uploads/rooms/file.webp"
                // __dirname is "server/controllers"
                // we need to go up to "server/"
                const fullPath = path.resolve(__dirname, "..", imagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }

        // Delete Video
        if (roomToDelete.video) {
            const videoFullPath = path.resolve(__dirname, "..", roomToDelete.video);
            if (fs.existsSync(videoFullPath)) {
                fs.unlinkSync(videoFullPath);
            }
        }
    } catch (err) {
        console.error("Media deletion partially failed, but proceeding with room removal:", err);
    }
    // ------------------------------

    db.rooms = db.rooms.filter(function (room) {
      return room.id !== roomId;
    });

    writeDatabase(db);

    res.json({
      message: "Room and associated media deleted successfully"
    });
  });

  // UPLOAD VIDEO TO ROOM - admin only
  app.post("/rooms/:id/video", uploadRoomVideo.single("video"), function (req, res) {
    const db = readDatabase();

    const roomId = Number(req.params.id);
    const loggedUserId = Number(req.body.loggedUserId);

    const loggedUser = db.users.find(function (user) {
      return user.id === loggedUserId;
    });

    if (!loggedUser || loggedUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can add room videos"
      });
    }

    const room = db.rooms.find(function (room) {
      return room.id === roomId;
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No video selected"
      });
    }

    const videoPath = "uploads/videos/" + req.file.filename;

    room.video = videoPath;

    writeDatabase(db);

    res.json({
      message: "Room video uploaded successfully",
      video: videoPath,
      room: room
    });
  });

 // ADD IMAGE TO ROOM - admin only
app.post("/rooms/:id/images", uploadRoomImage.single("image"), function (req, res) {
  const db = readDatabase();

  const roomId = Number(req.params.id);
  const loggedUserId = Number(req.body.loggedUserId);

  const loggedUser = db.users.find(function (user) {
    return user.id === loggedUserId;
  });

  if (!loggedUser || loggedUser.role !== "admin") {
    return res.status(403).json({
      message: "Only admin can add room images"
    });
  }

  const room = db.rooms.find(function (room) {
    return room.id === roomId;
  });

  if (!room) {
    return res.status(404).json({
      message: "Room not found"
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: "No image selected"
    });
  }

 //limit 5 images
 if (!room.images) {
  room.images = [];
}

if (room.images.length >= 5) {
  return res.status(400).json({
    message: "A room can have maximum 5 images"
  });
}

const imagePath = "uploads/rooms/" + req.file.filename;

room.images.push(imagePath);


  writeDatabase(db);

  res.json({
    message: "Room image uploaded successfully",
    image: imagePath,
    room: room
  });
});
}

module.exports = roomController;