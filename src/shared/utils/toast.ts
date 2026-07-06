export type ToastVariant = "success" | "error";

export interface ToastPayload {
  id?: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

export const TOAST_EVENT = "patria:toast";

export const publishToast = (toast: ToastPayload) => {
  if (typeof window === "undefined" || !toast.message) return;

  window.dispatchEvent(
    new CustomEvent<ToastPayload>(TOAST_EVENT, {
      detail: toast,
    }),
  );
};

export const showSuccessToast = (message: string, duration?: number) => {
  publishToast({ message, duration, variant: "success" });
};

export const showErrorToast = (message: string, duration?: number) => {
  publishToast({ message, duration, variant: "error" });
};

export const subscribeToToasts = (
  listener: (toast: ToastPayload) => void,
) => {
  if (typeof window === "undefined") return () => undefined;

  const handleToast = (event: Event) => {
    listener((event as CustomEvent<ToastPayload>).detail);
  };

  window.addEventListener(TOAST_EVENT, handleToast);
  return () => window.removeEventListener(TOAST_EVENT, handleToast);
};
