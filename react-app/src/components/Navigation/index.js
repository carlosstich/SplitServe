import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
    const sessionUser = useSelector(state => state.session.user);

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
                    <NavLink to="/login" className="sign-in-btn">
                        Sign In
                    </NavLink>
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
