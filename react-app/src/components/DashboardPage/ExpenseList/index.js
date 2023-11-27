import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteExpenseThunk } from '../../../store/expenses';
import './ExpenseList.css'; 

function ExpenseList({ expenses }) {
    const dispatch = useDispatch();

    const handleDelete = (expenseId) => {
        dispatch(deleteExpenseThunk(expenseId));
    };

    return (
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
    );
}

export default ExpenseList;
