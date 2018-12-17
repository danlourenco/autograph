export const isPressureSensitiveDevice = ev => !!(ev.touches && ev.touches[0] && typeof ev.touches[0]["force"] !== "undefined")
export const pressureDetected = ev => !!(ev.touches[0]["force"] > 0);

