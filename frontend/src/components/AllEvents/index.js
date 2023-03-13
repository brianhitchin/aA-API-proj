import { NavLink, useHistory, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initialEvents } from '../../store/events'
import './index.css'

const AllEvents = () => {
    const events = useSelector(state => state.events)
    const dispatch = useDispatch();
    const history = useHistory();

    const sorry = "https://cdn.maikoapp.com/3d4b/4qs2p/200.png"

    useEffect(() => {
        dispatch(initialEvents())
    }, [dispatch])

    ///event.startDate, name, .Venue ? .city, .state : null, .previewImage, hosted by: groupid (maybe navigate there)

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
                {Object.values(events).map((event) => {
                    return (
                        <div className='indivevents' onClick={() => history.push(`/events/${event.id}`)}>
                            <div className='indiveventimg'>
                                <img src={(event.previewImage && event.previewImage.includes('/')) ? event.previewImage : { sorry }} alt="" height={"300px"} width={"300px"}></img>
                            </div>
                            <div className='indiveventdetail'>
                                <span className='indiveventname'>{event.name}</span>
                                <span className='indiveventtime tealme'>{event.startDate}<i class="fa-regular fa-clock"></i></span>
                                <span className='indiveventloc'>{event.Venue !== 'null' ? `Location: ${event.Venue.city}, ${event.Venue.state}` : "Location not set yet!"}</span>
                                <span className='indiveventhost'>Hosted by: {<Link to={`/groups/${event.groupId}`}>{event.Group.name}</Link>}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default AllEvents