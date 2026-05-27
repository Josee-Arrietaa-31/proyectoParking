import { useState } from "react";
import { api } from "../services/api";
import { useToast } from "../hooks/useToast";

export default function ReservationForm({ parking, conductorId, onReservationCreated }) {
  const [formData, setFormData] = useState({
    reservedDate: "",
    startTime: "09:00",
    endTime: "11:00"
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.reservedDate) {
        addToast("Por favor selecciona una fecha", "error");
        return;
      }

      // Validar que la fecha sea futura
      const reservedDate = new Date(formData.reservedDate);
      if (reservedDate < new Date()) {
        addToast("La fecha debe ser futura", "error");
        return;
      }

      // Validar que la hora de fin sea mayor que la de inicio
      if (formData.startTime >= formData.endTime) {
        addToast("La hora de fin debe ser mayor que la de inicio", "error");
        return;
      }

      await api("/api/reservations", {
        method: "POST",
        body: JSON.stringify({
          parkingId: parking.id,
          conductorId,
          reservedDate: formData.reservedDate,
          startTime: formData.startTime,
          endTime: formData.endTime
        })
      });

      addToast(`Reserva confirmada en ${parking.name}`, "success");
      setFormData({ reservedDate: "", startTime: "09:00", endTime: "11:00" });
      onReservationCreated?.();
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Reservar en {parking.name}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha
            </label>
            <input
              type="date"
              name="reservedDate"
              value={formData.reservedDate}
              onChange={handleChange}
              min={today}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Zona
            </label>
            <input
              type="text"
              value={parking.zone || "N/A"}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hora de inicio
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hora de fin
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-md">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Tarifa: {parking.ratePerHour} por hora
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-md transition"
        >
          {loading ? "Creando reserva..." : "Crear reserva"}
        </button>
      </form>
    </div>
  );
}
