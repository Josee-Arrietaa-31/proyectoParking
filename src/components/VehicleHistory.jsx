import { useState } from "react";
import { useToast } from "../hooks/useToast";

export default function VehicleHistory({ vehicles, currentUser }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    plate: "",
    model: "",
    year: new Date().getFullYear(),
    color: ""
  });
  const [localVehicles, setLocalVehicles] = useState(vehicles);
  const { addToast } = useToast();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleAddVehicle(e) {
    e.preventDefault();
    
    if (!formData.plate || !formData.model) {
      addToast("Por favor completa todos los campos requeridos", "error");
      return;
    }

    const newVehicle = {
      id: Math.max(...localVehicles.map(v => v.id), 0) + 1,
      conductorId: currentUser.id,
      ...formData,
      year: Number(formData.year),
      isDefault: localVehicles.length === 0,
      createdAt: new Date().toISOString()
    };

    setLocalVehicles([...localVehicles, newVehicle]);
    addToast("Vehículo agregado correctamente", "success");
    setFormData({ plate: "", model: "", year: new Date().getFullYear(), color: "" });
    setShowForm(false);
  }

  function handleSetDefault(vehicleId) {
    const updated = localVehicles.map(v => ({
      ...v,
      isDefault: v.id === vehicleId
    }));
    setLocalVehicles(updated);
    addToast("Vehículo predeterminado actualizado", "success");
  }

  function handleDeleteVehicle(vehicleId) {
    if (localVehicles.length === 1) {
      addToast("Debes tener al menos un vehículo", "error");
      return;
    }
    setLocalVehicles(localVehicles.filter(v => v.id !== vehicleId));
    addToast("Vehículo eliminado", "success");
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          🚗 Mis Vehículos
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          {showForm ? "Cancelar" : "+ Agregar Vehículo"}
        </button>
      </div>

      {/* Formulario de agregar vehículo */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Registrar Nuevo Vehículo
          </h3>
          <form onSubmit={handleAddVehicle} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Placa *
                </label>
                <input
                  type="text"
                  name="plate"
                  value={formData.plate}
                  onChange={handleChange}
                  placeholder="ej: SJO-2024"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Modelo *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="ej: Toyota Corolla"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Año
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="2000"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="ej: Blanco"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Guardar Vehículo
            </button>
          </form>
        </div>
      )}

      {/* Lista de vehículos */}
      {localVehicles.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            No tienes vehículos registrados
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Registrar tu primer vehículo
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {localVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`border-2 rounded-lg p-6 transition ${
                vehicle.isDefault
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    {vehicle.model}
                  </h4>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-1">
                    {vehicle.plate}
                  </p>
                </div>
                {vehicle.isDefault && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Predeterminado
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Año</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {vehicle.year}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Color</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {vehicle.color}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Registrado</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(vehicle.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {!vehicle.isDefault && (
                  <button
                    onClick={() => handleSetDefault(vehicle.id)}
                    className="flex-1 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                  >
                    Establecer como predeterminado
                  </button>
                )}
                <button
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-semibold rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
