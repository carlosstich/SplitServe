import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserExpensesForExpense } from '../../store/userexpenses';
import './ExpenseDetailPage.css';
import { useParams } from 'react-router-dom';

function ExpenseDetailPage() {
    const { expenseId } = useParams();
    const dispatch = useDispatch();
    const userId = useSelector(state => state.session.user?.id); 
    const userExpenses = useSelector(state => state.userexpenses.userExpensesForExpense || []);

    useEffect(() => {
        dispatch(fetchUserExpensesForExpense(expenseId));
    }, [dispatch, expenseId]);

    const currentUserExpense = userExpenses.find(expense => expense.user_id === userId);
    const otherUserExpense = userExpenses.find(expense => expense.user_id !== userId);

    // const currentUserAmountOwed = currentUserExpense && (currentUserExpense.original_debt_amount - currentUserExpense.paid_amount);
    const total = currentUserExpense && currentUserExpense.original_debt_amount * 2;
    // const paid = currentUserExpense && otherUserExpense && currentUserExpense.paid_amount + otherUserExpense.paid_amount;

    return (
        <div className="expense-detail-container">
            {currentUserExpense && otherUserExpense ? (
                <div className="expense-summary">
                    <div>Total amount of the expense: ${total.toFixed(2)}</div>
                    <div>You have paid: ${currentUserExpense.paid_amount.toFixed(2)}</div>
                    <div>Other User Paid: ${otherUserExpense.paid_amount.toFixed(2)}</div>
                    <div>Other User Owes: ${(otherUserExpense.original_debt_amount - otherUserExpense.paid_amount).toFixed(2)}</div>
                </div>
            ) : (
                <div>Loading expense details...</div>
            )}
            <div className="expense-detail">
            </div>
        </div>
    );
}

export default ExpenseDetailPage;
