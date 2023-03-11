import creategroup from './creategroup.png'
import findevent from './findevent.png'
import getgroup from './getgroup.png'
import './index.css'

const ThreeFunctions = () => {
    return (
        <div className="threebuttonsmain">
            <div className="getgroups">
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
            <div className="creategroup">
                <img src={creategroup} alt="" className="tfimages"></img>
                <h2 className='tbh3'>Start a new group</h2>
                <span className='tbtext'>You don’t have to be an expert to gather 
                    people together and explore shared interests.</span>
            </div>
        </div>
    )
}

export default ThreeFunctions;