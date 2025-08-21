import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";
import { useEffect } from "react";

export default function AddItemModal({
  onClose,
  isOpen,
  onAddItemModalSubmit,
}) {
  const { values, handleChange, setValues } = useForm({
    name: "",
    imageUrl: "",
    weather: "",
  });

  useEffect(() => {
    if (isOpen) {
      setValues({
        name: "",
        imageUrl: "",
        weather: "",
      });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddItemModalSubmit(values);
  };

  return (
    <ModalWithForm
      title="New garment"
      buttonText="Add garment"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label htmlFor="addItemModal__name" className="modal__label">
        Name
        <input
          type="text"
          className="modal__input"
          id="addItemModal__name"
          name="name"
          placeholder="Name"
          required
          minLength="1"
          maxLength="999"
          onChange={handleChange}
          value={values.name}
        />
      </label>
      <label htmlFor="imageUrl" className="modal__label">
        Image{" "}
        <input
          type="text"
          className="modal__input"
          name="imageUrl"
          id="imageUrl"
          placeholder="Image URL"
          required
          minLength="1"
          maxLength="999"
          onChange={handleChange}
          value={values.imageUrl}
        />
      </label>
      <fieldset className="modal__radio-buttons">
        <legend className="modal__legend">Select the weather type:</legend>
        <label htmlFor="hot" className="modal__label modal__label_type_radio">
          <input
            type="radio"
            className="modal__radio-input"
            id="hot"
            name="weather"
            value="hot"
            onChange={handleChange}
            checked={values.weather === "hot"}
          />
          <span>Hot</span>
        </label>
        <label htmlFor="warm" className="modal__label modal__label_type_radio">
          <input
            type="radio"
            className="modal__radio-input"
            id="warm"
            name="weather"
            value="warm"
            onChange={handleChange}
            checked={values.weather === "warm"}
          />
          <span>Warm</span>
        </label>
        <label
          htmlFor="cold"
          className="modal__label modal__label_type_radio-cold"
        >
          <input
            type="radio"
            className="modal__radio-input"
            id="cold"
            name="weather"
            value="cold"
            onChange={handleChange}
            checked={values.weather === "cold"}
          />
          <span>Cold</span>
        </label>
      </fieldset>
    </ModalWithForm>
  );
}
