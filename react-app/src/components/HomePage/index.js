import React from 'react';
import { useSelector } from 'react-redux';
import './HomePage.css';

function HomePage() {
    const sessionUser = useSelector(state => state.session.user); 
    return (
        <>
            {!sessionUser && (
                <div className="welcome-message">
                    Welcome to SplitServe
                </div>
            )}
        </>
    );
}

export default HomePage;
