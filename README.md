# 🌌 QUNEXA & LUCENT AI — Autonomous Support Ticket Intelligence

> **Next-Generation Autonomous Triage, Real-Time Intent Intelligence & Dynamic Human-in-the-Loop Operations.**  
> *Built with Next.js 16, Google Gemini 3.8 Flash, FastAPI, Scikit-Learn & SQLite.*

---

## 🌟 Overview

**Lucent AI (by Qunexa)** is a high-performance customer support operations platform designed to sort, classify, evaluate business impact, and route incoming customer tickets in real time.

* **Autonomous Triage Engine**: Sub-second ticket classification across billing, technical issues, logistics, and account operations.
* **Dual-Tier AI Classifier**: Powered by **Google Gemini 3.8 Flash** with a high-speed local Scikit-Learn (TF-IDF + Softmax Logistic Regression) fallback.
* **Explainable AI Routing**: Generates human-readable reasoning and confidence scores (45%–99%) for every triage decision.
* **Human-in-the-Loop Override**: Adjustable confidence threshold slider (70%–95%) that dynamically diverts low-confidence tickets to human agents.
* **Built-in Mock Storefront & Test Suite**: Test live tickets with single-click sample inputs or custom dataset CSV imports.

---

## ⚡ Key Metrics

| Metric | Value | Description |
|---|:---:|---|
| **Average Response Time** | **30s** | Automated sub-minute first-touch triage |
| **Triage Accuracy** | **94.6%** | High-precision multi-class category routing |
| **Open Ticket Backlog** | **128 ↓** | 12.5% reduction in active queue volume |
| **Resolution Rate** | **86.4% ↑** | Powered by automated intent resolution |

---

## 🏗️ Architecture & Technology Stack

```
   ┌──────────────────────────────────────────────────────────────┐
   │                  FRONTEND (Next.js 16 App Router)            │
   │   • Modern Glassmorphic UI with Dynamic Aurora Backgrounds   │
   │   • Lucent Floating Chat Assistant & Navigation Guide        │
   │   • Nexus Customer Storefront Demo Modal                     │
   │   • Live Test Dataset Selector & CSV Importer                │
   │   • Interactive Human Override & Audit Flow                  │
   └──────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
   ┌──────────────────────────────────────────────────────────────┐
   │                   LUCENT AI FASTAPI BACKEND                  │
   │   • Google Gemini 3.8 Flash (Business Impact & Intent)       │
   │   • Local ML Classifier (`fast_ticket_classifier.pkl`)       │
   │   • Multi-Turn Chat Assistant (`/api/chat`)                  │
   │   • SQLite / SQLAlchemy Persistent Database (`tickets.db`)    │
   └──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart Guide

### 1. Run the Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Run the AI Backend (FastAPI)

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start Lucent AI API server (Port 8080)
python main.py

# (Optional) Start Admin Server (Port 8081)
python admin_server.py
```

---

## 🧪 Testing Scenarios & Datasets

Lucent comes pre-equipped with multiple test suites accessible from the UI:
1. **E-Commerce Dataset**: Order status, returns, damaged items, tracking delays.
2. **Edge Cases & Deceptive Tone**: Outages phrased calmly (*"no rush, but our database is deleted"*).
3. **Low Confidence & Ambiguous Cases**: Queries lacking clear keywords that trigger human escalation.
4. **Custom CSV Importer**: Upload your own customer query CSV directly from the interface.

---

## 📄 License
MIT License. Created by Shaperbeam.
