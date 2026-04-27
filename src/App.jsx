import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import DashboardShell from "./components/DashboardShell";
import ProtectedRoute from "./components/ProtectedRoute";
import { emptyLoginForm, emptyParkingForm, emptyRegisterForm } from "./constants/appData";
import { useSession } from "./hooks/useSession";
import HomePage from "./pages/HomePage";
import { api } from "./services/api";
import { formatCurrency } from "./utils/format";
import ConductorView from "./views/ConductorView";
import MunicipalidadView from "./views/MunicipalidadView";
import OperadorView from "./views/OperadorView";

function App() {
  const [users, setUsers] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({});
  const [status, setStatus] = useState({ message: "Cargando aplicacion...", error: false });
  const [loginForm, setLoginForm] = useState(emptyLoginForm);
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm);
  const [parkingForm, setParkingForm] = useState(emptyParkingForm);
  const { currentUser, setCurrentUser } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    loadBootstrap();
  }, []);

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

  function updateLoginField(field, value) {
    setLoginForm((current) => ({ ...current, [field]: value }));
  }

  function updateRegisterField(field, value) {
    setRegisterForm((current) => ({ ...current, [field]: value }));
  }

  function updateParkingField(field, value) {
    setParkingForm((current) => ({ ...current, [field]: value }));
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();

    try {
      const payload = await api("/api/login", {
        method: "POST",
        body: JSON.stringify(loginForm)
      });
      setCurrentUser(payload.user);
      setLoginForm(emptyLoginForm);
      setStatus({ message: `Sesion iniciada como ${payload.user.role}.`, error: false });
      navigate(`/${payload.user.role}`);
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
      setRegisterForm(emptyRegisterForm);
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
    navigate("/");
  }

  const myParkings = currentUser ? parkings.filter((parking) => parking.operatorId === currentUser.id) : [];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#ecfdf5_48%,_#eff6ff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                users={users}
                parkings={parkings}
                payments={payments}
                summary={summary}
                formatCurrency={formatCurrency}
                loginForm={loginForm}
                registerForm={registerForm}
                onLoginChange={updateLoginField}
                onRegisterChange={updateRegisterField}
                onLoginSubmit={handleLoginSubmit}
                onRegisterSubmit={handleRegisterSubmit}
                status={status}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/conductor"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRole="conductor">
                <DashboardShell
                  currentUser={currentUser}
                  onLogout={logout}
                  title="Panel del conductor"
                  description="Consulta parqueos cercanos, revisa disponibilidad y registra pagos desde una vista dedicada."
                >
                  <ConductorView parkings={parkings} formatCurrency={formatCurrency} onPayParking={payParking} />
                </DashboardShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/operador"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRole="operador">
                <DashboardShell
                  currentUser={currentUser}
                  onLogout={logout}
                  title="Panel del operador"
                  description="Administra parqueos, tarifas y disponibilidad desde una pantalla enfocada en la operacion."
                >
                  <OperadorView
                    parkingForm={parkingForm}
                    myParkings={myParkings}
                    formatCurrency={formatCurrency}
                    onParkingChange={updateParkingField}
                    onParkingSubmit={handleParkingSubmit}
                    onUpdateAvailability={updateAvailability}
                  />
                </DashboardShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/municipalidad"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRole="municipalidad">
                <DashboardShell
                  currentUser={currentUser}
                  onLogout={logout}
                  title="Panel municipal"
                  description="Observa ocupacion, capacidad e ingresos desde una vista mas clara para supervision."
                >
                  <MunicipalidadView summary={summary} parkings={parkings} formatCurrency={formatCurrency} />
                </DashboardShell>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
