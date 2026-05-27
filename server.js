const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const dataPath = path.join(__dirname, "data", "data.json");
const distDir = path.join(__dirname, "dist");
const publicDir = fs.existsSync(distDir) ? distDir : path.join(__dirname, "public");

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const typeMap = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8"
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      sendJson(res, 404, { error: "Archivo no encontrado" });
      return;
    }

    res.writeHead(200, { "Content-Type": typeMap[ext] || "text/plain; charset=utf-8" });
    res.end(content);
  });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function nextId(items) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, { ok: true });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/bootstrap") {
    const data = readData();
    sendJson(res, 200, {
      users: data.users.map(sanitizeUser),
      parkings: data.parkings,
      payments: data.payments,
      ratings: data.ratings || [],
      reservations: data.reservations || [],
      vehicles: data.vehicles || [],
      subscriptions: data.subscriptions || [],
      user_subscriptions: data.user_subscriptions || [],
      support_tickets: data.support_tickets || [],
      infractions: data.infractions || [],
      summary: buildMunicipalSummary(data)
    });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/register") {
    const body = await parseBody(req);
    const { name, email, password, role } = body;
    const validRoles = ["conductor", "operador", "municipalidad"];

    if (!name || !email || !password || !validRoles.includes(role)) {
      sendJson(res, 400, { error: "Datos incompletos o invalidos" });
      return true;
    }

    const data = readData();
    const existingUser = data.users.find((user) => user.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      sendJson(res, 409, { error: "El correo ya esta registrado" });
      return true;
    }

    const user = {
      id: nextId(data.users),
      name,
      email,
      password,
      role
    };

    data.users.push(user);
    writeData(data);
    sendJson(res, 201, { user: sanitizeUser(user) });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/login") {
    const body = await parseBody(req);
    const { email, password } = body;
    const data = readData();
    const user = data.users.find(
      (item) => item.email.toLowerCase() === String(email || "").toLowerCase() && item.password === password
    );

    if (!user) {
      sendJson(res, 401, { error: "Credenciales invalidas" });
      return true;
    }

    sendJson(res, 200, { user: sanitizeUser(user) });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/parkings") {
    const data = readData();
    sendJson(res, 200, { parkings: data.parkings });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/parkings") {
    const body = await parseBody(req);
    const { name, latitude, longitude, capacity, availableSpots, ratePerHour, operatorId, type } = body;

    if (!name || latitude === undefined || longitude === undefined || !capacity || availableSpots === undefined || !ratePerHour || !operatorId || !type) {
      sendJson(res, 400, { error: "Faltan campos para registrar el parqueo" });
      return true;
    }

    const data = readData();
    const parking = {
      id: nextId(data.parkings),
      name,
      latitude: Number(latitude),
      longitude: Number(longitude),
      capacity: Number(capacity),
      availableSpots: Number(availableSpots),
      ratePerHour: Number(ratePerHour),
      operatorId: Number(operatorId),
      type
    };

    data.parkings.push(parking);
    writeData(data);
    sendJson(res, 201, { parking });
    return true;
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/api/parkings/")) {
    const parkingId = Number(url.pathname.split("/").pop());
    const body = await parseBody(req);
    const data = readData();
    const parking = data.parkings.find((item) => item.id === parkingId);

    if (!parking) {
      sendJson(res, 404, { error: "Parqueo no encontrado" });
      return true;
    }

    if (body.availableSpots !== undefined) {
      parking.availableSpots = Math.max(0, Math.min(parking.capacity, Number(body.availableSpots)));
    }

    writeData(data);
    sendJson(res, 200, { parking });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/payments") {
    const body = await parseBody(req);
    const { parkingId, conductorId, hours } = body;
    const data = readData();
    const parking = data.parkings.find((item) => item.id === Number(parkingId));

    if (!parking || !conductorId || !hours) {
      sendJson(res, 400, { error: "No fue posible registrar el pago" });
      return true;
    }

    const payment = {
      id: nextId(data.payments),
      parkingId: parking.id,
      conductorId: Number(conductorId),
      hours: Number(hours),
      amount: Number(hours) * parking.ratePerHour,
      createdAt: new Date().toISOString()
    };

    if (parking.availableSpots > 0) {
      parking.availableSpots -= 1;
    }

    data.payments.push(payment);
    writeData(data);
    sendJson(res, 201, { payment, summary: buildMunicipalSummary(data) });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/ratings") {
    const body = await parseBody(req);
    const { parkingId, conductorId, rating, comment } = body;
    const data = readData();

    if (!parkingId || !conductorId || !rating || rating < 1 || rating > 5) {
      sendJson(res, 400, { error: "Datos invalidos para la calificación" });
      return true;
    }

    // Verificar si el usuario ya tiene una calificación para este parqueo
    const existingRating = data.ratings.find(
      (r) => r.parkingId === Number(parkingId) && r.conductorId === Number(conductorId)
    );

    if (existingRating) {
      // Actualizar calificación existente
      existingRating.rating = Number(rating);
      existingRating.comment = comment || "";
      existingRating.createdAt = new Date().toISOString();
      writeData(data);
      sendJson(res, 200, { rating: existingRating, message: "Calificación actualizada" });
      return true;
    }

    // Crear nueva calificación
    const newRating = {
      id: nextId(data.ratings),
      parkingId: Number(parkingId),
      conductorId: Number(conductorId),
      rating: Number(rating),
      comment: comment || "",
      createdAt: new Date().toISOString()
    };

    data.ratings.push(newRating);
    writeData(data);
    sendJson(res, 201, { rating: newRating });
    return true;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/parkings/") && url.pathname.endsWith("/ratings")) {
    const parkingId = Number(url.pathname.split("/")[3]);
    const data = readData();
    const parkingRatings = data.ratings.filter((r) => r.parkingId === parkingId);

    sendJson(res, 200, { ratings: parkingRatings });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/reservations") {
    const body = await parseBody(req);
    const { parkingId, conductorId, reservedDate, startTime, endTime } = body;
    const data = readData();

    if (!parkingId || !conductorId || !reservedDate || !startTime || !endTime) {
      sendJson(res, 400, { error: "Datos incompletos para la reserva" });
      return true;
    }

    const parking = data.parkings.find((p) => p.id === Number(parkingId));
    if (!parking) {
      sendJson(res, 404, { error: "Parqueo no encontrado" });
      return true;
    }

    // Verificar conflictos de reservas
    const conflicts = data.reservations.filter(
      (r) => r.parkingId === Number(parkingId) && 
             r.reservedDate === reservedDate && 
             r.status !== "cancelled"
    );

    if (conflicts.length >= parking.capacity) {
      sendJson(res, 409, { error: "No hay espacios disponibles para esta fecha y hora" });
      return true;
    }

    const reservation = {
      id: nextId(data.reservations),
      parkingId: Number(parkingId),
      conductorId: Number(conductorId),
      reservedDate,
      startTime,
      endTime,
      status: "confirmed",
      createdAt: new Date().toISOString()
    };

    data.reservations.push(reservation);
    writeData(data);
    sendJson(res, 201, { reservation });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/reservations") {
    const conductorId = url.searchParams.get("conductorId");
    const data = readData();

    if (!conductorId) {
      sendJson(res, 400, { error: "Se requiere conductorId" });
      return true;
    }

    const reservations = data.reservations.filter(
      (r) => r.conductorId === Number(conductorId)
    );

    const enrichedReservations = reservations.map((res) => {
      const parking = data.parkings.find((p) => p.id === res.parkingId);
      return {
        ...res,
        parkingName: parking?.name,
        parkingAddress: parking?.address,
        ratePerHour: parking?.ratePerHour
      };
    });

    sendJson(res, 200, { reservations: enrichedReservations });
    return true;
  }

  if (req.method === "DELETE" && url.pathname.startsWith("/api/reservations/")) {
    const reservationId = Number(url.pathname.split("/").pop());
    const data = readData();
    const reservation = data.reservations.find((r) => r.id === reservationId);

    if (!reservation) {
      sendJson(res, 404, { error: "Reserva no encontrada" });
      return true;
    }

    reservation.status = "cancelled";
    writeData(data);
    sendJson(res, 200, { reservation, message: "Reserva cancelada" });
    return true;
  }

  // ===== VEHÍCULOS =====
  if (req.method === "GET" && url.pathname.startsWith("/api/vehicles")) {
    const data = readData();
    const conductorId = url.searchParams.get("conductorId");
    
    if (conductorId) {
      const vehicles = data.vehicles.filter(v => v.conductorId === Number(conductorId));
      sendJson(res, 200, vehicles);
    } else {
      sendJson(res, 200, data.vehicles || []);
    }
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/vehicles") {
    const body = await parseBody(req);
    const { conductorId, plate, model, year, color } = body;

    if (!conductorId || !plate || !model) {
      sendJson(res, 400, { error: "Datos incompletos" });
      return true;
    }

    const data = readData();
    const vehicle = {
      id: nextId(data.vehicles),
      conductorId: Number(conductorId),
      plate,
      model,
      year: Number(year) || new Date().getFullYear(),
      color,
      isDefault: data.vehicles.filter(v => v.conductorId === Number(conductorId)).length === 0,
      createdAt: new Date().toISOString()
    };

    data.vehicles.push(vehicle);
    writeData(data);
    sendJson(res, 201, { vehicle, message: "Vehículo registrado" });
    return true;
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/api/vehicles/")) {
    const vehicleId = Number(url.pathname.split("/").pop());
    const body = await parseBody(req);
    const data = readData();
    const vehicle = data.vehicles.find(v => v.id === vehicleId);

    if (!vehicle) {
      sendJson(res, 404, { error: "Vehículo no encontrado" });
      return true;
    }

    if (body.isDefault && body.isDefault === true) {
      data.vehicles.forEach(v => {
        if (v.conductorId === vehicle.conductorId) v.isDefault = false;
      });
      vehicle.isDefault = true;
    }

    Object.assign(vehicle, body);
    writeData(data);
    sendJson(res, 200, { vehicle, message: "Vehículo actualizado" });
    return true;
  }

  if (req.method === "DELETE" && url.pathname.startsWith("/api/vehicles/")) {
    const vehicleId = Number(url.pathname.split("/").pop());
    const data = readData();
    const vehicle = data.vehicles.find(v => v.id === vehicleId);

    if (!vehicle) {
      sendJson(res, 404, { error: "Vehículo no encontrado" });
      return true;
    }

    data.vehicles = data.vehicles.filter(v => v.id !== vehicleId);
    writeData(data);
    sendJson(res, 200, { message: "Vehículo eliminado" });
    return true;
  }

  // ===== SUSCRIPCIONES =====
  if (req.method === "GET" && url.pathname === "/api/subscriptions") {
    const data = readData();
    sendJson(res, 200, data.subscriptions || []);
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/user-subscriptions") {
    const body = await parseBody(req);
    const { userId, subscriptionId } = body;

    if (!userId || !subscriptionId) {
      sendJson(res, 400, { error: "Datos incompletos" });
      return true;
    }

    const data = readData();
    const subscription = data.subscriptions.find(s => s.id === Number(subscriptionId));

    if (!subscription) {
      sendJson(res, 404, { error: "Plan no encontrado" });
      return true;
    }

    const userSub = {
      id: nextId(data.user_subscriptions),
      userId: Number(userId),
      subscriptionId: Number(subscriptionId),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + subscription.duration * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      discount: subscription.id === 1 ? 5 : subscription.id === 2 ? 15 : 20
    };

    data.user_subscriptions.push(userSub);
    writeData(data);
    sendJson(res, 201, { subscription: userSub, message: "Membresía activada" });
    return true;
  }

  // ===== TICKETS DE SOPORTE =====
  if (req.method === "GET" && url.pathname.startsWith("/api/support/tickets")) {
    const data = readData();
    const userId = url.searchParams.get("userId");

    if (userId) {
      const tickets = data.support_tickets.filter(t => t.userId === Number(userId));
      sendJson(res, 200, tickets);
    } else {
      sendJson(res, 200, data.support_tickets || []);
    }
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/support/tickets") {
    const body = await parseBody(req);
    const { userId, subject, message, priority } = body;

    if (!userId || !subject || !message) {
      sendJson(res, 400, { error: "Datos incompletos" });
      return true;
    }

    const data = readData();
    const ticket = {
      id: nextId(data.support_tickets),
      userId: Number(userId),
      subject,
      message,
      status: "open",
      priority: priority || "medium",
      createdAt: new Date().toISOString(),
      responses: []
    };

    data.support_tickets.push(ticket);
    writeData(data);
    sendJson(res, 201, { ticket, message: "Ticket creado" });
    return true;
  }

  if (req.method === "POST" && url.pathname.startsWith("/api/support/tickets/") && url.pathname.includes("/respond")) {
    const ticketId = Number(url.pathname.split("/")[4]);
    const body = await parseBody(req);
    const { author, message: responseMessage } = body;

    if (!author || !responseMessage) {
      sendJson(res, 400, { error: "Datos incompletos" });
      return true;
    }

    const data = readData();
    const ticket = data.support_tickets.find(t => t.id === ticketId);

    if (!ticket) {
      sendJson(res, 404, { error: "Ticket no encontrado" });
      return true;
    }

    ticket.responses.push({
      author,
      message: responseMessage,
      timestamp: new Date().toISOString()
    });

    writeData(data);
    sendJson(res, 200, { ticket, message: "Respuesta añadida" });
    return true;
  }

  // ===== INFRACCIONES =====
  if (req.method === "GET" && url.pathname.startsWith("/api/infractions")) {
    const data = readData();
    const conductorId = url.searchParams.get("conductorId");

    if (conductorId) {
      const infractions = data.infractions.filter(i => i.conductorId === Number(conductorId));
      sendJson(res, 200, infractions);
    } else {
      sendJson(res, 200, data.infractions || []);
    }
    return true;
  }

  if (req.method === "POST" && url.pathname.startsWith("/api/infractions/") && url.pathname.includes("/pay")) {
    const infractionId = Number(url.pathname.split("/")[3]);
    const data = readData();
    const infraction = data.infractions.find(i => i.id === infractionId);

    if (!infraction) {
      sendJson(res, 404, { error: "Infracción no encontrada" });
      return true;
    }

    infraction.status = "paid";
    infraction.paidDate = new Date().toISOString();
    writeData(data);
    sendJson(res, 200, { infraction, message: "Infracción pagada" });
    return true;
  }

  return false;
}

function buildMunicipalSummary(data) {
  const totalParkings = data.parkings.length;
  const totalCapacity = data.parkings.reduce((sum, parking) => sum + parking.capacity, 0);
  const totalAvailable = data.parkings.reduce((sum, parking) => sum + parking.availableSpots, 0);
  const totalRevenue = data.payments.reduce((sum, payment) => sum + payment.amount, 0);

  return {
    totalParkings,
    totalCapacity,
    occupiedSpots: totalCapacity - totalAvailable,
    totalAvailable,
    totalRevenue
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    const handled = await handleApi(req, res, url);
    if (handled) {
      return;
    }
  } catch (error) {
    sendJson(res, 500, { error: "Error interno del servidor", details: error.message });
    return;
  }

  let filePath = path.join(publicDir, url.pathname === "/" ? "index.html" : url.pathname);

  if (!filePath.startsWith(publicDir)) {
    sendJson(res, 403, { error: "Acceso denegado" });
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    filePath = path.join(publicDir, "index.html");
  }

  sendFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Servidor disponible en http://localhost:${PORT}`);
});
