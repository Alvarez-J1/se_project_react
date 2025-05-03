import "./WeatherCard.css";
import MainImage from "../../assets/sunny.svg";

function WeatherCard({ weatherData }) {
  return (
    <>
      <section className="weather-card">
        <p className="weather-card__temp">{weatherData.temp.F} &deg; F</p>
        <img src={MainImage} alt="sunny" className="weather-card__image" />
      </section>
    </>
  );
}

export default WeatherCard;
