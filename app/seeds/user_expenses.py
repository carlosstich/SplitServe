from datetime import datetime
from app.models import UserExpense, db, environment, SCHEMA

def seed_user_expenses():
    user_expenses = [
        # UserExpense(user_id=1, expense_id=1, paid_amount=3000, original_debt_amount=5000, is_settled=False, created_at=datetime(2023, 1, 1, 12, 0), updated_at=datetime(2023, 1, 1, 12, 0)),
        # UserExpense(user_id=2, expense_id=2, paid_amount=1000, original_debt_amount=1000, is_settled=True, created_at=datetime(2023, 2, 16, 10, 30), updated_at=datetime(2023, 2, 16, 10, 30)),
        # UserExpense(user_id=3, expense_id=3, paid_amount=2500, original_debt_amount=3000, is_settled=False, created_at=datetime(2023, 3, 21, 9, 0), updated_at=datetime(2023, 3, 21, 9, 0)),
        # UserExpense(user_id=1, expense_id=4, paid_amount=500, original_debt_amount=1500, is_settled=False, created_at=datetime(2023, 4, 6, 11, 0), updated_at=datetime(2023, 4, 6, 11, 0)),
        # UserExpense(user_id=2, expense_id=5, paid_amount=2000, original_debt_amount=2500, is_settled=True, created_at=datetime(2023, 4, 19, 13, 30), updated_at=datetime(2023, 4, 19, 13, 30)),
    ]

    for user_expense in user_expenses:
        db.session.add(user_expense)

    db.session.commit()

def undo_user_expenses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.user_expenses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM user_expenses")
    db.session.commit()
