import "./Header.css";
import headerLogo from "../../assets/logo.svg";
import avatarLogo from "../../assets/avatar.svg";

function Header({ handleAddClick, weatherData }) {
  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });
  return (
    <header className="header">
      <img
        src={headerLogo}
        alt="Terrence Tegegne"
        className="header__logo"
      ></img>
      <p className="header__date-and-location">
        {currentDate}, {weatherData.city}
      </p>
      <button
        onClick={handleAddClick}
        type="button"
        className="header__add-clothes-btn"
      >
        + Add clothes
      </button>
      <div className="header__user-container">
        <p className="header__username">Terrence Tegegne</p>
        <img src={avatarLogo} alt="avatar Logo" className="header__avatar" />
      </div>
    </header>
  );
}

export default Header;
