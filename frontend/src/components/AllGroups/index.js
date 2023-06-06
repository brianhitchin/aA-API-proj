import { Link, useHistory } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initialGroups } from '../../store/groups'
import './index.css'

const AllGroups = () => {
    const groups = useSelector(state => state.groups)
    const dispatch = useDispatch();
    const history = useHistory();
    const sorry = "https://spoiltpig.co.uk/wp-content/plugins/responsive-menu/v4.0.0/assets/images/no-preview.jpeg"

    useEffect(() => {
        document.title = 'MeetPup!';
    }, []);

    useEffect(() => {
        dispatch(initialGroups())
    }, [dispatch])

    return (
        <>
            <div className="egtop">
                <div className="egsub">
                    <Link to='/groups' className="eglinkactive">Groups</Link>
                    <Link to='/events' className="eglinkinactive">Events</Link>
                </div>
            </div>
            <div className="groupsmaindiv">
                <span className="egsubp">Groups on MeetPup</span>
                {Object.values(groups).map((group) => {
                    return (
                        <div className='indivgroups' onClick={() => history.push(`/groups/${group.id}`)}>
                            <div className='indivgroupimg'>
                                <img src={(group.previewImage && group.previewImage.includes('/')) ? group.previewImage : sorry} alt="" height={"300px"} width={"300px"}></img>
                            </div>
                            <div className='indivgroupdetail'>
                                <span className='indivgroupname'>{group.name}</span>
                                <span className='indivgrouploc'>{`${group.city}, ${group.state}`}</span>
                                <p className='indivgroupabout'>{group.about}</p>
                                <div className='indivgrouppri'>
                                    <span>{(group.private === true) ? "Private" : "Public"}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default AllGroups