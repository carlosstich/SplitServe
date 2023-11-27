// Redux module file (e.g., userExpenses.js)

// Action Types
const GET_USER_EXPENSES_FOR_EXPENSE = 'userExpenses/GET_USER_EXPENSES_FOR_EXPENSE';
const GET_USERS_FOR_EXPENSE = 'userExpenses/GET_USERS_FOR_EXPENSE';

// Action Creators
const getUserExpensesForExpense = (userExpenses) => ({
    type: GET_USER_EXPENSES_FOR_EXPENSE,
    payload: userExpenses,
});

const getUsersForExpense = (users) => ({
    type: GET_USERS_FOR_EXPENSE,
    payload: users,
});

// Initial State
const initialState = {
    userExpensesForExpense: [],
    usersForExpense: [],
};

// Reducer
export default function userExpensesReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER_EXPENSES_FOR_EXPENSE:
            return {
                ...state,
                userExpensesForExpense: action.payload
            };
        case GET_USERS_FOR_EXPENSE:
            return {
                ...state,
                usersForExpense: action.payload
            };
        default:
            return state;
    }
}

// Thunks
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

export const fetchUsersForExpense = (expenseId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/user_expenses/expense/${expenseId}/users`);
        if (response.ok) {
            const users = await response.json();
            dispatch(getUsersForExpense(users));
        } else {
            console.error("Failed to fetch users for the expense");
        }
    } catch (error) {
        console.error("An error occurred while fetching users:", error);
    }
};
