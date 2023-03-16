import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink, useHistory } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react';
import { oneGroup } from '../../store/groups'
import { oneEvent } from '../../store/events';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteEventModal from '../DeleteModal';
import './index.css'

const SingleEvent = () => {

    const { eventId } = useParams();
    const [imgurl, setImgurl] = useState("https://spoiltpig.co.uk/wp-content/plugins/responsive-menu/v4.0.0/assets/images/no-preview.jpeg")
    const [currEvent, setCurrEvent] = useState(null)
    const [currGroup, setCurrGroup] = useState({})
    const [name, setName] = useState("")
    const [ownerId, setOwnerId] = useState(0)
    const [groupPrev, setGroupPrev] = useState("https://spoiltpig.co.uk/wp-content/plugins/responsive-menu/v4.0.0/assets/images/no-preview.jpeg")
    const dispatch = useDispatch();
    const events = useSelector(state => state.events)
    const groups = useSelector(state => state.groups)
    const curruserid2 = useSelector(state => state.session.user)
    const [curruseridstate, setCurruseridstate] = useState(1000000)
    const history = useHistory();
    const ulRef = useRef();
    const [showMenu, setShowMenu] = useState(false);

    const showEdit = false

    useEffect(() => {
        document.title = 'Meetpup!';
    }, []);

    useEffect(() => {
        dispatch(oneEvent(eventId))
    }, [eventId, dispatch])

    useEffect(() => {
        try {
            setCurrEvent(events)
            dispatch(oneGroup(events.groupId))
        } catch (e) {
            setImgurl("https://spoiltpig.co.uk/wp-content/plugins/responsive-menu/v4.0.0/assets/images/no-preview.jpeg")
        }
    }, [events, setCurrEvent])

    useEffect(() => {
        try {
            setCurrGroup(groups)
        } catch (e) {
            setCurrGroup(groups)
        }
    }, [groups])

    useEffect(() => {
        try {
            const fullName = currGroup.Organizer.firstName + " " + currGroup.Organizer.lastName
            setName(fullName)
            setOwnerId(currGroup.Organizer.id)
            setGroupPrev(currGroup.GroupImages[0].url)
            setCurruseridstate(curruserid2.id)
        } catch(e) {
            setName('')
            setOwnerId(0)
        }
    }, [currGroup])

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    const closeMenu = (e) => {
        if (!showMenu) return;
        if (!ulRef.current.contains(e.target)) {
            setShowMenu(false);
        }
    };

    events.EventImages?.length >= 1 && imgurl === "https://spoiltpig.co.uk/wp-content/plugins/responsive-menu/v4.0.0/assets/images/no-preview.jpeg" && setImgurl(events.EventImages[0].url)
    curruserid2 && !Object.values(curruserid2) && history.push('/')
    

    useEffect(() => {
        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, [closeMenu]);

    return (
        <div className="singleeventmain">
            <div className='eventsum'>
                <div className="eventsnav">
                    <NavLink to={'/events'}>{"< Events"}</NavLink>
                    <h1>{currEvent && currEvent.name}</h1>
                    <h3 className="greyme">{currEvent && currEvent.Group ? `Hosted by ${name}` : ``}</h3>
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
                                <h4>{currEvent && currGroup.name}</h4>
                                <span>{currEvent && currGroup.private ? "Private" : "Public"}</span>
                            </div>
                        </div>
                        <div className="eventtopbottom">
                            <div className="timeholder">
                                <div className="timeholderinnerL"><i class="fa-regular fa-clock"></i></div>
                                <div className="timeholderinnerM">
                                    <div>·</div>
                                    <div>·</div>
                                </div>
                                <div className="timeholderinnerR">
                                    <div className="timeholderinnerRinner">
                                        <div className="wtfgray vcxz">START</div>
                                        <div className="tealme vcxz">{currEvent && currEvent?.startDate ? currEvent.startDate.slice(0, 10) + " · " + currEvent.startDate.slice(11, currEvent.startDate.length - 1) : ""}</div>
                                    </div>
                                    <div className="timeholderinnerRinner">
                                        <div className="wtfgray vcxz">END</div>
                                        <div className="tealme vcxz">{currEvent && currEvent?.endDate ? currEvent.endDate.slice(0, 10) + " · " + currEvent.endDate.slice(11, currEvent.endDate.length - 1) : ""}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="timeholder">
                                <div className="timeholderinnerL">
                                    <i class="fa-solid fa-money-bill"></i>
                                </div>
                                {currEvent &&
                                    <div className='timeholderinnerR toomuchcss wtfgray'>
                                        {(currEvent?.price === 0) ? 'FREE' : `$${currEvent.price}`}
                                    </div>
                                }
                            </div>
                            <div className="timeholder">
                                <div className="timeholderinnerL">
                                    <i class="fa-solid fa-map-pin"></i>
                                </div>
                                <div className='timeholderinnerRnC toomuchcss wtfgray'>
                                    {`${currEvent?.type}`}
                                    {curruseridstate && curruseridstate === ownerId &&
                                        <div className="delbuttonholder">
                                            <button className="deletesignup">Update</button>
                                            <OpenModalMenuItem
                                                itemText="Delete"
                                                onItemClick={closeMenu}
                                                modalComponent={<DeleteEventModal />}
                                            /></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='graysection2'>
                    <h1>Details</h1>
                    {currEvent && <p>{currEvent.description}</p>}
                </div>
            </div>
        </div >
    )
}

export default SingleEvent