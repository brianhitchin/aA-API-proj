import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom'
import { useEffect } from 'react';
import { oneGroup } from '../../store/groups';
import './index.css'

const SingleGroup = () => {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups)

    useEffect(() => {
        dispatch(oneGroup(groupId))
    }, [groupId, dispatch])

    return (
        <div className="singlegroupmain">
            <div className='groupsum'>
                <div className="groupnav">
                    <NavLink to={'/groups'}>Groups</NavLink>
                </div>
                <div className="groupov">
                    <div className="imgholder">
                        <img src="http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/back05.jpg" 
                        className="groupovimg" alt=""> 
                        </img>
                    </div>
                    <div className="groupdt">
                        <h1>{group.name}</h1>
                        <h3 className="greyme">{`${group.city}, ${group.state}`}</h3>
                        <h3 className="greyme">{group.Organizer ? `Organizer: ${group.Organizer.firstName} ${group.Organizer.lastName}` : ``}</h3>
                        <h3 className="greyme">{group.private === true ? "Private" : "Public"}</h3>
                        <div class="gobot"><button className="groupbutton" onClick={() => alert('Feature coming soon...')}>Join this group</button></div>
                    </div>
                </div>
            </div>
            <div className="graysection">
                <div className='grayintro'>
                    <h1>Organizer</h1>
                    <h3 className="greymeintro">{group.Organizer ? `Organizer: ${group.Organizer.firstName} ${group.Organizer.lastName}` : ``}</h3>
                    <h1>What we're about</h1>
                    <p className="grayabout">{group.about}</p>
                </div>
            </div>
        </div>
    )
}

export default SingleGroup