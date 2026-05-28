function createRoom(id, name, roomNumber, numberOfRooms, capacity, price, description, images) {
  return {
    id: id,
    name: name,
    roomNumber: roomNumber,
    numberOfRooms: Number(numberOfRooms),
    capacity: Number(capacity),
    price: Number(price),
    description: description,
    status: "available",
    images: images || []
  };
}

module.exports = {
  createRoom
};