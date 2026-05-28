const roomMethods = {
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
    this.selectedRoomImage = event.target.files[0];

    if (this.selectedRoomImage) {
      this.show({
        message: "Room image selected",
        fileName: this.selectedRoomImage.name
      });
    }
  },

  uploadRoomImage: function () {
    const loggedUser = this.getLoggedUser();

    if (!loggedUser) {
      this.show({ message: "You must login first" });
      return;
    }

    if (!this.selectedRoomImage) {
      this.show({ message: "Please select a room image first" });
      return;
    }

    const formData = new FormData();
    formData.append("loggedUserId", loggedUser.id);
    formData.append("image", this.selectedRoomImage);

    axios.post(API_URL + "/rooms/" + this.imageRoomId + "/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
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
  }
};