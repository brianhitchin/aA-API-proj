import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { oneGroup } from '../../store/groups';
import './index.css'

const SingleGroup = () => {
    const { groupId } = useParams();
    const [imgurl, setImgurl] = useState("http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/back05.jpg")
    const [currGroup, setCurrGroup] = useState(false)
    const [oner, setOner] = useState(null)
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups)
    const curruser = useSelector(state => state.session)

    useEffect(() => {
        dispatch(oneGroup(groupId))
    }, [groupId, dispatch])

    useEffect(() => {
        if (Object.entries(group)[0][0] === 'id') {
            setCurrGroup(group)
        }
    }, [group, setOner])

    useEffect(() => {
        try {
            setImgurl(group.GroupImages[0].url)
            setOner(group.organizerId)
        } catch(e) {
            setCurrGroup(false)
        }
    }, [currGroup, group])

    return (
        <div className="singlegroupmain">
            <div className='groupsum'>
                <div className="groupnav">
                    <NavLink to={'/groups'}>Groups</NavLink>
                </div>
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
                        {oner && oner === curruser.user.id ? 
                        <div className='gobot'><span>Create event</span><span>Update</span><span>Delete</span></div> : 
                        <div class="gobot"><button className="groupbutton" onClick={() => alert('Feature coming soon...')}>Join this group</button></div>}
                    </div>
                </div>
                <div className="graysection">
                    <div className="grayinner">
                        <h1>Organizer</h1>
                        <h3 className="greymeintro">{currGroup.Organizer ? `Organizer: ${currGroup.Organizer.firstName} ${currGroup.Organizer.lastName}` : ``}</h3>
                        <h1>What we're about</h1>
                        <p className="grayabout">{currGroup.about}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleGroup