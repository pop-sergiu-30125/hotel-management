const clientMethods = {
  registerClient: function () {
    let clientId = localStorage.getItem("clientId");

    if (!clientId) {
      clientId = Date.now().toString();
      localStorage.setItem("clientId", clientId);
    }

    axios.post(API_URL + "/clients/connect", {
      clientId: clientId
    })
      .then(function (response) {
        console.log("Client registered:", response.data);
      })
      .catch(function (error) {
        console.log("Could not register client:", error);
      });
  }
};