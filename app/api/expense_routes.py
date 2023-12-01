from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Expense, UserExpense
from app import db
from datetime import datetime

expense_routes = Blueprint('expenses', __name__, url_prefix='/api/expenses')

# Endpoint to create a new expense and split it between users
@expense_routes.route('/', methods=['POST'])
@login_required
def create_and_split_expense():
    data = request.json
    new_expense = Expense(
        created_by=current_user.id,
        total_amount=data['total_amount'],
        description=data['description'],
        status='pending'
    )
    db.session.add(new_expense)
    db.session.flush()  # Flush to get the new_expense.id for foreign key references

    # Split the expense
    user_ids = data['user_ids']
    split_amount = new_expense.total_amount // len(user_ids)

    user_expenses = []  # To store user_expense objects for JSON response
    for user_id in user_ids:
        # Calculate the original debt for each user
        original_debt = split_amount if user_id != current_user.id else new_expense.total_amount - split_amount * (len(user_ids) - 1)

        user_expense = UserExpense(
            user_id=user_id,
            expense_id=new_expense.id,
            paid_amount=0 if user_id != current_user.id else split_amount,
            original_debt_amount=original_debt,
            is_settled=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.session.add(user_expense)
        user_expenses.append(user_expense)

    db.session.commit()


    return jsonify([ue.to_dict() for ue in user_expenses]), 201




@expense_routes.route('/user')
@login_required
def get_user_expenses():
    created_expenses = Expense.query.filter(Expense.created_by == current_user.id)
    involved_expenses = Expense.query.join(UserExpense, UserExpense.expense_id == Expense.id).filter(UserExpense.user_id == current_user.id)

    all_expenses = created_expenses.union(involved_expenses).all()

    return jsonify({'user_expenses': [expense.to_dict() for expense in all_expenses]})






# Get a single expense by id
@expense_routes.route('/<int:expense_id>')
@login_required
def get_expense(expense_id):
    expense = Expense.query.get_or_404(expense_id)
    return jsonify(expense.to_dict())

# Update an existing expense
@expense_routes.route('/<int:expense_id>', methods=['PUT'])
@login_required
def update_expense(expense_id):
    expense = Expense.query.get_or_404(expense_id)
    if expense.created_by != current_user.id:
        return jsonify(message="Not authorized to update this expense"), 403

    data = request.json

    if 'total_amount' in data:
        expense.total_amount = data['total_amount']
    if 'description' in data:
        expense.description = data['description']
    if 'status' in data:
        expense.status = data['status']

    db.session.commit()
    return jsonify(expense.to_dict())


# Delete an expense
@expense_routes.route('/<int:expense_id>', methods=['DELETE'])
@login_required
def delete_expense(expense_id):
    expense = Expense.query.get_or_404(expense_id)
    if expense.created_by != current_user.id:
        return jsonify(message="Not authorized to delete this expense"), 403

    db.session.delete(expense)
    db.session.commit()
    return jsonify(message="Expense deleted")

@expense_routes.route('/')
@login_required
def get_all_expenses():
    expenses = Expense.query.all()
    return jsonify([expense.to_dict() for expense in expenses])
