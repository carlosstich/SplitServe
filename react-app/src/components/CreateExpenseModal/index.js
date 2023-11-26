import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createExpenseThunk } from '../../store/expenses';
import "./CreateExpenseModal.css";

function CreateExpenseModal({ closeModal }) {
  const dispatch = useDispatch();
  const [totalAmount, setTotalAmount] = useState('');
  const [description, setDescription] = useState('');
  const [userIds, setUserIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || totalAmount <= 0 || userIds.length === 0) {
      setErrorMessage("Please enter a valid description, total amount, and at least one user ID.");
      return;
    }

    const newExpense = {
      total_amount: Number(totalAmount),
      description,
      user_ids: userIds
    };

    const response = await dispatch(createExpenseThunk(newExpense));
    if (response) {
      closeModal();
    } else {
      setErrorMessage("Failed to create expense.");
    }
  };

  const handleUserIdsChange = (e) => {
    const ids = e.target.value.split(',').map(id => id.trim()).filter(id => id);
    setUserIds(ids.map(Number));
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
          <span className="modal-title">Add an bill</span>
          <button onClick={closeModal} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="input-group">
            <label>With you and:</label>
            <input
                type="text"
                onChange={handleUserIdsChange}
                required
                placeholder="1,2"
            />
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
