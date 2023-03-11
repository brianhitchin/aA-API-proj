// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  console.log('errors', errors)
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          console.log(data, data.errors)
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  const handleDemoClick = () => {
    setErrors([]);
    return dispatch(sessionActions.login({ credential: "demo@demo.io", password: "password4" }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  }

  return (
    <div className="loginmain">
      <h1 className="loginloginlmao">Log In</h1>
      <form onSubmit={handleSubmit} className='loginform'>
        {(errors.length >= 1 || Object.values(errors).length >= 1) && <div className="loginerror">Please provide valid credentials.</div>}
        <label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder={"Username or Email"}
            required
            className="logininputs"
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={"Password"}
            required
            className="logininputs"
          />
        </label>
        <button type="submit" className="loginbutton" disabled={credential.length < 4 || password.length < 6}>{
          (credential.length < 4 || password.length < 6) ? "Please provide valid credentials." : "Log In"
        }</button>
        <div className="logindemo" onClick={handleDemoClick}>Demo User</div>
      </form>
    </div>
  );
}

export default LoginFormModal;