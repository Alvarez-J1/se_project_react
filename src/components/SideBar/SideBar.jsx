import "./SideBar.css";
import avatarLogo from "../../assets/avatar.svg";

function SideBar({ onEditProfileClick }) {
  return (
    <div className="sidebar">
      <img className="sidebar__avatar" src={avatarLogo} alt="avatar" />
      <p className="sidebar__username">Terrence Tegegne</p>
      <button
        type="button"
        className="sidebar__edit-btn"
        onClick={onEditProfileClick}
      />
    </div>
  );
}

export default SideBar;
