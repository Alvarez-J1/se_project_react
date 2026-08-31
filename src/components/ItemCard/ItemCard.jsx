import "./ItemCard.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import likeButton from "../../assets/Default.svg";
import likedHeart from "../../assets/heart.svg";

const inferCategory = (name = "") => {
  const normalizedName = name.toLowerCase();

  if (/jacket|coat|hoodie|parka|windbreaker/.test(normalizedName)) {
    return "Outerwear";
  }

  if (/sweater|shirt|t-shirt|tee|tank|top/.test(normalizedName)) {
    return "Tops";
  }

  if (/shorts|pants|sweatpants|jeans|trousers/.test(normalizedName)) {
    return "Bottoms";
  }

  if (/sneaker|shoe|boot|footwear/.test(normalizedName)) {
    return "Footwear";
  }

  if (/beanie|cap|hat|scarf|glove|sunglasses/.test(normalizedName)) {
    return "Accessories";
  }

  return "Wardrobe item";
};

function ItemCard({ item, onCardClick, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);

  const isAuthorized = !!currentUser?._id;
  const likes = Array.isArray(item.likes) ? item.likes : [];
  const currentUserId = String(currentUser?._id || "");
  const isLiked =
    isAuthorized && likes.some((id) => String(id) === currentUserId);
  const category = item.category || inferCategory(item.name);

  const itemLikeButtonClassName = `card__like ${
    isLiked ? "card__like--active" : ""
  }`;

  const handleCardClick = () => {
    onCardClick(item);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (!isAuthorized) return;
    onCardLike(item);
  };

  return (
    <li className="card">
      <button
        onClick={handleCardClick}
        className="card__media"
        type="button"
        aria-label={`View details for ${item.name}`}
      >
        <img
          className="card__image"
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          decoding="async"
        />
      </button>
      <div className="card__body">
        <div className="card__details">
          <p className="card__category">{category}</p>
          <h2 className="card__title">{item.name}</h2>
        </div>
        {isAuthorized ? (
          <button
            type="button"
            className={itemLikeButtonClassName}
            onClick={handleLike}
            aria-label={isLiked ? `Unlike ${item.name}` : `Like ${item.name}`}
            aria-pressed={isLiked}
          >
            <img
              src={isLiked ? likedHeart : likeButton}
              alt=""
              aria-hidden="true"
              className="like__btn"
            />
          </button>
        ) : (
          <div className="like__btn-spacer"></div>
        )}
      </div>
    </li>
  );
}

export default ItemCard;
