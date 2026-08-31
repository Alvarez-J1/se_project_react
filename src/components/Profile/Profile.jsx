import SideBar from "../SideBar/SideBar";
import ClothesSection from "../ClothesSection/ClothesSection";
import "./Profile.css";

function Profile({
  onCardClick,
  clothingItems,
  onEditProfileClick,
  onCardLike,
  onLogout,
}) {
  return (
    <main className="profile">
      <section className="profile__sidebar" aria-label="Profile actions">
        <SideBar onEditProfileClick={onEditProfileClick} onLogout={onLogout} />
      </section>
      <div className="profile__clothing-items">
        <ClothesSection
          onCardClick={onCardClick}
          clothingItems={clothingItems}
          onCardLike={onCardLike}
        />
      </div>
    </main>
  );
}

export default Profile;
