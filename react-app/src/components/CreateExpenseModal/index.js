import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createExpenseThunk } from '../../store/expenses';
import { fetchAllUsersThunk } from '../../store/session';
import "./CreateExpenseModal.css";

function CreateExpenseModal({ closeModal }) {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.session.user);
  const [totalAmount, setTotalAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const allUsers = useSelector((state) => state.session.allUsers || []); 


  useEffect(() => {
    dispatch(fetchAllUsersThunk());
  }, [dispatch]);

  const handleUserSelectionChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || totalAmount <= 0 || !selectedUserId) {
      setErrorMessage("Please enter a valid description, total amount, and select a user.");
      return;
    }

    const newExpense = {
      total_amount: Number(totalAmount),
      description,
      user_ids: [currentUser.id, Number(selectedUserId)]
    };

    const response = await dispatch(createExpenseThunk(newExpense));
    if (response) {
      closeModal();
    } else {
      setErrorMessage("Failed to create expense.");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      closeModal();
    }
  };

  return (
    <div id="modal-backdrop" className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="create-expense-modal">
        <div className="modal-header">
          <span className="modal-title">Add an Expense</span>
          <button onClick={closeModal} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="input-group">
            <label>With you and:</label>
            <select
              onChange={handleUserSelectionChange}
              value={selectedUserId}
              required
            >
              <option value="">Select User</option>
              {allUsers
                .filter(user => user.id !== currentUser.id)
                .map(user => (
                  <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Enter a description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Amount:</label>
            <input
              type="text"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="$0.00"
            />
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="form-footer">
            <button type="submit" className="save-button">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateExpenseModal;
