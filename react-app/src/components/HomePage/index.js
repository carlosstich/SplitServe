import React from 'react';
import { useSelector } from 'react-redux';
import './HomePage.css';
import SignupFormModal from "../SignupFormModal";
import { useModal } from "../../context/Modal";

function HomePage() {
    const sessionUser = useSelector(state => state.session.user);
    const { openModal } = useModal();

    const openSignup = () => {
        openModal(<SignupFormModal />);
    };

    return (
        <div className="home-container">
            {!sessionUser && (
                <>
                    <div className="text-container">
                        <h1>Less stress when sharing expenses with housemates.</h1>
                        <p>Keep track of your shared expenses and balances with housemates, trips, groups, friends, and family.</p>
                        <button className="sign-up-button" onClick={openSignup}>Sign up</button>
                    </div>
                    <img src="/images/image.svg" alt="House graphic" className="house-image" />
                </>
            )}
        </div>
    );
}

export default HomePage;
