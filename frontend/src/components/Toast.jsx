import React, { useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
};

export default function Toast({ message, type = "success", onClose, duration = 4000 }) {
  const Icon = icons[type];

  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const styles = {
    success: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
    error: "border-red-500/50 bg-red-500/10 text-red-400",
    warning: "border-amber-500/50 bg-amber-500/10 text-amber-400",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl animate-slide-in-right ${styles[type]}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
