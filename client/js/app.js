const API_URL = "http://localhost:3000";

console.log("app.js loaded");

function show(data) {
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

function signup() {
  console.log("signup clicked");

  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;
  const balance = document.getElementById("signupBalance").value;

  fetch(API_URL + "/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password,
      role: "guest",
      balance: Number(balance)
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