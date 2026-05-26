const API_URL = "http://localhost:3000";

console.log("app.js loaded");

// CLIENT VISUALIZATION
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

function show(data) {
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

// SIGN UP
function signup() {
  console.log("signup clicked");

  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;

  axios.post(API_URL + "/signup", {
    username: username,
    password: password
  })
    .then(function (response) {
      show(response.data);
    })
    .catch(function (error) {
      if (error.response) {
        show(error.response.data);
      } else {
        show({ error: "Could not connect to server" });
      }
    });
}

// LOGIN
function login() {
  console.log("login clicked");

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  axios.post(API_URL + "/login", {
    username: username,
    password: password
  })
    .then(function (response) {
      const data = response.data;

      if (data.user) {
        localStorage.setItem("loggedUser", JSON.stringify(data.user));
      }

      show(data);
    })
    .catch(function (error) {
      if (error.response) {
        show(error.response.data);
      } else {
        show({ error: "Could not connect to server" });
      }
    });
}

// LOGOUT
function logout() {
  localStorage.removeItem("loggedUser");

  show({
    message: "Logged out"
  });
}

// CHECK LOGIN STATUS
function checkLoginStatus() {
  console.log("checkLoginStatus clicked");

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  if (!loggedUser) {
    show({
      loggedIn: false,
      message: "You are not logged in"
    });
    return;
  }

  show({
    loggedIn: true,
    message: "You are logged in",
    user: loggedUser
  });
}

// LOAD USERS
function loadUsers() {
  console.log("load users clicked");

  axios.get(API_URL + "/users")
    .then(function (response) {
      show(response.data);
    })
    .catch(function (error) {
      if (error.response) {
        show(error.response.data);
      } else {
        show({ error: "Could not connect to server" });
      }
    });
}

// UPDATE USERNAME / PASSWORD
function updateUser() {
  const id = Number(document.getElementById("updateUserId").value);
  const username = document.getElementById("updateUsername").value;
  const password = document.getElementById("updatePassword").value;

  axios.put(API_URL + "/users/" + id, {
    username: username,
    password: password
  })
    .then(function (response) {
      show(response.data);
    })
    .catch(function (error) {
      if (error.response) {
        show(error.response.data);
      } else {
        show({ error: "Could not connect to server" });
      }
    });
}

// UPDATE BALANCE
function updateBalance() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const id = Number(document.getElementById("balanceUserId").value);
  const balance = Number(document.getElementById("newBalance").value);

  if (!loggedUser) {
    show({ message: "You must login first" });
    return;
  }

  axios.put(API_URL + "/users/" + id + "/balance", {
    loggedUserId: loggedUser.id,
    balance: balance
  })
    .then(function (response) {
      const data = response.data;

      if (data.user && data.user.id === loggedUser.id) {
        localStorage.setItem("loggedUser", JSON.stringify(data.user));
      }

      show(data);
    })
    .catch(function (error) {
      if (error.response) {
        show(error.response.data);
      } else {
        show({ error: "Could not connect to server" });
      }
    });
}

// DELETE USER
function deleteUser() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const id = Number(document.getElementById("deleteUserId").value);

  if (!loggedUser) {
    show({ message: "You must login first" });
    return;
  }

  axios.delete(API_URL + "/users/" + id, {
    data: {
      loggedUserId: loggedUser.id
    }
  })
    .then(function (response) {
      show(response.data);
    })
    .catch(function (error) {
      if (error.response) {
        show(error.response.data);
      } else {
        show({ error: "Could not connect to server" });
      }
    });
}