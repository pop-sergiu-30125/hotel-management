function createRoom(id, name, roomNumber, numberOfRooms, capacity, price, description, images, video) {
  return {
    id: id,
    name: name,
    roomNumber: roomNumber,
    numberOfRooms: Number(numberOfRooms),
    capacity: Number(capacity),
    price: Number(price),
    description: description,
    status: "available",
    images: images || [],
    video: video || ""
  };
}

module.exports = {
  createRoom
};