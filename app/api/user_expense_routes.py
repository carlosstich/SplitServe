from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import UserExpense, Expense
from app import db
from datetime import datetime

user_expense_routes = Blueprint('user_expenses', __name__, url_prefix='/api/user_expenses')

# Endpoint for a user to make a payment towards their share of the expense
@user_expense_routes.route('/<int:user_expense_id>/pay', methods=['POST'])
@login_required
def pay_user_expense(user_expense_id):
    user_expense = UserExpense.query.get_or_404(user_expense_id)
    data = request.json
    payment_amount = data['payment_amount']

    # Check if the user making the request is the one associated with the UserExpense record
    if user_expense.user_id != current_user.id:
        return jsonify(error="You do not have permission to perform this action."), 403

    user_expense.paid_amount += payment_amount
    user_expense.updated_at = datetime.utcnow()

    # Check if the user has fully paid their share
    if user_expense.paid_amount >= user_expense.expense.total_amount // 2:
        user_expense.is_settled = True

    db.session.commit()
    return jsonify(user_expense.to_dict()), 200


# Get all user_expenses for a specific expense
@user_expense_routes.route('/expense/<int:expense_id>')
@login_required
def get_expense_users(expense_id):
    user_expenses = UserExpense.query.filter(UserExpense.expense_id == expense_id).all()
    return jsonify([user_expense.to_dict() for user_expense in user_expenses])

# Update a user's contribution to an expense
@user_expense_routes.route('/<int:user_expense_id>', methods=['PUT'])
@login_required
def update_user_expense(user_expense_id):
    user_expense = UserExpense.query.get_or_404(user_expense_id)
    data = request.json
    user_expense.paid_amount = data['paid_amount']
    user_expense.is_settled = data['is_settled']
    db.session.commit()
    return jsonify(user_expense.to_dict())

# Delete a user from an expense
@user_expense_routes.route('/<int:user_expense_id>', methods=['DELETE'])
@login_required
def delete_user_from_expense(user_expense_id):
    user_expense = UserExpense.query.get_or_404(user_expense_id)
    db.session.delete(user_expense)
    db.session.commit()
    return jsonify(message="User removed from expense")
