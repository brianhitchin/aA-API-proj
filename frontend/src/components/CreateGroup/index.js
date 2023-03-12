import { useState } from 'react'
import './index.css'

const CreateGroup = () => {
    const [location, setLocation] = useState('')
    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
    return (
        <div className="formmaindiv">
            <div className="toptwo">
                <span className="tealme toptwodes">BECOME AN ORGANIZER</span>
                <span className="toptwodes">We'll walk you through a few steps to build your local community</span>
            </div>
            <div className="grouploc">
                <span className="toptwodes">First, set your group's location.</span>
                <span className="groupmsg">MeetPup groupos meet locally, in person and online.</span>
                <span className="groupmsg">We'll connect you to pups in your area! And more follow!</span>
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
                    <textarea id="groupabout" placeholder="Be creative!" className="cginput"
                    value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
                </label>
            </div>
        </div>
    )
}

export default CreateGroup