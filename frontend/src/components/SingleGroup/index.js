import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink, useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { oneGroup, deleteGroup } from '../../store/groups';
import EditGroup from '../EditGroup';
import './index.css'

const SingleGroup = () => {
    const { groupId } = useParams();
    const [imgurl, setImgurl] = useState("http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/back05.jpg")
    const [currGroup, setCurrGroup] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [clicked, setClicked] = useState(false)
    const [oner, setOner] = useState(null)
    const [showEdit, setShowEdit] = useState(false)
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups)
    const curruser = useSelector(state => state.session)
    const history = useHistory();

    useEffect(() => {
        dispatch(oneGroup(groupId))
    }, [groupId, dispatch])

    useEffect(() => {
        setCurrGroup(group)
        setShowEdit(false)
    }, [group, setOner])

    useEffect(() => {
        try {
            setImgurl(group.GroupImages[0].url)
            setOner(group.organizerId)
        } catch (e) {
            console.log('idk what else to do')
        }
    }, [currGroup])

    const deletehandler = (e) => {
        e.preventDefault();
        setConfirm(!confirm)
    }

    const realdeletehandler = (e) => {
        e.preventDefault();
        dispatch(deleteGroup(groupId))
        history.push('/deletedgroup')
    }

    return (
        <div className="singlegroupmain">
            <div className='groupsum'>
                <div className="groupnav">
                    <NavLink to={'/groups'}>Groups</NavLink>
                </div>
                {showEdit && <div className="formholder">
                    <EditGroup group={group} privacy={currGroup.private} id={groupId} />
                    <button onClick={() => setShowEdit(false)} className="groupbuttonns">X</button>
                    </div>}
                <div className="groupov">
                    <div className="imgholder">
                        <img src={imgurl}
                            className="groupovimg" alt="">
                        </img>
                    </div>
                    <div className="groupdt">
                        <h1>{currGroup.name}</h1>
                        <h3 className="greyme">{`${currGroup.city}, ${currGroup.state}`}</h3>
                        <h3 className="greyme">{currGroup.Organizer ? `Organizer: ${currGroup.Organizer.firstName} ${currGroup.Organizer.lastName}` : ``}</h3>
                        <h3 className="greyme">{currGroup.private === true ? "Private" : "Public"}</h3>
                        {curruser.user && oner && oner === curruser.user.id ?
                            <div className='gobot2'>
                                <button className="sgowneropt" onClick={() => setClicked(!clicked)}>{clicked ? "Coming soon!" : "Create event"}</button>
                                <button className="sgowneropt" onClick={() => setShowEdit(!showEdit)}>Update</button>
                                <button className="sgowneropt" onClick={deletehandler}>Delete</button>
                                {confirm && <button className="sgowneroptc" onClick={realdeletehandler}>Are you sure?</button>}
                            </div> :
                            <div class="gobot"><button className="groupbutton" onClick={() => alert('Feature coming soon...')}>
                                Join this group</button></div>}
                    </div>
                </div>
                <div className="graysection">
                    <div className="grayinner">
                        <h1 className="greymeintro">{currGroup.Organizer ? `Organizer: ${currGroup.Organizer.firstName} ${currGroup.Organizer.lastName}` : ``}</h1>
                        <h1>What we're about</h1>
                        <p className="grayabout">{currGroup.about}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleGroup