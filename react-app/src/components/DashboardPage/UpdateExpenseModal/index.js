import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateExpenseThunk } from "../../../store/expenses";
import "./UpdateExpenseModal.css"


function UpdateExpenseModal({ expense, closeModal }) {
    const dispatch = useDispatch();

    // Set initial form
    const [expenseFormData, setExpenseFormData] = useState({
        id: expense.id,
        total_amount: expense.total_amount,
        description: expense.description,
    });

    const handleInputChange = (e) => {
        setExpenseFormData({ ...expenseFormData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(updateExpenseThunk(expense.id, expenseFormData));
        closeModal();

    };

    return (
        <div className="update-expense-modal">
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="total_amount"
                    value={expenseFormData.total_amount}
                    onChange={handleInputChange}
                    placeholder="Total Amount"
                    disabled={true}
                />
                <input
                    type="text"
                    name="description"
                    value={expenseFormData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                />
                <button type="submit">Update Expense</button>
            </form>
        </div>
    );
}

export default UpdateExpenseModal;
