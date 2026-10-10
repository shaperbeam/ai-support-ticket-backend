import os
from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Ticket

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Acme Admin Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

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

@app.get("/")
def read_admin():
    return FileResponse("static/admin.html")

# The Admin server gets its own read-only API endpoint to fetch tickets
@app.get("/api/tickets", response_model=List[TicketResponse])
def get_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).order_by(Ticket.id.desc()).all()

if __name__ == "__main__":
    import uvicorn
    # Runs on port 8081, fully separated from the storefront
    uvicorn.run(app, host="0.0.0.0", port=8081)
