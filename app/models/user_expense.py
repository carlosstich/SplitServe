from .db import db, SCHEMA, environment, add_prefix_for_prod

class UserExpense(db.Model):
    __tablename__ = 'user_expenses'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    expense_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("expenses.id")), nullable=False)
    paid_amount = db.Column(db.Integer)
    original_debt_amount = db.Column(db.Integer)
    is_settled = db.Column(db.Boolean)
    updated_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    transactions = db.relationship(
    'Transaction',
    cascade='all, delete-orphan',
    backref='related_user_expense',
    overlaps="related_user_expense,related_transactions"  
)



    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'expense_id': self.expense_id,
            'paid_amount': self.paid_amount,
            'original_debt_amount': self.original_debt_amount,
            'is_settled': self.is_settled,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
