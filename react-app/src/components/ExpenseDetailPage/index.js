import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserExpensesForExpense } from '../../store/userexpenses';
import {
    approveTransactionThunk,
    getTransactionsAwaitingApprovalThunk,
    getUserTransactionsThunk
} from '../../store/transactions';
import './ExpenseDetailPage.css';
import AddTransactionModal from '../AddTransactionModal';
import { useModal } from '../../context/Modal';

function ExpenseDetailPage() {
    const { expenseId } = useParams();
    const dispatch = useDispatch();
    const userId = useSelector(state => state.session.user?.id);
    const userExpenses = useSelector(state => state.userexpenses.userExpensesForExpense || []);
    const transactionsAwaitingApproval = useSelector(state => state.transactions.transactionsAwaitingApproval || []);
    const userTransactions = useSelector(state => state.transactions.userTransactions || []);

    const currentUserExpense = userExpenses.find(expense => expense.user_id === userId);
    const otherUserExpense = userExpenses.find(expense => expense.user_id !== userId);
    const total = currentUserExpense && currentUserExpense.original_debt_amount * 2;

    const { openModal } = useModal();

    useEffect(() => {
        dispatch(fetchUserExpensesForExpense(expenseId));
        dispatch(getTransactionsAwaitingApprovalThunk());
        dispatch(getUserTransactionsThunk(userId));
    }, [dispatch, expenseId, userId]);

    const handleOpenAddTransactionModal = () => {
        openModal(
            <AddTransactionModal
                userId={userId}
                expenseId={expenseId}
                onTransactionSubmit={() => dispatch(getTransactionsAwaitingApprovalThunk())}
            />
        );
    };


    const handleApproveTransaction = (transactionId) => {
        dispatch(approveTransactionThunk(transactionId))
            .then(() => {
                dispatch(getTransactionsAwaitingApprovalThunk());
            })
            .catch(error => {
                console.error('Error in approving transaction:', error);
            });
    };



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

            <button onClick={handleOpenAddTransactionModal}>Add Transaction</button>

            <div className="transactions-awaiting-approval">
                <h3>Transactions awaiting your approval</h3>
                {transactionsAwaitingApproval.map(transaction => (
                    <div key={transaction.id} className="transaction">
                        <div>Amount: ${transaction.amount}</div>
                        <div>Sender ID: {transaction.sender_id}</div>
                        <div>Receiver ID: {transaction.receiver_id}</div>
                        <button onClick={() => handleApproveTransaction(transaction.id)}>Approve</button>
                    </div>
                ))}
            </div>

            <div className="user-transactions">
                <h3>All Bill Transactions</h3>
                {userTransactions.map(transaction => (
                    <div key={transaction.id} className="transaction">
                        <div>Amount: ${transaction.amount}</div>
                        <div>Description: {transaction.description}</div>
                        <div>Status: {transaction.approved}</div>
                        <br />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExpenseDetailPage;
