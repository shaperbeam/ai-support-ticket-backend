-- ====================================================================
-- TROJANOVA AI SUPPORT INTELLIGENCE — PRODUCTION DATABASE SCHEMA
-- Target Databases: PostgreSQL 14+, Supabase, Neon Serverless, Amazon RDS
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For semantic fuzzy search

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM ('P1', 'P2', 'P3', 'P4');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN PROGRESS', 'RESOLVED', 'ESCALATED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE customer_tier AS ENUM ('Free', 'Growth', 'Scale', 'Enterprise');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TICKETS TABLE
CREATE TABLE IF NOT EXISTS tickets (
    id VARCHAR(32) PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_tier customer_tier DEFAULT 'Growth',
    product_affected VARCHAR(100) NOT NULL,
    affected_users VARCHAR(100),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status ticket_status DEFAULT 'OPEN',
    sla_remaining_minutes INT DEFAULT 480,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AI PREDICTIONS & REASONING TELEMETRY
CREATE TABLE IF NOT EXISTS ai_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(32) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    predicted_category VARCHAR(100) NOT NULL,
    secondary_category VARCHAR(100),
    predicted_priority ticket_priority NOT NULL,
    predicted_department VARCHAR(100) NOT NULL,
    confidence_score NUMERIC(5,2) NOT NULL,
    explanation TEXT NOT NULL,
    signals JSONB DEFAULT '[]'::jsonb,
    is_ambiguous BOOLEAN DEFAULT FALSE,
    cluster_id VARCHAR(50),
    translated_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. HUMAN OVERRIDE AUDIT LOG (MODEL FEEDBACK LOOP)
CREATE TABLE IF NOT EXISTS audit_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(32) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    agent_id VARCHAR(100) NOT NULL,
    original_category VARCHAR(100) NOT NULL,
    original_priority ticket_priority NOT NULL,
    original_department VARCHAR(100) NOT NULL,
    corrected_category VARCHAR(100) NOT NULL,
    corrected_priority ticket_priority NOT NULL,
    corrected_department VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    retraining_weight_delta NUMERIC(4,3) DEFAULT 0.050,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INCIDENT & OUTAGE CLUSTERS
CREATE TABLE IF NOT EXISTS incident_clusters (
    id VARCHAR(50) PRIMARY KEY,
    cluster_name VARCHAR(200) NOT NULL,
    affected_service VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    summary TEXT NOT NULL,
    average_similarity_score NUMERIC(5,2) DEFAULT 90.0,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CLUSTER TICKET MAPPING
CREATE TABLE IF NOT EXISTS cluster_tickets (
    cluster_id VARCHAR(50) REFERENCES incident_clusters(id) ON DELETE CASCADE,
    ticket_id VARCHAR(32) REFERENCES tickets(id) ON DELETE CASCADE,
    similarity_score NUMERIC(5,2) NOT NULL,
    linked_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (cluster_id, ticket_id)
);

-- 8. INDEXES FOR HIGH-THROUGHPUT QUEUE SORTING
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_sla ON tickets(sla_remaining_minutes);
CREATE INDEX IF NOT EXISTS idx_predictions_prio ON ai_predictions(predicted_priority);
CREATE INDEX IF NOT EXISTS idx_predictions_dept ON ai_predictions(predicted_department);
CREATE INDEX IF NOT EXISTS idx_predictions_ambiguous ON ai_predictions(is_ambiguous);

-- 9. SEED DATA SAMPLE
INSERT INTO incident_clusters (id, cluster_name, affected_service, severity, summary, average_similarity_score)
VALUES (
    'INC-89', 
    'Payment Gateway 504 Timeout Outage', 
    'Payment Gateway & Checkout API', 
    'P1 — Critical Outage', 
    'Correlated multiple independent customer reports experiencing HTTP 504 Gateway Timeouts and checkout drop-offs.', 
    94.5
) ON CONFLICT (id) DO NOTHING;

INSERT INTO tickets (id, customer_name, customer_email, customer_tier, product_affected, affected_users, subject, description, status, sla_remaining_minutes)
VALUES (
    'TN-1042',
    'Arjun Mehta (FinTech Corp)',
    'arjun@fintechcorp.io',
    'Enterprise',
    'Payment Gateway',
    'All Organization / Public (>1,000)',
    'Our payment service has stopped working. Checkout failing completely',
    'Our payment service has stopped working. Hundreds of customers cannot complete checkout, and transactions are failing with 504 Gateway errors. Revenue is blocked and our support phone lines are flooded.',
    'OPEN',
    8
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ai_predictions (ticket_id, predicted_category, secondary_category, predicted_priority, predicted_department, confidence_score, explanation, signals, is_ambiguous, cluster_id)
VALUES (
    'TN-1042',
    'Payment / Service Outage',
    'Technical Bug / Exception',
    'P1',
    'Payments Engineering',
    94.0,
    'Detected high-severity keywords: stopped working, hundreds of customers, revenue blocked. Mandates immediate P1 escalation.',
    '["504 Gateway", "stopped working", "hundreds of customers", "revenue blocked"]'::jsonb,
    FALSE,
    'INC-89'
) ON CONFLICT DO NOTHING;
