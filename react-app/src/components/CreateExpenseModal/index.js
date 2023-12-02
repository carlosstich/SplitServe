import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createExpenseThunk } from '../../store/expenses';
import { fetchAllUsersThunk } from '../../store/session';
import { useModal } from "../../context/Modal";
import "./CreateExpenseModal.css";

function CreateExpenseModal() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const currentUser = useSelector((state) => state.session.user);
    const allUsers = useSelector((state) => state.session.allUsers || []);

    const [expenseFormData, setExpenseFormData] = useState({
        total_amount: '',
        description: '',
        user_ids: [currentUser.id]
    });
    const [selectedUserId, setSelectedUserId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        dispatch(fetchAllUsersThunk());
    }, [dispatch]);

    const handleUserSelectionChange = (e) => {
        setSelectedUserId(e.target.value);
        setExpenseFormData({ ...expenseFormData, user_ids: [currentUser.id, Number(e.target.value)] });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "total_amount") {
            const numericValue = parseFloat(value);
            if (!isNaN(numericValue) && numericValue > 0) {
                setExpenseFormData({ ...expenseFormData, [name]: numericValue });
            }
        } else {
            setExpenseFormData({ ...expenseFormData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!expenseFormData.description || expenseFormData.total_amount <= 0) {
            setErrorMessage("Please enter a valid description and total amount.");
            return;
        }
        await dispatch(createExpenseThunk(expenseFormData));
        closeModal();
    };

    return (
        <div className="create-expense-modal">
            <form onSubmit={handleSubmit}>
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
                        name="description"
                        value={expenseFormData.description}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group">
                    <label>Amount:</label>
                    <input
                        type="number"
                        name="total_amount"
                        value={expenseFormData.total_amount}
                        onChange={handleInputChange}
                        placeholder="$0.00"
                        min="0.01"
                        step="0.01"
                    />
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button type="submit" className="save-button">Save</button>
            </form>
        </div>
    );
}

export default CreateExpenseModal;
