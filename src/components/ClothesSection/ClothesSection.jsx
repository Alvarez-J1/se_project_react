import "./ClothesSection.css";
import ItemCard from "../ItemCard/ItemCard";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ClothesSection({ onCardClick, clothingItems, handleAddClick }) {
  const currentUser = useContext(CurrentUserContext);
  const userItems = clothingItems.filter(
    (item) => item.owner === currentUser._id
  );

  return (
    <div className="clothes-section">
      <div className="clothes__header">
        <p className="clothes__section-title">Your items</p>
        <button onClick={handleAddClick} type="button" className="add__new-btn">
          + Add new
        </button>
      </div>
      {isOwn && (
        <ul className="clothes-section__items">
          {userItems.map((item) => {
            return (
              <ItemCard key={item._id} item={item} onCardClick={onCardClick} />
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default ClothesSection;
