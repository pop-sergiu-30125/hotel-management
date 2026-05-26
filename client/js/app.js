const API_URL = "http://localhost:3000";

let clientId = localStorage.getItem("clientId");

if (!clientId) {
  clientId = Date.now().toString();
  localStorage.setItem("clientId", clientId);
}

fetch(API_URL + "/clients/connect", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    clientId: clientId
  })
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log("Client registered:", data);
  });

console.log("app.js loaded");

function show(data) {
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

function signup() {
  console.log("signup clicked");

  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;

  fetch(API_URL + "/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      show(data);
    })
    .catch(function (error) {
      console.log(error);
      show({ error: "Could not connect to server" });
    });
}

function updateBalance() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const id = Number(document.getElementById("balanceUserId").value);
  const balance = Number(document.getElementById("newBalance").value);

  if (!loggedUser) {
    show({ message: "You must login first" });
    return;
  }

  fetch(API_URL + "/users/" + id + "/balance", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      loggedUserId: loggedUser.id,
      balance: balance
    })
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.user && data.user.id === loggedUser.id) {
        localStorage.setItem("loggedUser", JSON.stringify(data.user));
      }

      show(data);
    })
    .catch(function (error) {
      console.log(error);
      show({ error: "Could not connect to server" });
    });
}

function login() {
  console.log("login clicked");

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  fetch(API_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.user) {
        localStorage.setItem("loggedUser", JSON.stringify(data.user));
      }

      show(data);
    })
    .catch(function (error) {
      console.log(error);
      show({ error: "Could not connect to server" });
    });
}

function loadUsers() {
  console.log("load users clicked");

  fetch(API_URL + "/users")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      show(data);
    })
    .catch(function (error) {
      console.log(error);
      show({ error: "Could not connect to server" });
    });
}

function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  fetch(API_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.user) {
        localStorage.setItem("loggedUser", JSON.stringify(data.user));
      }

      show(data);
    })
    .catch(function (error) {
      console.log(error);
      show({ error: "Could not connect to server" });
    });
}

function logout() {
  localStorage.removeItem("loggedUser");
  show({ message: "Logged out" });
}

function deleteUser() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const id = Number(document.getElementById("deleteUserId").value);

  if (!loggedUser) {
    show({ message: "You must login first" });
    return;
  }

  fetch(API_URL + "/users/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      loggedUserId: loggedUser.id
    })
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      show(data);
    })
    .catch(function (error) {
      console.log(error);
      show({ error: "Could not connect to server" });
    });
}

//check on what account am i logged in
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
    user: {
      id: loggedUser.id,
      username: loggedUser.username,
      role: loggedUser.role,
      balance: loggedUser.balance
    }
  });
}