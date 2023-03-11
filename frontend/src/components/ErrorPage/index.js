import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import errordog from './errordog.png'
import './index.css'

const ErrorPage = () => {

    const [counter, setCounter] = useState(5)
    const history = useHistory();

    useEffect(() => {
        function reduceCounter() {
            if (counter > 0) {
                setCounter((prevState) => prevState - 1)
            } 
            else {
                history.push('/')
            }
        }
        const redirectInterval = setInterval(reduceCounter, 1000)
        return clearInterval(redirectInterval)
    }, [])

    return (
        <div>
            <h2>So sorry, we couldn't find your destination.</h2>
            <h4>{`We will redirect you to home page in ${counter}...`}</h4>
            <img src={errordog} alt="sorry!"></img>
        </div>
    )
}

export default ErrorPage