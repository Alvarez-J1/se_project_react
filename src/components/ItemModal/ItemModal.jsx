import "./ItemModal.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemModal({ activeModal, onClose, card, onDeleteItem }) {
  const currentUser = useContext(CurrentUserContext);
  const _id = currentUser?._id || "";
  const isOwn = card.owner === _id;
  const isOpen = activeModal === "preview";
  const openClassName = isOpen ? "modal_opened" : "";

  return (
    <div
      className={`modal ${openClassName}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="itemModalTitle"
      aria-describedby="itemModalWeather"
      aria-hidden={!isOpen}
    >
      <div className="modal__content modal__content_type_image">
        <button
          onClick={onClose}
          type="button"
          className="modal__close modal__close_type_image"
          aria-label="Close preview"
        ></button>
        <img src={card.imageUrl} alt={card.name} className="modal__image" />
        <div className="modal__footer">
          <h2 className="modal__caption" id="itemModalTitle">
            {card.name}
          </h2>
          <p className="modal__weather" id="itemModalWeather">
            Weather: {card.weather}
          </p>
          {isOwn && (
            <button
              className="modal__delete-btn"
              onClick={() => onDeleteItem(card._id)}
            >
              Delete item
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
