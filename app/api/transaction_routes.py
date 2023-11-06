from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Transaction
from app import db

transaction_routes = Blueprint('transactions', __name__, url_prefix='/api/transactions')

@transaction_routes.route('/', methods=['POST'])
@login_required
def create_transaction():
    data = request.json
    new_transaction = Transaction(
        sender_id=data['sender_id'],
        receiver_id=data['receiver_id'],
        amount=data['amount'],
        description=data['description'],
        # You may have more fields to include here
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify(new_transaction.to_dict()), 201

@transaction_routes.route('/')
@login_required
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([transaction.to_dict() for transaction in transactions])

@transaction_routes.route('/<int:transaction_id>')
@login_required
def get_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    return jsonify(transaction.to_dict())

@transaction_routes.route('/<int:transaction_id>', methods=['PUT'])
@login_required
def update_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    data = request.json
    transaction.amount = data['amount']
    transaction.description = data['description']
    # Add more fields as necessary
    db.session.commit()
    return jsonify(transaction.to_dict())

@transaction_routes.route('/<int:transaction_id>', methods=['DELETE'])
@login_required
def delete_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction deleted'})

@transaction_routes.route('/<int:transaction_id>/approve', methods=['POST'])
@login_required
def approve_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    transaction.approved = True
    # Add any additional logic for approval
    db.session.commit()
    return jsonify(transaction.to_dict())

@transaction_routes.route('/user/<int:user_id>')
@login_required
def get_user_transactions(user_id):
    transactions_sent = Transaction.query.filter_by(sender_id=user_id).all()
    transactions_received = Transaction.query.filter_by(receiver_id=user_id).all()
    transactions = transactions_sent + transactions_received
    return jsonify([transaction.to_dict() for transaction in transactions])

# Other routes specific to your business logic could be added here

