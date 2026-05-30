const { createBalanceRequest } = require("../models/balanceRequestModel");

function balanceRequestController(app, readDatabase, writeDatabase, getNextId) {
  // CREATE BALANCE REQUEST
  app.post("/balance-requests", function (req, res) {
    const db = readDatabase();

    const loggedUserId = Number(req.body.loggedUserId);
    const amount = Number(req.body.amount);

    const loggedUser = db.users.find(function (user) {
      return user.id === loggedUserId;
    });

    if (!loggedUser) {
      return res.status(401).json({
        message: "You must be logged in"
      });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Amount must be a positive number"
      });
    }

    const newRequest = createBalanceRequest(
      getNextId(db.balanceRequests),
      loggedUser.id,
      amount
    );

    db.balanceRequests.push(newRequest);
    writeDatabase(db);

    res.status(201).json({
      message: "Balance request created successfully",
      request: newRequest
    });
  });

  // GET ALL BALANCE REQUESTS - admin only
  app.get("/balance-requests", function (req, res) {
    const db = readDatabase();

    const loggedUserId = Number(req.query.loggedUserId);

    const loggedUser = db.users.find(function (user) {
      return user.id === loggedUserId;
    });

    if (!loggedUser || loggedUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can view balance requests"
      });
    }

    const result = db.balanceRequests.map(function (request) {
      const user = db.users.find(function (user) {
        return user.id === request.userId;
      });

      return {
        id: request.id,
        userId: request.userId,
        username: user ? user.username : "Unknown user",
        amount: request.amount,
        status: request.status,
        createdAt: request.createdAt
      };
    });

    res.json(result);
  });

  // APPROVE BALANCE REQUEST - admin only
  app.put("/balance-requests/:id/approve", function (req, res) {
    const db = readDatabase();

    const requestId = Number(req.params.id);
    const loggedUserId = Number(req.body.loggedUserId);

    const loggedUser = db.users.find(function (user) {
      return user.id === loggedUserId;
    });

    if (!loggedUser || loggedUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can approve balance requests"
      });
    }

    const request = db.balanceRequests.find(function (request) {
      return request.id === requestId;
    });

    if (!request) {
      return res.status(404).json({
        message: "Balance request not found"
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "This request was already processed"
      });
    }

    const user = db.users.find(function (user) {
      return user.id === request.userId;
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.balance = user.balance + request.amount;
    request.status = "approved";

    writeDatabase(db);

    res.json({
      message: "Balance request approved",
      request: request,
      user: {
        id: user.id,
        username: user.username,
        balance: user.balance
      }
    });
  });

  // REJECT BALANCE REQUEST - admin only
  app.put("/balance-requests/:id/reject", function (req, res) {
    const db = readDatabase();

    const requestId = Number(req.params.id);
    const loggedUserId = Number(req.body.loggedUserId);

    const loggedUser = db.users.find(function (user) {
      return user.id === loggedUserId;
    });

    if (!loggedUser || loggedUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can reject balance requests"
      });
    }

    const request = db.balanceRequests.find(function (request) {
      return request.id === requestId;
    });

    if (!request) {
      return res.status(404).json({
        message: "Balance request not found"
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "This request was already processed"
      });
    }

    request.status = "rejected";

    writeDatabase(db);

    res.json({
      message: "Balance request rejected",
      request: request
    });
  });
}

module.exports = balanceRequestController;