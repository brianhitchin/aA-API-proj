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
    const [currGroup, setCurrGroup] = useState({})
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
            setCurrGroup(groups)
        } catch (e) {
            setCurrGroup({})
        }
    }, [groups])

    useEffect(() => {
        try {
            const fullName = currGroup.Organizer.firstName + " " + currGroup.Organizer.lastName
            setName(fullName)
            setOwnerId(currGroup.Organizer.id)
            setGroupPrev(currGroup.GroupImages[0].url)
        } catch {
            setName('')
            setOwnerId(0)
        }
    }, [currGroup])

    console.log('cuser, owner', curruser, ownerId)

    return (
        <div className="singleeventmain">
            <div className='eventsum'>
                <div className="eventsnav">
                    <NavLink to={'/events'}>{"< Events"}</NavLink>
                    <h1>{currEvent.name}</h1>
                    <h3 className="greyme">{currEvent.Group ? `Hosted by ${name}` : ``}</h3>
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
                                <h4>{currGroup.name}</h4>
                                <span>{currGroup.private ? "Private" : "Public"}</span>
                            </div>
                        </div>
                        <div className="eventtopbottom">
                            <div className="timeholder">
                                <div className="timeholderinnerL"><i class="fa-regular fa-clock"></i></div>
                                <div className="timeholderinnerR">
                                    <div className="timeholderinnerRinner">
                                        <div className="wtfgray vcxz">START</div>
                                        <div className="tealme vcxz">{currEvent?.startDate}</div>
                                    </div>
                                    <div className="timeholderinnerRinner">
                                        <div className="wtfgray vcxz">END</div>
                                        <div className="tealme vcxz">{currEvent?.endDate}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="timeholder">
                                <div className="timeholderinnerL">
                                    <i class="fa-solid fa-money-bill"></i>
                                </div>
                                <div className='timeholderinnerR toomuchcss wtfgray'>
                                    {(currEvent.price !== undefined) && (currEvent.price === 0) ? 'FREE' : `$${currEvent.price}`}
                                </div>
                            </div>
                            <div className="timeholder">
                                <div className="timeholderinnerL">
                                    <i class="fa-solid fa-map-pin"></i>
                                </div>
                                <div className='timeholderinnerR toomuchcss wtfgray'>
                                    {`${currEvent?.type}`}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <h1>Details</h1>
                {curruser && curruser.id === ownerId && <div>Plz</div>}
                <p>{currEvent.description}</p>
            </div>
        </div >
    )
}

export default SingleEvent