const GET_EXPENSES = 'expenses/GET_EXPENSES';
const CREATE_EXPENSE = 'expenses/CREATE_EXPENSE';
const UPDATE_EXPENSE = 'expenses/UPDATE_EXPENSE';
const DELETE_EXPENSE = 'expenses/DELETE_EXPENSE';


const getExpenses = (expenses) => ({
    type: GET_EXPENSES,
    payload: expenses,
});

const createExpense = (expense) => ({
    type: CREATE_EXPENSE,
    payload: expense,
});

const updateExpense = (expense) => ({
    type: UPDATE_EXPENSE,
    payload: expense,
});

const deleteExpense = (expenseId) => ({
    type: DELETE_EXPENSE,
    payload: expenseId,
});

export const getExpensesThunk = () => async (dispatch) => {
    const response = await fetch(`/api/expenses/user`, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    if (response.ok) {
        const data = await response.json();
        dispatch(getExpenses(data.user_expenses))
    } else {
        console.error("Failed to get user expense")
    }
}

export const createExpenseThunk = (expenseData) => async (dispatch) => {
    const response = await fetch('/api/expenses/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(createExpense(data));
        dispatch(getExpensesThunk())
        return data;
    } else {
        return null;
    }
};


export const updateExpenseThunk = (expenseId, expenseData) => async (dispatch) => {
    const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(updateExpense(data));
    }
};

export const deleteExpenseThunk = (expenseId) => async (dispatch) => {
    const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(deleteExpense(expenseId));
    }
};

// Initial State
const initialState = {
    userExpenses: [],
};

// Reducer
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_EXPENSES:
            return {
                ...state,
                userExpenses: action.payload,
            };
        case CREATE_EXPENSE:
            return {
                ...state,
                userExpenses: [...state.userExpenses, action.payload],
            };
        case UPDATE_EXPENSE:
            return {
                ...state,
                userExpenses: state.userExpenses.map((expense) =>
                    expense.id === action.payload.id ? action.payload : expense
                ),
            };
        case DELETE_EXPENSE:
            return {
                ...state,
                userExpenses: state.userExpenses.filter(
                    (expense) => expense.id !== action.payload
                ),
            };
        default:
            return state;
    }
}
