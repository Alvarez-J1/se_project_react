import "./ItemCard.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import likeButton from "../../assets/Default.svg";
import likedHeart from "../../assets/heart.svg";

function ItemCard({ item, onCardClick, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);

  const isAuthorized = !!currentUser?._id;

  const likes = Array.isArray(item.likes) ? item.likes : [];

  const isLiked = isAuthorized && likes.some((id) => id === currentUser._id);

  const itemLikeButtonClassName = `card__like ${
    isLiked ? "card__like--active" : ""
  }`;

  const handleCardClick = () => {
    onCardClick(item);
  };

  const handleLike = (e) => {
    e.stopPropagation(); //  Makes sure clicking the ♥ button only likes and doesn’t also trigger other clicks.
    if (!isAuthorized) return; //  Adds a safety net so only logged-in users can run the like action, even if the button somehow appears for others.
    onCardLike(item);
  };

  return (
    <li className="card">
      <img
        onClick={handleCardClick}
        className="card__image"
        src={item.imageUrl}
        alt={item.name}
      />
      <div className="card__header">
        <h2 className="card__title">{item.name}</h2>

        {isAuthorized ? (
          <button
            type="button"
            className={itemLikeButtonClassName}
            onClick={handleLike}
          >
            <img
              src={isLiked ? likedHeart : likeButton}
              alt="like-btn"
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
