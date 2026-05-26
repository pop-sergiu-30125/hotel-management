function createUser(id, username, password, role, balance) {
  return {
    id: id,
    username: username,
    password: password,
    role: role || "guest",
    balance: Number(balance) || 0
  };
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    balance: user.balance
  };
}

module.exports = {
  createUser,
  publicUser
};