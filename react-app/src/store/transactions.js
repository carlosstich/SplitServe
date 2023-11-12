const CREATE_TRANSACTION = 'transactions/CREATE_TRANSACTION';
const APPROVE_TRANSACTION = 'transactions/APPROVE_TRANSACTION';
const GET_TRANSACTIONS_AWAITING_APPROVAL = 'transactions/GET_TRANSACTIONS_AWAITING_APPROVAL';
const GET_USER_TRANSACTIONS = 'transactions/GET_USER_TRANSACTIONS';
const UPDATE_TRANSACTION = 'transactions/UPDATE_TRANSACTION';
const DELETE_TRANSACTION = 'transactions/DELETE_TRANSACTION';

const createTransactionAction = (transaction) => ({
    type: CREATE_TRANSACTION,
    payload: transaction,
});

const approveTransactionAction = (transaction) => ({
    type: APPROVE_TRANSACTION,
    payload: transaction,
});

const getTransactionsAwaitingApprovalAction = (transactions) => ({
    type: GET_TRANSACTIONS_AWAITING_APPROVAL,
    payload: transactions,
});

const getUserTransactionsAction = (transactions) => ({
    type: GET_USER_TRANSACTIONS,
    payload: transactions,
});

const updateTransactionAction = (transaction) => ({
    type: UPDATE_TRANSACTION,
    payload: transaction,
});

const deleteTransactionAction = (transactionId) => ({
    type: DELETE_TRANSACTION,
    payload: transactionId,
});

export const createTransactionThunk = (transactionData) => async (dispatch) => {
    const response = await fetch('/api/transactions/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(createTransactionAction(data));
    }
};

export const approveTransactionThunk = (transactionId) => async (dispatch) => {
    const response = await fetch(`/api/transactions/${transactionId}/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(approveTransactionAction(data));
    }
};

export const getTransactionsAwaitingApprovalThunk = () => async (dispatch) => {
    const response = await fetch('/api/transactions/approvals_waiting');

    if (response.ok) {
        const data = await response.json();
        dispatch(getTransactionsAwaitingApprovalAction(data));
    }
};

export const getUserTransactionsThunk = (userId) => async (dispatch) => {
    const response = await fetch(`/api/transactions/user/${userId}`);

    if (response.ok) {
        const data = await response.json();
        dispatch(getUserTransactionsAction(data));
    }
};

export const updateTransactionThunk = (transactionId, transactionData) => async (dispatch) => {
    const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(updateTransactionAction(data));
    }
};

export const deleteTransactionThunk = (transactionId) => async (dispatch) => {
    const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(deleteTransactionAction(transactionId));
    }
};


const initialState = {
    createdTransaction: {},
    approvedTransaction: {},
    transactionsAwaitingApproval: [],
    userTransactions: [],
};

export default function transactionsReducer(state = initialState, action) {
    switch (action.type) {
        case CREATE_TRANSACTION:
            return { ...state, createdTransaction: action.payload };
        case APPROVE_TRANSACTION:
            return { ...state, approvedTransaction: action.payload };
        case GET_TRANSACTIONS_AWAITING_APPROVAL:
            return { ...state, transactionsAwaitingApproval: action.payload };
        case GET_USER_TRANSACTIONS:
            return { ...state, userTransactions: action.payload };
        case UPDATE_TRANSACTION:
            const updatedTransactions = state.userTransactions.map(transaction =>
                transaction.id === action.payload.id ? action.payload : transaction
            );
            return { ...state, userTransactions: updatedTransactions };
        case DELETE_TRANSACTION:
            const filteredTransactions = state.userTransactions.filter(transaction =>
                transaction.id !== action.payload
            );
            return { ...state, userTransactions: filteredTransactions };
        default:
            return state;
    }
}
