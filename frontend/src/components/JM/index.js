import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";
import * as sessionActions from "../../store/session";
import './index.css'

const JM = () => {
    const user = useSelector(state => state.session.user);
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const dispatch = useDispatch();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    const closeMenu = (e) => {
        if (!showMenu) return;
        if (!ulRef.current.contains(e.target)) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, [closeMenu]);

    useEffect(() => {
        if (!user) {
            setShowMenu(true)
        }
    }, [user])

    const handleDemoClick = () => {
        return dispatch(sessionActions.login({ credential: "demo@demo.io", password: "password4" }))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [user])

    return (
        <div>
            {!user ? (
                <div className="JMholder">
                    <OpenModalMenuItem
                        itemText="Join MeetPup"
                        onItemClick={closeMenu}
                        modalComponent={<SignupFormModal />}
                    />
                    <button onClick={handleDemoClick} className='jmbutton'>Log in as Demo</button>
                </div>)
                : (<></>)
            }
        </div>
    )
}

export default JM;