function clientController(app, connectedClients) {
  // CLIENT CONNECT
  app.post("/clients/connect", function (req, res) {
    const clientId = req.body.clientId;

    if (!clientId) {
      return res.status(400).json({
        message: "clientId is required"
      });
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

  // GET CLIENTS
  app.get("/clients", function (req, res) {
    res.json({
      connectedClients: connectedClients.length,
      clients: connectedClients
    });
  });
}

module.exports = clientController;