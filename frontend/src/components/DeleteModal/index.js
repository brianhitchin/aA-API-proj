import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom"
import * as eventsActions from "../../store/events";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./index.css";

function DeleteEventModal() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const eventId = useSelector(state => state.events.id)
    const [errors, setErrors] = useState([]);
    const history = useHistory();
    const handleSubmitY = (e) => {
        e.preventDefault();

        return dispatch(eventsActions.deleteEvent(eventId))
            .then(closeModal)
            .then(history.push('/deletedevent'))
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
        closeModal()
    }

    return (
        <div className="deletemain">
            <h1 className="loginloginlmao">Confirm Delete</h1>
            {(errors.length >= 1 || Object.values(errors).length >= 1) && <div className="loginerror">Couldn't delete event!</div>}
            <button type="text" className="deletebuttonR" onClick={handleSubmitY}>Yes (Delete Event)</button>
            <button type="text" className="deletebutton" onClick={handleSubmitN}>No (Keep Event)</button>
        </div>
    );
}

export default DeleteEventModal;