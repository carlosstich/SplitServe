from datetime import datetime
from app.models import Expense, environment, SCHEMA, db

def seed_expenses():
    expenses = [
        Expense(created_by=1, created_at=datetime(2023, 1, 1, 10, 0), updated_at=datetime(2023, 1, 1, 10, 0), total_amount=10000, description='Dinner with friends', status='pending'),
        Expense(created_by=2, created_at=datetime(2023, 2, 15, 15, 30), updated_at=datetime(2023, 2, 15, 15, 30), total_amount=5000, description='Office supplies', status='pending'),
        Expense(created_by=3, created_at=datetime(2023, 3, 20, 9, 45), updated_at=datetime(2023, 3, 20, 9, 45), total_amount=7500, description='Conference tickets', status='pending'),
        Expense(created_by=1, created_at=datetime(2023, 4, 5, 12, 10), updated_at=datetime(2023, 4, 5, 12, 10), total_amount=3000, description='Uber rides', status='pending'),
        Expense(created_by=2, created_at=datetime(2023, 4, 18, 14, 20), updated_at=datetime(2023, 4, 18, 14, 20), total_amount=2000, description='Coffee for team', status='pending'),
    ]

    for expense in expenses:
        db.session.add(expense)

    db.session.commit()

def undo_expenses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expenses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM expenses")
    db.session.commit()
