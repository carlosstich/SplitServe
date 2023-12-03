from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Transaction
from app import db
from sqlalchemy import not_

transaction_routes = Blueprint('transactions', __name__, url_prefix='/api/transactions')


from app.models import UserExpense, Transaction

@transaction_routes.route('/create-with-approval', methods=['POST'])
@login_required
def create_transaction_with_approval():
    data = request.json

    new_transaction = Transaction(
        sender_id=current_user.id,
        receiver_id=data['receiver_id'],
        amount=data['amount'],
        description=data['description'],
        approved=False
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify(new_transaction.to_dict()), 201


@transaction_routes.route('/<int:transaction_id>/approve', methods=['POST'])
@login_required
def approve_transaction_and_update_expense(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)

    # Only the receiverto approve the transaction
    if current_user.id != transaction.receiver_id:
        return jsonify({'message': 'You are not authorized to approve this transaction'}), 403

    transaction.approved = True
    transaction.status = "Approved"
    db.session.commit()

    # Find the  user expense
    user_expense = UserExpense.query.filter_by(
        user_id=transaction.sender_id,
        expense_id=transaction.user_expense_id
    ).first()

    if not user_expense:
        return jsonify({'message': 'User expense not found'}), 404

    # Update the user expense paid amount
    user_expense.paid_amount += transaction.amount

    # Check if the updated paid amount covers the original debt
    if user_expense.paid_amount >= user_expense.original_debt_amount:
        user_expense.is_settled = True

    try:
        db.session.commit()
        return jsonify({
            'transaction': transaction.to_dict(),
            'user_expense': user_expense.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Transaction could not be approved', 'error': str(e)}), 500

#get all the transactions that the current user can approval
@transaction_routes.route('/approvals_waiting')
@login_required
def get_approvals():

    approvals = Transaction.query.filter_by(receiver_id=current_user.id, approved=False).all()
    approval_dicts = [approval.to_dict() for approval in approvals]
    return jsonify(approval_dicts), 200

# get all the tranaction the current user has waiting for a approval
@transaction_routes.route('/transactions-waiting-for-approval')
@login_required
def get_sent():
    payments = Transaction.query.filter(
        Transaction.sender_id == current_user.id,
        Transaction.approved == False,
        not_(Transaction.status == "Rejected")  # Exclude rejected transactions
    ).all()
    payments_dicts = [payment.to_dict() for payment in payments]
    return jsonify(payments_dicts), 200

@transaction_routes.route('/')
@login_required
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([transaction.to_dict() for transaction in transactions])

#get a transaction by id
@transaction_routes.route('/<int:transaction_id>')
@login_required
def get_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    return jsonify(transaction.to_dict())

#update
@transaction_routes.route('/<int:transaction_id>', methods=['PUT'])
@login_required
def update_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    data = request.json
    transaction.amount = data['amount']
    transaction.description = data['description']

    db.session.commit()
    return jsonify(transaction.to_dict())

@transaction_routes.route('/<int:transaction_id>', methods=['DELETE'])
@login_required
def delete_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction deleted'})

# @transaction_routes.route('/<int:transaction_id>/approve', methods=['POST'])
# @login_required
# def approve_transaction(transaction_id):
#     transaction = Transaction.query.get_or_404(transaction_id)
#     transaction.approved = True
#     transaction.status = "Approved"

#     db.session.commit()
#     return jsonify(transaction.to_dict())

#reject this thing
@transaction_routes.route('/<int:transaction_id>/reject', methods=['POST'])
@login_required
def reject_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    transaction.approved = False
    transaction.status = "Rejected"

    db.session.commit()
    return jsonify(transaction.to_dict())


@transaction_routes.route('/user/<int:user_id>')
@login_required
def get_user_transactions(user_id):
    transactions_sent = Transaction.query.filter_by(sender_id=user_id).all()
    transactions_received = Transaction.query.filter_by(receiver_id=user_id).all()
    transactions = transactions_sent + transactions_received
    return jsonify([transaction.to_dict() for transaction in transactions])

@transaction_routes.route('/expense/<int:expense_id>')
@login_required
def get_transactions_by_expense(expense_id):
    transactions = Transaction.query.filter_by(user_expense_id=expense_id).all()
    return jsonify([transaction.to_dict() for transaction in transactions]), 200


@transaction_routes.route('/', methods=['POST'])
@login_required
def create_transaction():
    data = request.json
    new_transaction = Transaction(
        sender_id=data['sender_id'],
        receiver_id=data['receiver_id'],
        amount=data['amount'],
        description=data['description'],
        type=data['type'],
        user_expense_id=data['user_expense_id']
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify(new_transaction.to_dict()), 201
