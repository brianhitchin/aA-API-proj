import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as groupsActions from "../../store/groups";
import './index.css'

const EditGroup = () => {
    const currgroup = useSelector(state => state.groups)
    const curruser = useSelector(state => state.session.user)
    const { groupId } = useParams()
    const [newName, setNewName] = useState(currgroup.name)
    const [newAbout, setNewAbout] = useState(currgroup.about)
    const [newType, setNewType] = useState(currgroup.type)
    const [newCity, setNewCity] = useState(currgroup.city)
    const [newState, setNewState] = useState(currgroup.state)
    const [newPrivate, setNewPrivate] = useState(currgroup.private)
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        window.scrollTo(0, 0)
        return dispatch(groupsActions.editGroup(groupId, { name: newName, about: newAbout, type: newType, private: newPrivate, city: newCity, state: newState }))
            .then((_res) => history.push(`/groups/${groupId}`))
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
    };

    !curruser && history.push('/')
    curruser?.id !== currgroup.organizerId && history.push('/')
    
    return (
        <div className='overall'>
            <div className="formmaindiv2">
                <ul>
                    {Object.values(errors).map((error, idx) => <li key={idx} className="updateerror">{error}</li>)}
                </ul>
                <div className="toptwo2">
                    <span className="tealme2 toptwodes2">EDIT YOUR GROUP</span>
                    <span className="toptwodes2">What would you like to change?</span>
                    <span className="toptwodes2">Unchanged fields will remain unchanged in the new edited group.</span>
                </div>
                <div className="thevalues">
                    <span className="toptwodes2">What will your group's name be?</span>
                    <label for="groupname"></label>
                    <input type="text" id="groupname" placeholder="New name" className="cginput2"
                        value={newName} onChange={(e) => setNewName(e.target.value)}></input>
                    <span className="toptwodes2">What is your new group description?</span>
                    <label for="groupname"></label>
                    <textarea id="groupname" placeholder="New description" className="cginput2"
                        value={newAbout} onChange={(e) => setNewAbout(e.target.value)}></textarea>
                    <span className="toptwodes2">What is your new group type?</span>
                    <label for="grouptype"></label>
                    <select id="grouptype" value={newType} className="cginput2" onChange={(e) => setNewType(e.target.value)}>
                        <option value="" disabled>(select one)</option>
                        <option value="In person">In person</option>
                        <option value="Online">Online</option>
                    </select>
                    <span className="toptwodes2">Do you want your group to be private?</span>
                    <label for="groupprivate"></label>
                    <select id="groupprivate" value={newPrivate} className="cginput2" onChange={(e) => setNewPrivate(e.target.value)}>
                        <option value="" disabled>(select one)</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                    <span className="toptwodes2">Where is the new city?</span>
                    <label for="groupcity"></label>
                    <input type="text" id="groupcity" placeholder="New city" className="cginput2"
                        value={newCity} onChange={(e) => setNewCity(e.target.value)}></input>
                    <span className="toptwodes2">How about the state?</span>
                    <label for="groupstate"></label>
                    <input type="text" id="groupstate" placeholder="New state" className="cginput2"
                        value={newState} onChange={(e) => setNewState(e.target.value)}></input>
                </div>
                <div className="trycg2">
                    <button className="cgbutton2" onClick={handleSubmit}>Edit group</button>
                </div>
            </div>
        </div>
    )
}

export default EditGroup