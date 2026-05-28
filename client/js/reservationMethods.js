const reservationMethods = {
  loadReservations: function () {
    axios.get(API_URL + "/reservations")
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

  loadReservationDetails: function () {
    axios.get(API_URL + "/reservations/details")
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

  createReservation: function () {
    const loggedUser = this.getLoggedUser();

    if (!loggedUser) {
      this.show({ message: "You must login first" });
      return;
    }

    axios.post(API_URL + "/reservations", {
      loggedUserId: loggedUser.id,
      roomId: Number(this.reservationRoomId),
      checkIn: this.reservationCheckIn,
      checkOut: this.reservationCheckOut
    })
      .then(response => {
        const data = response.data;

        if (data.remainingBalance !== undefined) {
          loggedUser.balance = data.remainingBalance;
          localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
        }

        this.show(data);
      })
      .catch(error => {
        if (error.response) {
          this.show(error.response.data);
        } else {
          this.show({ error: "Could not connect to server" });
        }
      });
  },

  cancelReservation: function () {
    const loggedUser = this.getLoggedUser();

    if (!loggedUser) {
      this.show({ message: "You must login first" });
      return;
    }

    axios.put(API_URL + "/reservations/" + this.cancelReservationId + "/cancel", {
      loggedUserId: loggedUser.id
    })
      .then(response => {
        const data = response.data;

        if (data.userBalance !== null && data.userBalance !== undefined) {
          loggedUser.balance = data.userBalance;
          localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
        }

        this.show(data);
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