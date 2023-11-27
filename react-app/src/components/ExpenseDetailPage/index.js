import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserExpensesForExpense, fetchUsersForExpense } from '../../store/userexpenses';
import {
    approveTransactionThunk,
    getTransactionsAwaitingApprovalThunk,
    getUserTransactionsThunk,
    getTransactionsForExpenseThunk
} from '../../store/transactions';
import './ExpenseDetailPage.css';
import AddTransactionModal from '../AddTransactionModal';
import { useModal } from '../../context/Modal';

function ExpenseDetailPage() {
    const { expenseId } = useParams();
    const dispatch = useDispatch();
    const userId = useSelector(state => state.session.user?.id);
    const userExpenses = useSelector(state => state.userexpenses.userExpensesForExpense || []);
    const usersForExpense = useSelector(state => state.userexpenses.usersForExpense || []);
    const transactionsAwaitingApproval = useSelector(state => state.transactions.transactionsAwaitingApproval || []);
    const userTransactions = useSelector(state => state.transactions.userTransactions || []);

    const currentUserExpense = userExpenses.find(expense => expense.user_id === userId);
    const otherUserExpense = userExpenses.find(expense => expense.user_id !== userId);
    const total = currentUserExpense && currentUserExpense.original_debt_amount * 2;

    const { openModal } = useModal();

    const refreshTransactions = () => {
        dispatch(getTransactionsForExpenseThunk(expenseId));
    };

    useEffect(() => {
        dispatch(fetchUserExpensesForExpense(expenseId));
        dispatch(fetchUsersForExpense(expenseId));
        dispatch(getTransactionsAwaitingApprovalThunk());
        dispatch(getTransactionsForExpenseThunk(expenseId)); 
    }, [dispatch, expenseId, userId]);


    const getUsername = (userId) => {
        const user = usersForExpense.find(user => user.id === userId);
        return user ? user.username : 'Unknown';
    };

    const handleOpenAddTransactionModal = () => {
        openModal(
            <AddTransactionModal
                userId={userId}
                users={usersForExpense}
                expenseId={expenseId}
                onTransactionSubmit={refreshTransactions}
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
                    <div>Original expense total: ${total.toFixed(2)}</div>
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
                        <div>{getUsername(transaction.sender_id)} is suggesting a transaction</div>
                        <div>Amount: ${transaction.amount}</div>
                        <div>Transaction type: {transaction.type}</div>
                        <div>Transaction note: {transaction.description}</div>
                        <br></br>
                        {/* <div>Approver: {getUsername(transaction.receiver_id)}</div> */}
                        <button onClick={() => handleApproveTransaction(transaction.id)}>Approve</button>
                        <br></br>
                        <br></br>
                    </div>
                ))}
            </div>

            <div className="user-transactions">
                <h3>All Bill Transactions</h3>
                {userTransactions.map(transaction => (
                    <div key={transaction.id} className="transaction">
                        <div>Amount: ${transaction.amount}</div>
                        <div>Description: {transaction.description}</div>
                        <div>Status: {transaction.approved ? 'Approved' : 'Pending'}</div>
                        <br />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExpenseDetailPage;
