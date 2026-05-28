const API_URL = "http://localhost:3000";

var app = new Vue({
  el: "#app",

  data: {
    signupUsername: "",
    signupPassword: "",

    loginUsername: "",
    loginPassword: "",

    updateUserId: "",
    updateUsername: "",
    updatePassword: "",

    balanceUserId: "",
    newBalance: "",

    deleteUserId: "",

    output: "",

    //rooms
    rooms: [],

    roomName: "",
    roomNumber: "",
    numberOfRooms: "",
    capacity: "",
    price: "",
    description: "",

    updateRoomId: "",
    updateRoomName: "",
    updateRoomPrice: "",
    updateRoomStatus: "",

    deleteRoomId: "",

    imageRoomId: "",
    roomImage: "",

    //reservation
    reservationRoomId: "",
    reservationCheckIn: "",
    reservationCheckOut: "",

    cancelReservationId: ""
  },

  created: function () {
    this.registerClient();
  },

  methods: {
    show: function (data) {
      this.output = JSON.stringify(data, null, 2);
    },

    getLoggedUser: function () {
      return JSON.parse(localStorage.getItem("loggedUser"));
    },

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
    },

    signup: function () {
      axios.post(API_URL + "/signup", {
        username: this.signupUsername,
        password: this.signupPassword
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

    login: function () {
      axios.post(API_URL + "/login", {
        username: this.loginUsername,
        password: this.loginPassword
      })
        .then(response => {
          const data = response.data;

          if (data.user) {
            localStorage.setItem("loggedUser", JSON.stringify(data.user));
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

    logout: function () {
      localStorage.removeItem("loggedUser");

      this.show({
        message: "Logged out"
      });
    },

    checkLoginStatus: function () {
      const loggedUser = this.getLoggedUser();

      if (!loggedUser) {
        this.show({
          loggedIn: false,
          message: "You are not logged in"
        });
        return;
      }

      this.show({
        loggedIn: true,
        message: "You are logged in",
        user: loggedUser
      });
    },

    loadUsers: function () {
      axios.get(API_URL + "/users")
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

    updateUser: function () {
      axios.put(API_URL + "/users/" + this.updateUserId, {
        username: this.updateUsername,
        password: this.updatePassword
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

    updateBalance: function () {
      const loggedUser = this.getLoggedUser();

      if (!loggedUser) {
        this.show({ message: "You must login first" });
        return;
      }

      axios.put(API_URL + "/users/" + this.balanceUserId + "/balance", {
        loggedUserId: loggedUser.id,
        balance: Number(this.newBalance)
      })
        .then(response => {
          const data = response.data;

          if (data.user && data.user.id === loggedUser.id) {
            localStorage.setItem("loggedUser", JSON.stringify(data.user));
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

    deleteUser: function () {
      const loggedUser = this.getLoggedUser();

      if (!loggedUser) {
        this.show({ message: "You must login first" });
        return;
      }

      axios.delete(API_URL + "/users/" + this.deleteUserId, {
        data: {
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

    //for roomController
    loadRooms: function () {
  axios.get(API_URL + "/rooms")
    .then(response => {
      this.rooms = response.data;
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

addRoom: function () {
  const loggedUser = this.getLoggedUser();

  if (!loggedUser) {
    this.show({ message: "You must login first" });
    return;
  }

  axios.post(API_URL + "/rooms", {
    loggedUserId: loggedUser.id,
    name: this.roomName,
    roomNumber: this.roomNumber,
    numberOfRooms: Number(this.numberOfRooms),
    capacity: Number(this.capacity),
    price: Number(this.price),
    description: this.description,
    status: "available",
    images: []
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

updateRoom: function () {
  const loggedUser = this.getLoggedUser();

  if (!loggedUser) {
    this.show({ message: "You must login first" });
    return;
  }

  axios.put(API_URL + "/rooms/" + this.updateRoomId, {
    loggedUserId: loggedUser.id,
    name: this.updateRoomName,
    price: Number(this.updateRoomPrice),
    status: this.updateRoomStatus
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

deleteRoom: function () {
  const loggedUser = this.getLoggedUser();

  if (!loggedUser) {
    this.show({ message: "You must login first" });
    return;
  }

  axios.delete(API_URL + "/rooms/" + this.deleteRoomId, {
    data: {
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

selectRoomImage: function (event) {
  const file = event.target.files[0];

  if (!file) {
    this.show({ message: "No image selected" });
    return;
  }

  this.roomImage = "images/" + file.name;

  this.show({
    message: "Image selected",
    imagePath: this.roomImage
  });
},

addRoomImage: function () {
  const loggedUser = this.getLoggedUser();

  if (!loggedUser) {
    this.show({ message: "You must login first" });
    return;
  }

  axios.post(API_URL + "/rooms/" + this.imageRoomId + "/images", {
    loggedUserId: loggedUser.id,
    image: this.roomImage
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

  //reservation Methods

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
  }
});