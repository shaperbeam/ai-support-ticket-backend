from sqlalchemy import create_engine, Column, Integer, String, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./tickets.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    customer_message = Column(Text, nullable=False)
    primary_category = Column(String, index=True)
    department = Column(String)
    priority = Column(String)
    confidence_score = Column(Integer)
    reasoning = Column(Text)
    duplicate_of = Column(String, nullable=True)
    status = Column(String, default="Open")
