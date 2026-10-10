import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

def train_and_save_model():
    print("Training fast local ML model on standard e-commerce dataset...")
    
    # 8 Industry-Standard E-Commerce Categories
    dataset = [
        # 1. Order Status & Shipping
        ("Where is my package? The tracking hasn't updated.", "Order Status & Shipping"),
        ("Tracking says delivered but I don't have it.", "Order Status & Shipping"),
        ("My order is late, it was supposed to be here yesterday.", "Order Status & Shipping"),
        ("Can I change my delivery address? I moved.", "Order Status & Shipping"),
        ("The box arrived completely crushed and opened.", "Order Status & Shipping"),
        
        # 2. Returns & Exchanges
        ("I want a refund, this isn't what I expected.", "Returns & Exchanges"),
        ("How do I return this item?", "Returns & Exchanges"),
        ("The item is defective, I want to send it back.", "Returns & Exchanges"),
        ("Wrong size, I need to make an exchange.", "Returns & Exchanges"),
        ("Where can I print my return shipping label?", "Returns & Exchanges"),
        
        # 3. Billing & Payments
        ("I was charged twice for the same transaction!", "Billing & Payments"),
        ("Why is my invoice so high? The total is wrong.", "Billing & Payments"),
        ("Refund my credit card, you guys overcharged me.", "Billing & Payments"),
        ("Payment declined but I have money in my bank.", "Billing & Payments"),
        ("Can you send me a VAT receipt?", "Billing & Payments"),
        
        # 4. Account Management
        ("I forgot my password and can't log in.", "Account Management"),
        ("How do I change my account email address?", "Account Management"),
        ("My account is locked, please unlock it.", "Account Management"),
        ("I want to delete my account.", "Account Management"),
        ("Where can I see my past order history?", "Account Management"),

        # 5. Product Inquiries
        ("When will the blue jacket be back in stock?", "Product Inquiries"),
        ("Does this shoe run true to size or small?", "Product Inquiries"),
        ("What are the exact dimensions of this table?", "Product Inquiries"),
        ("Is this material vegan leather or real leather?", "Product Inquiries"),
        ("Do you sell replacement parts for this item?", "Product Inquiries"),

        # 6. Promotions & Discounts
        ("My promo code isn't working at checkout.", "Promotions & Discounts"),
        ("I forgot to apply my 20% off coupon, can you apply it?", "Promotions & Discounts"),
        ("How do I check my gift card balance?", "Promotions & Discounts"),
        ("Do you offer student discounts?", "Promotions & Discounts"),

        # 7. Technical Issues
        ("The website is completely down and I get a 500 error.", "Technical Issues"),
        ("The app crashes when I try to check out.", "Technical Issues"),
        ("I can't add this item to my cart, the button is broken.", "Technical Issues"),
        ("The checkout page is frozen and won't load.", "Technical Issues"),

        # 8. Feedback & Complaints
        ("The customer service I received yesterday was awful.", "Feedback & Complaints"),
        ("I absolutely love the new design of your website!", "Feedback & Complaints"),
        ("Your packaging uses too much plastic. Please change it.", "Feedback & Complaints"),
        ("I want to file a formal complaint about a rude agent.", "Feedback & Complaints"),
    ]
    
    X = [item[0] for item in dataset]
    y = [item[1] for item in dataset]
    
    model = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english')),
        ('clf', LogisticRegression())
    ])
    
    model.fit(X, y)
    joblib.dump(model, 'fast_ticket_classifier.pkl')
    print("Standard e-commerce model trained and saved as 'fast_ticket_classifier.pkl'!")

if __name__ == "__main__":
    train_and_save_model()
