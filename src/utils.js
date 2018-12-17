export const isPressureSensitiveDevice = ev => !!(ev.touches && ev.touches[0] && typeof ev.touches[0]["force"] !== "undefined")
export const pressureDetected = ev => !!(ev.touches[0]["force"] > 0);
export const getPressure = ev => pressureDetected(ev) ? ev.touches[0]["force"] : 1.0;

export const getCoords = (ev, canvasEl) => {
  const rect = canvasEl.getBoundingClientRect();
  if (isPressureSensitiveDevice(ev)) {
    return {
      x : ev.touches[0].clientX - rect.left,
      y : ev.touches[0].clientY - rect.top
    }
  } else {
    return {
      x: ev.clientX - rect.left,
      y: ev.clientY - rect.top
    }
  }
};

