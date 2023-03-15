import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink, useHistory } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react';
import { oneGroup, deleteGroup } from '../../store/groups';
import { oneGroupEvent } from '../../store/events';
import DeleteGroupModal from '../DeleteModalG';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import './index.css'

const SingleGroup = () => {

    const sorry = "../../sorry.png"
    const { groupId } = useParams();
    const [imgurl, setImgurl] = useState(sorry)
    const [currGroup, setCurrGroup] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [loggedin, setLoggedin] = useState(false)
    const [oner, setOner] = useState(null)
    const [showEdit, setShowEdit] = useState(false)
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups)
    const curruser = useSelector(state => state.session.user)
    const history = useHistory();
    const ulRef = useRef();
    const [showMenu, setShowMenu] = useState(false);
    const groupevents = useSelector(state => state.events)

    useEffect(() => {
        dispatch(oneGroup(groupId))
    }, [groupId, dispatch])

    useEffect(() => {
        try {
            setCurrGroup(group)
            setShowEdit(false)
        } catch (e) {
            setImgurl(sorry)
        }
    }, [group])

    useEffect(() => {
        try {
            setImgurl(group.GroupImages[0].url)
            setOner(group.organizerId)
            dispatch(oneGroupEvent(groupId))
        } catch (e) {
            setImgurl(sorry)
        }
    }, [currGroup])

    useEffect(() => {
        try {
            if (Object.values(curruser)) setLoggedin(true)
        } catch (e) {
            setLoggedin(false)
        }
    }, [curruser])

    const deletehandler = (e) => {
        e.preventDefault();
        setConfirm(!confirm)
    }

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

    useEffect(() => {
        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, [closeMenu]);

    const rightformat = (startDate) => {
        const splitted = startDate.split('T')
        const fixed = splitted[1].substring(0, splitted[1].length-1)
        return `${splitted[0]} · ${fixed}`
    }

    return (
        <div className="singlegroupmain">
            <div className='groupsum'>
                <div className="groupnav">
                    <NavLink to={'/groups'}>{"< Groups"}</NavLink>
                </div>
                <div className="groupov">
                    <div className="imgholder">
                        <img src={imgurl}
                            className="groupovimg" alt="">
                        </img>
                    </div>
                    <div className="groupdt">
                        <h2 className="groupname">{currGroup.name}</h2>
                        <h3 className="greyme">{`${currGroup.city}, ${currGroup.state}`}</h3>
                        <h3 className="greyme">{currGroup.Organizer ? `Organizer: ${currGroup.Organizer.firstName} ${currGroup.Organizer.lastName}` : ``}</h3>
                        <div className="pubeveholder">
                            <h3 className="greymep">{Object.values(groupevents) ? Object.values(groupevents).length : "0"}</h3>
                            <h3 className="greymep">{" events"}</h3>
                            <h3 className="boldmep">·</h3>
                            <h3 className="greymep">{currGroup.private === true ? "Private" : "Public"}</h3>
                        </div>
                        {loggedin && oner && oner === curruser.id &&
                            <div className="gobot2">
                                <button className="sgowneropt" onClick={() => history.push(`/groups/${groupId}/events/new`)}>Create event</button>
                                <button className="sgowneropt" onClick={() => history.push(`/groups/${groupId}/edit`)}>Update</button>
                                <button className="sgowneropt" onClick={deletehandler}>{confirm ? "Undo" : "Delete"}</button>
                                {confirm && <div className="sgowneropt"><OpenModalMenuItem
                                    itemText="Delete Group"
                                    onItemClick={closeMenu}
                                    modalComponent={<DeleteGroupModal />}></OpenModalMenuItem></div>}
                            </div>}
                        {loggedin && oner && oner !== curruser.id &&
                            <div class="gobot"><button className="groupbutton" onClick={() => alert('Feature coming soon...')}>
                                Join this group</button></div>}
                    </div>
                </div>
                <div className="graysection">
                    <div className="grayinner">
                        <h2 className="greymeintro">{currGroup.Organizer ? `Organized by: ${currGroup.Organizer.firstName} ${currGroup.Organizer.lastName}` : ``}</h2>
                        <h2>What we're about</h2>
                        <p className="grayabout">{currGroup.about}</p>
                        <h2>{`Upcoming events (${Object.values(groupevents) ? Object.values(groupevents).length : '0'})`}</h2>
                        <div className='eventholder'>
                            {Object.values(groupevents) && Object.values(groupevents).map((el) => {
                                return (
                                    <div className='indiveventholder' onClick={() => history.push(`/events/${el.id}`)}>
                                        <div className='indiveventtop'>
                                            <div className='indiveventtopimgholder'>
                                                <img src={el.previewImage} alt=''></img>
                                            </div>
                                            <div className='indiveventtoprest'>
                                                <div className='tealme megabold'>{rightformat(el.startDate)}</div>
                                                <h4 className='topresttitle'>{el.name}</h4>
                                                <div className='greyme'>{`${el.Venue?.city}, ${el.Venue?.state}`}</div>
                                            </div>
                                        </div>
                                        <div className='indiveventbot'>{el.description}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleGroup