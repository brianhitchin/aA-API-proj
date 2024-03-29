// frontend/src/components/Navigation/OpenModalMenuItem.js
import React from 'react';
import { useModal } from '../../context/Modal';
import './Navigation.css'

function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onItemClick) onItemClick();
  };

  if (itemText === 'Log In' || itemText === 'Sign Up') {
    return (
      <span onClick={onClick} className="ddbarspan2 buttonme">{itemText}</span>
    );
  }
  if (itemText === 'Join MeetPup') {
    return (
      <span onClick={onClick} className="alonesignup buttonme">{itemText}</span>
    );
  }

  if (itemText === 'Delete') {
    return (
      <span onClick={onClick} className="deletesignup">{itemText}</span>
    );
  }

  if (itemText === 'Delete Group') {
    return (
      <span onClick={onClick} className="ddbarspan2">{itemText}</span>
    );
  }

  return (
    <span onClick={onClick} className="ddbarspan2 nb">{itemText}</span>
  );
}

export default OpenModalMenuItem;