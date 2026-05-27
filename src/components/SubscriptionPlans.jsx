import { useState } from "react";
import { useToast } from "../hooks/useToast";

export default function SubscriptionPlans({ currentSubscription, subscriptions }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { addToast } = useToast();

  function handleSubscribe(plan) {
    setSelectedPlan(plan);
    addToast(`Plan ${plan.name} seleccionado. Procede al pago.`, "success");
    // Aquí iría la integración con pasarela de pago
  }

  const benefitIcons = {
    "5% descuento": "💰",
    "15% descuento": "💰",
    "20% descuento": "💰",
    "Soporte prioritario": "⭐",
    "Soporte 24/7": "🆘",
    "Acceso prioritario a reservas": "🎯",
    "Acceso prioritario": "🎯",
    "Gratis primera hora": "🎁",
    "Gratis 10 horas/mes": "🎁"
  };

  return (
    <div className="space-y-6">
      {/* Plan actual */}
      {currentSubscription && (
        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">✅ Tu suscripción activa</h3>
          <p className="text-green-100">
            {currentSubscription.name} - Vence: 22 de junio, 2026
          </p>
          <button className="mt-4 px-6 py-2 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition">
            Gestionar suscripción
          </button>
        </div>
      )}

      {/* Planes disponibles */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📦 Planes Disponibles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptions.map((plan) => {
            const isCurrentPlan = currentSubscription?.id === plan.id;
            const monthlyPrice = plan.duration === 365 ? Math.round(plan.price / 12) : plan.price;

            return (
              <div
                key={plan.id}
                className={`rounded-lg border-2 p-6 transition transform hover:scale-105 ${
                  isCurrentPlan
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                }`}
              >
                {isCurrentPlan && (
                  <div className="mb-3 inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Plan Actual
                  </div>
                )}

                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h4>

                <div className="mb-4">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₡{plan.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {plan.duration === 365 ? "anual" : "por mes"}
                    {plan.duration !== 365 && (
                      <span className="block text-xs">
                        ≈ ₡{monthlyPrice.toLocaleString()}/mes
                      </span>
                    )}
                  </p>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {plan.description}
                </p>

                <div className="space-y-2 mb-6">
                  {plan.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-2">
                      <span className="text-lg">{benefitIcons[benefit] || "✓"}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isCurrentPlan}
                  className={`w-full py-2 rounded-lg font-semibold transition ${
                    isCurrentPlan
                      ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isCurrentPlan ? "Plan actual" : "Suscribirse"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparativa */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Comparativa de planes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-4 text-gray-700 dark:text-gray-300">Característica</th>
                <th className="text-center py-2 px-4 text-gray-700 dark:text-gray-300">Básico</th>
                <th className="text-center py-2 px-4 text-gray-700 dark:text-gray-300">Premium</th>
                <th className="text-center py-2 px-4 text-gray-700 dark:text-gray-300">Anual</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Descuento", basic: "5%", premium: "15%", annual: "20%" },
                { feature: "Soporte", basic: "Estándar", premium: "24/7", annual: "24/7" },
                { feature: "Acceso prioritario", basic: "❌", premium: "✅", annual: "✅" },
                { feature: "Horas gratis", basic: "❌", premium: "1 hora", annual: "10 horas" },
                { feature: "Historial extendido", basic: "30 días", premium: "90 días", annual: "1 año" }
              ].map((row) => (
                <tr key={row.feature} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{row.feature}</td>
                  <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">{row.basic}</td>
                  <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">{row.premium}</td>
                  <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">{row.annual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
