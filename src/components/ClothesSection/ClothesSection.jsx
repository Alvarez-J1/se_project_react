import "./ClothesSection.css";
import ItemCard from "../ItemCard/ItemCard";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ClothesSection({
  onCardClick,
  clothingItems,
  handleAddClick,
  onCardLike,
}) {
  const currentUser = useContext(CurrentUserContext);
  const _id = currentUser?._id || "";
  const userItems = clothingItems.filter((item) => item.owner === _id);

  return (
    <div className="clothes-section">
      <div className="clothes__header">
        <p className="clothes__section-title">Your items</p>
        <button onClick={handleAddClick} type="button" className="add__new-btn">
          + Add new
        </button>
      </div>
      {userItems.length > 0 && (
        <ul className="clothes-section__items">
          {userItems.map((item) => {
            return (
              <ItemCard
                key={item._id}
                item={item}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default ClothesSection;
