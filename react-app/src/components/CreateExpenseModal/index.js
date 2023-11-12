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

    if (!description || totalAmount <= 0 || userIds.length < 2) {
      setErrorMessage("Just enter two userid devided by commas.");
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

  //close modal if clicked outside of it
  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      closeModal();
    }
  };

  return (
    <>
      <div id="modal-backdrop" className="modal-backdrop" onClick={handleBackdropClick}></div>
      <div className="modal-container">
        <div className="create-expense-modal">
          <button className="modal-close-button" onClick={closeModal}>&times;</button>
          <div className="title-container">
            <p className="title">Create New Expense</p>
          </div>
          <form onSubmit={handleSubmit}>
            <label>
              Description:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
            <label>
              Total Amount:
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
            </label>
            <label>
              User IDs (comma-separated):
              <input
                type="text"
                onChange={handleUserIdsChange}
                required
                placeholder="1,2"
              />
            </label>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit">Create Expense</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateExpenseModal;
