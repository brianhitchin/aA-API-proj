import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as groupsActions from "../../store/groups";
import './index.css'

const CreateGroup = () => {


    useEffect(() => {
        document.title = 'Start a New Group';
    }, []);

    const [location, setLocation] = useState(null)
    const [name, setName] = useState(null)
    const [about, setAbout] = useState(null)
    const [url, setUrl] = useState(null)
    const [type, setType] = useState(null)
    const [priorpub, setPriorpub] = useState(null)
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        window.scrollTo(0, 0)
        if (location && name && about && type && priorpub && about?.length >= 30) {
            try {
                const [city, state] = location.split(',')
                if (state.startsWith(' ')) { state.slice(1) }
                if (city && state) {
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
                }
            } catch (e) {
                setErrors([])
                setErrors(["There needs to be a comma in location."])
                window.scrollTo(0, 0)
            }
        } else {
            if (about?.length < 30) {
                setErrors([])
                setErrors(["Description needs to be more than 30 characters."])
                window.scrollTo(0, 0)
            } else {
                setErrors([])
                setErrors(["There cannot be an empty field."])
                window.scrollTo(0, 0)
            }
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
                <span className="groupmsg">MeetPup groups meet locally, in person and online.</span>
                <span className="groupmsg">We'll connect you to pups in your area!</span>
                <label for="location"></label>
                <input type="text" id="location" placeholder="City, STATE" className="cginput"
                    value={location} onChange={(e) => setLocation(e.target.value)}></input>
            </div>
            <div className="grouploc">
                <span className="toptwodes">What will your group's name be?</span>
                <span className="groupmsg">Choose a name that will give people a clear idea of what the group is about.</span>
                <span className="groupmsg">Feel free to get creative! You can edit this later if you change your mind.</span>
                <label for="groupname">
                    <input type="text" id="groupname" placeholder="What is your group name?" className="cginput"
                        value={name} onChange={(e) => setName(e.target.value)}></input>
                </label>
            </div>
            <div className="grouploc">
                <span className="toptwodes">Describe the purpose of your group.</span>
                <span className="groupmsg">People will see this when we promote your group, but you'll be able to add to it later, too.</span>
                <span className="groupmsg">Here's a general guideline: </span>
                <span className="groupmsg wb">1. What's the purpose of the group? </span>
                <span className="groupmsg">2. Who should join? </span>
                <span className="groupmsg">3. What will you do at your events?</span>
                <label for="groupabout">
                    <textarea id="groupabout" placeholder="Please write at least 30 characters." className="cginput textbox"
                        value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
                </label>
            </div>
            <div className="grouploc">
                <span className="toptwodes">Final steps...</span>
                <span className="groupmsg">Is this an in person or online group?</span>
                <label for="grouptype"></label>
                <select name="pets" id="grouptype" value={type} className="cginput" onChange={(e) => setType(e.target.value)}>
                    <option value="" disabled selected>(select one)</option>
                    <option value="In person">In person</option>
                    <option value="Online">Online</option>
                </select>
                <span className="groupmsgwb">Is this group private or public?</span>
                <label for="groupprivate"></label>
                <select name="private" id="groupprivate" value={priorpub} className="cginput" onChange={(e) => setPriorpub(e.target.value)}>
                    <option value="" disabled selected>(select one)</option>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>
                <span className="groupmsg wb">Please add an image url for your group below:</span>
                <span className="groupmsgwb">This works. Try it!</span>
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