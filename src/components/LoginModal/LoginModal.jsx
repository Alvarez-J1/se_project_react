import "./LoginModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";
import { useEffect, useState } from "react";

export default function LoginModal({
  onClose,
  isOpen,
  onLogin,
  onOpenRegister,
  onViewDemo,
}) {
  const { values, handleChange, setValues } = useForm({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");
  const [wrongField, setWrongField] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValues({ email: "", password: "" });
      setLoginError("");
      setWrongField("");
    }
  }, [isOpen, setValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onLogin(values);
      setWrongField("");
      setLoginError("");
    } catch {
      setWrongField("password");
      setLoginError("Email or password incorrect");
    }
  };

  return (
    <ModalWithForm
      title="Welcome back"
      description="Log in to save outfits, add clothing, and keep your WeatherFit profile synced."
      buttonText="Log In"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      variant="auth"
      contentClassName="modal__content--auth modal__content--si"
      submitClassName="modal__submit--auth modal__submit--si"
      disabled={!values.email || !values.password}
      formFooter={
        <>
          <div className="auth-modal__demo">
            <button
              type="button"
              className="auth-modal__demo-button"
              onClick={onViewDemo}
            >
              View Demo
            </button>
            <p className="auth-modal__demo-text">
              Skip sign in and explore WeatherFit with a demo account.
            </p>
          </div>
          <p className="auth-modal__switch-text">
            New to WeatherFit?
            <button
              type="button"
              className="auth-modal__switch"
              onClick={onOpenRegister}
            >
              Create an account
            </button>
          </p>
        </>
      }
    >
      <label htmlFor="loginModal__email" className="modal__label">
        <span className="modal__label-text">Email</span>
        <input
          type="email"
          className={`modal__input ${
            wrongField === "email" ? "input-error" : ""
          }`}
          id="loginModal__email"
          name="email"
          placeholder="you@example.com"
          required
          minLength="1"
          maxLength="999"
          onChange={handleChange}
          value={values.email}
          autoComplete="email"
          autoCapitalize="none"
          aria-invalid={wrongField === "email"}
        />
      </label>
      <label
        htmlFor="loginModal__password"
        className={`modal__label ${
          wrongField === "password" ? "modal__label--error" : ""
        }`}
      >
        <span className="modal__label-text">
          {wrongField === "password" ? "Password needs attention" : "Password"}
        </span>

        <input
          type="password"
          className={`modal__input ${
            wrongField === "password" ? "input-error" : ""
          }`}
          id="loginModal__password"
          name="password"
          placeholder="Password"
          required
          minLength="1"
          maxLength="999"
          onChange={handleChange}
          value={values.password}
          autoComplete="current-password"
          aria-invalid={wrongField === "password"}
          aria-describedby={loginError ? "loginModal__error" : undefined}
        />
      </label>

      {loginError && (
        <span className="modal__error" id="loginModal__error" role="alert">
          {loginError}
        </span>
      )}
    </ModalWithForm>
  );
}
