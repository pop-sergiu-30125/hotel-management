function createReservation(id, userId, roomId, checkIn, checkOut, totalPrice) {
  return {
    id: id,
    userId: Number(userId),
    roomId: Number(roomId),
    checkIn: checkIn,
    checkOut: checkOut,
    totalPrice: Number(totalPrice),
    status: "confirmed"
  };
}

module.exports = {
  createReservation
};