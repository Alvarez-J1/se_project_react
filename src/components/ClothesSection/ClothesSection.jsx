import "./ClothesSection.css";
import ItemCard from "../ItemCard/ItemCard";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

const emptyWardrobePreviews = [
  { label: "Outerwear" },
  { label: "Sweaters" },
  { label: "Accessories" },
  { label: "Footwear" },
];

function WardrobePreviewIcon() {
  return (
    <svg
      className="clothes-section__empty-preview-icon"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path d="M32 15a5 5 0 0 1 4 8l-4 3" />
      <path d="M32 26 15 41a4 4 0 0 0 3 7h28a4 4 0 0 0 3-7L32 26Z" />
    </svg>
  );
}

function ClothesSection({
  onCardClick,
  clothingItems,
  onCardLike,
}) {
  const currentUser = useContext(CurrentUserContext);
  const _id = currentUser?._id || "";
  const userItems = clothingItems.filter((item) => item.owner === _id);
  const hasUserItems = userItems.length > 0;

  return (
    <div className="clothes-section">
      <div className="clothes-section__header">
        <h2 className="clothes-section__title">Your items</h2>
      </div>
      {hasUserItems ? (
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
      ) : (
        <section
          className="clothes-section__empty"
          aria-labelledby="wardrobeEmptyTitle"
        >
          <div className="clothes-section__empty-content">
            <svg
              className="clothes-section__empty-illustration"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
            >
              <path d="M32 15a5 5 0 0 1 4 8l-4 3" />
              <path d="M32 26 15 41a4 4 0 0 0 3 7h28a4 4 0 0 0 3-7L32 26Z" />
            </svg>
            <p className="clothes-section__empty-eyebrow">Your wardrobe</p>
            <h2
              className="clothes-section__empty-title"
              id="wardrobeEmptyTitle"
            >
              Start building your collection
            </h2>
            <p className="clothes-section__empty-description">
              Add clothing items to personalize your daily outfit
              recommendations and weather-based suggestions.
            </p>
          </div>

          <ul className="clothes-section__empty-previews" aria-hidden="true">
            {emptyWardrobePreviews.map((preview) => (
              <li
                className="clothes-section__empty-preview"
                key={preview.label}
              >
                <div className="clothes-section__empty-preview-image">
                  <WardrobePreviewIcon />
                </div>
                <div className="clothes-section__empty-preview-footer">
                  <span className="clothes-section__empty-preview-name">
                    {preview.label}
                  </span>
                  <span className="clothes-section__empty-preview-meta">
                    Ready to add
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default ClothesSection;
