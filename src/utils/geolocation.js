import { coordinates } from "./constants";

// Default location used when geolocation is denied or unavailable.
export const DEFAULT_COORDINATES = {
  latitude: coordinates.latitude,
  longitude: coordinates.longitude,
};

const COORDS_STORAGE_KEY = "weatherfit-coords";
const DEFAULT_POSITION_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 5 * 60 * 1000,
};

const isValidCoordinates = (value) =>
  value &&
  typeof value.latitude === "number" &&
    typeof value.longitude === "number" &&
    Number.isFinite(value.latitude) &&
    Number.isFinite(value.longitude) &&
    value.latitude >= -90 &&
    value.latitude <= 90 &&
    value.longitude >= -180 &&
    value.longitude <= 180;

// Read previously granted coordinates from localStorage (null if absent/invalid).
export const getStoredCoordinates = () => {
  try {
    const raw = localStorage.getItem(COORDS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidCoordinates(parsed)) return null;
    return { latitude: parsed.latitude, longitude: parsed.longitude };
  } catch {
    return null;
  }
};

// Persist coordinates so we don't re-prompt on every visit.
export const storeCoordinates = (coords) => {
  if (!isValidCoordinates(coords)) return;
  try {
    localStorage.setItem(
      COORDS_STORAGE_KEY,
      JSON.stringify({
        latitude: coords.latitude,
        longitude: coords.longitude,
      }),
    );
  } catch {
    /* storage may be unavailable (private mode); fail silently */
  }
};

// Promise wrapper around navigator.geolocation.getCurrentPosition.
export const getCurrentPosition = (options = {}) =>
  new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      const error = new Error("Geolocation is not supported by this browser.");
      error.code = "UNSUPPORTED";
      reject(error);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (error) => reject(error),
      {
        ...DEFAULT_POSITION_OPTIONS,
        ...options,
      },
    );
  });
