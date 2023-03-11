import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import errordog from './errordog.png'
import './index.css'

const ErrorPage = () => {

    const [counter, setCounter] = useState(5)
    const history = useHistory();

    useEffect(() => {
        setTimeout(() => {
            history.push('/')
        }, 5000)
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setCounter(counter - 1)
        }, 1000)
    }, [setCounter, counter])

    return (
        <div className='errormain'>
            <h1>So sorry, we couldn't find your destination.</h1>
            <h2>{`We will redirect you to home page in ${counter} seconds...`}</h2>
            <img src={errordog} alt="sorry!"></img>
        </div>
    )
}

export default ErrorPage