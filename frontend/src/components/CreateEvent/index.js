import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as groupsActions from "../../store/groups";
import './index.css'

const CreateEvent = ({ name }) => {

    const [venueId, setLocation] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartdate] = useState('')
    const [endDate, setEnddate] = useState('')
    const [type, setType] = useState('')
    const [price, setPrice] = useState(0)
    const [capacity, setCapacity] = useState(0)
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('click')
    }

    return (
        <div className="formmaindiv">
            <ul>
                {Object.values(errors).map((error, idx) => <li key={idx} className="signuperror">{error}</li>)}
            </ul>
            <div className="grouploc">
                <span className="toptwodes">{`Create an event for ${name}`}</span>
                <span className="groupms">What is the name of your event?</span>
                <label for="name"></label>
                <input type="text" id="name" placeholder="Event name" className="cginput bb"
                    value={name} onChange={(e) => setName(e.target.value)}></input>
                <span className="groupmsg">Is this an in person or online event?</span>
                <label for="type"></label>
                <select id="type" value={type} className="cginput" onChange={(e) => setType(e.target.value)}>
                    <option value="" disabled>(select one)</option>
                    <option value="In Person">In Person</option>
                    <option value="Online">Online</option>
                </select>
            </div>
            <div className="trycg">
                <button className="cgbutton" onClick={handleSubmit}>Create Event</button>
            </div>
        </div>
    )
}

export default CreateEvent