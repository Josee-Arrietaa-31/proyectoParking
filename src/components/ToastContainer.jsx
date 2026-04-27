import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";

function Toast({ toast, onRemove }) {
  const baseClasses = "flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-sm font-medium";
  
  const typeClasses = {
    success: "bg-emerald-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-amber-500 text-white"
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[toast.type] || typeClasses.info} animate-in fade-in slide-in-from-right-4 duration-300`}>
      <span className="text-lg">{icons[toast.type]}</span>
      <span>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-auto text-lg opacity-80 hover:opacity-100 transition"
      >
        ×
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div className="fixed bottom-4 right-4 space-y-3 pointer-events-none z-50">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
}
