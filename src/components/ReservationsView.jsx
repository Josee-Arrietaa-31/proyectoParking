import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "../hooks/useToast";

export default function ReservationsView({ conductorId, refresh }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    loadReservations();
  }, [conductorId, refresh]);

  async function loadReservations() {
    try {
      setLoading(true);
      const payload = await api(`/api/reservations?conductorId=${conductorId}`);
      setReservations(payload.reservations);
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelReservation(reservationId) {
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      return;
    }

    try {
      await api(`/api/reservations/${reservationId}`, {
        method: "DELETE"
      });
      addToast("Reserva cancelada correctamente", "success");
      loadReservations();
    } catch (error) {
      addToast(error.message, "error");
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin">⏳</div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Cargando reservas...</p>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No tienes reservas aún. ¡Crea una nueva!
        </p>
      </div>
    );
  }

  const activeReservations = reservations.filter(r => r.status !== "cancelled");
  const cancelledReservations = reservations.filter(r => r.status === "cancelled");

  return (
    <div className="space-y-6">
      {/* Reservas Activas */}
      {activeReservations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Reservas Activas ({activeReservations.length})
          </h3>
          <div className="grid gap-4">
            {activeReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-green-500"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {reservation.parkingName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {reservation.parkingAddress}
                    </p>
                  </div>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold px-3 py-1 rounded-full">
                    {reservation.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Fecha</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(reservation.reservedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Horario</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {reservation.startTime} - {reservation.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Tarifa</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ₡{reservation.ratePerHour}/hora
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCancelReservation(reservation.id)}
                  className="w-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 font-medium py-2 rounded-md transition"
                >
                  Cancelar reserva
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reservas Canceladas */}
      {cancelledReservations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Reservas Canceladas ({cancelledReservations.length})
          </h3>
          <div className="grid gap-3">
            {cancelledReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 opacity-60 border-l-4 border-gray-400"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-600 dark:text-gray-300">
                      {reservation.parkingName}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(reservation.reservedDate).toLocaleDateString()} - {reservation.startTime} a {reservation.endTime}
                    </p>
                  </div>
                  <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">
                    Cancelada
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
