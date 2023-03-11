import { useSelector} from "react-redux";
import { useRef, useState, useEffect } from "react";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";
import './index.css'

const JM = () => {
    const user = useSelector(state => state.session.user);
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

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

    return (
        <div className="JMholder">
            {!user ? (
                <OpenModalMenuItem
                    itemText="Join MeetPup"
                    onItemClick={closeMenu}
                    modalComponent={<SignupFormModal />}
                />)
                : (<></>)
            }
        </div>
    )
}

export default JM;