import "./SideBar.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function SideBar({ onEditProfileClick, onLogout }) {
  const currentUser = useContext(CurrentUserContext);
  const avatar = currentUser?.avatar || "";
  const name = currentUser?.name || "";
  const initial = (name || "").charAt(0).toUpperCase();
  return (
    <div className="sidebar">
      <div className="sidebar__top">
        {avatar ? (
          <img className="sidebar__avatar" src={avatar} alt="avatar" />
        ) : (
          <div className="sidebar__avatar-placeholder">{initial}</div>
        )}
        <p className="sidebar__username">{name}</p>
      </div>
      <div className="sidebar__profile-data">
        <button
          type="button"
          className="sidebar__edit-btn"
          onClick={onEditProfileClick}
        >
          Change profile data
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="sidebar__logout-btn"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default SideBar;
