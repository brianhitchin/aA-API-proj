import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink, useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { oneGroup } from '../../store/groups'
import { oneEvent } from '../../store/events';
import './index.css'

const SingleEvent = () => {

    const { eventId } = useParams();
    const [imgurl, setImgurl] = useState("https://spoiltpig.co.uk/wp-content/plugins/responsive-menu/v4.0.0/assets/images/no-preview.jpeg")
    const [currEvent, setCurrEvent] = useState({})
    const [name, setName] = useState("")
    const [ownerId, setOwnerId] = useState(0)
    const [groupPrev, setGroupPrev] = useState("https://spoiltpig.co.uk/wp-content/plugins/responsive-menu/v4.0.0/assets/images/no-preview.jpeg")
    const dispatch = useDispatch();
    const events = useSelector(state => state.events)
    const groups = useSelector(state => state.groups)
    const curruser = useSelector(state => state.session)
    const history = useHistory();

    const showEdit = false

    useEffect(() => {
        dispatch(oneEvent(eventId))
    }, [eventId, dispatch])

    useEffect(() => {
        try {
            setCurrEvent(events)
            setImgurl(events.EventImages[0].url)
            dispatch(oneGroup(events.groupId))
        } catch (e) {
            setImgurl("https://spoiltpig.co.uk/wp-content/plugins/responsive-menu/v4.0.0/assets/images/no-preview.jpeg")
        }
    }, [events, setCurrEvent, setImgurl])

    useEffect(() => {
        try {
            const fullName = groups.Organizer.firstName + " " + groups.Organizer.lastName
            setName(fullName)
            setOwnerId(groups.Organizer.id)
            setGroupPrev(groups.EventImages[0].url)
        } catch (e) {
            setName('')
            setOwnerId(0)
        }
    }, [groups])

    return (
        <div className="singleeventmain">
            <div className='eventsum'>
                <div className="eventsnav">
                    <NavLink to={'/events'}>{"< Events"}</NavLink>
                    <h1>{currEvent.name}</h1>
                    <h3 className="greyme">{currEvent.Group ? `Hosted by: ${currEvent.Group.name}, by ${name}` : ``}</h3>
                </div>
                <div className="eventov">
                    <div className="imgholder">
                        <img src={imgurl} className="eventovimg" alt=""></img>
                    </div>
                    <div className="eventright">
                        <div className="eventtoptop">
                            <div className='eventtoptopleft'>
                                <img src={groupPrev} className='eventtoptopleftimage' alt=""></img>
                            </div>
                            <div className='eventtoptopright'>
                                {Array.isArray(groups) &&
                                    <>
                                        <h3>{groups.name}</h3>
                                        <span>{groups.about}</span>
                                    </>}
                            </div>
                        </div>
                        <div className="eventtopbottom">
                            <div className="timeholder">
                                <div className="timeholderinnerL"><i class="fa-regular fa-clock"></i></div>
                                <div className="timeholderinnerR">
                                    <div>
                                        <div className="wtfgray">START</div>
                                        <div className="tealme">{currEvent.startDate}</div>
                                    </div>
                                    <div>
                                        <div className="wtfgray">END</div>
                                        <div className="tealme">{currEvent.endDate}</div>
                                    </div>
                                </div>
                            </div>
                            <span><i class="fa-solid fa-square-dollar"></i>{` ${currEvent.Venue.address}, ${currEvent.Venue.city}, ${currEvent.Venue.state}`}</span>
                            <span><i class="fa-solid fa-map-pin"></i>{` ${currEvent.type}`}</span>
                            {curruser && curruser.id === ownerId && <div>Plz</div>}
                        </div>
                    </div>
                </div>
                <h1>Details</h1>
                <p>{currEvent.description}</p>
            </div>
        </div>
    )
}

export default SingleEvent