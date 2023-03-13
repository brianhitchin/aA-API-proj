import { NavLink, useHistory } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initialGroups } from '../../store/groups'
import './index.css'

const AllGroups = () => {
    const groups = useSelector(state => state.groups)
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(initialGroups())
    }, [dispatch])

    return (
        <>
            <div className="egtop">
                <div className="egsub">
                    <NavLink to='/groups' activeClassName="eglinkactive" className="eglink">Groups</NavLink>
                    <NavLink to='/events' activeClassName="eglinkactive" className="eglink">Events</NavLink>
                </div>
            </div>
            <div className="groupsmaindiv">
                <span className="egsubp">Groups on MeetPup</span>
                {Object.values(groups).map((group) => {
                    return (
                        <div className='indivgroups' onClick={() => history.push(`/groups/${group.id}`)}>
                            <div className='indivgroupimg'>
                                <img src={(group.previewImage && group.previewImage.includes('/')) ? group.previewImage : "https://cdn.tutsplus.com/gamedev/uploads/legacy/043_freeShmupSprites/Free_Shmup_Sprites_Boss_Battle.jpg"} alt="" height={"300px"} width={"300px"}></img>
                            </div>
                            <div className='indivgroupdetail'>
                                <span className='indivgroupname'>{group.name}</span>
                                <span className='indivgrouploc'>{`${group.city}, ${group.state}`}</span>
                                <p className='indivgroupabout'>{group.about}</p>
                                <span className='indivgrouppri'>{(group.private === true) ? "Private" : "Public"}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default AllGroups