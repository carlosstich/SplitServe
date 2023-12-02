import React from 'react';

function AllBillTransactions({ userTransactions, handleOpenUpdateTransactionModal, userId }) {
  return (
    <div className="user-transactions">
      <h3>All Bill Transactions</h3>
      {userTransactions.map(transaction => (
        <div key={transaction.id} className="transaction">
          <div>Amount: ${transaction.amount.toFixed(2)}</div>
          <div>Description: {transaction.description}</div>
          <div>Status: {transaction.approved ? 'Approved' : 'Pending'}</div>
          {transaction.sender_id === userId && !transaction.approved && (
            <button onClick={() => handleOpenUpdateTransactionModal(transaction)}>
              Update Transaction
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default AllBillTransactions;
