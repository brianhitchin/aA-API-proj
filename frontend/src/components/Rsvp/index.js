import { useHistory, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AllMembersThunk } from '../../store/membership'
import './index.css'

const MyRSVP = () => {

    const dispatch = useDispatch();
    const memberstate = useSelector(state => state.membership.all_memberships)
    const [loaded, setLoaded] = useState([])

    useEffect(() => {
        dispatch(AllMembersThunk())
    }, [])

    useEffect(() => {
        if (memberstate) {
            setLoaded([...Object.values(memberstate)])
        }
    }, [memberstate])

    return (
        <div className='mainmain'>
            <div className="egtop">
                <div className="egsub">
                    <Link to='/' className="eglinkactive">Home</Link>
                </div>
            </div>
            <div>
                <ul>
                    {loaded.length > 0 && Object.values(memberstate).map((ele) => {
                        return (
                            <li>{ele.id}</li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default MyRSVP;