function createUser(id, username, password) {
  return {
    id: id,
    username: username,
    password: password,
    email: "",
    profilePhoto: "",
    role: "guest",
    balance: 0
  };
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profilePhoto: user.profilePhoto,
    role: user.role,
    balance: user.balance
  };
}

module.exports = {
  createUser,
  publicUser
};