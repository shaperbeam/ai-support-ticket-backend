# AI Customer Support Ticket System Backend (FastAPI + ML)

An AI-powered customer support ticket classification and routing backend built with **FastAPI**, **Scikit-Learn**, and **SQLAlchemy**.

Designed for e-commerce platforms to automatically classify, prioritize, and route customer support requests to appropriate departments in real time.

---

## 🌟 Key Features

- **⚡ Instant ML Classification**: Uses a trained local Machine Learning pipeline (`TF-IDF Vectorizer` + `Logistic Regression`) for sub-millisecond classification into 8 standard e-commerce categories.
- **🌐 Full CORS Support**: Pre-configured with `CORSMiddleware` (`allow_origins=["*"]`) so any frontend (React, Vue, Next.js, React Native, Vanilla JS) can connect without cross-origin blocks.
- **🏛️ Microservices Architecture**:
  - **Storefront API** (`main.py` on Port `8080`): Handles public ticket submissions and AI categorization.
  - **Admin Server** (`admin_server.py` on Port `8081`): Dedicated internal API for support staff to view and filter tickets.
- **💾 Database Ready**: SQLite + SQLAlchemy integration with automated seeding.

---

## 📋 API Documentation for Frontend Integration

### 1. Submit Ticket (Public API)
- **Endpoint**: `POST http://localhost:8080/api/tickets`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "customer_message": "I was charged twice for my recent order #12345!"
  }
  ```
- **Response Body**:
  ```json
  {
    "id": 1,
    "customer_message": "I was charged twice for my recent order #12345!",
    "primary_category": "Billing & Payments",
    "department": "Finance",
    "priority": "High",
    "confidence_score": 95,
    "reasoning": "Routed to Finance due to charge discrepancies or refund requests.",
    "status": "Open"
  }
  ```

### 2. Fetch All Tickets (Admin API)
- **Endpoint**: `GET http://localhost:8081/api/tickets`
- **Response Body**:
  ```json
  [
    {
      "id": 1,
      "customer_message": "I was charged twice for my recent order #12345!",
      "primary_category": "Billing & Payments",
      "department": "Finance",
      "priority": "High",
      "confidence_score": 95,
      "reasoning": "Routed to Finance due to charge discrepancies or refund requests.",
      "status": "Open"
    }
  ]
  ```

---

## 🚀 Setup & Installation Instructions

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <YOUR_GITHUB_REPO_URL>
cd <REPO_FOLDER>

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

### 2. Seed Database & Train ML Model
```bash
# Seed initial database tickets
python seed.py

# Train the local machine learning classifier
python train_local_model.py
```

### 3. Launch Servers

- **Start Public Storefront API (Port 8080)**:
  ```bash
  python main.py
  # or: uvicorn main:app --port 8080 --reload
  ```

- **Start Private Admin Server (Port 8081)**:
  ```bash
  python admin_server.py
  # or: uvicorn admin_server:app --port 8081 --reload
  ```

---

## 📁 Repository Structure

```
├── main.py                 # FastAPI Public Storefront Server (Port 8080)
├── admin_server.py         # FastAPI Private Admin Server (Port 8081)
├── database.py             # SQLAlchemy Database Models & Engine
├── train_local_model.py    # Script to train Scikit-Learn TF-IDF classifier
├── seed.py                 # Database Seeding Script with synthetic tickets
├── fast_ticket_classifier.pkl # Saved Machine Learning Model weights
├── requirements.txt        # Python dependencies
├── static/                 # Embedded HTML/JS frontend demo (index.html & admin.html)
└── README.md               # Documentation
```
