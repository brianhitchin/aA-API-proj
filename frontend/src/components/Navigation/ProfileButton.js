import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { useHistory, Link } from "react-router-dom";
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import userupf from './userupf.png'
import userdownf from './userdownf.png'
import './Navigation.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(true);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    if (user) {
      openMenu()
      const closeMenu = (e) => {
        if (!ulRef.current.contains(e.target)) {
          setShowMenu(false);
        }
      };
      document.addEventListener('click', closeMenu);
      return () => document.removeEventListener("click", closeMenu);
    }

  }, [showMenu, openMenu, user]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/')
  };

  const caghandler = () => {
    history.push('/creategroup')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const buttonClassName = "ddbarbutton"
  const hidebutton = "custombutton"

  return (
    <div className="ddbar">
        {user ? (
          <div className="interholder">
            <div className={showMenu ? "ddbagcag2" : "ddbagcag"} onClick={caghandler}>Create a group</div>
            <ul className={ulClassName} ref={ulRef}>
              <span className="ddbarspan nl"><i class="fa-solid fa-person"></i> Hello, {user.firstName} {user.lastName}</span>
              <span className="ddbarspan nl"><i class="fa-regular fa-envelope"></i> {user.email}</span>
              <span className="ddbarspan buttonme"><i class="fa-solid fa-users"></i><Link to="/groups">View all groups</Link></span>
              <span className="ddbarspan buttonme"><i class="fa-solid fa-rocket"></i><Link to="/events">View events</Link></span>
              <span className="ddbarspan2 buttonme" onClick={logout}>Log Out</span>
            </ul>
          </div>
        ) : (
          <ul className="profile-dropdown">
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </ul>
        )}
      {user ? (
        <div className={buttonClassName}>
          <button onClick={openMenu}>
            <img src={showMenu ? userdownf : userupf} alt='' className={hidebutton} />
          </button>
        </div>
      ) : (<></>)}
    </div>
  );
}

export default ProfileButton;