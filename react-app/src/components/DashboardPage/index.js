import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getExpensesThunk } from '../../store/expenses';
import { Link } from 'react-router-dom';
import CreateExpenseModal from '../CreateExpenseModal';
import './DashboardPage.css';

function Dashboard() {
    const dispatch = useDispatch();
    const expenses = useSelector(state => state.expenses.userExpenses);
    const username = useSelector(state => state.session.user.username);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        dispatch(getExpensesThunk());
    }, [dispatch]);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">{`${username}'s Expenses`}</h1>
            <button onClick={openModal} className="create-expense-button">Create Expense</button>
            <div className="expenses-list">
                {expenses.map(expense => (
                    <Link to={`/expenses/${expense.id}`} key={expense.id} className="expense-item">
                        <div className="expense-tile">
                            <div className="expense-description">{expense.description}</div>
                            <div className="expense-amount">${expense.total_amount}</div>
                        </div>
                    </Link>
                ))}
            </div>
            {showModal && <CreateExpenseModal closeModal={closeModal} />} 
        </div>
    );
}

export default Dashboard;
