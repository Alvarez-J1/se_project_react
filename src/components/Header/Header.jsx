import "./Header.css";
import headerLogo from "../../assets/logo.svg";
// import avatarLogo from "../../assets/avatar.svg";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { Link } from "react-router-dom";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Header({
  handleAddClick,
  weatherData,
  isLoggedIn,
  onLoginClick,
  onRegisterClick,
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
      <Link to="/">
        <img src={headerLogo} alt="User avatar" className="header__logo"></img>
      </Link>

      <p className="header__date-and-location">
        {currentDate}, {weatherData.city}
      </p>
      <ToggleSwitch />
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
                  alt="User avatar "
                  className="header__avatar"
                />
              ) : (
                <div className="header__avatar-placeholder">{initial}</div>
              )}
            </div>
          </Link>
        </>
      ) : (
        // Non-authorized view
        <div>
          <button className="header__signup-btn" onClick={onRegisterClick}>
            Sign Up
          </button>
          <button className="header__signin-btn" onClick={onLoginClick}>
            Log In
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
