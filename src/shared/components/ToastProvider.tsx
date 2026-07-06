import { useCallback, useEffect, useState, type ReactNode } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  subscribeToToasts,
  type ToastPayload,
  type ToastVariant,
} from "@/shared/utils/toast";

interface ToastProviderProps {
  children: ReactNode;
}

interface ActiveToast extends ToastPayload {
  id: string;
}

const DEFAULT_TOAST_DURATION = 4500;
const MAX_VISIBLE_TOASTS = 4;

const createToastId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const toastStyles: Record<
  ToastVariant,
  {
    icon: ReactNode;
    title: string;
    className: string;
    iconClassName: string;
  }
> = {
  success: {
    icon: <CheckCircle2 size={20} />,
    title: "Success",
    className: "border-[#CFEADC] bg-[#F0FBF5] text-[#145C38]",
    iconClassName: "text-[#059B5A]",
  },
  error: {
    icon: <XCircle size={20} />,
    title: "Error",
    className: "border-[#F3C4C4] bg-[#FFF3F3] text-[#7A1515]",
    iconClassName: "text-[#C90000]",
  },
};

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  useEffect(() => {
    return subscribeToToasts((toast) => {
      const id = toast.id ?? createToastId();

      setToasts((currentToasts) =>
        [...currentToasts, { ...toast, id }].slice(-MAX_VISIBLE_TOASTS),
      );

      window.setTimeout(
        () => removeToast(id),
        toast.duration ?? DEFAULT_TOAST_DURATION,
      );
    });
  }, [removeToast]);

  return (
    <>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed right-4 top-4 z-[100] flex w-[min(420px,calc(100vw-2rem))] flex-col gap-3"
      >
        {toasts.map((toast) => {
          const styles = toastStyles[toast.variant];

          return (
            <div
              key={toast.id}
              role="status"
              className={cn(
                "flex items-start gap-3 rounded-[8px] border px-4 py-3 shadow-lg",
                styles.className,
              )}
            >
              <span className={cn("mt-0.5 shrink-0", styles.iconClassName)}>
                {styles.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold">{styles.title}</p>
                <p className="break-words text-[13px] leading-5">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
                className="mt-0.5 shrink-0 rounded-full p-1 transition-colors hover:bg-black/5"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ToastProvider;
