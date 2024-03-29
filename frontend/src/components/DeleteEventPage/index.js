import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import hooray from './eventhooray.png'
import './index.css'

const DEPage = () => {

    const [counter, setCounter] = useState(3)
    const history = useHistory();
    const { groupId } = useParams()
    console.log(groupId)
    useEffect(() => {
        setTimeout(() => {
            history.push(`/groups/${groupId}`)
        }, 3000)
    }, [history])

    useEffect(() => {
        setTimeout(() => {
            setCounter(counter - 1)
        }, 1000)
    }, [setCounter, counter])

    return (
        <div className='dgmain'>
            <h1>Event successfully deleted!</h1>
            <h2>{`We will redirect you to the group page in ${counter} seconds...`}</h2>
            <img src={hooray} alt="sorry!"></img>
        </div>
    )
}

export default DEPage