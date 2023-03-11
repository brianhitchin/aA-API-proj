import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="ddbar">
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <span className="ddbarspan"><i class="fa-solid fa-signature"></i> Welcome, {user.username}.</span>
            <span className="ddbarspan"><i class="fa-solid fa-person"></i> {user.firstName} {user.lastName}</span>
            <span className="ddbarspan"><i class="fa-regular fa-envelope"></i> {user.email}</span>
            <span className="ddbarspan">
              <button onClick={logout}>Log Out</button>
            </span>
          </>
        ) : (
          <>
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
          </>
        )}
      </ul>
      <div className="ddbarbutton">
        <button onClick={openMenu}>
          <i className={user ? "fa-solid fa-circle-user": "fa-regular fa-circle-user"} />
        </button>
      </div>
    </div>
  );
}

export default ProfileButton;