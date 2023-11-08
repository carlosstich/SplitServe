from datetime import datetime
from app.models import Transaction, db, environment, SCHEMA

def seed_transactions():
    transactions = [
        # Transaction(sender_id=1, receiver_id=2, approver_id=3, user_expense_id=1, created_at=datetime(2023, 1, 15, 10, 0), updated_at=datetime(2023, 1, 15, 10, 15), amount=150, description="Lunch reimbursement", status="approved", approved=True, type="reimbursement"),
        # Transaction(sender_id=2, receiver_id=1, approver_id=3, user_expense_id=2, created_at=datetime(2023, 2, 20, 14, 30), updated_at=datetime(2023, 2, 20, 14, 45), amount=45, description="Coffee run", status="pending", approved=False, type="payment"),
        # Transaction(sender_id=3, receiver_id=1, approver_id=2, user_expense_id=3, created_at=datetime(2023, 3, 10, 9, 20), updated_at=datetime(2023, 3, 10, 9, 35), amount=200, description="Conference ticket refund", status="rejected", approved=False, type="refund"),
        # Transaction(sender_id=1, receiver_id=3, approver_id=2, user_expense_id=4, created_at=datetime(2023, 4, 5, 16, 10), updated_at=datetime(2023, 4, 5, 16, 25), amount=300, description="Office supplies purchase", status="approved", approved=True, type="purchase"),
    ]

    for transaction in transactions:
        db.session.add(transaction)

    db.session.commit()

def undo_transactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM transactions")
    db.session.commit()
