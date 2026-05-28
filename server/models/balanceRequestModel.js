function createBalanceRequest(id, userId, amount) {
  return {
    id: id,
    userId: Number(userId),
    amount: Number(amount),
    status: "pending",
    createdAt: new Date().toLocaleString()
  };
}

module.exports = {
  createBalanceRequest
};