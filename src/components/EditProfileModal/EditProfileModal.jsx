import React, { useEffect, useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";
export default function EditProfileModal({ isOpen, onClose, onEditProfile }) {
  const currentUser = useContext(CurrentUserContext);

  const { values, handleChange, setValues } = useForm({
    name: "",
    avatar: "",
  });

  useEffect(() => {
    if (isOpen && currentUser) {
      setValues({ name: currentUser.name, avatar: currentUser.avatar });
    }
  }),
    [currentUser, isOpen];

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditProfile(values);
  };
  return (
    <ModalWithForm
      title="Change profile data"
      buttonText="Change profile data"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label htmlFor="name" className="modal__label">
        Name<span className="modal__required">*</span>
        <input
          type="text"
          className="modal__input"
          id="name"
          name="name"
          placeholder="Your Name"
          required
          minLength="1"
          maxLength="999"
          onChange={handleChange}
          value={values.name}
        />
      </label>
      <label htmlFor="avatar" className="modal__label">
        Avatar<span className="modal__required">*</span>
        <input
          type="url"
          className="modal__input"
          id="avatar"
          name="avatar"
          placeholder="Avatar Url"
          required
          minLength="1"
          maxLength="999"
          onChange={handleChange}
          value={values.avatar}
        />
      </label>
    </ModalWithForm>
  );
}
