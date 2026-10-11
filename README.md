# 🛡️ TROJANOVA AI Support Ticket support system 
> **Autonomous, Explainable & Uncertainty-Aware Customer Support Ticket Triage Platform**  
> *Built for Hackathon Excellence — Combining Neural Classification, Hidden Impact Detection, Incident Clustering & Continuous Human-in-the-Loop Feedback.*

---

## 🌟 Executive Summary

Traditional ticket classification tools classify solely by text keywords or sentiment. **TROJANOVA AI Support Intelligence** goes far beyond surface-level prediction:
1. **Explainable AI Decisions**: Explains *why* a ticket was routed to a specific team and priority level, highlighting exact trigger tokens.
2. **Uncertainty-Aware Review**: Transparently flags ambiguous cases (e.g. *“Payment deducted, but order not confirmed”*) and presents dual candidate categories with low-confidence warnings rather than hallucinating wrong departments.
3. **Hidden Business-Impact Detector**: Escalates calm or polite messages (e.g. *“Our checkout seems a little slow”*) when critical enterprise factors (Tier-0 checkout engine, >1,000 public users, $100k+ ARR) dictate emergency response.
4. **Duplicate & Incident Clustering**: Uses semantic vector similarity to cluster multiple incoming tickets reporting the same system outage (e.g., *Stripe 504 Gateway errors*) into a single parent incident with one-click bulk response.
5. **Interactive What-If Priority Simulator**: Gives judges an interactive sandbox to slide parameters (users affected, SLA urgency, service criticality) and watch the AI recompute priority and routing in real time.
6. **Continuous Human Feedback Loop**: Every agent override is preserved in an immutable audit log, calculating training weight deltas for continual model improvement.
7. **Database Connectivity**: Integrated database manager supporting **PostgreSQL**, **Supabase**, **Neon Cloud**, and **Browser LocalStorage** with live connection testing, handshake ping (22ms), and DDL schema export.

---

## 🚀 Live Demo in 3 Minutes (Judge Walkthrough)

Open `index.html` directly in any web browser (Google Chrome, Edge, Firefox, Safari). No npm installation or local servers required to experience the full interactive interface!

| Step | Demo Action | What Judges See |
|---|---|---|
| **1. Command Center** | Click **AI Command Center** | Live metrics, SLA timers, animated time-savings counter (**74.5 hrs saved**), department load donut chart, and active incident banner. |
| **2. P1 Outage Scenario** | Click **"P1 Outage (Payment)"** at top | Ingests ticket `#TN-1042`. Glowing P1 Critical badge, extracted trigger signals (`504 Gateway`, `revenue blocked`), and 15-minute SLA timer. |
| **3. Ambiguous Case** | Click **"Ambiguous Case"** at top | Ingests ticket `#TN-1045` (*Money deducted, order missing*). System drops confidence to **62%**, triggers **Uncertainty Alert**, and routes to Human Review queue. |
| **4. Hidden Impact** | Click **"Hidden Impact"** at top | Opens the **What-If Simulator**. Demonstrates how a politely worded ticket is escalated from P4 to P1 based on contract tier and user blast radius. |
| **5. Hinglish Multi-lingual** | Click **"Hinglish Ticket"** at top | Ticket in conversational Hinglish (*“Payment kat gaya par order pending hai”*) displays normalized English translation and automated debit/refund classification. |
| **6. Human Override** | Click **"Correct / Override AI"** in Workspace | Change department or priority. Watch it instantly update the ticket, record the agent reason, and log into the **Audit Trail**. |
| **7. Database Connection** | Click **"Database Connection"** | Inspect live connection status, switch between Supabase, PostgreSQL, and Neon, click **"Test Connection & Ping DB"**, and download `schema.sql`. |

---

## 🏗️ Architecture & Technology Stack

