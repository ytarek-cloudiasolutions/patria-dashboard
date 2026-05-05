export const formatEgp = (value: number) => `EGP ${value.toFixed(2)}`;

export const formatEgpAmount = (value: number) =>
  Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);

export const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
