const { createRoom } = require("../models/roomModel");

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
      req.body.images
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

    const roomExists = db.rooms.find(function (room) {
      return room.id === roomId;
    });

    if (!roomExists) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    db.rooms = db.rooms.filter(function (room) {
      return room.id !== roomId;
    });

    writeDatabase(db);

    res.json({
      message: "Room deleted successfully"
    });
  });

  // ADD IMAGE TO ROOM - admin only
  app.post("/rooms/:id/images", function (req, res) {
    const db = readDatabase();

    const roomId = Number(req.params.id);
    const loggedUserId = Number(req.body.loggedUserId);
    const image = req.body.image;

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

    if (!image) {
      return res.status(400).json({
        message: "Image path is required"
      });
    }

    if (!room.images) {
      room.images = [];
    }

    room.images.push(image);

    writeDatabase(db);

    res.json({
      message: "Image added successfully",
      room: room
    });
  });
}

module.exports = roomController;