import "./WeatherCard.css";
import { useContext } from "react";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";

function WeatherCard({
  weatherData,
  isWeatherLoading = false,
  weatherError = null,
  locationStatus = "idle",
  onUseMyLocation,
}) {
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);
  const temperature =
    currentTemperatureUnit === "F" ? weatherData.temp.F : weatherData.temp.C;
  const weatherType = weatherData.type || "default";
  const isLocating = locationStatus === "locating";
  const conditionLabel =
    weatherType === "hot"
      ? "Warm and bright"
      : weatherType === "cold"
        ? "Cool and crisp"
        : "Loading forecast";
  const outfitHint =
    weatherType === "hot"
      ? "Perfect weather for a T-shirt and shorts."
      : weatherType === "cold"
        ? "A warm jacket and layers are recommended today."
        : "WeatherFit is checking your best outfit match.";

  const locationLabel =
    weatherData.location || weatherData.city || "Finding your location";

  return (
    <section
      className={`weather-card weather-card_type_${weatherType}`}
      aria-busy={isWeatherLoading || isLocating}
    >
      <div className="weather-card__content">
        <p className="weather-card__eyebrow">Today&apos;s forecast</p>
        <div className="weather-card__main">
          <p className="weather-card__temp">
            <span className="weather-card__temp-value">{temperature}</span>
            <span className="weather-card__degree">
              &deg;{currentTemperatureUnit}
            </span>
          </p>
          <div className="weather-card__details">
            <h1 className="weather-card__condition">{conditionLabel}</h1>
            <p className="weather-card__location">{locationLabel}</p>
          </div>
        </div>
        <p className="weather-card__outfit-note">{outfitHint}</p>

        <div className="weather-card__location-actions" aria-live="polite">
          <button
            type="button"
            className="weather-card__location-btn"
            onClick={onUseMyLocation}
            disabled={isWeatherLoading || isLocating}
          >
            {isLocating ? "Locating..." : "Use My Location"}
          </button>

          {weatherError ? (
            <p className="weather-card__location-note weather-card__location-note_error">
              Couldn&apos;t load the latest weather. Please try again.
            </p>
          ) : locationStatus === "default" ? (
            <p className="weather-card__location-note">
              Location access unavailable &mdash; showing the default location.
            </p>
          ) : null}
        </div>
      </div>
      <div className="weather-card__visual" aria-hidden="true">
        <div className="weather-card__sun"></div>
        <div className="weather-card__cloud weather-card__cloud_primary"></div>
        <div className="weather-card__cloud weather-card__cloud_secondary"></div>
      </div>
    </section>
  );
}

export default WeatherCard;
