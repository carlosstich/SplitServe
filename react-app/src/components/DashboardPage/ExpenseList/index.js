import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteExpenseThunk } from '../../../store/expenses';
import './ExpenseList.css';

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthName = months[date.getMonth()];
  return `${monthName} ${day < 10 ? `0${day}` : day}`;
}

function ExpenseList({ expenses, openModal }) {
    const dispatch = useDispatch();
    const currentUserId = useSelector(state => state.session.user.id);

    const handleDelete = (expenseId) => {
        if (window.confirm("Are you sure you want to delete this expense? This will completely remove this expense for ALL people involved, not just you.")) {
            dispatch(deleteExpenseThunk(expenseId));
        }
    };

    if (expenses.length === 0) {
        return (
            <div className="expense-list-container">
                <div className="expense-list-header">
                    <h1 className="expense-list-title">Demo's Expenses</h1>
                    <button onClick={openModal} className="create-expense-button">Add an Expense</button>
                </div>
                <p>No expenses found. Start by adding a new expense.</p>
            </div>
        );
    }

    return (
        <div className="expense-list-container">
            <div className="expense-list-header">
                <h1 className="expense-list-title">Demo's Expenses</h1>
                <button onClick={openModal} className="create-expense-button">Add an Expense</button>
            </div>
            <div className="expenses-list">
                {expenses.map(expense => (
                    <div key={expense.id} className="expense-item">
                        <div className="expense-date">{formatDate(expense.created_at).toUpperCase()}</div>
                        <Link to={`/expenses/${expense.id}`} className="expense-link">
                            <div className="expense-description">{expense.description}</div>
                            <div className="expense-amount">${expense.total_amount}</div>
                        </Link>
                        {expense.created_by === currentUserId && (
                            <button className="delete-expense-button" onClick={() => handleDelete(expense.id)}>
                                &times;
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExpenseList;
