import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as groupsActions from "../../store/groups";
import './index.css'

const CreateGroup = () => {
    const groups = useSelector(state => state.groups)
    const [location, setLocation] = useState('')
    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
    const [url, setUrl] = useState('')
    const [type, setType] = useState('')
    const [priorpub, setPriorpub] = useState(true)
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        const [city, state] = location.split(', ')
        window.scrollTo(0, 0)
        if (url) {
        return dispatch(groupsActions.create({ name, about, type, private: priorpub, city, state, url }))
            .then((res) => history.push(`/groups/${res}`))
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
        } else {
            return dispatch(groupsActions.create({ name, about, type, private: priorpub, city, state, url: "https://spoiltpig.co.uk/wp-content/plugins/responsive-menu/v4.0.0/assets/images/no-preview.jpeg" }))
            .then((res) => history.push(`/groups/${res}`))
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
        }
    };

    return (
        <div className="formmaindiv">
            <ul>
                {Object.values(errors).map((error, idx) => <li key={idx} className="signuperror">{error}</li>)}
            </ul>
            <div className="toptwo">
                <span className="tealme toptwodes">BECOME AN ORGANIZER</span>
                <span className="toptwodes">We'll walk you through a few steps to build your local community</span>
            </div>
            <div className="grouploc">
                <span className="toptwodes">First, set your group's location.</span>
                <span className="groupmsg">MeetPup groupos meet locally, in person and online.</span>
                <span className="groupmsg">We'll connect you to pups in your area! And more to follow!</span>
                <label for="location">
                    <input type="text" id="location" placeholder="City, STATE" className="cginput"
                        value={location} onChange={(e) => setLocation(e.target.value)}></input>
                </label>
            </div>
            <div className="grouploc">
                <span className="toptwodes">What will your group's name be?</span>
                <span className="groupmsg">Choose a name that will give people a clear idea of what the group is about.</span>
                <span className="groupmsg">With MeetPup Pro, you can change the group name for free once a year.</span>
                <label for="groupname">
                    <input type="text" id="groupname" placeholder="What is your group name?" className="cginput"
                        value={name} onChange={(e) => setName(e.target.value)}></input>
                </label>
            </div>
            <div className="grouploc">
                <span className="toptwodes">Now describe what your group will be about</span>
                <span className="groupmsg">Everyone can see this! You can edit this later, too.</span>
                <span className="groupmsg">Here's a general guideline: </span>
                <span className="groupmsg wb">1. What's the purpose of the group?</span>
                <span className="groupmsg">2. Who should join? </span>
                <span className="groupmsg">3. Why do you like dogs?? </span>
                <label for="groupabout">
                    <textarea id="groupabout" placeholder="Be creative!" className="cginput textbox"
                        value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
                </label>
            </div>
            <div className="grouploc">
                <span className="toptwodes">Final steps...</span>
                <span className="groupmsg">Is this an in person or online group?</span>
                <label for="grouptype"></label>
                <select name="pets" id="grouptype" value={type} className="cginput" onChange={(e) => setType(e.target.value)}>
                    <option value="" disabled>(select one)</option>
                    <option value="In person">In person</option>
                    <option value="Online">Online</option>
                </select>
                <span className="groupmsgwb">Is this group private or public?</span>
                <label for="groupprivate"></label>
                <select name="private" id="groupprivate" value={priorpub} className="cginput" onChange={(e) => setPriorpub(e.target.value)}>
                    <option value="" disabled>(select one)</option>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>
                <span className="groupmsg wb">Please add an image url for your group below:</span>
                <label for="groupurl">
                    <input type="text" id="groupurl" placeholder="Optional, leave blank if no suitable image." className="cginput"
                        value={url} onChange={(e) => setUrl(e.target.value)}></input>
                </label>
            </div>
            <div className="trycg">
                <button className="cgbutton" onClick={handleSubmit}>Create group</button>
            </div>
        </div>
    )
}

export default CreateGroup