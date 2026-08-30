import "./ItemModal.css";
import { useContext, useEffect, useRef } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemModal({ activeModal, onClose, card, onDeleteItem }) {
  const currentUser = useContext(CurrentUserContext);
  const currentUserId = String(currentUser?._id || "");
  const ownerId = String(card?.owner || "");
  const cardName = card?.name || "Selected item";
  const cardWeather = card?.weather || "";
  const cardId = card?._id;
  const isOwn = ownerId === currentUserId;
  const isOpen = activeModal === "preview";
  const openClassName = isOpen ? "modal_opened" : "";
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

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
          aria-label={`Close ${cardName} preview`}
          ref={closeButtonRef}
        ></button>
        <img
          src={card?.imageUrl}
          alt={`Preview of ${cardName}`}
          className="modal__image"
        />
        <div className="modal__footer">
          <h2 className="modal__caption" id="itemModalTitle">
            {cardName}
          </h2>
          <p className="modal__weather" id="itemModalWeather">
            Weather: {cardWeather}
          </p>
          {isOwn && (
            <button
              type="button"
              className="modal__delete-btn"
              onClick={() => onDeleteItem(cardId)}
              aria-label={`Delete ${cardName}`}
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
