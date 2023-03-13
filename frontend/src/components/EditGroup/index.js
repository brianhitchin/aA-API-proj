import { useState } from 'react'
import * as groupsActions from "../../store/groups";
import './index.css'

const EditGroup = ({ group: { name, about, type, city, state}, privacy }) => {
    const [newName, setNewName] = useState(name)
    const [newAbout, setNewAbout] = useState(about)
    const [newType, setNewType] = useState(type)
    const [newCity, setNewCity] = useState(city)
    const [newState, setNewState] = useState(state)
    const [newPrivate, setNewPrivate] = useState(privacy)
    const [errors, setErrors] = useState([]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        alert('clicked')
    };

    return (
        <div className="formmaindiv2">
            <ul>
                {Object.values(errors).map((error, idx) => <li key={idx} className="updateerror">{error}</li>)}
            </ul>
            <div className="toptwo2">
                <span className="tealme2 toptwodes2">EDIT YOUR GROUP</span>
                <span className="toptwodes2">What would you like to change?</span>
                <span className="toptwodes2">Leave any field blank to leave it unchanged.</span>
            </div>
            <div className="thevalues">
                <span className="toptwodes2">What will your group's name be?</span>
                <label for="groupname"></label>
                <input type="text" id="groupname" placeholder={name} className="cginput2"
                        value={newName} onChange={(e) => setNewName(e.target.value)}></input>
                <span className="toptwodes2">What is your new group description?</span>
                <label for="groupname"></label>
                <textarea id="groupname" placeholder={about} className="cginput2"
                        value={newAbout} onChange={(e) => setNewAbout(e.target.value)}></textarea>
                <span className="toptwodes2">What is your new group type?</span>
                <label for="grouptype"></label>
                <select id="grouptype" value={newType} className="cginput2" onChange={(e) => setNewType(e.target.value)}>
                    <option value="" disabled>(select one)</option>
                    <option value="In person">In person</option>
                    <option value="Online">Online</option>
                </select>
                <label for="grouptype">Do you want your group to be private?</label>
                <select id="groupprivate" value={newPrivate} className="cginput2" onChange={(e) => setNewPrivate(e.target.value)}>
                    <option value="" disabled>(select one)</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </select>
                <span className="toptwodes2">Where is the new city?</span>
                <label for="groupcity"></label>
                <input type="text" id="groupcity" placeholder={city} className="cginput2"
                        value={newCity} onChange={(e) => setNewCity(e.target.value)}></input>
                <span className="toptwodes2">How about the state?</span>
                <label for="groupstate"></label>
                <input type="text" id="groupstate" placeholder={state} className="cginput2"
                        value={newState} onChange={(e) => setNewState(e.target.value)}></input>
            </div>
            <div className="trycg2">
                <button className="cgbutton2" onClick={handleSubmit}>Edit group</button>
            </div>
        </div>
    )
}

export default EditGroup