import "./Header.css";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { Link } from "react-router-dom";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Header({
  handleAddClick,
  weatherData,
  isLoggedIn,
  onLoginClick,
  onRegisterClick,
  theme,
  onToggleTheme,
}) {
  const currentUser = useContext(CurrentUserContext);
  const name = currentUser?.name || "";
  const avatar = currentUser?.avatar || "";
  const initial = (name || "").charAt(0).toUpperCase();

  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });
  return (
    <header className="header">
      <Link to="/" className="header__brand-link">
        <span className="header__brand-mark" aria-hidden="true">
          <span className="header__brand-cloud"></span>
          <span className="header__brand-sun"></span>
        </span>
        <span className="header__brand-name">WeatherFit</span>
      </Link>

      <p className="header__date-and-location">
        {currentDate}, {weatherData.city}
      </p>
      <ToggleSwitch />
      <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
      {isLoggedIn ? (
        // Authorized view
        <>
          <button
            onClick={handleAddClick}
            type="button"
            className="header__add-clothes-btn"
          >
            + Add clothes
          </button>
          <Link to="/profile" className="header__link">
            <div className="header__user-container">
              <p className="header__username">{name || "User"}</p>

              {avatar ? (
                <img
                  src={avatar}
                  alt=""
                  className="header__avatar"
                />
              ) : (
                <div className="header__avatar-placeholder" aria-hidden="true">
                  {initial}
                </div>
              )}
            </div>
          </Link>
        </>
      ) : (
        // Non-authorized view
        <div className="header__auth-actions">
          <button
            type="button"
            className="header__signup-btn"
            onClick={onRegisterClick}
          >
            Sign Up
          </button>
          <button
            type="button"
            className="header__signin-btn"
            onClick={onLoginClick}
          >
            Log In
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
