from .db import db, SCHEMA, environment, add_prefix_for_prod

class Expense(db.Model):
    __tablename__ = 'expenses'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    created_by = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    updated_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    total_amount = db.Column(db.Integer)
    description = db.Column(db.Text)
    status = db.Column(db.String)


    creator = db.relationship('User', backref='expenses_created')
    user_expenses = db.relationship(
        'UserExpense',
        cascade='all, delete-orphan',  
        backref='expense',
    )

    def to_dict(self):
        return {
            'id': self.id,
            'created_by': self.created_by,
            'updated_at': self.updated_at,
            'created_at': self.created_at,
            'total_amount': self.total_amount,
            'description': self.description,
            'status': self.status
        }
