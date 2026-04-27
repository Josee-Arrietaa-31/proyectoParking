export const demoUsers = [
  { role: "Conductor", email: "conductor@demo.com", password: "1234" },
  { role: "Operador", email: "operador@demo.com", password: "1234" },
  { role: "Municipalidad", email: "municipalidad@demo.com", password: "1234" }
];

export const emptyParkingForm = {
  name: "",
  type: "privado",
  latitude: "10.3234",
  longitude: "-84.4271",
  capacity: "20",
  availableSpots: "10",
  ratePerHour: "800"
};

export const emptyLoginForm = {
  email: "",
  password: ""
};

export const emptyRegisterForm = {
  name: "",
  email: "",
  password: "",
  role: "conductor"
};
