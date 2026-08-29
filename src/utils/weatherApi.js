import { processResponse } from "./api";

// Current weather for a coordinate pair (works for any location worldwide).
export const getWeather = ({ latitude, longitude }, APIkey) => {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${APIkey}`,
  ).then(processResponse);
};

// Reverse geocoding gives us a precise city name plus state/country.
export const reverseGeocode = ({ latitude, longitude }, APIkey) => {
  return fetch(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${APIkey}`,
  )
    .then(processResponse)
    .then((results) =>
      Array.isArray(results) ? (results[0] ?? null) : (results ?? null),
    );
};

const getCountryName = (countryCode) => {
  if (!countryCode) return "";
  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(countryCode) || countryCode;
  } catch {
    return countryCode;
  }
};

// Build a human-readable "City, State" (US) or "City, Country" label.
const buildLocationLabel = ({ city, state, countryCode }) => {
  if (!city) return "";
  if (countryCode === "US" && state) {
    return `${city}, ${state}`;
  }
  const countryName = getCountryName(countryCode);
  return countryName ? `${city}, ${countryName}` : city;
};

export const filterWeatherData = (data, geo = {}) => {
  const result = {};
  // Prefer the geocoder's name (more accurate), fall back to the weather payload.
  const city = geo?.name || data?.name || "";
  const countryCode = data?.sys?.country || geo?.country || "";
  const state = geo?.state || "";
  const fahrenheitTemperature = Number.isFinite(data?.main?.temp)
    ? data.main.temp
    : 999;

  result.city = city;
  result.state = state;
  result.country = getCountryName(countryCode);
  result.countryCode = countryCode;
  result.location = buildLocationLabel({ city, state, countryCode });

  result.temp = {
    F: Math.round(fahrenheitTemperature),
    C: Math.round(((fahrenheitTemperature - 32) * 5) / 9),
  };

  result.type = getWeatherType(result.temp.F);
  return result;
};

const getWeatherType = (temperature) => {
  if (temperature > 66) {
    return "hot";
  }

  return "cold";
};
