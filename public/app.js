const state = {
  users: [],
  parkings: [],
  payments: [],
  summary: {},
  currentUser: null
};

const statusMessage = document.getElementById("status-message");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const roleView = document.getElementById("role-view");
const userSummary = document.getElementById("user-summary");

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Ocurrio un error");
  }

  return payload;
}

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.className = isError ? "status-message error" : "status-message";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function persistSession() {
  if (state.currentUser) {
    localStorage.setItem("parkingUser", JSON.stringify(state.currentUser));
  } else {
    localStorage.removeItem("parkingUser");
  }
}

function restoreSession() {
  const saved = localStorage.getItem("parkingUser");
  if (saved) {
    state.currentUser = JSON.parse(saved);
  }
}

async function loadBootstrap() {
  const payload = await api("/api/bootstrap");
  state.users = payload.users;
  state.parkings = payload.parkings;
  state.payments = payload.payments;
  state.summary = payload.summary;
}

function renderUserSummary() {
  if (!state.currentUser) {
    userSummary.classList.add("hidden");
    userSummary.innerHTML = "";
    return;
  }

  userSummary.classList.remove("hidden");
  userSummary.innerHTML = `
    <div>
      <strong>${state.currentUser.name}</strong>
      <div>${state.currentUser.email}</div>
      <span class="pill">${state.currentUser.role}</span>
    </div>
    <button class="secondary-button" id="logout-button">Cerrar sesion</button>
  `;

  document.getElementById("logout-button").addEventListener("click", () => {
    state.currentUser = null;
    persistSession();
    render();
    setStatus("Sesion cerrada.");
  });
}

function parkingCards(parkings, options = {}) {
  const showPayment = options.showPayment || false;

  return parkings
    .map(
      (parking) => `
        <article class="parking-card">
          <div class="pill">${parking.type}</div>
          <h3>${parking.name}</h3>
          <p>Tarifa por hora: <strong>${formatCurrency(parking.ratePerHour)}</strong></p>
          <p>Disponibles: <strong>${parking.availableSpots}</strong> de ${parking.capacity}</p>
          <p>Ubicacion simulada: ${parking.latitude}, ${parking.longitude}</p>
          ${
            showPayment
              ? `
                <div class="inline-actions">
                  <button data-pay="${parking.id}">Pagar 1 hora</button>
                </div>
              `
              : ""
          }
        </article>
      `
    )
    .join("");
}

function mapDots() {
  if (!state.parkings.length) {
    return "<p>No hay parqueos registrados.</p>";
  }

  return state.parkings
    .map((parking, index) => {
      const left = 18 + ((index * 31) % 65);
      const top = 22 + ((index * 19) % 58);
      return `<div class="map-dot" title="${parking.name}" style="left:${left}%; top:${top}%"></div>`;
    })
    .join("");
}

function renderGuest() {
  roleView.innerHTML = `
    <div class="card form-card">
      <h3>Prototipo listo para pruebas</h3>
      <p>Usa uno de los accesos demo o registra un usuario nuevo para probar las vistas por rol.</p>
      <p>Este MVP ya cubre autenticacion, consulta de parqueos, registro de parqueos y un flujo basico de pago.</p>
    </div>
  `;
}

function renderConductor() {
  roleView.innerHTML = `
    <div class="role-grid">
      <div class="map-card">
        <h3>Mapa interactivo simulado</h3>
        <p>Vista inicial de parqueos cercanos.</p>
        ${mapDots()}
      </div>
      <div class="parking-list">
        ${parkingCards(state.parkings, { showPayment: true })}
      </div>
    </div>
  `;

  document.querySelectorAll("[data-pay]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        const parkingId = Number(button.dataset.pay);
        const payload = await api("/api/payments", {
          method: "POST",
          body: JSON.stringify({
            parkingId,
            conductorId: state.currentUser.id,
            hours: 1
          })
        });
        state.payments.push(payload.payment);
        state.summary = payload.summary;
        await loadBootstrap();
        render();
        setStatus("Pago registrado correctamente.");
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  });
}

