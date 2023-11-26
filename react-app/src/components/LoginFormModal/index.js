import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import SignupFormModal from "../SignupFormModal";

function LoginFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal, openModal } = useModal();

  const demoUserButton = async (e) => {
    e.preventDefault();
    await dispatch(login('demo@aa.io', 'password'));
    closeModal();
    history.push('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!email || !emailRegex.test(email)) {
        validationErrors.email = "The provided credentials were invalid.";
    }

    // Check if password field is not empty and has minimum length
    if (!password || password.length < 6) {
        validationErrors.password = "The provided credentials were invalid.";
    }

    // If frontend validation fails, display the errors
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    // Attempt to log in with provided credentials
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      closeModal();
      history.push('/dashboard');
    }
  };

  const openSignupModal = () => {
    closeModal();
    openModal(<SignupFormModal />);
  };

  return (
    <>
      <div className="login-form-modal">
        <p>Sign in</p>
        <button className="register-button" onClick={openSignupModal}>
          Register
        </button>
        <form onSubmit={handleSubmit}>
          {errors.email && <div className="error-message">{errors.email}</div>}
          {errors.password && <div className="error-message">{errors.password}</div>}
          <label>
            Email address
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "input-error" : ""}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "input-error" : ""}
              required
            />
          </label>
          <button className="login-button" type="submit" disabled={!email || password.length < 6}>Sign in</button>
          <div className="login-button-div">
            <button
              className="login-button"
              type="button"
              onClick={demoUserButton}>
              Demo User
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
