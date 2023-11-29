import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getExpensesThunk } from '../../store/expenses';
import CreateExpenseModal from '../CreateExpenseModal';
import ExpenseList from './ExpenseList';
import './DashboardPage.css';

function Dashboard() {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.userExpenses);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getExpensesThunk());
  }, [dispatch]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="dashboard-container">
      {expenses.length > 0 ? (
        <ExpenseList expenses={expenses} openModal={openModal} />
      ) : (
        <p>Loading expenses...</p>
      )}
      {showModal && <CreateExpenseModal closeModal={closeModal} />}
    </div>
  );
}

export default Dashboard;
