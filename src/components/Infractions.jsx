import { useState } from "react";
import { useToast } from "../hooks/useToast";

export default function Infractions({ currentUser }) {
  const [infractions] = useState([
    {
      id: 1,
      conductorId: 1,
      parkingId: 1,
      type: "overtime",
      description: "Estacionamiento fuera de tiempo permitido",
      fine: 25000,
      date: "2026-05-15T15:00:00.000Z",
      status: "unpaid",
      plate: "SJO-2024",
      location: "Parqueo Central San Carlos",
      daysOvertime: 2,
      paymentDeadline: "2026-06-15"
    }
  ]);
  const { addToast } = useToast();

  const infractionsData = infractions.filter(i => i.conductorId === currentUser.id);
  const pendingInfractions = infractionsData.filter(i => i.status === "unpaid");
  const paidInfractions = infractionsData.filter(i => i.status === "paid");
  const totalFines = pendingInfractions.reduce((sum, i) => sum + i.fine, 0);

  function handlePayInfraction(infraction) {
    addToast(`Redirigiendo a pago de ₡${infraction.fine.toLocaleString()}...`, "success");
    // Aquí iría la integración con pasarela de pago
  }

  const typeIcons = {
    overtime: "⏰",
    no_payment: "💳",
    no_parking: "🚫",
    invalid_zone: "🚨",
    accident: "🚗"
  };

  const typeNames = {
    overtime: "Tiempo excedido",
    no_payment: "Falta de pago",
    no_parking: "Estacionamiento prohibido",
    invalid_zone: "Zona inválida",
    accident: "Reporte de accidente"
  };

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total de Infracciones</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {infractionsData.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {pendingInfractions.length} pendientes
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md p-6 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">Multas Pendientes</p>
          <p className="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">
            ₡{totalFines.toLocaleString()}
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            Vence el {pendingInfractions[0]?.paymentDeadline || "N/A"}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow-md p-6 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">Pagadas</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">
            {paidInfractions.length}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Total: ₡{paidInfractions.reduce((sum, i) => sum + i.fine, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Infracciones Pendientes */}
      {pendingInfractions.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            ⚠️ Infracciones Pendientes de Pago
          </h3>
          <div className="space-y-4">
            {pendingInfractions.map((infraction) => (
              <div
                key={infraction.id}
                className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{typeIcons[infraction.type]}</span>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                        {typeNames[infraction.type]}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {infraction.location} • {new Date(infraction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                      ₡{infraction.fine.toLocaleString()}
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Infracción #{infraction.id}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {infraction.description}
                </p>

                {infraction.type === "overtime" && (
                  <div className="bg-red-100 dark:bg-red-900/40 rounded p-3 mb-4 text-sm text-red-700 dark:text-red-300">
                    Excediste {infraction.daysOvertime} horas del tiempo permitido
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-red-200 dark:border-red-700">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Vence: <span className="font-semibold">{infraction.paymentDeadline}</span>
                  </p>
                  <button
                    onClick={() => handlePayInfraction(infraction)}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                  >
                    💳 Pagar ahora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Infracciones Pagadas */}
      {paidInfractions.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            ✅ Infracciones Pagadas
          </h3>
          <div className="space-y-3">
            {paidInfractions.map((infraction) => (
              <div
                key={infraction.id}
                className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4 opacity-75"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      {typeNames[infraction.type]} - {new Date(infraction.date).toLocaleDateString()}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {infraction.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-700 dark:text-green-300">
                      ₡{infraction.fine.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">Pagado</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sin infracciones */}
      {infractionsData.length === 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-8 text-center border border-green-200 dark:border-green-700">
          <p className="text-2xl mb-2">✨</p>
          <p className="text-gray-700 dark:text-gray-300 font-semibold">
            ¡Excelente! No tienes infracciones
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Continúa respetando las normas de estacionamiento
          </p>
        </div>
      )}

      {/* Información importante */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
          ℹ️ Información sobre Infracciones
        </h4>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <li>• Las infracciones deben pagarse antes de la fecha de vencimiento</li>
          <li>• Si no pagas a tiempo, se pueden generar intereses adicionales</li>
          <li>• Puedes disputar una infracción dentro de 7 días contacting soporte</li>
          <li>• Mantén un registro de tus vehículos actualizado para evitar sanciones</li>
          <li>• Las infracciones graves pueden resultar en suspensión de cuenta</li>
        </ul>
      </div>
    </div>
  );
}
