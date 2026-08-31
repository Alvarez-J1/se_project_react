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
  }, [isOpen, setValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(values);
  };

  return (
    <ModalWithForm
      title="Create your WeatherFit"
      description="Create a profile so WeatherFit can personalize your outfit recommendations."
      buttonText="Sign Up"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      variant="auth"
      contentClassName="modal__content--auth modal__content--sp"
      submitClassName="modal__submit--auth modal__submit--signup"
      disabled={
        !values.email || !values.password || !values.name || !values.avatar
      }
      formFooter={
        <p className="auth-modal__switch-text">
          Already have an account?
          <button
            type="button"
            onClick={onOpenLogin}
            className="auth-modal__switch"
          >
            Log in
          </button>
        </p>
      }
    >
      <label htmlFor="registerModal__email" className="modal__label">
        <span className="modal__label-text">
          Email<span className="modal__required" aria-hidden="true">*</span>
        </span>
        <input
          type="email"
          className="modal__input"
          id="registerModal__email"
          name="email"
          placeholder="you@example.com"
          required
          minLength="1"
          maxLength="999"
          onChange={handleChange}
          value={values.email}
          autoComplete="email"
          autoCapitalize="none"
        />
      </label>
      <label htmlFor="registerModal__password" className="modal__label">
        <span className="modal__label-text">
          Password<span className="modal__required" aria-hidden="true">*</span>
        </span>
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
          autoComplete="new-password"
        />
      </label>
      <label htmlFor="registerModal__name" className="modal__label">
        <span className="modal__label-text">
          Name<span className="modal__required" aria-hidden="true">*</span>
        </span>
        <input
          type="text"
          className="modal__input"
          id="registerModal__name"
          name="name"
          placeholder="Your name"
          required
          minLength="1"
          maxLength="999"
          onChange={handleChange}
          value={values.name}
          autoComplete="name"
        />
      </label>
      <label htmlFor="registerModal__avatar" className="modal__label">
        <span className="modal__label-text">
          Profile image link<span className="modal__required" aria-hidden="true">*</span>
        </span>
        <input
          type="url"
          className="modal__input"
          id="registerModal__avatar"
          name="avatar"
          placeholder="https://example.com/photo.jpg"
          required
          minLength="1"
          maxLength="999"
          onChange={handleChange}
          value={values.avatar}
          autoComplete="url"
          autoCapitalize="none"
          spellCheck="false"
          aria-describedby="registerModal__avatarHint"
        />
        <span className="modal__field-hint" id="registerModal__avatarHint">
          Paste a direct image URL for your profile photo.
        </span>
      </label>
    </ModalWithForm>
  );
}
