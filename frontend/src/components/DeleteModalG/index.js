import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom"
import * as groupsActions from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./index.css";

function DeleteGroupModal() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const groupId = useSelector(state => state.groups.id)
    const [errors, setErrors] = useState([]);
    const history = useHistory();

    const handleSubmitY = (e) => {
        e.preventDefault();
        return dispatch(groupsActions.deleteGroup(groupId))
            .then(closeModal)
            .then(history.push('/deletedgroup'))
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
            {(errors.length >= 1 || Object.values(errors).length >= 1) && <div className="loginerror">Couldn't delete group!</div>}
            <button type="text" className="deletebuttonR" onClick={handleSubmitY}>Yes (Delete Group)</button>
            <button type="text" className="deletebutton" onClick={handleSubmitN}>No (Keep Group)</button>
        </div>
    );
}

export default DeleteGroupModal