function renderOperador() {
  const myParkings = state.parkings.filter((parking) => parking.operatorId === state.currentUser.id);

  roleView.innerHTML = `
    <div class="role-grid two-columns">
      <form id="parking-form" class="card form-card">
        <h3>Registrar parqueo</h3>
        <label>
          Nombre
          <input type="text" name="name" required />
        </label>
        <label>
          Tipo
          <select name="type" required>
            <option value="privado">Privado</option>
            <option value="publico">Publico</option>
          </select>
        </label>
        <label>
          Latitud
          <input type="number" step="0.0001" name="latitude" required />
        </label>
        <label>
          Longitud
          <input type="number" step="0.0001" name="longitude" required />
        </label>
        <label>
          Capacidad
          <input type="number" name="capacity" min="1" required />
        </label>
        <label>
          Espacios disponibles
          <input type="number" name="availableSpots" min="0" required />
        </label>
        <label>
          Tarifa por hora
          <input type="number" name="ratePerHour" min="1" required />
        </label>
        <button type="submit">Guardar parqueo</button>
      </form>
      <div class="parking-list">
        ${
          myParkings.length
            ? myParkings
                .map(
                  (parking) => `
                    <article class="parking-card">
                      <h3>${parking.name}</h3>
                      <p>Disponibles: ${parking.availableSpots} / ${parking.capacity}</p>
                      <p>Tarifa: ${formatCurrency(parking.ratePerHour)}</p>
                      <div class="inline-actions">
                        <button data-adjust="${parking.id}" data-value="${Math.max(parking.availableSpots - 1, 0)}">-1 disponible</button>
                        <button class="secondary-button" data-adjust="${parking.id}" data-value="${Math.min(parking.availableSpots + 1, parking.capacity)}">+1 disponible</button>
                      </div>
                    </article>
                  `
                )
                .join("")
            : '<div class="card form-card"><p>Aun no has registrado parqueos.</p></div>'
        }
      </div>
    </div>
  `;

  document.getElementById("parking-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    data.operatorId = state.currentUser.id;

    try {
      await api("/api/parkings", {
        method: "POST",
        body: JSON.stringify(data)
      });
      await loadBootstrap();
      render();
      event.target.reset();
      setStatus("Parqueo registrado correctamente.");
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  document.querySelectorAll("[data-adjust]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await api(`/api/parkings/${button.dataset.adjust}`, {
          method: "PATCH",
          body: JSON.stringify({ availableSpots: Number(button.dataset.value) })
        });
        await loadBootstrap();
        render();
        setStatus("Disponibilidad actualizada.");
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  });
}

function renderMunicipalidad() {
  roleView.innerHTML = `
    <div class="summary-grid">
      <div class="summary-card">
        <h3>Resumen municipal</h3>
        <p>Total de parqueos registrados: <strong>${state.summary.totalParkings || 0}</strong></p>
        <p>Capacidad total: <strong>${state.summary.totalCapacity || 0}</strong></p>
        <p>Espacios ocupados: <strong>${state.summary.occupiedSpots || 0}</strong></p>
        <p>Espacios disponibles: <strong>${state.summary.totalAvailable || 0}</strong></p>
        <p>Ingresos acumulados: <strong>${formatCurrency(state.summary.totalRevenue || 0)}</strong></p>
      </div>
      <div class="parking-list">
        ${parkingCards(state.parkings)}
      </div>
    </div>
  `;
}

function renderRoleView() {
  if (!state.currentUser) {
    renderGuest();
    return;
  }

  if (state.currentUser.role === "conductor") {
    renderConductor();
    return;
  }

  if (state.currentUser.role === "operador") {
    renderOperador();
    return;
  }

  renderMunicipalidad();
}

function render() {
  renderUserSummary();
  renderRoleView();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const payload = await api("/api/login", {
      method: "POST",
      body: JSON.stringify(data)
    });
    state.currentUser = payload.user;
    persistSession();
    render();
    setStatus(`Sesion iniciada como ${payload.user.role}.`);
    event.target.reset();
  } catch (error) {
    setStatus(error.message, true);
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const payload = await api("/api/register", {
      method: "POST",
      body: JSON.stringify(data)
    });
    state.users.push(payload.user);
    setStatus(`Usuario ${payload.user.name} registrado correctamente.`);
    event.target.reset();
  } catch (error) {
    setStatus(error.message, true);
  }
});

async function init() {
  try {
    restoreSession();
    await loadBootstrap();
    render();
    setStatus("Aplicacion lista para pruebas.");
  } catch (error) {
    setStatus(error.message, true);
  }
}

init();
