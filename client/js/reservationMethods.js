const reservationMethods = {
  loadMyReservations: function () {
    const loggedUser = this.getLoggedUser();
    if (!loggedUser) return;

    axios.get(API_URL + "/users/" + loggedUser.id + "/reservations")
      .then(response => {
        this.myReservations = response.data;
      })
      .catch(error => {
        console.error("Failed to load user reservations", error);
      });
  },

  loadReservations: function () {
    axios.get(API_URL + "/reservations")
      .then(response => {
        this.reservationsList = response.data;
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

        // Keep all selections (room ID and dates) in the form and session memory
        // so the user can easily make another identical reservation if needed.

        this.show(data);
        this.loadMyReservations();
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
      this.show({message: "You must login first"});
      return;
    }

    const requestBody = {
      loggedUserId: loggedUser.id
    };

    if (!this.useRealCurrentDate) {
      requestBody.currentDate = this.customCancelDate;
    }

    axios.put(API_URL + "/reservations/" + this.cancelReservationId + "/cancel", requestBody)
        .then(response => {
          const data = response.data;

          if (data.userBalance !== null && data.userBalance !== undefined) {
            loggedUser.balance = data.userBalance;
            localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
          }

          this.show(data);
          this.loadReservations();
          this.loadMyReservations();
        })
        .catch(error => {
          if (error.response) {
            this.show(error.response.data);
          } else {
            this.show({error: "Could not connect to server"});
          }
        });
  }

};