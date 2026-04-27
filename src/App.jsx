import { useEffect, useState } from "react";

const demoUsers = [
  { role: "Conductor", email: "conductor@demo.com", password: "1234" },
  { role: "Operador", email: "operador@demo.com", password: "1234" },
  { role: "Municipalidad", email: "municipalidad@demo.com", password: "1234" }
];

const emptyParkingForm = {
  name: "",
  type: "privado",
  latitude: "10.3234",
  longitude: "-84.4271",
  capacity: "20",
  availableSpots: "10",
  ratePerHour: "800"
};

const inputClass =
  "w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-200";

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-[28px] border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-semibold tracking-tight ${accent}`}>{value}</p>
    </div>
  );
}

function ParkingCard({ parking, formatCurrency, action }) {
  return (
    <article className="rounded-[28px] border border-white/40 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-800">
            {parking.type}
          </span>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">{parking.name}</h3>
        </div>
        <div className="rounded-2xl bg-slate-950 px-3 py-2 text-right text-white">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Tarifa</p>
          <p className="text-sm font-semibold">{formatCurrency(parking.ratePerHour)}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <p>
          Disponibles: <span className="font-semibold text-slate-900">{parking.availableSpots}</span> de {parking.capacity}
        </p>
        <p>
          Ubicacion: <span className="font-semibold text-slate-900">{parking.latitude}, {parking.longitude}</span>
        </p>
      </div>
      {action ? <div className="mt-5">{action}</div> : null}
    </article>
  );
}

function App() {
  const [users, setUsers] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [status, setStatus] = useState({ message: "Cargando aplicacion...", error: false });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "conductor"
  });
  const [parkingForm, setParkingForm] = useState(emptyParkingForm);

  useEffect(() => {
    const saved = localStorage.getItem("parkingUser");
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    loadBootstrap();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("parkingUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("parkingUser");
    }
  }, [currentUser]);

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

  async function loadBootstrap() {
    try {
      const payload = await api("/api/bootstrap");
      setUsers(payload.users);
      setParkings(payload.parkings);
      setPayments(payload.payments);
      setSummary(payload.summary);
      setStatus({ message: "Aplicacion lista para pruebas.", error: false });
    } catch (error) {
      setStatus({ message: error.message, error: true });
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      maximumFractionDigits: 0
    }).format(value || 0);
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();

    try {
      const payload = await api("/api/login", {
        method: "POST",
        body: JSON.stringify(loginForm)
      });
      setCurrentUser(payload.user);
      setLoginForm({ email: "", password: "" });
      setStatus({ message: `Sesion iniciada como ${payload.user.role}.`, error: false });
    } catch (error) {
      setStatus({ message: error.message, error: true });
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();

    try {
      const payload = await api("/api/register", {
        method: "POST",
        body: JSON.stringify(registerForm)
      });
      setUsers((current) => [...current, payload.user]);
      setRegisterForm({
        name: "",
        email: "",
        password: "",
        role: "conductor"
      });
      setStatus({ message: `Usuario ${payload.user.name} registrado correctamente.`, error: false });
    } catch (error) {
      setStatus({ message: error.message, error: true });
    }
  }

  async function handleParkingSubmit(event) {
    event.preventDefault();

    try {
      await api("/api/parkings", {
        method: "POST",
        body: JSON.stringify({
          ...parkingForm,
          operatorId: currentUser.id
        })
      });
      setParkingForm(emptyParkingForm);
      await loadBootstrap();
      setStatus({ message: "Parqueo registrado correctamente.", error: false });
    } catch (error) {
      setStatus({ message: error.message, error: true });
    }
  }

  async function updateAvailability(parkingId, availableSpots) {
    try {
      await api(`/api/parkings/${parkingId}`, {
        method: "PATCH",
        body: JSON.stringify({ availableSpots })
      });
      await loadBootstrap();
      setStatus({ message: "Disponibilidad actualizada.", error: false });
    } catch (error) {
      setStatus({ message: error.message, error: true });
    }
  }

  async function payParking(parkingId) {
    try {
      const payload = await api("/api/payments", {
        method: "POST",
        body: JSON.stringify({
          parkingId,
          conductorId: currentUser.id,
          hours: 1
        })
      });
      setPayments((current) => [...current, payload.payment]);
      setSummary(payload.summary);
      await loadBootstrap();
      setStatus({ message: "Pago registrado correctamente.", error: false });
    } catch (error) {
      setStatus({ message: error.message, error: true });
    }
  }

  function logout() {
    setCurrentUser(null);
    setStatus({ message: "Sesion cerrada.", error: false });
  }

  const myParkings = currentUser ? parkings.filter((parking) => parking.operatorId === currentUser.id) : [];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#ecfdf5_48%,_#eff6ff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="relative overflow-hidden rounded-[36px] border border-white/50 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_120px_rgba(15,23,42,0.35)] sm:px-8 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,_rgba(16,185,129,0.30),_transparent_20%),radial-gradient(circle_at_90%_20%,_rgba(250,204,21,0.18),_transparent_18%),linear-gradient(135deg,_rgba(15,23,42,0.1),_rgba(15,23,42,0.85))]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-300">Sprint 3 · React + Tailwind</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Plataforma integrada para gestionar parqueos urbanos
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Un MVP para conductores, operadores y municipalidades con autenticacion, consulta visual, disponibilidad y pagos basicos.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <StatCard label="Usuarios" value={users.length} accent="text-emerald-300" />
                <StatCard label="Parqueos" value={parkings.length} accent="text-amber-300" />
                <StatCard label="Pagos" value={payments.length} accent="text-cyan-300" />
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/8 p-6 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">Accesos demo</p>
              <div className="mt-5 space-y-4">
                {demoUsers.map((user) => (
                  <div key={user.email} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                    <p className="text-sm font-semibold text-white">{user.role}</p>
                    <p className="mt-1 text-sm text-slate-300">{user.email}</p>
                    <p className="text-sm text-emerald-300">Clave: {user.password}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="mt-8 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <section className="rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Acceso</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Entrar o registrarse</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Prueba los flujos del prototipo con los roles del sistema.</p>
            </div>

            <div className="mt-6 space-y-5">
              <form onSubmit={handleLoginSubmit} className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-5">
                <h3 className="text-lg font-semibold text-slate-900">Iniciar sesion</h3>
                <div className="mt-4 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Correo</span>
                    <input
                      className={inputClass}
                      type="email"
                      value={loginForm.email}
                      onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Contrasena</span>
                    <input
                      className={inputClass}
                      type="password"
                      value={loginForm.password}
                      onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                      required
                    />
                  </label>
                </div>
                <button className="mt-5 inline-flex w-full justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700" type="submit">
                  Entrar al sistema
                </button>
              </form>

              <form onSubmit={handleRegisterSubmit} className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-5">
                <h3 className="text-lg font-semibold text-slate-900">Registrar usuario</h3>
                <div className="mt-4 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Nombre</span>
                    <input
                      className={inputClass}
                      type="text"
                      value={registerForm.name}
                      onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Correo</span>
                    <input
                      className={inputClass}
                      type="email"
                      value={registerForm.email}
                      onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Contrasena</span>
                    <input
                      className={inputClass}
                      type="password"
                      value={registerForm.password}
                      onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Rol</span>
                    <select
                      className={inputClass}
                      value={registerForm.role}
                      onChange={(event) => setRegisterForm({ ...registerForm, role: event.target.value })}
                    >
                      <option value="conductor">Conductor</option>
                      <option value="operador">Operador</option>
                      <option value="municipalidad">Municipalidad</option>
                    </select>
                  </label>
                </div>
                <button className="mt-5 inline-flex w-full justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700" type="submit">
                  Crear cuenta
                </button>
              </form>
            </div>

            <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${status.error ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
              {status.message}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Vista activa</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Panel segun el rol</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">La interfaz se adapta al tipo de usuario autenticado.</p>
              </div>
              {currentUser ? (
                <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white">
                  <div>
                    <p className="font-semibold">{currentUser.name}</p>
                    <p className="text-slate-300">{currentUser.email}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    {currentUser.role}
                  </span>
                  <button className="rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10" type="button" onClick={logout}>
                    Salir
                  </button>
                </div>
              ) : null}
            </div>

            {!currentUser ? (
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[30px] bg-slate-950 p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">MVP del sprint</p>
                  <h3 className="mt-4 text-3xl font-semibold tracking-tight">Una base lista para crecer</h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                    La app ya funciona con React, Tailwind y una API local. El siguiente paso natural es modularizar componentes y conectar mapa o base de datos real.
                  </p>
                </div>
                <div className="grid gap-4">
                  <StatCard label="Ingresos acumulados" value={formatCurrency(summary.totalRevenue || 0)} accent="text-emerald-700" />
                  <StatCard label="Espacios disponibles" value={summary.totalAvailable || 0} accent="text-cyan-700" />
                </div>
              </div>
            ) : null}

            {currentUser?.role === "conductor" ? (
              <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="overflow-hidden rounded-[30px] border border-white/40 bg-slate-950 p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Busqueda cercana</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">Mapa interactivo simulado</h3>
                  <div className="relative mt-5 h-[360px] overflow-hidden rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,_rgba(16,185,129,0.18),_transparent_18%),radial-gradient(circle_at_80%_30%,_rgba(250,204,21,0.18),_transparent_16%),linear-gradient(135deg,_rgba(15,23,42,0.92),_rgba(30,41,59,0.78))]">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px]" />
                    {parkings.map((parking, index) => {
                      const left = 16 + ((index * 29) % 68);
                      const top = 18 + ((index * 17) % 62);
                      return (
                        <div
                          key={parking.id}
                          className="absolute"
                          style={{ left: `${left}%`, top: `${top}%` }}
                        >
                          <div className="h-5 w-5 rounded-full border-4 border-white bg-emerald-400 shadow-[0_0_0_8px_rgba(16,185,129,0.18)]" />
                          <div className="mt-2 -ml-4 w-28 rounded-xl bg-white/95 px-2 py-1 text-[11px] font-semibold text-slate-900 shadow-lg">
                            {parking.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-5">
                  {parkings.map((parking) => (
                    <ParkingCard
                      key={parking.id}
                      parking={parking}
                      formatCurrency={formatCurrency}
                      action={
                        <button
                          className="inline-flex rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                          type="button"
                          onClick={() => payParking(parking.id)}
                        >
                          Pagar 1 hora
                        </button>
                      }
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {currentUser?.role === "operador" ? (
              <div className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                <form onSubmit={handleParkingSubmit} className="rounded-[30px] border border-white/40 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Gestion operativa</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">Registrar parqueo</h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-sm font-medium text-slate-200">Nombre</span>
                      <input className={inputClass} type="text" value={parkingForm.name} onChange={(event) => setParkingForm({ ...parkingForm, name: event.target.value })} required />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-200">Tipo</span>
                      <select className={inputClass} value={parkingForm.type} onChange={(event) => setParkingForm({ ...parkingForm, type: event.target.value })}>
                        <option value="privado">Privado</option>
                        <option value="publico">Publico</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-200">Tarifa por hora</span>
                      <input className={inputClass} type="number" min="1" value={parkingForm.ratePerHour} onChange={(event) => setParkingForm({ ...parkingForm, ratePerHour: event.target.value })} required />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-200">Latitud</span>
                      <input className={inputClass} type="number" step="0.0001" value={parkingForm.latitude} onChange={(event) => setParkingForm({ ...parkingForm, latitude: event.target.value })} required />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-200">Longitud</span>
                      <input className={inputClass} type="number" step="0.0001" value={parkingForm.longitude} onChange={(event) => setParkingForm({ ...parkingForm, longitude: event.target.value })} required />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-200">Capacidad</span>
                      <input className={inputClass} type="number" min="1" value={parkingForm.capacity} onChange={(event) => setParkingForm({ ...parkingForm, capacity: event.target.value })} required />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-200">Disponibles</span>
                      <input className={inputClass} type="number" min="0" value={parkingForm.availableSpots} onChange={(event) => setParkingForm({ ...parkingForm, availableSpots: event.target.value })} required />
                    </label>
                  </div>
                  <button className="mt-5 inline-flex w-full justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400" type="submit">
                    Guardar parqueo
                  </button>
                </form>

                <div className="grid gap-5">
                  {myParkings.length ? (
                    myParkings.map((parking) => (
                      <ParkingCard
                        key={parking.id}
                        parking={parking}
                        formatCurrency={formatCurrency}
                        action={
                          <div className="flex flex-wrap gap-3">
                            <button
                              className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                              type="button"
                              onClick={() => updateAvailability(parking.id, Math.max(parking.availableSpots - 1, 0))}
                            >
                              -1 disponible
                            </button>
                            <button
                              className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-200"
                              type="button"
                              onClick={() => updateAvailability(parking.id, Math.min(parking.availableSpots + 1, parking.capacity))}
                            >
                              +1 disponible
                            </button>
                          </div>
                        }
                      />
                    ))
                  ) : (
                    <div className="rounded-[30px] border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center text-slate-600">
                      Aun no has registrado parqueos.
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {currentUser?.role === "municipalidad" ? (
              <div className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <StatCard label="Parqueos" value={summary.totalParkings || 0} accent="text-slate-900" />
                  <StatCard label="Capacidad" value={summary.totalCapacity || 0} accent="text-cyan-700" />
                  <StatCard label="Ocupados" value={summary.occupiedSpots || 0} accent="text-amber-700" />
                  <StatCard label="Disponibles" value={summary.totalAvailable || 0} accent="text-emerald-700" />
                  <StatCard label="Ingresos" value={formatCurrency(summary.totalRevenue || 0)} accent="text-violet-700" />
                </div>
                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  {parkings.map((parking) => (
                    <ParkingCard key={parking.id} parking={parking} formatCurrency={formatCurrency} />
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
