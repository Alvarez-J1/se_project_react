import "./RegisterModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";
import { useEffect } from "react";

export default function RegisterModal({
  onClose,
  isOpen,
  onRegister,
  onOpenLogin,
}) {
  const { values, handleChange, setValues } = useForm({
    email: "",
    password: "",
    name: "",
    avatar: "",
  });

  useEffect(() => {
    if (isOpen) {
      setValues({ email: "", password: "", name: "", avatar: "" });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(values);
  };

  return (
    <ModalWithForm
      title="Sign Up"
      buttonText="Sign Up"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      contentClassName="modal__content--sp"
      submitClassName="modal__submit--signup"
      disabled={
        !values.email || !values.password || !values.name || !values.avatar
      }
    >
      <label htmlFor="email" className="modal__label">
        Email<span className="modal__required">*</span>
        <input
          type="email"
          className="modal__input"
          id="email"
          name="email"
          placeholder="Email"
          required
          minLength="1"
          maxLength="999"
          onChange={handleChange}
          value={values.email}
        />
      </label>
      <label htmlFor="registerModal__password" className="modal__label">
        Password<span className="modal__required">*</span>
        <input
          type="password"
          className="modal__input"
          id="registerModal__password"
          name="password"
          placeholder="Password"
          required
          minLength="1"
          maxLength="999"
          onChange={handleChange}
          value={values.password}
        />
      </label>
      <label htmlFor="registerModal__name" className="modal__label">
        Name<span className="modal__required">*</span>
        <input
          type="text"
          className="modal__input"
          id="registerModal__name"
          name="name"
          placeholder="Name"
          required
          minLength="1"
          maxLength="999"
          onChange={handleChange}
          value={values.name}
        />
      </label>
      <label htmlFor="registerModal__avatar" className="modal__label">
        Avatar URL<span className="modal__required">*</span>
        <input
          type="text"
          className="modal__input"
          id="registerModal__avatar"
          name="avatar"
          placeholder="Avatar Url"
          required
          minLength="1"
          maxLength="999"
          onChange={handleChange}
          value={values.avatar}
        />
      </label>
      <button
        type="button"
        onClick={onOpenLogin}
        className="registerModal__switch"
      >
        or Log In
      </button>
    </ModalWithForm>
  );
}
