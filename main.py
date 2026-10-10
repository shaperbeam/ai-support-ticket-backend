import os
import joblib
from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal, Ticket

# Create DB Tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="E-Commerce Storefront Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_index():
    return FileResponse("static/index.html")

# Load the trained Scikit-Learn model globally
try:
    classifier_model = joblib.load('fast_ticket_classifier.pkl')
except:
    classifier_model = None

class SubmitTicketRequest(BaseModel):
    customer_message: str

class TicketResponse(BaseModel):
    id: int
    customer_message: str
    primary_category: str
    department: str
    priority: str
    confidence_score: int
    reasoning: str
    status: str

    class Config:
        from_attributes = True

# INDUSTRY-STANDARD E-COMMERCE ROUTING RULES
CATEGORY_ROUTING = {
    "Order Status & Shipping": {"dept": "Logistics", "priority": "Medium", "reasoning": "Routed to Logistics for tracking, delays, or lost packages."},
    "Returns & Exchanges": {"dept": "Customer Success", "priority": "Medium", "reasoning": "Routed to CS for RMA, wrong items, or damages."},
    "Billing & Payments": {"dept": "Finance", "priority": "High", "reasoning": "Routed to Finance due to charge discrepancies or refund requests."},
    "Account Management": {"dept": "Support", "priority": "Low", "reasoning": "Routed to Support for password resets and address changes."},
    "Product Inquiries": {"dept": "Sales", "priority": "Low", "reasoning": "Routed to Sales for sizing, stock checks, or product details."},
    "Promotions & Discounts": {"dept": "Customer Success", "priority": "Low", "reasoning": "Routed to CS for promo codes or gift card issues."},
    "Technical Issues": {"dept": "Engineering", "priority": "Critical", "reasoning": "Routed to Engineering. Potential system outage affecting revenue."},
    "Feedback & Complaints": {"dept": "Management", "priority": "High", "reasoning": "Routed to Management for escalation and service recovery."}
}

@app.post("/api/tickets", response_model=TicketResponse)
def submit_ticket(request: SubmitTicketRequest, db: Session = Depends(get_db)):
    if not classifier_model:
        raise HTTPException(status_code=500, detail="Local ML model not loaded.")
        
    category_prediction = classifier_model.predict([request.customer_message])[0]
    
    routing = CATEGORY_ROUTING.get(category_prediction, {"dept": "General Support", "priority": "Medium", "reasoning": "Default routing."})
    
    new_ticket = Ticket(
        customer_message=request.customer_message,
        primary_category=category_prediction,
        department=routing["dept"],
        priority=routing["priority"],
        confidence_score=95,
        reasoning=routing["reasoning"],
        duplicate_of=None,
        status="Open"
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    
    return new_ticket

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
