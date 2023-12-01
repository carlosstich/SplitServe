import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTransactionThunk } from "../../store/transactions";
import { useModal } from "../../context/Modal";
import "../AddTransactionModal/AddTransactionModal.css"

function UpdateTransactionModal({ transaction, onTransactionUpdate }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();


    const [transactionFormData, setTransactionFormData] = useState({
        id: transaction.id,
        amount: transaction.amount,
        description: transaction.description,
        type: transaction.type,
        user_expense_id: transaction.user_expense_id
    });

    const handleInputChange = (e) => {
        setTransactionFormData({ ...transactionFormData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(updateTransactionThunk(transaction.id, transactionFormData));
        closeModal();
        if (onTransactionUpdate) {
            onTransactionUpdate();
        }
    };

    return (
        <div className="add-transaction-modal">
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Update Transaction</button>
            </form>
        </div>
    );
}

export default UpdateTransactionModal;
