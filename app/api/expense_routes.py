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
    db.session.flush()  

    #Split the expense
    user_ids = data['user_ids']
    split_amount = new_expense.total_amount // len(user_ids)

    for user_id in user_ids:
        user_expense = UserExpense(
            user_id=user_id,
            expense_id=new_expense.id,
            paid_amount=0 if user_id != current_user.id else split_amount,
            is_settled=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.session.add(user_expense)

    db.session.commit()
    return jsonify([user_expense.to_dict() for user_expense in UserExpense.query.filter(UserExpense.expense_id == new_expense.id).all()]), 201


# Get all expenses for the current user
@expense_routes.route('/user')
@login_required
def get_user_expenses():
    expenses = Expense.query.filter(Expense.created_by == current_user.id).all()
    return jsonify([expense.to_dict() for expense in expenses])

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
    expense.total_amount = data['total_amount']
    expense.description = data['description']
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
