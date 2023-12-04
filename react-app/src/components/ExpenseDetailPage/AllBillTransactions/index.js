import React from "react";

function AllBillTransactions({
  userTransactions,
  handleOpenUpdateTransactionModal,
  handleDeleteTransaction,
  userId,
}) {
  return (
    <div className="user-transactions">
      <h3>All Bill Transactions</h3>
      {userTransactions.map((transaction) => (
        <div key={transaction.id} className="transaction">
          <div>Amount: ${transaction.amount.toFixed(2)}</div>
          <div>Description: {transaction.description}</div>
          <div>Status: {transaction.status}</div>
          {transaction.sender_id === userId &&
            !transaction.approved &&
            transaction.status !== "Rejected" && (
              <>
                <button
                  onClick={() => handleOpenUpdateTransactionModal(transaction)}
                  className="update-expense-button"
                >
                  Update Transaction
                </button>
                <button
                  onClick={() => handleDeleteTransaction(transaction.id)}
                  className="delete-expense-button"
                >
                  Delete Transaction
                </button>
              </>
            )}
        </div>
      ))}
    </div>
  );
}

export default AllBillTransactions;
