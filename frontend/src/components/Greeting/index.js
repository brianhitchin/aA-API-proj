import dogs from './dogfull.png'
import './index.css'

const Greeting = () => {
    return (
        <div className='greeting'>
            <div>
                <h1 className='louder'>Dog friend finder - Where you can find a new dog friend!</h1>
                <p className='loud'>Just like us, dogs have different interests too! From hiking to
                    reading to networking and skillsharing, there might be thousands of
                    people you can do it with, but there are tens of thousands of dogs 
                    you can do it with instead! Sign up today and meet a pup!
                </p>
            </div>
            <div>
                <img src={dogs} alt='' className='bannerImage'></img>
            </div>
        </div>
    )
}

export default Greeting