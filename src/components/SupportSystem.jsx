import { useState } from "react";
import { useToast } from "../hooks/useToast";

export default function SupportSystem({ currentUser }) {
  const [activeTab, setActiveTab] = useState("create");
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "medium"
  });
  const [tickets, setTickets] = useState([
    {
      id: 1,
      subject: "Problema con reserva",
      message: "No puedo reservar en ciertos horarios",
      status: "open",
      priority: "medium",
      createdAt: "2026-05-20T14:30:00.000Z",
      responses: [
        {
          id: 1,
          author: "Soporte",
          message: "Estamos investigando el problema. Gracias por reportarlo.",
          createdAt: "2026-05-20T15:00:00.000Z"
        }
      ]
    }
  ]);
  const { addToast } = useToast();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmitTicket(e) {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      addToast("Por favor completa todos los campos", "error");
      return;
    }

    const newTicket = {
      id: Math.max(...tickets.map(t => t.id), 0) + 1,
      ...formData,
      status: "open",
      createdAt: new Date().toISOString(),
      responses: []
    };

    setTickets([newTicket, ...tickets]);
    addToast("Ticket de soporte creado exitosamente", "success");
    setFormData({ subject: "", message: "", priority: "medium" });
    setActiveTab("tickets");
  }

  const priorityColors = {
    low: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
    medium: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
    high: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
  };

  const statusColors = {
    open: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    in_progress: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
    closed: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
  };

  return (
    <div className="space-y-6">
      {/* Pestañas */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === "create"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          ✏️ Nuevo Ticket
        </button>
        <button
          onClick={() => setActiveTab("tickets")}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === "tickets"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          📋 Mis Tickets ({tickets.length})
        </button>
        <button
          onClick={() => setActiveTab("faq")}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === "faq"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          ❓ Preguntas Frecuentes
        </button>
      </div>

      {/* Tab: Crear Ticket */}
      {activeTab === "create" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Crear Nuevo Ticket de Soporte
          </h3>

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Asunto *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="ej: Problema con pago"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mensaje *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe tu problema en detalle..."
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prioridad
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Enviar Ticket
            </button>
          </form>

          {/* Contacto directo */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              💬 Otras formas de contactarnos
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-semibold text-gray-900 dark:text-white">soporte@parqueos.cr</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                <p className="font-semibold text-gray-900 dark:text-white">+506 2519-2000</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Chat</p>
                <p className="font-semibold text-gray-900 dark:text-white">Disponible 24/7</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">WhatsApp</p>
                <p className="font-semibold text-gray-900 dark:text-white">+506 8765-4321</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Mis Tickets */}
      {activeTab === "tickets" && (
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No tienes tickets de soporte
              </p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      #{ticket.id} - {ticket.subject}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Creado: {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[ticket.priority]}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[ticket.status]}`}>
                      {ticket.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {ticket.message}
                </p>

                {ticket.responses.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Respuestas ({ticket.responses.length})
                    </h5>
                    <div className="space-y-3">
                      {ticket.responses.map((response) => (
                        <div
                          key={response.id}
                          className="bg-white dark:bg-gray-800 p-3 rounded"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {response.author}
                            </p>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {new Date(response.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {response.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: FAQ */}
      {activeTab === "faq" && (
        <div className="space-y-4">
          {[
            {
              q: "¿Cómo cancelo una reserva?",
              a: "Puedes cancelar tu reserva desde la pestaña 'Mis Reservas' dentro de tu perfil de conductor."
            },
            {
              q: "¿Qué métodos de pago aceptan?",
              a: "Aceptamos tarjetas de crédito, débito y transferencias bancarias."
            },
            {
              q: "¿Cuál es el tiempo de respuesta del soporte?",
              a: "Respondemos dentro de 24 horas. Para asuntos urgentes, llama al +506 2519-2000."
            },
            {
              q: "¿Puedo registrar múltiples vehículos?",
              a: "Sí, puedes registrar varios vehículos en tu perfil. Puedes establecer uno como predeterminado."
            },
            {
              q: "¿Cómo obtengo descuentos?",
              a: "Suscríbete a uno de nuestros planes para obtener descuentos automáticos en tus pagos."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {item.q}
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
