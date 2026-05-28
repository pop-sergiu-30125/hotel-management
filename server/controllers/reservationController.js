const { createReservation } = require("../models/reservationModel");

function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  const difference = end - start;
  const nights = difference / (1000 * 60 * 60 * 24);

  return nights;
}

function reservationController(app, readDatabase, writeDatabase, getNextId) {
  // GET ALL RESERVATIONS
  app.get("/reservations", function (req, res) {
    const db = readDatabase();
    res.json(db.reservations);
  });

  // GET RESERVATIONS WITH DETAILS
  app.get("/reservations/details", function (req, res) {
    const db = readDatabase();

    const result = db.reservations.map(function (reservation) {
      const user = db.users.find(function (user) {
        return user.id === reservation.userId;
      });

      const room = db.rooms.find(function (room) {
        return room.id === reservation.roomId;
      });

      return {
        id: reservation.id,
        username: user ? user.username : "Unknown user",
        roomName: room ? room.name : "Unknown room",
        roomNumber: room ? room.roomNumber : "Unknown room number",
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        totalPrice: reservation.totalPrice,
        status: reservation.status
      };
    });

    res.json(result);
  });

  // CREATE RESERVATION
  app.post("/reservations", function (req, res) {
    const db = readDatabase();

    const loggedUserId = Number(req.body.loggedUserId);
    const roomId = Number(req.body.roomId);
    const checkIn = req.body.checkIn;
    const checkOut = req.body.checkOut;

    const user = db.users.find(function (user) {
      return user.id === loggedUserId;
    });

    if (!user) {
      return res.status(401).json({
        message: "You must be logged in"
      });
    }

    if (user.role !== "guest") {
      return res.status(403).json({
        message: "Only guests can make reservations"
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

    if (room.status !== "available") {
      return res.status(400).json({
        message: "Room is not available"
      });
    }

    if (!checkIn || !checkOut) {
  return res.status(400).json({
    message: "Check-in and check-out dates are required"
  });
    }

    const overlappingReservation = db.reservations.find(function (reservation) {
    return reservation.roomId === roomId &&
        reservation.status === "confirmed" &&
        reservation.checkIn < checkOut &&
        reservation.checkOut > checkIn;
    });

    if (overlappingReservation) {
        return res.status(400).json({
        message: "Room is already reserved for this period"
    });
    }

    const nights = calculateNights(checkIn, checkOut);

    if (nights <= 0) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date"
      });
    }

    const totalPrice = room.price * nights;

    if (user.balance < totalPrice) {
      return res.status(400).json({
        message: "Not enough balance",
        required: totalPrice,
        currentBalance: user.balance
      });
    }

    user.balance = user.balance - totalPrice;
    //room.status = "reserved";

    const newReservation = createReservation(
      getNextId(db.reservations),
      user.id,
      room.id,
      checkIn,
      checkOut,
      totalPrice
    );

    db.reservations.push(newReservation);
    writeDatabase(db);

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: newReservation,
      remainingBalance: user.balance
    });
  });

  // CANCEL RESERVATION
  app.put("/reservations/:id/cancel", function (req, res) {
    const db = readDatabase();

    const reservationId = Number(req.params.id);
    const loggedUserId = Number(req.body.loggedUserId);

    const loggedUser = db.users.find(function (user) {
      return user.id === loggedUserId;
    });

    if (!loggedUser) {
      return res.status(401).json({
        message: "You must be logged in"
      });
    }

    const reservation = db.reservations.find(function (reservation) {
      return reservation.id === reservationId;
    });

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found"
      });
    }

    if (reservation.status === "cancelled") {
      return res.status(400).json({
        message: "Reservation is already cancelled"
      });
    }

    if (loggedUser.role !== "admin" && loggedUser.id !== reservation.userId) {
      return res.status(403).json({
        message: "You can cancel only your own reservation"
      });
    }

    const user = db.users.find(function (user) {
      return user.id === reservation.userId;
    });

    const room = db.rooms.find(function (room) {
      return room.id === reservation.roomId;
    });

    const now = new Date();
    const refundLimit = new Date(reservation.checkIn + "T20:00:00");

    let refunded = false;

    if (now < refundLimit && user) {
      user.balance = user.balance + reservation.totalPrice;
      refunded = true;
    }

    reservation.status = "cancelled";

    //if (room) {
    //  room.status = "available";
    //}

    writeDatabase(db);

    res.json({
      message: refunded
        ? "Reservation cancelled and refunded"
        : "Reservation cancelled without refund",
      refunded: refunded,
      reservation: reservation,
      userBalance: user ? user.balance : null
    });
  });
}

module.exports = reservationController;