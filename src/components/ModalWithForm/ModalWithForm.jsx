import "./ModalWithForm.css";

function ModalWithForm({
  children,
  buttonText,
  title,
  onClose,
  isOpen,
  onSubmit,
  className = "",
  contentClassName = "",
  submitClassName = "",
  variant,
  disabled,
}) {
  const variantAttr = variant ? `modal--${variant}` : "";

  return (
    <div
      className={`modal ${
        isOpen && "modal_opened"
      } ${className} ${variantAttr}`}
    >
      <div className={`modal__content ${contentClassName}`}>
        <h2 className="modal__title">{title}</h2>
        <button onClick={onClose} type="button" className="modal__close" />
        <form onSubmit={onSubmit} className="modal__form">
          {children}
          <button
            disabled={disabled}
            type="submit"
            className={`modal__submit ${submitClassName}`}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
export default ModalWithForm;
