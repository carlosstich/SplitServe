import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import './SignupFormModal.css'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function SignupFormModal() {
  const dispatch = useDispatch();
  const history = useHistory()
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Email Validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!email || !emailRegex.test(email)) {
      validationErrors.email = "Please enter a valid email address.";
    }

    // Password Strength
    if (!password || password.length < 6) {
      validationErrors.password = "Password should be at least 6 characters.";
    }

    // Check Confirm Password
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Confirm Password field must be the same as the Password field.";
    }

    // Username Length
    if (!username || username.length < 4) {
      validationErrors.username = "Username should be at least 4 characters.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = await dispatch(signUp(username, email, password));
    if (data) {
      setErrors(data);
    } else {
      closeModal();
	  history.push('/dashboard')
    }
  };

  return (

    <>
	<div id="modal-content" className="signup-form-modal">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {Object.values(errors).map((error, idx) => (
            <li key={idx} className="error-message">{error}</li>
          ))}
        </ul>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "input-error" : ""}
            required
          />
        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={errors.username ? "input-error" : ""}
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
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? "input-error" : ""}
            required
          />
        </label>
        <button type="submit" className="signup-form-button">Sign Up</button>

      </form>
	  </div>
    </>
  );
}

export default SignupFormModal;
