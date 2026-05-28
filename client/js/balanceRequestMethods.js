const balanceRequestMethods = {
  createBalanceRequest: function () {
    const loggedUser = this.getLoggedUser();

    if (!loggedUser) {
      this.show({ message: "You must login first" });
      return;
    }

    axios.post(API_URL + "/balance-requests", {
      loggedUserId: loggedUser.id,
      amount: Number(this.balanceRequestAmount)
    })
      .then(response => {
        this.show(response.data);
      })
      .catch(error => {
        if (error.response) {
          this.show(error.response.data);
        } else {
          this.show({ error: "Could not connect to server" });
        }
      });
  },

  loadBalanceRequests: function () {
    const loggedUser = this.getLoggedUser();

    if (!loggedUser) {
      this.show({ message: "You must login first" });
      return;
    }

    axios.get(API_URL + "/balance-requests", {
      params: {
        loggedUserId: loggedUser.id
      }
    })
      .then(response => {
        this.show(response.data);
      })
      .catch(error => {
        if (error.response) {
          this.show(error.response.data);
        } else {
          this.show({ error: "Could not connect to server" });
        }
      });
  },

  approveBalanceRequest: function () {
    const loggedUser = this.getLoggedUser();

    if (!loggedUser) {
      this.show({ message: "You must login first" });
      return;
    }

    axios.put(API_URL + "/balance-requests/" + this.balanceRequestId + "/approve", {
      loggedUserId: loggedUser.id
    })
      .then(response => {
        this.show(response.data);
      })
      .catch(error => {
        if (error.response) {
          this.show(error.response.data);
        } else {
          this.show({ error: "Could not connect to server" });
        }
      });
  },

  rejectBalanceRequest: function () {
    const loggedUser = this.getLoggedUser();

    if (!loggedUser) {
      this.show({ message: "You must login first" });
      return;
    }

    axios.put(API_URL + "/balance-requests/" + this.balanceRequestId + "/reject", {
      loggedUserId: loggedUser.id
    })
      .then(response => {
        this.show(response.data);
      })
      .catch(error => {
        if (error.response) {
          this.show(error.response.data);
        } else {
          this.show({ error: "Could not connect to server" });
        }
      });
  }
};