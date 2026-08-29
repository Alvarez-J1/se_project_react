import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__brand">WeatherFit</p>
        <p className="footer__description">
          Smart outfit recommendations powered by live weather data.
        </p>
        <nav className="footer__links" aria-label="WeatherFit resources">
          <a
            className="footer__link"
            href="https://openweathermap.org/api"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Powered by OpenWeather API, opens in a new tab"
          >
            Powered by OpenWeather API
          </a>
        </nav>
        <p className="footer__meta">&copy; {currentYear} WeatherFit</p>
      </div>
    </footer>
  );
}

export default Footer;
