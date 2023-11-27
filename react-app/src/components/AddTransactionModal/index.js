import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createTransactionThunk } from "../../store/transactions";
import { useModal } from "../../context/Modal";
import "./AddTransactionModal.css";

function AddTransactionModal({ userId, users, expenseId, onTransactionSubmit }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    // Find the other user's details
    const otherUser = users.find(user => user.id !== userId) || {};

    const [transactionFormData, setTransactionFormData] = useState({
        sender_id: userId,
        receiver_id: otherUser.id || '',
        amount: '',
        description: '',
        type: '',
        user_expense_id: expenseId
    });

    useEffect(() => {
        setTransactionFormData(formData => ({ ...formData, receiver_id: otherUser.id }));
    }, [otherUser]);

    const handleInputChange = (e) => {
        setTransactionFormData({ ...transactionFormData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(createTransactionThunk(transactionFormData));
        closeModal();
        if (onTransactionSubmit) {
            onTransactionSubmit();
        }
    };


    return (
        <div className="add-transaction-modal">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Approver:</label>
                    <span>{otherUser.username || 'Unknown'}</span>
                </div>
                <input
                    type="number"
                    name="amount"
                    value={transactionFormData.amount}
                    onChange={handleInputChange}
                    placeholder="Transaction Amount"
                />
                <input
                    type="text"
                    name="description"
                    value={transactionFormData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                />
                <select
                    name="type"
                    value={transactionFormData.type}
                    onChange={handleInputChange}
                >
                    <option value="" disabled>Select a Type</option>
                    <option value="Service">Service</option>
                    <option value="Cash Payment">Cash Payment</option>
                </select>
                <button type="submit">Add Transaction</button>
            </form>
        </div>
    );
}

export default AddTransactionModal;
