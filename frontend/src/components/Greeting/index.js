import topbanner from './tp.png'
import botbanner from './bd.png'

const Greeting = () => {
    return (
        <div>
            <img src={topbanner} alt=''></img>
            <img src={botbanner} alt=''></img>
            <div>
                <h2>Dog friend finder - </h2>
                <h2>Where you can find</h2>
                <h2>a new dog friend!</h2>
                <p>Just like us, dogs have different interests too! From hiking to
                    reading to networking and skillsharing, there are thousands of
                    dogs you can do it with - log in to join the fun.
                </p>
            </div>
        </div>
    )
}

export default Greeting