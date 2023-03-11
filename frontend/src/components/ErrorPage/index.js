import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import errordog from './errordog.png'
import './index.css'

const ErrorPage = () => {

    const history = useHistory();

    useEffect(() => {
        setTimeout(() => {
            history.push('/')
        }, 5000)
    }, [])

    return (
        <div className='errormain'>
            <h1>So sorry, we couldn't find your destination.</h1>
            <h2>{`We will redirect you to home page in 5 seconds...`}</h2>
            <img src={errordog} alt="sorry!"></img>
        </div>
    )
}

export default ErrorPage