function ExpenseSummary({ expense, currentUserExpense, otherUserExpense, handleSettleExpense }) {
  if (!expense || !currentUserExpense || !otherUserExpense) {
    return <div>Loading expense details...</div>;
  }

  const total = currentUserExpense.original_debt_amount * 2;

  return (
    <div className="expense-summary">
      <div>Original expense total: ${total.toFixed(2)}</div>
      <div>You have paid: ${currentUserExpense.paid_amount.toFixed(2)}</div>
      <div>Other User Paid: ${otherUserExpense.paid_amount.toFixed(2)}</div>
      <div>Other User Owes: ${(otherUserExpense.original_debt_amount - otherUserExpense.paid_amount).toFixed(2)}</div>
      {expense.created_by === currentUserExpense.user_id && (
        <button onClick={handleSettleExpense}>Settle Up</button>
      )}
      
    </div>
  );
}

export default ExpenseSummary;
