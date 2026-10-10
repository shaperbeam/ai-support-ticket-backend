import os
from database import engine, Base, SessionLocal, Ticket

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if we already have data
    if db.query(Ticket).count() > 0:
        print("Database already contains data. Skipping seed.")
        db.close()
        return

    # Synthetic E-commerce Support Tickets
    synthetic_data = [
        Ticket(
            customer_message="My tracking number (1Z999999) says delivered but I haven't received my package.", 
            primary_category="Shipping", 
            department="Logistics", 
            priority="High", 
            confidence_score=95, 
            reasoning="Customer claims non-receipt of a marked-delivered package. Requires carrier investigation.", 
            status="Open"
        ),
        Ticket(
            customer_message="I want to return the leather jacket I bought, it's too small.", 
            primary_category="Returns", 
            department="Customer Success", 
            priority="Low", 
            confidence_score=99, 
            reasoning="Standard return request due to sizing.", 
            status="Closed"
        ),
        Ticket(
            customer_message="The checkout page is crashing with a 500 error every time I try to pay for my cart.", 
            primary_category="Technical", 
            department="Engineering", 
            priority="Critical", 
            confidence_score=100, 
            reasoning="Checkout crash prevents revenue. High business impact.", 
            status="Open"
        ),
        Ticket(
            customer_message="How do I change my account password?", 
            primary_category="Account Access", 
            department="Support", 
            priority="Low", 
            confidence_score=100, 
            reasoning="Standard account question, easy resolution.", 
            status="Closed"
        ),
        Ticket(
            customer_message="I got charged twice for my recent order! Please refund the extra charge immediately.", 
            primary_category="Billing", 
            department="Finance", 
            priority="High", 
            confidence_score=98, 
            reasoning="Double charge creates poor customer experience and requires immediate financial remediation.", 
            status="Open"
        ),
    ]

    for t in synthetic_data:
        db.add(t)
    
    db.commit()
    db.close()
    print("Database seeded with synthetic e-commerce tickets!")

if __name__ == "__main__":
    seed_database()
