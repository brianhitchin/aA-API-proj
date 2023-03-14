// frontend/src/components/LoginFormModal/index.js
import React from "react";
import { useParams } from "react-router-dom"
import * as eventsActions from "../../store/events";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./index.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const { eventId } = useParams();

  const handleSubmitY = (e) => {
    e.preventDefault();
    return dispatch(eventsActions.delete({ eventId }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          console.log(data, data.errors)
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  const handleSubmitN = (e) => {
    e.preventDefault();
    closeModal
  }

  return (
    <div className="loginmain">
      <h1 className="loginloginlmao">Confirm Delete</h1>
      <form onSubmit={handleSubmit} className='loginform'>
        {(errors.length >= 1 || Object.values(errors).length >= 1) && <div className="loginerror">Couldn't delete group!</div>}
        <button type="text" className="deletebuttonR" onClick={handleSubmitY}>Yes (Delete Event)</button>
        <button type="text" className="deletebutton" onClick={handleSubmitN}>No (Keep Event)</button>
      </form>
    </div>
  );
}

export default LoginFormModal;