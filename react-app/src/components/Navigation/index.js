import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { useModal } from '../../context/Modal';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';

function Navigation({ isLoaded }){
    const sessionUser = useSelector(state => state.session.user);
    const { openModal } = useModal();

    const openLoginForm = () => {
        openModal(<LoginFormModal />);
    };

    return (
        <ul className="navbar">
            <li>
                <NavLink exact to="/">
                    <img src="/images/bg-primary.png" alt="SplitServe Logo" style={{ height: '50px' }} />
                    SplitServe
                </NavLink>
            </li>
            {isLoaded && !sessionUser && (
                <li className="right">
                    <button onClick={openLoginForm} className="sign-in-btn">
                        Sign In
                    </button>
                </li>
            )}
            {isLoaded && sessionUser && (
                <li className="right">
                    <ProfileButton user={sessionUser} />
                </li>
            )}
        </ul>
    );
}

export default Navigation;
