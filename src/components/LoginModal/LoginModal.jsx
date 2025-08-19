import "./LoginModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";
import { useEffect, useState } from "react";

export default function LoginModal({ onClose, isOpen, onLogin }) {
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
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onLogin(values);
      setWrongField(null);
      setLoginError("");
    } catch (err) {
      const status =
        err?.code === "INVALID_CREDENTIALS"
          ? 401
          : err?.status ?? err?.response?.status ?? Number(err?.message);

      if (status === 401) {
        setWrongField("password");
        setLoginError("Email or password incorrect");
      } else {
        setWrongField("password");
        setLoginError("Email or password incorrect");
      }
    }
  };

  return (
    <ModalWithForm
      title="Log In"
      buttonText="Log In"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      type="submit"
      contentClassName="modal__content--si"
      submitClassName="modal__submit--si"
      disabled={!values.email || !values.password}
    >
      <label htmlFor="email" className="modal__label">
        Email
        <input
          type="email"
          className={`modal__input ${
            wrongField === "email" ? "input-error" : ""
          }`}
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
      <label
        htmlFor="password"
        className={`modal__label ${
          wrongField === "password" ? "modal__label--error" : ""
        }`}
      >
        {wrongField === "password" ? "Incorrect password" : "Password"}
      </label>

      {/* Password input */}
      <input
        type="password"
        className={`modal__input ${
          wrongField === "password" ? "input-error" : ""
        }`}
        id="password"
        name="password"
        placeholder="Password"
        required
        minLength="1"
        maxLength="999"
        onChange={handleChange}
        value={values.password}
      />

      {loginError && <span className="modal__error">{loginError}</span>}
    </ModalWithForm>
  );
}
