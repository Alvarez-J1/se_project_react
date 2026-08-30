import { useEffect, useId, useRef } from "react";
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
  description,
  formFooter,
}) {
  const variantAttr = variant ? `modal--${variant}` : "";
  const openClassName = isOpen ? "modal_opened" : "";
  const titleId = useId();
  const descriptionId = useId();
  const formRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    formRef.current
      ?.querySelector("input, button, select, textarea")
      ?.focus();
  }, [isOpen]);

  return (
    <div
      className={`modal ${openClassName} ${className} ${variantAttr}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      aria-hidden={!isOpen}
    >
      <div className={`modal__content ${contentClassName}`}>
        <div className="modal__header">
          <h2 className="modal__title" id={titleId}>
            {title}
          </h2>
          {description && (
            <p className="modal__description" id={descriptionId}>
              {description}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          type="button"
          className="modal__close"
          aria-label={`Close ${title} modal`}
        />
        <form onSubmit={onSubmit} className="modal__form" ref={formRef}>
          {children}
          <button
            disabled={disabled}
            type="submit"
            className={`modal__submit ${submitClassName}`}
          >
            {buttonText}
          </button>
          {formFooter && <div className="modal__form-footer">{formFooter}</div>}
        </form>
      </div>
    </div>
  );
}
export default ModalWithForm;
