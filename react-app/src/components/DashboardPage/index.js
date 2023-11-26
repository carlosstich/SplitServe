import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getExpensesThunk } from '../../store/expenses';
import CreateExpenseModal from '../CreateExpenseModal';
import ExpenseList from './ExpenseList';
import './DashboardPage.css';

function Dashboard() {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.userExpenses);
  const username = useSelector((state) => state.session.user.username);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getExpensesThunk());
    };

    fetchData();
  }, [dispatch]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">{`${username}'s Expenses`}</h1>
      <button onClick={openModal} className="create-expense-button">Add a Bill</button>
      {expenses.length > 0 ? (
        <ExpenseList expenses={expenses} />
      ) : (
        <p>Loading expenses...</p>
      )}
      {showModal && <CreateExpenseModal closeModal={closeModal} />}
    </div>
  );
}

export default Dashboard;
