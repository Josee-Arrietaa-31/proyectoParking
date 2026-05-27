import { useState } from "react";
import { api } from "../services/api";
import { useToast } from "../hooks/useToast";

export default function UserProfile({ currentUser, onUserUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone || "",
    license: currentUser.license || "",
    paymentMethod: currentUser.paymentMethod || "credit_card",
    cardLast4: currentUser.cardLast4 || ""
  });
  const { addToast } = useToast();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // En una aplicación real, esto haría una llamada API para actualizar
      onUserUpdate?.(formData);
      addToast("Perfil actualizado correctamente", "success");
      setIsEditing(false);
    } catch (error) {
      addToast(error.message, "error");
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Encabezado del perfil */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">{currentUser.name}</h2>
            <p className="text-blue-100 mt-1">
              {currentUser.role === "conductor" ? "👤 Conductor" : "🏢 " + currentUser.role}
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
          >
            {isEditing ? "Cancelar" : "✏️ Editar"}
          </button>
        </div>
      </div>

      {/* Información básica */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Información Personal
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Licencia de Conducir
              </label>
              <input
                type="text"
                name="license"
                value={formData.license}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>
          </div>

          {isEditing && (
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Guardar cambios
            </button>
          )}
        </form>
      </div>

      {/* Método de pago */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          💳 Método de Pago
        </h3>

        <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg p-6 text-white mb-4">
          <p className="text-sm text-gray-300 mb-2">Tarjeta de Crédito</p>
          <p className="text-2xl font-bold mb-2">•••• •••• •••• {formData.cardLast4 || "****"}</p>
          <p className="text-sm text-gray-400">Vence: 12/26</p>
        </div>

        {isEditing && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Método de Pago
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="credit_card">Tarjeta de Crédito</option>
                <option value="debit_card">Tarjeta de Débito</option>
                <option value="transfer">Transferencia Bancaria</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Últimos 4 dígitos
              </label>
              <input
                type="text"
                name="cardLast4"
                value={formData.cardLast4}
                onChange={handleChange}
                maxLength="4"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Preferencias */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          ⚙️ Preferencias
        </h3>

        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="ml-3 text-gray-700 dark:text-gray-300">
              Recibir notificaciones de parqueos cercanos
            </span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="ml-3 text-gray-700 dark:text-gray-300">
              Alertas de reservas próximas
            </span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="w-4 h-4" />
            <span className="ml-3 text-gray-700 dark:text-gray-300">
              Boletín de promociones
            </span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="ml-3 text-gray-700 dark:text-gray-300">
              Recordatorios de pagos pendientes
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