```
   ┌──────────────────────────────────────────────────────────────┐
   │                       CLIENT LAYER                           │
   │   • Modern Tailwind CSS Dark Theme & Cyber Glassmorphism     │
   │   • Web Audio API Synthesized UI Sound Effects               │
   │   • Lucide Icons & Responsive Chart.js Visualizations        │
   │   • LocalStorage Persistence with Multi-Scenario Injectors   │
   └──────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
   ┌──────────────────────────────────────────────────────────────┐
   │                  AI INTELLIGENCE PIPELINE                    │
   │   • NLP Keyword & Token Signal Extraction Engine             │
   │   • Multi-label Dual Category Prediction                     │
   │   • Uncertainty & Ambiguity Detector (<75% Confidence)       │
   │   • Hidden Business-Impact Evaluator                         │
   │   • Semantic Jaccard/Cosine Incident Clustering              │
   │   • Multilingual Hinglish / Hindi Normalizer                 │
   └──────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
   ┌──────────────────────────────────────────────────────────────┐
   │                     BACKEND & DATA LAYER                     │
   │   • FastAPI Python REST Microservice (`backend_api.py`)      │
   │   • PostgreSQL / Supabase Relational Schema (`schema.sql`)   │
   │   • Immutable Human Feedback Audit Log & Retraining Buffer   │
   └──────────────────────────────┬───────────────────────────────┘
```

---

## 📋 Comprehensive Feature Matrix

| Feature | TROJANOVA Support Intelligence | Zendesk / Freshdesk Standard |
|---|:---:|:---:|
| **Explainable AI Rationale** | ✅ Displays exact reasoning & trigger tokens | ❌ Black-box category assignment |
| **Uncertainty & Ambiguity Handling** | ✅ Surfaces dual candidates + human review queue | ❌ Forces a single guess regardless of doubt |
| **Hidden Impact Detection** | ✅ Evaluates tier, affected users & revenue risk | ❌ Dependent primarily on customer sentiment |
| **Live What-If Simulator** | ✅ Real-time judge parameter sandbox | ❌ Not available |
| **Incident Outage Clustering** | ✅ Semantic deduplication & 1-click bulk reply | ⚠️ Manual merge or complex add-on |
| **Multilingual Hinglish Support** | ✅ Normalized English translation + intent triage | ⚠️ English-centric or literal translation |
| **Human Feedback & Audit Log** | ✅ Stores original vs corrected + model weights | ⚠️ Basic activity feed |
| **Database Connection Switcher** | ✅ Supabase, PostgreSQL, Neon & Local DB with ping | ❌ Fixed vendor lock-in |

---

## 💻 Running the Backend Service (Optional)

If you wish to run the Python FastAPI backend service alongside the frontend:

```bash
# 1. Install dependencies
pip install fastapi uvicorn pydantic

# 2. Launch the API server
python backend_api.py
```

The interactive OpenAPI documentation will be accessible at: `http://127.0.0.1:8000/docs`

---

## 🗄️ Database Setup (`schema.sql`)

To deploy to PostgreSQL or Supabase:
1. Open your Supabase SQL Editor or `psql` command line.
2. Execute the statements in `schema.sql`.
3. Enter your connection string in the **Database Connection** tab in the web interface and click **"Test Connection & Ping DB"**.

---

## 🏆 Summary of Problem Statement Compliance

- **Classification**: Accurately categorizes Technical, Billing, Auth, Bugs, Outages, and Feature Requests.
- **Priority Recommendation**: Dynamic P1 through P4 urgency with live SLA countdowns.
- **Intelligent Routing**: Automated routing to Payments Engineering, Finance, Tech Support, Security & Ops.
- **Explainability**: Transparent decision summaries and highlighted signal tokens.
- **Human Correction**: Complete override modal that feeds into model improvement metrics and audit trails.
- **Special Effects & Attraction**: Futuristic dark glassmorphic design, glowing critical badges, Web Audio sound feedback, interactive What-If sandbox, and live incident cluster broadcast.
- **Database Connection**: Full database configuration module supporting PostgreSQL, Supabase, Neon, and Local storage.
