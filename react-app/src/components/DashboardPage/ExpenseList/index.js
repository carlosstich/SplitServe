import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteExpenseThunk } from '../../../store/expenses';
import UpdateExpenseModal from '../UpdateExpenseModal';
import { useModal } from '../../../context/Modal';
import "./ExpenseList.css";


function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthName = months[date.getMonth()];
  return `${monthName} ${day < 10 ? `0${day}` : day}`;
}

function ExpenseList({ expenses }) {
    const dispatch = useDispatch();
    const currentUserId = useSelector(state => state.session.user.id);
    const { openModal } = useModal(); 

    const settledExpenses = expenses.filter(expense => expense.status === 'Settled');
    const unsettledExpenses = expenses.filter(expense => expense.status !== 'Settled');

    const handleDelete = (expenseId) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            dispatch(deleteExpenseThunk(expenseId));
        }
    };

    const handleUpdateClick = (expenseId) => {
        const expenseToUpdate = expenses.find(exp => exp.id === expenseId);
        if (expenseToUpdate) {
            openModal(<UpdateExpenseModal expense={expenseToUpdate} closeModal={() => openModal()} />);
        } else {
            console.error('Expense not found');
        }
    };


    if (expenses.length === 0) {
        return (
            <div className="expense-list-container">
                <div className="expense-list-header">
                    <h1 className="expense-list-title">Demo's Expenses</h1>
                    <button onClick={() => openModal(<UpdateExpenseModal />)} className="create-expense-button">Add an Expense</button>
                </div>
                <p>No expenses found. Start by adding a new expense.</p>
            </div>
        );
    }

    return (
        <div className="expense-list-container">
            <div className="expense-list-header">
                <h1 className="expense-list-title">Demo's Expenses</h1>
                <button onClick={() => openModal(<UpdateExpenseModal />)} className="create-expense-button">Add an Expense</button>
            </div>
            <div className="expenses-list">
                {unsettledExpenses.map(expense => (
                    <div key={expense.id} className="expense-item">
                        <div className="expense-date">{formatDate(expense.created_at).toUpperCase()}</div>
                        <Link to={`/expenses/${expense.id}`} className="expense-link">
                            <div className="expense-description">{expense.description}</div>
                            <div className="expense-amount">${expense.total_amount}</div>
                        </Link>
                        {expense.created_by === currentUserId && (
                            <>
                                <button className="update-expense-button" onClick={() => handleUpdateClick(expense.id)}>
                                    Update
                                </button>
                                <button className="delete-expense-button" onClick={() => handleDelete(expense.id)}>
                                    &times;
                                </button>
                            </>
                        )}
                    </div>
                ))}
                {settledExpenses.length > 0 && (
                    <div className="settled-header">Settled Transactions</div>
                )}
                {settledExpenses.map(expense => (
                    <div key={expense.id} className="expense-item">
                        <div className="expense-date">{formatDate(expense.created_at).toUpperCase()}</div>
                        <Link to={`/expenses/${expense.id}`} className="expense-link">
                            <div className="expense-description">{expense.description}</div>
                            <div className="expense-amount">${expense.total_amount}</div>
                        </Link>
                        {expense.created_by === currentUserId && (
                            <>
                                <button className="update-expense-button" onClick={() => handleUpdateClick(expense.id)}>
                                    Update
                                </button>
                                <button className="delete-expense-button" onClick={() => handleDelete(expense.id)}>
                                    &times;
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExpenseList;
