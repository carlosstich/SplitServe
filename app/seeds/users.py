from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', password='password')
    marnie = User(
        username='marnie', email='marnie@aa.io', password='password')
    bobbie = User(username='bobbie', email='bobbie@aa.io', password='password')
    chuck = User(username='chuck', email='chuck@aa.io', password='password')
    alex = User(username='alex', email='alex@aa.io', password='password')
    mike = User(username='mike', email='mike@aa.io', password='password')
    joe = User(username='joe', email='joe@aa.io', password='password')
    steve = User(username='steve', email='steve@aa.io', password='password')
    beegle = User(username='beegle', email='beegle@aa.io', password='password')
    mayu = User(username='mayu', email='mayu@aa.io', password='password')
    ozzy = User(username='ozzy', email='ozzy@aa.io', password='password')

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.add(chuck)
    db.session.add(alex)
    db.session.add(mike)
    db.session.add(joe)
    db.session.add(steve)
    db.session.add(beegle)
    db.session.add(mayu)
    db.session.add(ozzy)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
