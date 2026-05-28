const userMethods = {
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

  updateProfile: function () {
    const loggedUser = this.getLoggedUser();

    if (!loggedUser) {
      this.show({ message: "You must login first" });
      return;
    }

    axios.put(API_URL + "/users/" + loggedUser.id, {
      email: this.profileEmail
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

  selectProfilePhoto: function (event) {
    this.selectedProfilePhoto = event.target.files[0];

    if (this.selectedProfilePhoto) {
      this.show({
        message: "Profile photo selected",
        fileName: this.selectedProfilePhoto.name
      });
    }
  },

  uploadProfilePhoto: function () {
    const loggedUser = this.getLoggedUser();

    if (!loggedUser) {
      this.show({ message: "You must login first" });
      return;
    }

    if (!this.selectedProfilePhoto) {
      this.show({ message: "Please select a profile photo first" });
      return;
    }

    const formData = new FormData();
    formData.append("loggedUserId", loggedUser.id);
    formData.append("image", this.selectedProfilePhoto);

    axios.post(API_URL + "/users/" + loggedUser.id + "/profile-photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
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
  }
};