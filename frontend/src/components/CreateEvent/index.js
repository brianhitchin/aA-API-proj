import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as eventsActions from "../../store/events";
import './index.css'

const CreateEvent = () => {

    const thisgroup = useSelector(state => state.groups)
    const [name, setName] = useState(null)
    const [description, setDescription] = useState(null)
    const [startDate, setStartdate] = useState(null)
    const [endDate, setEnddate] = useState(null)
    const [type, setType] = useState(null)
    const [price, setPrice] = useState(null)
    const [imgUrl, setImgUrl] = useState("")
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        window.scrollTo(0, 0)
        if (name && description && type && price && startDate && endDate) {
            const newstartDate = new Date(startDate)
            const newendDate = new Date(endDate)
                if (newstartDate <= newendDate) { 
                    return dispatch(eventsActions.create(thisgroup.id, { venueId: 1, capacity: 20, name, description, type, price: price.startsWith('0') ? parseInt(price.slice(1)) : parseInt(price), startDate: new Date(startDate), endDate: new Date(endDate) }))
                        .then((res) => history.push(`/events/${res}`))
                        .catch(
                            async (res) => {
                                alert('error!')
                                console.log(res)
                            }
                        );
                } else {
                    setErrors([]);
                    setErrors(['Start date cannot be before the end date.'])
                }
        } else {
            setErrors([]);
            setErrors(['There cannot be an empty field.'])
        }
    }

    return (
        <div className="formmaindiv">
            <ul>
                {Object.values(errors).map((error, idx) => <li key={idx} className="signuperror">{error}{idx}</li>)}
            </ul>
            <div className="grouploc">
                <h2 className="groupmsg bb">{`Create an event for ${thisgroup.name}`}</h2>
                <span className="groupmsg">What is the name of your event?</span>
                <label for="name"></label>
                <input type="text" id="name" placeholder="Event name" className="cginput"
                    value={name} onChange={(e) => setName(e.target.value)}></input>
                <span className="groupmsg">Is this an in person or online event?</span>
                <label for="type"></label>
                <select id="type" value={type} className="cginput" onChange={(e) => setType(e.target.value)}>
                    <option value="" disabled>(select one)</option>
                    <option value="In Person">In Person</option>
                    <option value="Online">Online</option>
                </select>
                <span className="groupmsg">What is the price for your event?</span>
                <label for="price"></label>
                <input type="text" id="start" placeholder="$$" className="cginput"
                    value={price} onChange={(e) => setPrice(e.target.value)}></input>
                <span className="groupmsg">When does your event start?</span>
                <label for="start"></label>
                <input type="text" id="start" placeholder="MM/DD/YYYY, HH/mm AM" className="cginput"
                    value={startDate} onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} onChange={(e) => setStartdate(e.target.value)}></input>
                <span className="groupmsg">When does your event end?</span>
                <label for="end"></label>
                <input type="text" id="end" placeholder="MM/DD/YYYY, HH/mm PM" className="cginput"
                    value={endDate} onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} onChange={(e) => setEnddate(e.target.value)}></input>
                <span className="groupmsg">Please add an image url for your event below.</span>
                <label for="imageurl"></label>
                <input type="text" id="imageurl" placeholder="Image URL" className="cginput"
                    value={imgUrl} onChange={(e) => setImgUrl(e.target.value)}></input>
                <span className="groupmsg">Please describe your event.</span>
                <label for="descr"></label>
                <textarea id="descr" placeholder="Please include at least 30 characters." className="cginput textbox"
                    value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div className="trycg">
                <button className="cgbutton" onClick={handleSubmit}>Create Event</button>
            </div>
        </div>
    )
}

export default CreateEvent