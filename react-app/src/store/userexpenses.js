const GET_USER_EXPENSES_FOR_EXPENSE = 'userExpenses/GET_USER_EXPENSES_FOR_EXPENSE';

const getUserExpensesForExpense = (userExpenses) => ({
    type: GET_USER_EXPENSES_FOR_EXPENSE,
    payload: userExpenses,
});

const initialState = {
    userExpensesForExpense: []
};

export default function userExpensesReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER_EXPENSES_FOR_EXPENSE:
            return {
                ...state,
                userExpensesForExpense: action.payload
            };
        default:
            return state;
    }
}

export const fetchUserExpensesForExpense = (expenseId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/user_expenses/expense/${expenseId}`);
        if (response.ok) {
            const data = await response.json();
            dispatch(getUserExpensesForExpense(data)); 
        } else {
            console.error("Failed to fetch user expenses for the expense");
        }
    } catch (error) {
        console.error("An error occurred while fetching user expenses:", error);
    }
};
