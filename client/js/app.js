var app = new Vue({
  el: "#app",

  data: {
    signupUsername: "",
    signupPassword: "",

    loginUsername: "",
    loginPassword: "",

    updateUserId: "",
    updateUsername: "",
    updatePassword: "",

    balanceUserId: "",
    newBalance: "",

    deleteUserId: "",

    profileEmail: "",

    output: "",

    balanceRequestAmount: "",
    balanceRequestId: "",

    rooms: [],

    roomName: "",
    roomNumber: "",
    numberOfRooms: "",
    capacity: "",
    price: "",
    description: "",

    updateRoomId: "",
    updateRoomName: "",
    updateRoomPrice: "",
    updateRoomStatus: "",

    deleteRoomId: "",

    imageRoomId: "",

    reservationRoomId: "",
    reservationCheckIn: "",
    reservationCheckOut: "",

    cancelReservationId: "",
    useRealCurrentDate: true,
    customCancelDate: "",

    selectedRoomImage: null,
    selectedProfilePhoto: null
  },

  created: function () {
    this.registerClient();
  },

  methods: {
    show: function (data) {
      this.output = JSON.stringify(data, null, 2);
    },

    getLoggedUser: function () {
      return JSON.parse(localStorage.getItem("loggedUser"));
    },

    ...clientMethods,
    ...userMethods,
    ...roomMethods,
    ...reservationMethods,
    ...balanceRequestMethods
  }
});