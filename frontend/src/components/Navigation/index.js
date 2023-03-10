// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from './logo.jpg'

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='topnavbar'>
      <NavLink exact to="/"><img src={logo} alt='logo'></img></NavLink>
      {isLoaded && (
          <ProfileButton user={sessionUser} />
      )}
    </div>
  );
}

export default Navigation;