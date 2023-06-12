import { useHistory, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AllMembersThunk } from '../../store/membership'
import { initialEvents } from '../../store/events'
import './index.css'
import plz from "./plz.jpg"

const MyRSVP = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const memberstate = useSelector(state => state.membership.all_memberships)
    const userstate = useSelector(state => state.session.user)
    const eventstate = useSelector(state => state.events)
    const [loaded, setLoaded] = useState([])

    useEffect(() => {
        dispatch(AllMembersThunk())
        dispatch(initialEvents())
    }, [])

    useEffect(() => {
        if (memberstate) {
            setLoaded([...Object.values(memberstate)])
        }
    }, [memberstate])

    let filtered = null;
    let fids;
    let fvnt;

    if (loaded.length > 0 && userstate && eventstate.length > 0) {
        filtered = loaded.filter(el => el.userId == userstate.id)
        fids = filtered.map(el => el = el.eventId)
        fvnt = eventstate.filter(el => fids.includes(el.id))
    }

    if (!userstate) { history.push('/') }

    const formatter = (date) => {
        return new Date(date).toDateString();
    }

    return (
        <div className='mainmain'>
            <div className="egtop">
                <div className="egsub">
                    <Link to='/' className="eglinkactive">Home</Link>
                </div>
            </div>
            <h3>My RSVP'd events!</h3>
            <div className='mymember'>
                {loaded.length > 0 && fvnt && fvnt.map((event) => {
                    return (
                        <div className='indivevents2' onClick={() => history.push(`/events/${event.id}`)}>
                            <div className='indiveventsI'>
                                <div className='indiveventimg'>
                                    <img src={(event.previewImage !== "No image yet!" && event.previewImage.includes('http')) ? event.previewImage : plz} alt="" height={"300px"} width={"300px"}></img>
                                </div>
                                <div className='indiveventdetail'>
                                    <span className='indiveventname'>{event.name}</span>
                                    <span className='indiveventtime tealme'>{formatter(event.startDate)} <i class="fa-regular fa-clock"></i></span>
                                    <span className='indiveventloc'>{`Location: ${event.Venue?.city}, ${event.Venue?.state}`}</span>
                                    <span className='indiveventhost'>Hosted by: {event.Group.name}</span>
                                </div>
                            </div>
                            <div className='indiveventdesc'>{event.description}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MyRSVP;