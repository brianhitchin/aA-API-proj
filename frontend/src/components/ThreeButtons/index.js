import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import creategroup from './creategroup.png'
import creategroupdisabled from './creategroupdisabled.png'
import findevent from './findevent.png'
import getgroup from './getgroup.png'
import './index.css'

const ThreeFunctions = () => {
    const user = useSelector(state => state.session.user);
    const history = useHistory();

    const GGclickhandle = () => {
        history.push('/groups')
    }

    const cghandle = () => {
        return user ? history.push('/creategroup') : alert('Log in to create a group!')
    }

    return (
        <div className="threebuttonsmain">
            <div className="getgroups" onClick={GGclickhandle}>
                <img src={getgroup} alt="" className="tfimages"></img>
                <h2 className='tbh3'>See all groups</h2>
                <span className='tbtext'>Do what you love, meet others who love it, find your community. 
                    The rest is history! You can meet some pups!</span>
            </div>
            <div className="findevents">
                <img src={findevent} alt="" className="tfimages"></img>
                <h2 className='tbh3'>Find an event</h2>
                <span className='tbtext'>
                Events are happening on just about any topic you can think of, 
                from online gaming and photography to yoga and hiking.
                </span>
            </div>
            <div className="creategroup" onClick={cghandle}>
                <img src={user ? creategroup : creategroupdisabled} alt="" className="tfimages"></img>
                <h2 className='tbh3'>Start a new group</h2>
                <span className='tbtext'>You don’t have to be an expert to gather 
                    people together and explore shared interests.</span>
            </div>
        </div>
    )
}

export default ThreeFunctions;