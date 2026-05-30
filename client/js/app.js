var app = new Vue({
  el: "#app",

  data: {

    API_URL: API_URL,

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
    updateRoomNumber: "",
    updateNumberOfRooms: "",
    updateCapacity: "",
    updateDescription: "",

    deleteRoomId: "",

    imageRoomId: "",
    videoRoomId: "",

    reservationRoomId: "",
    reservationCheckIn: "",
    reservationCheckOut: "",

    cancelReservationId: "",
    useRealCurrentDate: true,
    customCancelDate: "",

    selectedRoomImage: null,
    selectedRoomVideo: null,
    selectedProfilePhoto: null,


     loggedUser: null,

    selectedRoom: null,

    statusMessage: "",
    statusType: "",

    adminTab: "dashboard",

    rooms: [],
    usersList: [],
    reservationsList: [],
    },

  created: function () {
    this.registerClient();
    this.reservationRoomId = sessionStorage.getItem("reservationRoomId") || ""; //for second requirement for client app
    this.reservationCheckIn = sessionStorage.getItem("reservationCheckIn") || "";
    this.reservationCheckOut = sessionStorage.getItem("reservationCheckOut") || "";
    this.loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    this.syncUser();

    this.loadRooms();
    this.loadUsers();
    this.loadReservations();

  },

  watch: {
    reservationRoomId(newVal) {
      sessionStorage.setItem("reservationRoomId", newVal);
    },
    reservationCheckIn(newVal) {
      sessionStorage.setItem("reservationCheckIn", newVal);
    },
    reservationCheckOut(newVal) {
      sessionStorage.setItem("reservationCheckOut", newVal);
    }
  },

  methods: {
    getTotalRevenue: function() {
        if (!this.reservationsList || !Array.isArray(this.reservationsList)) return 0;
        return this.reservationsList
            .filter(res => res.status === "confirmed")
            .reduce((sum, res) => sum + (Number(res.totalPrice) || 0), 0);
    },
    show: function(data) {

      if (data.message) {

        this.statusMessage = data.message;

        if (
            data.message.toLowerCase().includes("error") ||
            data.message.toLowerCase().includes("not enough") ||
            data.message.toLowerCase().includes("cancelled")
        ) {

          this.statusType = "danger";

        } else {

          this.statusType = "success";
        }
      }

      this.output = data;
    },

    getLoggedUser: function () {
      return JSON.parse(localStorage.getItem("loggedUser"));
    },

    saveSelections: function () {

      sessionStorage.setItem(
          "reservationRoomId",
          this.reservationRoomId
      );

      sessionStorage.setItem(
          "reservationCheckIn",
          this.reservationCheckIn
      );

      sessionStorage.setItem(
          "reservationCheckOut",
          this.reservationCheckOut
      );

      window.location.href = "reservations.html";
    },

    ...clientMethods,
    ...userMethods,
    ...roomMethods,
    ...reservationMethods,
    ...balanceRequestMethods
  }
});