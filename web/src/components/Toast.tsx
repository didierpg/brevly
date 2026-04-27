import { useEffect, useRef } from "react";
import {
  InfoIcon,
  CheckCircleIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useToastStore } from "../store/useToastStore";
import type { ToastType } from "../store/useToastStore";

interface ToastProps {
  id: string;
  title: string;
  description: string;
  type: ToastType;
}

const icons: Record<ToastType, any> = {
  success: <CheckCircleIcon size={20} className="text-success" />,
  info: <InfoIcon size={20} className="text-blue-base" />,
  error: <TrashIcon size={20} className="text-danger" />,
};

export function Toast({ id, title, description, type }: ToastProps) {
  const removeToast = useToastStore((state) => state.removeToast);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimer = () => {
    timerRef.current = setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, []);

  return (
    <div
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
      className={`
        flex items-start gap-4 p-4 rounded-lg shadow-lg w-87.5
        bg-gray-100 border border-gray-200
        transition-all duration-500 ease-out
        animate-toast-in
      `}
    >
      <div className="bg-white p-2 rounded-full shrink-0 shadow-sm">
        {icons[type]}
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <span className="text-sm font-bold text-gray-600">{title}</span>
        <span className="text-xs text-gray-400 leading-tight">
          {description}
        </span>
      </div>
      <button
        onClick={() => removeToast(id)}
        className="text-gray-300 hover:text-gray-500 transition-colors"
      >
        <XIcon size={16} weight="bold" />
      </button>
    </div>
  );
}
