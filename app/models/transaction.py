from .db import db, SCHEMA, environment, add_prefix_for_prod

class Transaction(db.Model):
    __tablename__ = 'transactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    approver_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    updated_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    amount = db.Column(db.Integer)
    description = db.Column(db.Text)
    status = db.Column(db.String, default="Pending")
    approved = db.Column(db.Boolean, default=False)
    type = db.Column(db.String)
    user_expense_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('user_expenses.id')))



    sender = db.relationship('User', foreign_keys=[sender_id], backref='transactions_sent')
    receiver = db.relationship('User', foreign_keys=[receiver_id], backref='transactions_received')
    approver = db.relationship('User', foreign_keys=[approver_id], backref='transactions_approved')
    user_expense = db.relationship(
    'UserExpense',
    backref='related_transactions',
    overlaps="transactions"
)



    def to_dict(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'approver_id': self.approver_id,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'amount': self.amount,
            'description': self.description,
            'status': self.status,
            'approved': self.approved,
            'type': self.type,
            'user_expense_id': self.user_expense_id,
        }
