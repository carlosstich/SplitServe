import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchUserExpensesForExpense,
  fetchUsersForExpense,
} from "../../store/userexpenses";
import { getExpensesThunk, updateExpenseThunk } from "../../store/expenses";
import {
  approveTransactionThunk,
  getTransactionsAwaitingApprovalThunk,
  getTransactionsForExpenseThunk,
  rejectTransactionThunk,
  deleteTransactionThunk,
} from "../../store/transactions";
import "./ExpenseDetailPage.css";
import UpdateTransactionModal from "../UpdateTransactionModal";
import AddTransactionModal from "../AddTransactionModal";
import ExpenseSummary from "./ExpenseSummary";
import AllBillTransactions from "./AllBillTransactions";
import { useModal } from "../../context/Modal";

function ExpenseDetailPage() {
  const { expenseId } = useParams();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.session.user?.id);
  const expenses = useSelector((state) => state.expenses.userExpenses || []);
  const userExpenses = useSelector(
    (state) => state.userexpenses.userExpensesForExpense || []
  );
  const usersForExpense = useSelector(
    (state) => state.userexpenses.usersForExpense || []
  );
  const transactionsAwaitingApproval = useSelector(
    (state) => state.transactions.transactionsAwaitingApproval || []
  );
  const userTransactions = useSelector(
    (state) => state.transactions.userTransactions || []
  );
  // console.log(transactionsAwaitingApproval)
  // console.log(userExpenses)
  // console.log(expenses)

  const expense = expenses.find((e) => e.id === parseInt(expenseId));
  const currentUserExpense = userExpenses.find(
    (expense) => expense.user_id === userId
  );
  const otherUserExpense = userExpenses.find(
    (expense) => expense.user_id !== userId
  );

  // console.log(expense)


  const currentUserExpenseId = currentUserExpense?.expense_id;

  const relevantTransactionsAwaitingApproval =
    transactionsAwaitingApproval.filter(
      (transaction) => transaction.user_expense_id === currentUserExpenseId && transaction.status === "Pending"
    );

    console.log(relevantTransactionsAwaitingApproval)

  // console.log(currentUserExpense);
  // console.log(transactionsAwaitingApproval);
  const { openModal } = useModal();

  const refreshTransactions = () => {
    dispatch(getTransactionsForExpenseThunk(expenseId));
  };

  useEffect(() => {
    dispatch(getExpensesThunk());
    dispatch(fetchUserExpensesForExpense(expenseId));
    dispatch(fetchUsersForExpense(expenseId));
    dispatch(getTransactionsAwaitingApprovalThunk());
    dispatch(getTransactionsForExpenseThunk(expenseId));
  }, [dispatch, expenseId, userId]);

  const getUsername = (userId) => {
    const user = usersForExpense.find((user) => user.id === userId);
    return user ? user.username : "Unknown";
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

  const handleOpenUpdateTransactionModal = (transaction) => {
    openModal(
      <UpdateTransactionModal
        transaction={transaction}
        onTransactionUpdate={refreshTransactions}
      />
    );
  };

  const handleApproveTransaction = (transactionId) => {
    dispatch(approveTransactionThunk(transactionId))
      .then(() => {
        dispatch(getExpensesThunk());
        dispatch(fetchUserExpensesForExpense(expenseId));
        dispatch(fetchUsersForExpense(expenseId));
        dispatch(getTransactionsAwaitingApprovalThunk());
        dispatch(getTransactionsForExpenseThunk(expenseId));

      })
      .catch((error) => {
        console.error("Error in approving transaction:", error);
      });
  };

  const handleSettleExpense = () => {
    // Display confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to settle this expense?");


    if (isConfirmed) {
      const updatedExpenseData = {
        status: "Settled",
      };

      dispatch(updateExpenseThunk(expenseId, updatedExpenseData))
        .then(() => {
          dispatch(getExpensesThunk());
        })
        .catch((error) => {
          console.error("Error in settling expense:", error);
        });
    }
  };

  const handleDeleteTransaction = (transactionId) => {
    if(window.confirm("Are you sure you want to delete this transaction?")) {
      dispatch(deleteTransactionThunk(transactionId))
        .then(() => {
          refreshTransactions(); // Call a function to refresh the list of transactions
        })
        .catch((error) => {
          console.error("Error in deleting transaction:", error);
        });
    }
  };



  const handleRejectTransaction = (transactionId) => {
    dispatch(rejectTransactionThunk(transactionId))
      .then(() => {
        dispatch(getTransactionsAwaitingApprovalThunk());
        dispatch(getTransactionsForExpenseThunk(expenseId));
      })
      .catch((error) => {
        console.error("Error in rejecting transaction:", error);
      });
  };





  return (
    <>
    <div className="expense-detail-header">
      <h1>{expense?.description}</h1>
      <button
        onClick={handleOpenAddTransactionModal}
        className="add-transaction-button"
      >
        Add Transaction
      </button>
    </div>

    <div className="expense-detail-container">
      <ExpenseSummary
        expense={expense}
        currentUserExpense={currentUserExpense}
        otherUserExpense={otherUserExpense}
        handleSettleExpense={handleSettleExpense}
      />



      {relevantTransactionsAwaitingApproval.length > 0 && (
  <div className="transactions-awaiting-approval">
    <h3>Transactions awaiting your approval</h3>
    {relevantTransactionsAwaitingApproval.map((transaction) => (
      <div key={transaction.id} className="transaction">
        <div>
          {getUsername(transaction.sender_id)} is suggesting a transaction
        </div>
        <div>Amount: ${transaction.amount}</div>
        <div>Transaction type: {transaction.type}</div>
        <div>Transaction note: {transaction.description}</div>
        <button onClick={() => handleApproveTransaction(transaction.id)} className="update-expense-button">
  Approve
</button>

<button onClick={() => handleRejectTransaction(transaction.id)} className="reject-transaction-button">
  Reject
</button>

      </div>
    ))}
  </div>

)}


      <AllBillTransactions
        userTransactions={userTransactions}
        handleOpenUpdateTransactionModal={handleOpenUpdateTransactionModal}
        handleDeleteTransaction={handleDeleteTransaction}
        userId={userId}
      />
    </div>
    </>
  );
}

export default ExpenseDetailPage;
