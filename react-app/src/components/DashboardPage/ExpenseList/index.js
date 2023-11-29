import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteExpenseThunk } from '../../../store/expenses';
import './ExpenseList.css';

function ExpenseList({ expenses, openModal }) {
    const dispatch = useDispatch();

    const handleDelete = (expenseId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this expense? This will completely remove this expense for ALL people involved, not just you."
        );

        if (confirmed) {
            dispatch(deleteExpenseThunk(expenseId));
        }
    };

    return (
        <div className="expense-list-container">
            <div className="expense-list-header">
                <h1 className="expense-list-title">Demo's Expenses</h1>
                <button onClick={openModal} className="create-expense-button">Add an Expense</button>
            </div>
            <div className="expenses-list">
                {expenses.map(expense => (
                    <div key={expense.id} className="expense-item">
                        <Link to={`/expenses/${expense.id}`} className="expense-link">
                            <div className="expense-description">{expense.description}</div>
                            <div className="expense-amount">${expense.total_amount}</div>
                        </Link>
                        <button
                            className="delete-expense-button"
                            onClick={() => handleDelete(expense.id)}>
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExpenseList;
