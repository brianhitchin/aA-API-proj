import { NavLink, useHistory, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initialEvents } from '../../store/events'
import './index.css'

const AllEvents = () => {
    const events = useSelector(state => state.events)
    const [eventlist, setEventlist] = useState({})
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(initialEvents())
    }, [dispatch])

    useEffect(() => {
        try {
            setEventlist(events)
        } catch(e) {
            setEventlist({})
        }
    }, [events])

    const formatter = (date) => {
        return new Date(date).toDateString();
    }

    return (
        <>
            <div className="egtop">
                <div className="egsub">
                    <NavLink to='/events' activeClassName="eglinkactive" className="eglink">Events</NavLink>
                    <NavLink to='/groups' activeClassName="eglinkactive" className="eglink">Groups</NavLink>
                </div>
            </div>
            <div className="eventsmaindiv">
                <span className="egsubp">Events on MeetPup</span>
                {Array.isArray(eventlist) && eventlist.map((event) => {
                    return (
                        <div className='indivevents' onClick={() => history.push(`/events/${event.id}`)}>
                            <div className='indiveventimg'>
                                <img src={(event.previewImage !== "No image yet!" && event.previewImage.includes('http')) ? event.previewImage : "../../sorry.png"} alt="" height={"300px"} width={"300px"}></img>
                            </div>
                            <div className='indiveventdetail'>
                                <span className='indiveventname'>{event.name}</span>
                                <span className='indiveventtime tealme'>{formatter(event.startDate)} <i class="fa-regular fa-clock"></i></span>
                                <span className='indiveventloc'>{`Location: ${event.Venue?.city}, ${event.Venue?.state}`}</span>
                                <span className='indiveventhost'>Hosted by: {event.Group.name}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default AllEvents