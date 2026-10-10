/**
 * TROJANOVA AI Support Intelligence - Core Client Engine
 * Explainable Triage, Uncertainty Detection, What-If Simulator,
 * Semantic Clustering, Database Connectivity, Web Audio FX & Confetti
 */

// ==========================================
// 1. DATA STATE & SEED CORPUS
// ==========================================

const INITIAL_TICKETS = [
  {
    id: "TN-1042",
    customerName: "Arjun Mehta (FinTech Corp)",
    customerEmail: "arjun@fintechcorp.io",
    customerTier: "Enterprise",
    subject: "Our payment service has stopped working. Checkout failing completely",
    description: "Our payment service has stopped working. Hundreds of customers cannot complete checkout, and transactions are failing with 504 Gateway errors. Revenue is blocked and our support phone lines are flooded.",
    product: "Payment Gateway",
    affectedUsers: "All Organization / Public (>1,000)",
    status: "OPEN",
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    slaRemainingMinutes: 8,
    category: "Payment / Service Outage",
    secondaryCategory: "Technical Bug / Exception",
    priority: "P1",
    priorityLabel: "P1 — Critical",
    department: "Payments Engineering",
    assignedAgent: "Vikram S. (Tier-3 On-Call)",
    confidence: 94,
    explanation: "Detected high-severity keywords: 'stopped working', 'hundreds of customers', 'revenue is blocked', and '504 Gateway errors'. Multiple affected customers and failed transactions trigger an immediate P1 emergency escalation.",
    signals: ["504 Gateway", "stopped working", "hundreds of customers", "revenue blocked", "checkout failing"],
    isAmbiguous: false,
    clusterId: "INC-89",
    clusterSimilarity: 96,
    isHumanCorrected: false,
    notes: ["Escalated to payment on-call rotation.", "Stripe status page shows elevated latency in ap-south-1."],
    auditTrail: [
      { timestamp: "14m ago", actor: "Ingestion Engine", action: "Ticket received via API" },
      { timestamp: "14m ago", actor: "AI Classifier", action: "Predicted P1 Critical (94% conf) -> Payments Engineering" },
      { timestamp: "10m ago", actor: "Auto-Router", action: "SLA rule triggered: 15-minute response window assigned" }
    ]
  },
  {
    id: "TN-1045",
    customerName: "Pooja Verma",
    customerEmail: "pooja.v@quickshop.in",
    customerTier: "Growth",
    subject: "Payment deducted from bank, but order not confirmed in cart",
    description: "Payment deducted from bank account Rs 4,999, but order is still showing not confirmed in cart. Where is my item? No confirmation email received either.",
    product: "Customer Portal",
    affectedUsers: "Just 1 User",
    status: "OPEN",
    createdAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    slaRemainingMinutes: 88,
    category: "Finance & Billing Dispute",
    secondaryCategory: "Technical Bug / Exception",
    priority: "P2",
    priorityLabel: "P2 — High",
    department: "Finance & Billing",
    assignedAgent: "Sneha Roy (Billing Lead)",
    confidence: 62,
    explanation: "Uncertainty detected: Split classification between Finance/Billing (52%) and Technical Order Fulfillment (48%). The customer experienced both a monetary deduction and a system state failure.",
    signals: ["payment deducted", "order not confirmed", "no confirmation email"],
    isAmbiguous: true,
    clusterId: null,
    clusterSimilarity: null,
    isHumanCorrected: false,
    notes: ["Waiting on merchant payment gateway reference."],
    auditTrail: [
      { timestamp: "32m ago", actor: "Ingestion Engine", action: "Ticket submitted via web form" },
      { timestamp: "32m ago", actor: "AI Classifier", action: "Flagged: Low confidence (62%). Routed to Human Review Queue." }
    ]
  },
  {
    id: "TN-1048",
    customerName: "Marcus Vance (Starlight Retail)",
    customerEmail: "m.vance@starlightretail.com",
    customerTier: "Enterprise",
    subject: "Our checkout seems a little slow and customers are complaining",
    description: "Our checkout seems a little slow today and customers are complaining that payments take forever. No rush, but please check when someone is available.",
    product: "Payment Gateway",
    affectedUsers: "All Organization / Public (>1,000)",
    status: "IN PROGRESS",
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    slaRemainingMinutes: 45,
    category: "Payment / Service Outage",
    secondaryCategory: "Technical Support",
    priority: "P1",
    priorityLabel: "P1 — Critical",
    department: "Payments Engineering",
    assignedAgent: "Ananya Iyer (Senior SRE)",
    confidence: 89,
    explanation: "Hidden Business-Impact Triggered: Although customer tone is calm and low-urgency ('seems a little slow', 'no rush'), Enterprise tier combined with Tier-0 Checkout service and >1,000 public users escalates priority to P1 Critical.",
    signals: ["checkout slow", "payments take forever", "Enterprise Tier ($100k+ ARR)", "1,000+ affected users"],
    isAmbiguous: false,
    clusterId: "INC-89",
    clusterSimilarity: 91,
    isHumanCorrected: false,
    notes: ["Investigating database connection pool saturation."],
    auditTrail: [
      { timestamp: "55m ago", actor: "Ingestion Engine", action: "Ticket received from VIP Enterprise portal" },
      { timestamp: "54m ago", actor: "AI Impact Detector", action: "Overrode low-urgency sentiment due to Tier-0 service risk" }
    ]
  },
  {
    id: "TN-1051",
    customerName: "Rahul Deshmukh",
    customerEmail: "rahul.deshmukh@gmail.com",
    customerTier: "Growth",
    subject: "Payment kat gaya par order pending dikha raha hai",
    description: "Mera payment kat gaya bank account se 1200 rupees, par app me order pending dikha raha hai. Please check urgently or refund my money.",
    product: "Mobile App",
    affectedUsers: "Just 1 User",
    status: "OPEN",
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    slaRemainingMinutes: 105,
    category: "Finance & Billing Dispute",
    secondaryCategory: "Technical Bug / Exception",
    priority: "P3",
    priorityLabel: "P3 — Medium",
    department: "Finance & Billing",
    assignedAgent: "Karan Johar (Support Specialist)",
    confidence: 84,
    explanation: "Multilingual Ticket (Hinglish/Hindi): Normalized query. Detected debit intent ('payment kat gaya') combined with pending status ('order pending dikha raha hai') and refund demand ('refund my money').",
    signals: ["payment kat gaya", "bank account", "order pending", "refund my money"],
    isAmbiguous: false,
    translatedText: "[Hinglish to English Normalized]: 'My payment of 1,200 rupees was debited from my bank account, but the order is showing as pending in the mobile app. Please check urgently or refund my money.'",
    clusterId: null,
    clusterSimilarity: null,
    isHumanCorrected: false,
    notes: [],
    auditTrail: [
      { timestamp: "75m ago", actor: "Ingestion Engine", action: "Ticket received via Mobile SDK" },
      { timestamp: "75m ago", actor: "NLP Normalizer", action: "Detected Hinglish text; generated normalized English translation." }
    ]
  },
  {
    id: "TN-1052",
    customerName: "Deepak Chopra (OmniKart)",
    customerEmail: "d.chopra@omnikart.com",
    customerTier: "Scale",
    subject: "Users getting 504 Gateway Timeout on Razorpay payment step",
    description: "Several customers have sent screenshots showing 504 Gateway Timeout right after entering OTP on Razorpay payment modal. Webhook events are failing.",
    product: "Payment Gateway",
    affectedUsers: "Multiple Teams (50-200)",
    status: "IN PROGRESS",
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    slaRemainingMinutes: 18,
    category: "Payment / Service Outage",
    secondaryCategory: "Technical Bug / Exception",
    priority: "P1",
    priorityLabel: "P1 — Critical",
    department: "Payments Engineering",
    assignedAgent: "Vikram S. (Tier-3 On-Call)",
    confidence: 96,
    explanation: "Exact semantic match with active incident #INC-89. Multiple users experiencing 504 Gateway errors on checkout gateway.",
    signals: ["504 Gateway Timeout", "Razorpay", "Webhook failing"],
    isAmbiguous: false,
    clusterId: "INC-89",
    clusterSimilarity: 94,
    isHumanCorrected: false,
    notes: ["Linked to Parent Incident #INC-89."],
    auditTrail: [
      { timestamp: "22m ago", actor: "AI Cluster Detector", action: "Correlated to Incident #INC-89 with 94% similarity." }
    ]
  },
  {
    id: "TN-1039",
    customerName: "Elena Rostova",
    customerEmail: "elena@techcorp.de",
    customerTier: "Free",
    subject: "Unable to reset SSO account password",
    description: "I clicked the forgot password link three times but haven't received the reset link email in my inbox or spam folder.",
    product: "Auth Service",
    affectedUsers: "Just 1 User",
    status: "RESOLVED",
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    slaRemainingMinutes: 0,
    category: "User Authentication & SSO",
    secondaryCategory: "Technical Support",
    priority: "P4",
    priorityLabel: "P4 — Low",
    department: "Account Management",
    assignedAgent: "Sameer K. (Tier-1 Support)",
    confidence: 97,
    explanation: "Routine single-user credential access query. No system-wide breach or outage signals detected.",
    signals: ["forgot password", "reset link", "spam folder"],
    isAmbiguous: false,
    clusterId: null,
    clusterSimilarity: null,
    isHumanCorrected: true,
    notes: ["Sent manual verification reset token. Customer confirmed login."],
    auditTrail: [
      { timestamp: "3h ago", actor: "AI Classifier", action: "Categorized as User Auth (97% conf)" },
      { timestamp: "2h ago", actor: "Sameer K.", action: "Marked ticket as RESOLVED" }
    ]
  }
];

const INITIAL_CLUSTERS = [
  {
    id: "INC-89",
    name: "Payment Gateway 504 Timeout Outage",
    affectedService: "Payment Gateway & Checkout API",
    ticketIds: ["TN-1042", "TN-1048", "TN-1052"],
    severity: "P1 — Critical Outage",
    detectionTime: "25 minutes ago",
    status: "ACTIVE INVESTIGATION",
    summary: "Correlated 3 independent customer reports experiencing HTTP 504 Gateway Timeouts and order drop-offs during payment confirmation.",
    averageSimilarity: 94
  },
  {
    id: "INC-92",
    name: "Mobile App v4.2 iOS Crash on Launch",
    affectedService: "Mobile App (iOS)",
    ticketIds: ["TN-1033", "TN-1036"],
    severity: "P2 — High Priority",
    detectionTime: "1 hour ago",
    status: "PATCH DEPLOYED",
    summary: "Correlated crash reports on iOS 17.5 after recent release.",
    averageSimilarity: 91
  }
];

const INITIAL_AUDITS = [
  {
    id: "AUD-101",
    timestamp: "1 hour ago",
    ticketId: "TN-1039",
    agent: "Sameer K. (Tier-1 Support)",
    original: "Technical Support | P3 | Tech Support",
    corrected: "User Authentication & SSO | P4 | Account Management",
    reason: "Single password reset is a routine credential query, not a technical software bug. Lowered to P4 Low.",
    modelImpact: "Weights updated: +0.08 Account Management for 'reset link'"
  },
  {
    id: "AUD-098",
    timestamp: "3 hours ago",
    ticketId: "TN-1028",
    agent: "Sneha Roy (Billing Lead)",
    original: "Feature Request | P4 | Product Team",
    corrected: "Finance & Billing Dispute | P3 | Finance & Billing",
    reason: "Customer was asking for invoice tax exemption, which belongs to billing finance, not feature backlog.",
    modelImpact: "Weights updated: +0.12 Finance for 'tax exemption invoice'"
  }
];

// Active App State
let tickets = JSON.parse(localStorage.getItem("trojanova_tickets")) || INITIAL_TICKETS;
let incidentClusters = JSON.parse(localStorage.getItem("trojanova_clusters")) || INITIAL_CLUSTERS;
let auditLogs = JSON.parse(localStorage.getItem("trojanova_audits")) || INITIAL_AUDITS;
let activeTicketId = tickets[0]?.id || "TN-1042";
let currentTab = "dashboard";
let soundEnabled = true;
let simulatedDbEngine = "Supabase / PostgreSQL Pool";
let isDbConnected = true;

// Charts references
let categoryChart = null;
let departmentChart = null;
let accuracyChart = null;
let resolutionChart = null;

// ==========================================
// 2. AUDIO & HAPTIC SYNTHESIZER (WEB AUDIO API)
// ==========================================

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playBleep() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

function playSuccessChime() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.2);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.frequency.setValueAtTime(880, now + 0.12); // A5
    gain2.gain.setValueAtTime(0.08, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.35);
  } catch (e) {}
}

function playAlertPing() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {}
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const icon = document.getElementById("soundIcon");
  if (soundEnabled) {
    if (icon) icon.setAttribute("data-lucide", "volume-2");
    showToast("Audio effects enabled 🎵", "info");
    playSuccessChime();
  } else {
    if (icon) icon.setAttribute("data-lucide", "volume-x");
    showToast("Audio muted 🔇", "info");
  }
  if (window.lucide) lucide.createIcons();
}

// ==========================================
// CONFETTI & CELEBRATION FX
// ==========================================
function triggerConfetti() {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      position: fixed;
      z-index: 9999;
      width: ${Math.random() * 8 + 6}px;
      height: ${Math.random() * 8 + 6}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      top: ${Math.random() * 40 + 30}%;
      left: ${Math.random() * 60 + 20}%;
      pointer-events: none;
      opacity: 1;
      transform: scale(1) rotate(0deg);
      transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    document.body.appendChild(p);

    requestAnimationFrame(() => {
      p.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 300 + 100}px) rotate(${Math.random() * 360}deg) scale(0)`;
      p.style.opacity = '0';
    });

    setTimeout(() => p.remove(), 1300);
  }
}

// ==========================================
// 3. TOAST NOTIFICATION SYSTEM
// ==========================================

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  const colorClasses = {
    success: "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-lg",
    error: "bg-rose-50 text-rose-800 border-rose-300 shadow-lg",
    warning: "bg-amber-50 text-amber-800 border-amber-300 shadow-lg",
    info: "bg-indigo-50 text-indigo-800 border-indigo-200 shadow-lg",
  }[type] || "bg-white text-slate-800 border-slate-200 shadow-lg";

  toast.className = `flex items-center space-x-2.5 px-4 py-3 rounded-2xl border text-xs font-bold transform transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto ${colorClasses}`;
  
  const iconName = {
    success: "check-circle-2",
    error: "alert-circle",
    warning: "alert-triangle",
    info: "info"
  }[type] || "info";

  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-4 h-4"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  });

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================
// 4. NAVIGATION & TAB SWITCHING
// ==========================================

function switchTab(tabId) {
  currentTab = tabId;

  const sections = document.querySelectorAll("main > section");
  sections.forEach(sec => sec.classList.add("hidden"));

  const target = document.getElementById(`tab-${tabId}`);
  if (target) {
    target.classList.remove("hidden");
    target.classList.remove("animate-fade-in-up");
    void target.offsetWidth;
    target.classList.add("animate-fade-in-up");
  }

  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach(btn => {
    btn.classList.remove("bg-brand-50", "text-brand-700", "font-bold", "border", "border-brand-200", "shadow-2xs");
    btn.classList.add("text-slate-600");
  });

  const activeBtn = document.getElementById(`nav-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.add("bg-brand-50", "text-brand-700", "font-bold", "border", "border-brand-200", "shadow-2xs");
    activeBtn.classList.remove("text-slate-600");
  }

  if (tabId === "dashboard") {
    renderDashboardCharts();
  } else if (tabId === "tickets") {
    renderTicketTable();
  } else if (tabId === "agent-workspace") {
    loadTicketIntoWorkspace(activeTicketId);
  } else if (tabId === "simulator") {
    runSimulation();
  } else if (tabId === "clusters") {
    renderClusterCards();
  } else if (tabId === "analytics") {
    renderAnalyticsCharts();
  } else if (tabId === "audit") {
    renderAuditTable();
  }

  if (window.lucide) lucide.createIcons();
}

// ==========================================
// 5. NLP CLASSIFIER & REASONING ENGINE
// ==========================================

function runClassifierEngine(text, customerTier = "Growth", affectedUsers = "1 User", product = "Payment Gateway") {
  const lower = text.toLowerCase();
  
  const outageKeywords = ["stopped working", "down", "outage", "504", "crash", "gateway error", "failing", "failed", "hundreds of customers", "revenue blocked", "checkout failing", "unresponsive"];
  const billingKeywords = ["payment deducted", "deducted", "charged", "refund", "invoice", "receipt", "double charge", "rupees", "bank account", "subscription"];
  const authKeywords = ["password", "sso", "login", "reset link", "account access", "locked out", "two factor", "2fa"];
  const bugKeywords = ["bug", "glitch", "error", "exception", "freeze", "crash", "slow", "broken"];
  const featureKeywords = ["feature request", "would love", "suggestion", "add support", "dark mode", "enhancement"];
  
  let outageScore = outageKeywords.filter(k => lower.includes(k)).length * 3;
  let billingScore = billingKeywords.filter(k => lower.includes(k)).length * 2.5;
  let authScore = authKeywords.filter(k => lower.includes(k)).length * 3;
  let bugScore = bugKeywords.filter(k => lower.includes(k)).length * 1.5;
  let featureScore = featureKeywords.filter(k => lower.includes(k)).length * 2;

  const signals = [];
  [...outageKeywords, ...billingKeywords, ...authKeywords, ...bugKeywords, ...featureKeywords].forEach(kw => {
    if (lower.includes(kw) && !signals.includes(kw)) {
      signals.push(kw);
    }
  });

  let isHinglish = false;
  let translatedText = null;
  if (lower.includes("kat gaya") || lower.includes("dikha raha") || lower.includes("mera payment") || lower.includes("hai")) {
    isHinglish = true;
    billingScore += 3;
    signals.push("Hinglish text detected");
    translatedText = "[Hinglish to English Normalized]: 'Payment debited from account, but status pending. Requesting immediate verification or refund.'";
  }

  let category = "Technical Bug / Exception";
  let secondaryCategory = "Technical Support";
  let department = "Technical Support";
  let confidence = 86;
  let isAmbiguous = false;

  if ((lower.includes("deducted") || lower.includes("charged") || billingScore > 2) && 
      (lower.includes("order") || lower.includes("cart") || lower.includes("not confirmed") || lower.includes("item"))) {
    category = "Finance & Billing Dispute";
    secondaryCategory = "Technical Bug / Exception";
    department = "Finance & Billing";
    confidence = 62;
    isAmbiguous = true;
  } else if (outageScore >= 3 || lower.includes("504") || lower.includes("stopped working")) {
    category = "Payment / Service Outage";
    secondaryCategory = "Technical Bug / Exception";
    department = "Payments Engineering";
    confidence = Math.min(97, 85 + outageScore * 3);
  } else if (billingScore > authScore && billingScore > bugScore) {
    category = "Finance & Billing Dispute";
    secondaryCategory = "Technical Support";
    department = "Finance & Billing";
    confidence = Math.min(95, 78 + billingScore * 4);
  } else if (authScore > 0) {
    category = "User Authentication & SSO";
    secondaryCategory = "Security & Ops";
    department = "Account Management";
    confidence = Math.min(98, 82 + authScore * 4);
  } else if (featureScore > bugScore) {
    category = "Feature Request & Feedback";
    secondaryCategory = "Product Team";
    department = "Technical Support";
    confidence = 90;
  }

  let priority = "P3";
  let priorityLabel = "P3 — Medium";
  let explanation = "";

  const isEnterprise = customerTier === "Enterprise";
  const isHighUsers = affectedUsers.includes(">1,000") || affectedUsers.includes("50-200");
  const isCoreService = product.includes("Payment") || product.includes("Auth");

  if (category === "Payment / Service Outage" || outageScore >= 4 || (isEnterprise && isHighUsers && isCoreService)) {
    priority = "P1";
    priorityLabel = "P1 — Critical";
    explanation = `High-impact outage signals detected. Multi-customer impact and ${isEnterprise ? 'Enterprise customer tier' : 'critical infrastructure failure'} mandates P1 escalation and immediate 15-minute SLA.`;
  } else if (isAmbiguous) {
    priority = "P2";
    priorityLabel = "P2 — High";
    explanation = "Uncertainty Flag: Split categorization between Billing and Technical Order processing. Routed to high priority for human confirmation.";
  } else if (isEnterprise || isHighUsers) {
    priority = "P2";
    priorityLabel = "P2 — High";
    explanation = `Escalated to P2 based on business impact: ${customerTier} contract tier with ${affectedUsers}.`;
  } else if (category === "User Authentication & SSO") {
    priority = "P4";
    priorityLabel = "P4 — Low";
    explanation = "Single-user credential query. Standard self-service or Tier-1 support queue.";
  } else {
    priority = "P3";
    priorityLabel = "P3 — Medium";
    explanation = "Standard support ticket with localized user impact. Assigned normal SLA window.";
  }

  return {
    category,
    secondaryCategory,
    priority,
    priorityLabel,
    department,
    confidence,
    isAmbiguous,
    explanation,
    signals,
    isHinglish,
    translatedText
  };
}

// ==========================================
// 6. DASHBOARD & TELEMETRY
// ==========================================

function updateDashboardMetrics() {
  const total = tickets.length;
  const open = tickets.filter(t => t.status === "OPEN" || t.status === "IN PROGRESS").length;
  const resolved = tickets.filter(t => t.status === "RESOLVED").length;
  const critical = tickets.filter(t => (t.priority === "P1" || t.priority === "P2") && t.status !== "RESOLVED").length;
  const overdue = tickets.filter(t => t.slaRemainingMinutes <= 0 && t.status !== "RESOLVED").length;
  const ambiguous = tickets.filter(t => t.isAmbiguous).length;
  const corrected = tickets.filter(t => t.isHumanCorrected).length;

  const hoursSaved = ((total * 11.5) / 60).toFixed(1);

  const elTotal = document.getElementById("statTotalTickets");
  const elOpen = document.getElementById("statOpenTickets");
  const elResolved = document.getElementById("statResolvedTickets");
  const elCritical = document.getElementById("statCriticalTickets");
  const elOverdue = document.getElementById("statOverdueTickets");
  const elAmbiguous = document.getElementById("statAmbiguousTickets");
  const elTimeSaved = document.getElementById("statTimeSaved");
  const elQueueBadge = document.getElementById("queueBadgeCount");
  const elAuditCount = document.getElementById("auditLogCount");
  const elSidebarOverride = document.getElementById("sidebarOverrideRate");
  const elAnalyticsOverride = document.getElementById("analyticsOverrideRate");

  if (elTotal) elTotal.textContent = total;
  if (elOpen) elOpen.textContent = open;
  if (elResolved) elResolved.textContent = resolved;
  if (elCritical) elCritical.textContent = critical;
  if (elOverdue) elOverdue.textContent = overdue;
  if (elAmbiguous) elAmbiguous.textContent = ambiguous;
  if (elTimeSaved) elTimeSaved.textContent = `${hoursSaved} hrs`;
  if (elQueueBadge) elQueueBadge.textContent = open;
  if (elAuditCount) elAuditCount.textContent = auditLogs.length;

  const overrideRate = total > 0 ? ((corrected / total) * 100).toFixed(1) : "0.0";
  if (elSidebarOverride) elSidebarOverride.textContent = `${overrideRate}%`;
  if (elAnalyticsOverride) elAnalyticsOverride.textContent = `${overrideRate}%`;

  const hasActiveOutage = incidentClusters.some(c => c.severity.includes("Critical"));
  const alertBanner = document.getElementById("clusterAlertBanner");
  if (alertBanner) {
    if (hasActiveOutage) {
      alertBanner.classList.remove("hidden");
    } else {
      alertBanner.classList.add("hidden");
    }
  }
}

function renderDashboardCharts() {
  updateDashboardMetrics();

  const ctxCategory = document.getElementById("categoryDistributionChart");
  if (ctxCategory) {
    if (categoryChart) categoryChart.destroy();

    const categories = ["Payment/Outage", "Finance/Billing", "Auth & SSO", "Tech Bug", "Feature Req"];
    const p1Counts = [4, 1, 0, 1, 0];
    const p2Counts = [2, 3, 1, 2, 0];
    const p3p4Counts = [1, 5, 6, 8, 8];

    categoryChart = new Chart(ctxCategory, {
      type: "bar",
      data: {
        labels: categories,
        datasets: [
          {
            label: "P1 Critical",
            data: p1Counts,
            backgroundColor: "#f43f5e",
            borderRadius: 6
          },
          {
            label: "P2 High",
            data: p2Counts,
            backgroundColor: "#f59e0b",
            borderRadius: 6
          },
          {
            label: "P3/P4 Medium/Low",
            data: p3p4Counts,
            backgroundColor: "#6366f1",
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: "#f1f5f9" },
            ticks: { color: "#64748b", font: { size: 11 } }
          },
          y: {
            stacked: true,
            grid: { color: "#f1f5f9" },
            ticks: { color: "#64748b", font: { size: 11 } }
          }
        }
      }
    });
  }

  const ctxDept = document.getElementById("departmentDonutChart");
  if (ctxDept) {
    if (departmentChart) departmentChart.destroy();

    departmentChart = new Chart(ctxDept, {
      type: "doughnut",
      data: {
        labels: ["Payments Eng", "Tech Support", "Finance & Billing", "Security & Ops", "Account Mgmt"],
        datasets: [{
          data: [34, 28, 22, 10, 6],
          backgroundColor: ["#ef4444", "#06b6d4", "#6366f1", "#8b5cf6", "#10b981"],
          borderWidth: 2,
          borderColor: "#ffffff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        cutout: "70%"
      }
    });
  }

  const urgentContainer = document.getElementById("dashboardUrgentList");
  if (urgentContainer) {
    const criticalTickets = tickets.filter(t => (t.priority === "P1" || t.isAmbiguous) && t.status !== "RESOLVED").slice(0, 3);
    if (criticalTickets.length > 0) {
      urgentContainer.innerHTML = criticalTickets.map(t => `
        <div class="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer" onclick="openTicketDetails('${t.id}')">
          <div class="flex items-center space-x-3">
            <span class="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold ${t.priority === 'P1' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
              ${t.priority}
            </span>
            <div>
              <div class="font-bold text-slate-800 text-xs">${t.subject}</div>
              <div class="text-[11px] text-slate-500">${t.customerName} • <span class="font-semibold text-slate-600">${t.department}</span></div>
            </div>
          </div>
          <div class="flex items-center space-x-3 text-right">
            <span class="text-xs font-mono font-bold ${t.slaRemainingMinutes <= 15 ? 'text-rose-600' : 'text-slate-600'}">
              ${t.slaRemainingMinutes}m SLA left
            </span>
            <button class="px-3 py-1 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs font-bold transition shadow-2xs">
              Inspect
            </button>
          </div>
        </div>
      `).join("");
    } else {
      urgentContainer.innerHTML = `<div class="p-4 text-center text-slate-400">No active critical SLA tickets. All systems operational.</div>`;
    }
  }
}

// ==========================================
// 7. SMART TICKET SUBMISSION
// ==========================================

function triggerLiveAiCheck() {
  const subject = document.getElementById("ticketSubject")?.value || "";
  const body = document.getElementById("ticketBody")?.value || "";
  const tier = document.getElementById("custTier")?.value || "Growth";
  const users = document.getElementById("affectedUsers")?.value || "1 User";
  const product = document.getElementById("prodAffected")?.value || "Payment Gateway";

  const fullText = subject + " " + body;
  if (fullText.trim().length < 10) return;

  const result = runClassifierEngine(fullText, tier, users, product);

  const elCat = document.getElementById("liveCatForecast");
  const elPrio = document.getElementById("livePrioForecast");
  const elDept = document.getElementById("liveDeptForecast");
  const elConf = document.getElementById("liveConfForecast");
  const elSla = document.getElementById("liveSlaForecast");

  if (elCat) elCat.textContent = result.category;
  if (elDept) elDept.textContent = result.department;
  if (elConf) elConf.textContent = `${result.confidence}% Confidence`;

  if (elPrio) {
    elPrio.textContent = result.priorityLabel;
    elPrio.className = `font-bold px-2 py-0.5 rounded border text-xs ${
      result.priority === "P1" ? "bg-rose-500/20 text-rose-400 border-rose-500/30" :
      result.priority === "P2" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
      "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
    }`;
  }

  if (elSla) {
    elSla.textContent = result.priority === "P1" ? "15 min response" :
                        result.priority === "P2" ? "2 hr response" :
                        result.priority === "P3" ? "8 hr response" : "24 hr response";
  }

  const container = document.getElementById("missingInfoSuggestions");
  if (container) {
    let suggestionsHtml = `
      <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-1">
        <span class="text-emerald-400 font-bold flex items-center gap-1">
          <i data-lucide="check" class="w-3.5 h-3.5"></i> Signals Detected: ${result.signals.length}
        </span>
        <p class="text-[11px] text-slate-400">Tokens extracted: ${result.signals.slice(0, 3).join(", ") || "analyzing..."}</p>
      </div>
    `;

    if (!lowerContains(fullText, ["error code", "504", "403", "screenshot", "log", "transaction id", "tx_"])) {
      suggestionsHtml += `
        <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
          <span class="text-amber-300 font-bold flex items-center gap-1">
            <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> Proactive AI Follow-up
          </span>
          <p class="text-[11px] text-slate-300">"Did you receive a specific Transaction Reference or HTTP error code?"</p>
          <button type="button" onclick="appendInfoToBody(' [Transaction Ref: TXN_98412239; HTTP 504 Timeout]')" class="text-[10px] text-brand-300 hover:text-white underline font-bold">
            + Insert Error Code & Ref ID
          </button>
        </div>
      `;
    }

    container.innerHTML = suggestionsHtml;
    if (window.lucide) lucide.createIcons();
  }
}

function lowerContains(text, list) {
  const lower = text.toLowerCase();
  return list.some(item => lower.includes(item));
}

function appendInfoToBody(extraText) {
  const bodyInput = document.getElementById("ticketBody");
  if (bodyInput) {
    bodyInput.value += extraText;
    triggerLiveAiCheck();
    playBleep();
  }
}

function fillFormTemplate(type) {
  playBleep();
  const nameEl = document.getElementById("custName");
  const emailEl = document.getElementById("custEmail");
  const tierEl = document.getElementById("custTier");
  const prodEl = document.getElementById("prodAffected");
  const usersEl = document.getElementById("affectedUsers");
  const subjEl = document.getElementById("ticketSubject");
  const bodyEl = document.getElementById("ticketBody");

  if (type === "p1-sample") {
    if (nameEl) nameEl.value = "Kavita Rao (HyperPay Labs)";
    if (emailEl) emailEl.value = "kavita@hyperpay.io";
    if (tierEl) tierEl.value = "Enterprise";
    if (prodEl) prodEl.value = "Payment Gateway";
    if (usersEl) usersEl.value = "All Organization / Public (>1,000)";
    if (subjEl) subjEl.value = "CRITICAL: Complete checkout failure on payment gateway cluster";
    if (bodyEl) bodyEl.value = "Payment checkout is completely unresponsive across production. Over 300 customers are reporting failed payments with 504 Gateway Timeouts. Revenue is directly blocked and our operations are halted.";
  } else if (type === "ambiguous-sample") {
    if (nameEl) nameEl.value = "Sameer Tandon";
    if (emailEl) emailEl.value = "sameer.t@gmail.com";
    if (tierEl) tierEl.value = "Growth";
    if (prodEl) prodEl.value = "Customer Portal";
    if (usersEl) usersEl.value = "Just 1 User";
    if (subjEl) subjEl.value = "Money deducted from bank but order disappeared";
    if (bodyEl) bodyEl.value = "Money of Rs 3,499 was deducted from my HDFC bank account, but your website says order placement failed. Please verify if my order will be delivered or if I will get an immediate refund.";
  } else if (type === "hinglish-sample") {
    if (nameEl) nameEl.value = "Vikas Patil";
    if (emailEl) emailEl.value = "vikas.p@yahoo.com";
    if (tierEl) tierEl.value = "Growth";
    if (prodEl) prodEl.value = "Mobile App";
    if (usersEl) usersEl.value = "Just 1 User";
    if (subjEl) subjEl.value = "Payment kat gaya par app me error dikha raha hai";
    if (bodyEl) bodyEl.value = "Bhai mera account se 850 kat gaya par app screen freeze ho gaya. Order pending dikha raha hai. Please urgent fix karo ya refund initiate karo.";
  }

  triggerLiveAiCheck();
}

function simulateFileUpload() {
  playBleep();
  const label = document.getElementById("attachedFileName");
  if (label) {
    label.innerHTML = `
      <span class="text-emerald-600 font-bold flex items-center justify-center gap-1">
        <i data-lucide="check" class="w-3.5 h-3.5"></i> Attached: <strong>payment_gateway_504_stacktrace.log</strong> (248 KB)
      </span>
    `;
    if (window.lucide) lucide.createIcons();
  }
  showToast("File attached: payment_gateway_504_stacktrace.log", "info");
}

function clearSubmitForm() {
  document.getElementById("ticketSubmissionForm")?.reset();
  triggerLiveAiCheck();
}

function handleTicketSubmit(e) {
  e.preventDefault();
  playSuccessChime();

  const name = document.getElementById("custName").value;
  const email = document.getElementById("custEmail").value;
  const tier = document.getElementById("custTier").value;
  const prod = document.getElementById("prodAffected").value;
  const users = document.getElementById("affectedUsers").value;
  const subject = document.getElementById("ticketSubject").value;
  const body = document.getElementById("ticketBody").value;

  const result = runClassifierEngine(subject + " " + body, tier, users, prod);

  const newId = `TN-${1054 + tickets.length}`;
  const slaMins = result.priority === "P1" ? 15 : result.priority === "P2" ? 120 : result.priority === "P3" ? 480 : 1440;

  const newTicket = {
    id: newId,
    customerName: name,
    customerEmail: email,
    customerTier: tier,
    subject: subject,
    description: body,
    product: prod,
    affectedUsers: users,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    slaRemainingMinutes: slaMins,
    category: result.category,
    secondaryCategory: result.secondaryCategory,
    priority: result.priority,
    priorityLabel: result.priorityLabel,
    department: result.department,
    assignedAgent: result.department === "Payments Engineering" ? "Vikram S. (Tier-3 On-Call)" : "Sneha Roy (Billing Lead)",
    confidence: result.confidence,
    explanation: result.explanation,
    signals: result.signals,
    isAmbiguous: result.isAmbiguous,
    translatedText: result.translatedText,
    clusterId: result.category.includes("Outage") ? "INC-89" : null,
    clusterSimilarity: result.category.includes("Outage") ? 92 : null,
    isHumanCorrected: false,
    notes: ["Ingested via Smart AI Form with auto-detected signals."],
    auditTrail: [
      { timestamp: "Just now", actor: "Ingestion Engine", action: "Ticket submitted and ingested" },
      { timestamp: "Just now", actor: "AI Classifier", action: `Classified as ${result.category} (${result.priority}) with ${result.confidence}% confidence` }
    ]
  };

  tickets.unshift(newTicket);
  localStorage.setItem("trojanova_tickets", JSON.stringify(tickets));

  showToast(`Ticket ${newId} created & triaged autonomously!`, "success");

  activeTicketId = newId;
  switchTab("agent-workspace");
}

// ==========================================
// 8. ALL TICKETS QUEUE & TABLE
// ==========================================

function renderTicketTable() {
  const tbody = document.getElementById("ticketTableBody");
  const emptyState = document.getElementById("emptyTableState");
  if (!tbody) return;

  const searchQuery = (document.getElementById("queueSearchInput")?.value || "").toLowerCase();
  const filterPrio = document.getElementById("filterPriority")?.value || "ALL";
  const filterDept = document.getElementById("filterDepartment")?.value || "ALL";
  const filterReview = document.getElementById("filterReview")?.value || "ALL";
  const sortBy = document.getElementById("queueSortSelect")?.value || "urgency";

  let filtered = tickets.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(searchQuery) ||
                        t.subject.toLowerCase().includes(searchQuery) ||
                        t.customerName.toLowerCase().includes(searchQuery) ||
                        t.category.toLowerCase().includes(searchQuery);

    if (!matchSearch) return false;

    if (filterPrio !== "ALL" && t.priority !== filterPrio) return false;
    if (filterDept !== "ALL" && t.department !== filterDept) return false;

    if (filterReview === "ambiguous" && !t.isAmbiguous) return false;
    if (filterReview === "corrected" && !t.isHumanCorrected) return false;
    if (filterReview === "clustered" && !t.clusterId) return false;

    return true;
  });

  if (sortBy === "urgency") {
    filtered.sort((a, b) => a.slaRemainingMinutes - b.slaRemainingMinutes);
  } else if (sortBy === "confidence-asc") {
    filtered.sort((a, b) => a.confidence - b.confidence);
  } else if (sortBy === "newest") {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === "priority") {
    const order = { P1: 1, P2: 2, P3: 3, P4: 4 };
    filtered.sort((a, b) => order[a.priority] - order[b.priority]);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

  tbody.innerHTML = filtered.map(t => {
    const prioColor = t.priority === "P1" ? "bg-rose-50 text-rose-700 border border-rose-200 font-bold" :
                      t.priority === "P2" ? "bg-amber-50 text-amber-700 border border-amber-200 font-semibold" :
                      t.priority === "P3" ? "bg-blue-50 text-blue-700 border border-blue-200 font-semibold" :
                      "bg-slate-100 text-slate-700 border border-slate-200";

    const confColor = t.confidence >= 85 ? "text-emerald-700" :
                      t.confidence >= 70 ? "text-indigo-700" : "text-amber-700";

    const slaDisplay = t.status === "RESOLVED" ? '<span class="text-emerald-700 font-bold">Resolved</span>' :
                       t.slaRemainingMinutes <= 15 ? `<span class="text-rose-600 font-mono font-bold">${t.slaRemainingMinutes}m left</span>` :
                       `<span class="text-slate-600 font-mono font-medium">${Math.floor(t.slaRemainingMinutes / 60)}h ${t.slaRemainingMinutes % 60}m</span>`;

    return `
      <tr class="hover:bg-slate-50/90 transition cursor-pointer ${t.id === activeTicketId ? 'bg-indigo-50/60' : ''}" onclick="openTicketDetails('${t.id}')">
        <td class="py-3 px-4 font-mono font-bold text-slate-900">
          <div class="flex items-center gap-1.5">
            <span>${t.id}</span>
            ${t.isAmbiguous ? '<span class="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded font-sans font-bold" title="Low AI Confidence">Review</span>' : ''}
          </div>
        </td>

        <td class="py-3 px-4 max-w-xs">
          <div class="font-bold text-slate-900 truncate">${t.subject}</div>
          <div class="text-[11px] text-slate-500 truncate">${t.customerName} • <span class="text-slate-400">${t.product}</span></div>
        </td>

        <td class="py-3 px-4">
          <span class="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 border border-slate-200 text-slate-700">
            ${t.category}
          </span>
        </td>

        <td class="py-3 px-4">
          <span class="px-2.5 py-0.5 rounded-lg text-[11px] border ${prioColor}">
            ${t.priority}
          </span>
        </td>

        <td class="py-3 px-4">
          <div class="flex items-center space-x-1.5 font-mono">
            <span class="font-bold ${confColor}">${t.confidence}%</span>
          </div>
        </td>

        <td class="py-3 px-4">
          <div class="text-slate-800 font-bold">${t.department}</div>
          <div class="text-[11px]">${slaDisplay}</div>
        </td>

        <td class="py-3 px-4">
          <div class="flex items-center gap-1.5">
            <span class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${t.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}">
              ${t.status}
            </span>
            ${t.isHumanCorrected ? '<span class="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded-md border border-amber-300 font-bold" title="Corrected by human agent">Edited</span>' : ''}
          </div>
        </td>

        <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
          <button onclick="openTicketDetails('${t.id}')" class="p-1.5 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 transition hover-wiggle" title="Open in Agent Workspace">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("");

  if (window.lucide) lucide.createIcons();
}

function resetFilters() {
  const s = document.getElementById("queueSearchInput");
  const p = document.getElementById("filterPriority");
  const d = document.getElementById("filterDepartment");
  const r = document.getElementById("filterReview");
  if (s) s.value = "";
  if (p) p.value = "ALL";
  if (d) d.value = "ALL";
  if (r) r.value = "ALL";
  renderTicketTable();
}

function openTicketDetails(ticketId) {
  activeTicketId = ticketId;
  switchTab("agent-workspace");
}

// ==========================================
// 9. AGENT WORKSPACE & EXPLAINABILITY
// ==========================================

function loadTicketIntoWorkspace(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  activeTicketId = ticket.id;

  const selector = document.getElementById("activeTicketSelector");
  if (selector) {
    selector.innerHTML = tickets.map(t => `
      <option value="${t.id}" ${t.id === ticket.id ? 'selected' : ''}>${t.id}: ${t.subject.substring(0, 38)}...</option>
    `).join("");
  }

  const prioBadge = document.getElementById("activeTicketPrioBadge");
  if (prioBadge) {
    prioBadge.textContent = ticket.priorityLabel;
    prioBadge.className = `text-xs font-bold px-2.5 py-1 rounded-lg border ${
      ticket.priority === "P1" ? "bg-rose-50 text-rose-700 border-rose-200" :
      ticket.priority === "P2" ? "bg-amber-50 text-amber-700 border-amber-200" :
      "bg-blue-50 text-blue-700 border-blue-200"
    }`;
  }

  const custName = document.getElementById("wsCustomerName");
  const custEmail = document.getElementById("wsCustomerEmail");
  const subjEl = document.getElementById("wsTicketSubject");
  const prodEl = document.getElementById("wsProduct");
  const usersEl = document.getElementById("wsAffectedUsers");
  const slaTimer = document.getElementById("wsSlaTimer");
  const timestamp = document.getElementById("wsTimestamp");

  if (custName) custName.textContent = ticket.customerName;
  if (custEmail) custEmail.textContent = `${ticket.customerEmail} • ${ticket.customerTier} Tier`;
  if (subjEl) subjEl.textContent = ticket.subject;
  if (prodEl) prodEl.textContent = ticket.product;
  if (usersEl) usersEl.textContent = ticket.affectedUsers;
  if (timestamp) timestamp.textContent = new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (slaTimer) {
    if (ticket.status === "RESOLVED") {
      slaTimer.textContent = "Resolved (SLA Met)";
      slaTimer.className = "text-emerald-700 font-mono font-bold";
    } else {
      slaTimer.textContent = `${ticket.slaRemainingMinutes} min remaining`;
      slaTimer.className = ticket.slaRemainingMinutes <= 15 ? "text-rose-600 font-mono font-bold" : "text-slate-700 font-mono";
    }
  }

  const bodyContainer = document.getElementById("wsHighlightedBody");
  if (bodyContainer) {
    let highlighted = ticket.description;
    ticket.signals.forEach(sig => {
      if (sig.length > 2) {
        const regex = new RegExp(`(${sig})`, "gi");
        const tokenClass = ticket.priority === "P1" ? "highlight-token-urgent" : "highlight-token";
        highlighted = highlighted.replace(regex, `<span class="${tokenClass}">$1</span>`);
      }
    });
    bodyContainer.innerHTML = highlighted;
  }

  const translationBox = document.getElementById("wsTranslationBox");
  const transText = document.getElementById("wsTranslatedText");
  if (translationBox && transText) {
    if (ticket.translatedText) {
      translationBox.classList.remove("hidden");
      transText.textContent = ticket.translatedText;
    } else {
      translationBox.classList.add("hidden");
    }
  }

  const timeline = document.getElementById("wsAuditTimeline");
  if (timeline) {
    timeline.innerHTML = ticket.auditTrail.map(a => `
      <div class="flex items-start space-x-2.5">
        <div class="w-2 h-2 rounded-full bg-brand-600 mt-1.5 shadow-2xs"></div>
        <div>
          <div class="text-[11px] font-bold text-slate-800">${a.action}</div>
          <div class="text-[10px] text-slate-500 font-mono">${a.actor} • ${a.timestamp}</div>
        </div>
      </div>
    `).join("");
  }

  const confEl = document.getElementById("wsConfidenceScore");
  const priCatEl = document.getElementById("wsPrimaryCategory");
  const secCatEl = document.getElementById("wsSecondaryCategory");
  const deptEl = document.getElementById("wsAssignedDept");
  const agentEl = document.getElementById("wsAssignedAgent");
  const explEl = document.getElementById("wsAiExplanation");
  const ambiguityBanner = document.getElementById("wsAmbiguityBanner");
  const signalChips = document.getElementById("wsSignalChips");

  if (confEl) confEl.textContent = `${ticket.confidence}% Conf`;
  if (priCatEl) priCatEl.textContent = ticket.category;
  if (secCatEl) secCatEl.textContent = ticket.secondaryCategory || "None";
  if (deptEl) deptEl.textContent = ticket.department;
  if (agentEl) agentEl.textContent = ticket.assignedAgent;
  if (explEl) explEl.textContent = ticket.explanation;

  if (ambiguityBanner) {
    if (ticket.isAmbiguous) {
      ambiguityBanner.classList.remove("hidden");
    } else {
      ambiguityBanner.classList.add("hidden");
    }
  }

  if (signalChips) {
    signalChips.innerHTML = ticket.signals.map(s => `
      <span class="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
        ${s}
      </span>
    `).join("");
  }

  generateAiResponseDraft(ticket, "formal");
  populateTroubleshootingSteps(ticket);

  const resolveBtn = document.getElementById("resolveTicketBtn");
  if (resolveBtn) {
    if (ticket.status === "RESOLVED") {
      resolveBtn.innerHTML = `<i data-lucide="check-check" class="w-3.5 h-3.5"></i> Resolved`;
      resolveBtn.className = "px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold cursor-not-allowed";
    } else {
      resolveBtn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i> Mark Resolved`;
      resolveBtn.className = "hover-wiggle px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs";
    }
  }

  if (window.lucide) lucide.createIcons();
}

function generateAiResponseDraft(ticket, tone = "formal") {
  const draftBox = document.getElementById("wsDraftResponse");
  if (!draftBox) return;

  let greeting = `Dear ${ticket.customerName.split(" ")[0]},`;
  let body = "";

  if (ticket.priority === "P1") {
    body = `Thank you for reaching out. We have flagged this as a critical P1 outage incident and our Senior Payments Engineering team has been paged immediately. We are investigating the elevated 504 Gateway errors affecting your checkout flow. You can monitor live incident updates here, and our on-call lead will follow up within 15 minutes.`;
  } else if (ticket.isAmbiguous) {
    body = `Thank you for contacting support regarding your recent payment deduction. Our systems have routed your query to our Finance & Order Fulfillment specialists. To assist you immediately, could you please provide the bank transaction reference number or screenshot so we can reconcile the payment directly with our gateway?`;
  } else if (ticket.category.includes("Authentication")) {
    body = `Hello ${ticket.customerName.split(" ")[0]}, We have received your request regarding account login assistance. An encrypted password reset token has been dispatched to your registered email address. Please allow 2-3 minutes for arrival and verify your spam folder if necessary.`;
  } else {
    body = `Thank you for reaching out to TROJANOVA Support. We have logged your request under ${ticket.category} and our specialized team is currently reviewing your ticket details. We anticipate resolving this well within our standard SLA window.`;
  }

  const signoff = `\n\nBest regards,\n${ticket.assignedAgent}\nTROJANOVA AI Support Operations`;
  draftBox.value = `${greeting}\n\n${body}${signoff}`;
}

function regenerateDraft(tone) {
  playBleep();
  const ticket = tickets.find(t => t.id === activeTicketId);
  if (ticket) generateAiResponseDraft(ticket, tone);
}

function copyAiDraft() {
  const draftBox = document.getElementById("wsDraftResponse");
  if (draftBox) {
    navigator.clipboard?.writeText(draftBox.value);
    showToast("AI Draft copied to clipboard! 📋", "success");
    playSuccessChime();
  }
}

function sendDraftToCustomer() {
  playSuccessChime();
  triggerConfetti();
  showToast(`Response dispatched to customer! ✉️`, "success");
  
  const ticket = tickets.find(t => t.id === activeTicketId);
  if (ticket) {
    ticket.status = "IN PROGRESS";
    ticket.auditTrail.unshift({
      timestamp: "Just now",
      actor: "Agent Workspace",
      action: "AI Response draft dispatched to customer"
    });
    localStorage.setItem("trojanova_tickets", JSON.stringify(tickets));
    loadTicketIntoWorkspace(activeTicketId);
  }
}

function populateTroubleshootingSteps(ticket) {
  const container = document.getElementById("wsTroubleshootingSteps");
  if (!container) return;

  let steps = [];
  if (ticket.category.includes("Payment") || ticket.category.includes("Outage")) {
    steps = [
      "Check CloudWatch / Datadog APM gateway timeout spike rate",
      "Verify status of third-party payment provider webhook endpoints",
      "Inspect database read-replica lag and connection pool starvation",
      "If incident confirmed, associate with Cluster #INC-89 for broadcast"
    ];
  } else if (ticket.category.includes("Billing")) {
    steps = [
      "Lookup customer email in Stripe/Razorpay dashboard for pending capture",
      "Check if ledger created a phantom authorization hold",
      "Issue zero-fee credit voucher or trigger auto-refund if uncaptured"
    ];
  } else {
    steps = [
      "Verify user directory sync in Okta / Auth0 identity pool",
      "Check email deliverability suppression list via SendGrid",
      "Generate temporary 24-hr bypass authentication link"
    ];
  }

  container.innerHTML = steps.map((step, idx) => `
    <div class="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
      <input type="checkbox" id="step-${idx}" class="mt-0.5 accent-brand-600 rounded">
      <label for="step-${idx}" class="text-slate-700 text-[11px] font-medium leading-tight cursor-pointer">${step}</label>
    </div>
  `).join("");
}

function addInternalNote() {
  const input = document.getElementById("wsInternalNoteInput");
  if (!input || !input.value.trim()) return;

  const ticket = tickets.find(t => t.id === activeTicketId);
  if (ticket) {
    ticket.notes.push(input.value.trim());
    ticket.auditTrail.unshift({
      timestamp: "Just now",
      actor: "Agent Internal Note",
      action: `Note added: "${input.value.trim().substring(0, 30)}..."`
    });
    input.value = "";
    localStorage.setItem("trojanova_tickets", JSON.stringify(tickets));
    showToast("Internal note attached to ticket", "info");
    loadTicketIntoWorkspace(activeTicketId);
  }
}

function resolveCurrentTicket() {
  const ticket = tickets.find(t => t.id === activeTicketId);
  if (!ticket || ticket.status === "RESOLVED") return;

  playSuccessChime();
  triggerConfetti();
  ticket.status = "RESOLVED";
  ticket.auditTrail.unshift({
    timestamp: "Just now",
    actor: "Human Agent",
    action: "Ticket marked as RESOLVED"
  });
  localStorage.setItem("trojanova_tickets", JSON.stringify(tickets));
  showToast(`🎉 Ticket ${ticket.id} marked as RESOLVED!`, "success");
  loadTicketIntoWorkspace(activeTicketId);
  updateDashboardMetrics();
}

// ==========================================
// 10. HUMAN OVERRIDE MODAL & FEEDBACK
// ==========================================

function openHumanOverrideModal() {
  const ticket = tickets.find(t => t.id === activeTicketId);
  if (!ticket) return;

  playBleep();
  const modal = document.getElementById("humanOverrideModal");
  const modalTicketId = document.getElementById("modalTicketId");
  const catSelect = document.getElementById("modalCategory");
  const prioSelect = document.getElementById("modalPriority");
  const deptSelect = document.getElementById("modalDepartment");
  const reasonText = document.getElementById("modalReason");

  if (modalTicketId) modalTicketId.textContent = `#${ticket.id}`;
  if (catSelect) catSelect.value = ticket.category;
  if (prioSelect) prioSelect.value = ticket.priority;
  if (deptSelect) deptSelect.value = ticket.department;
  if (reasonText) reasonText.value = "";

  if (modal) modal.classList.remove("hidden");
}

function closeHumanOverrideModal() {
  const modal = document.getElementById("humanOverrideModal");
  if (modal) modal.classList.add("hidden");
}

function saveHumanOverride(e) {
  e.preventDefault();
  playSuccessChime();

  const ticket = tickets.find(t => t.id === activeTicketId);
  if (!ticket) return;

  const newCat = document.getElementById("modalCategory").value;
  const newPrio = document.getElementById("modalPriority").value;
  const newDept = document.getElementById("modalDepartment").value;
  const reason = document.getElementById("modalReason").value;

  const originalState = `${ticket.category} | ${ticket.priority} | ${ticket.department}`;
  const correctedState = `${newCat} | ${newPrio} | ${newDept}`;

  ticket.category = newCat;
  ticket.priority = newPrio;
  ticket.priorityLabel = `${newPrio} — Override`;
  ticket.department = newDept;
  ticket.isHumanCorrected = true;
  ticket.isAmbiguous = false;
  ticket.auditTrail.unshift({
    timestamp: "Just now",
    actor: "Human Override",
    action: `Agent corrected AI triage to: ${newCat} (${newPrio})`
  });

  const newAudit = {
    id: `AUD-${102 + auditLogs.length}`,
    timestamp: "Just now",
    ticketId: ticket.id,
    agent: "Lead Agent (Session)",
    original: originalState,
    corrected: correctedState,
    reason: reason,
    modelImpact: `Fine-tuning delta applied for tokens in #${ticket.id}`
  };
  auditLogs.unshift(newAudit);

  localStorage.setItem("trojanova_tickets", JSON.stringify(tickets));
  localStorage.setItem("trojanova_audits", JSON.stringify(auditLogs));

  closeHumanOverrideModal();
  showToast(`Human correction logged! Model feedback updated.`, "success");
  loadTicketIntoWorkspace(activeTicketId);
  updateDashboardMetrics();
}

// ==========================================
// 11. WHAT-IF PRIORITY SIMULATOR
// ==========================================

function runSimulation() {
  const message = document.getElementById("simMessageText")?.value || "";
  const tierVal = parseInt(document.getElementById("simTierSlider")?.value || "4");
  const usersVal = parseInt(document.getElementById("simUsersSlider")?.value || "4");
  const serviceVal = parseInt(document.getElementById("simServiceSlider")?.value || "3");
  const revBlocked = document.getElementById("simRevenueBlocked")?.checked || false;

  const tiers = { 1: "Free Tier", 2: "Growth ($2k ARR)", 3: "Scale ($25k ARR)", 4: "Enterprise ($100k+ ARR)" };
  const users = { 1: "Single User", 2: "Team (5-20)", 3: "Multiple Orgs (100+)", 4: "Public / All Users (>1,000)" };
  const services = { 1: "Non-Critical (Docs/Blog)", 2: "Secondary (Analytics/Export)", 3: "Tier-0 (Payment/Auth)" };

  if (document.getElementById("simTierLabel")) document.getElementById("simTierLabel").textContent = tiers[tierVal];
  if (document.getElementById("simUsersLabel")) document.getElementById("simUsersLabel").textContent = users[usersVal];
  if (document.getElementById("simServiceLabel")) document.getElementById("simServiceLabel").textContent = services[serviceVal];

  let impactScore = (tierVal * 1.5) + (usersVal * 2.0) + (serviceVal * 2.5);
  if (revBlocked) impactScore += 6.0;

  let prioText = "P3 — Medium";
  let prioClass = "text-indigo-400";
  let slaText = "SLA Target: 8 Hours";
  let dept = "Technical Support";
  let escalation = "NO (Standard Queue)";
  let explanation = "";

  if (impactScore >= 14 || revBlocked) {
    prioText = "P1 — Critical";
    prioClass = "text-rose-400";
    slaText = "SLA Target: 15 Minutes (Breach Alert Active)";
    dept = serviceVal === 3 ? "Payments Engineering" : "Security & Ops";
    escalation = "YES (PagerDuty On-Call Paged)";
    explanation = `Critical Business Impact: Despite low-urgency wording in message text, the combination of ${tiers[tierVal]}, ${services[serviceVal]}, and ${users[usersVal]} triggers autonomous P1 escalation.`;
  } else if (impactScore >= 9) {
    prioText = "P2 — High";
    prioClass = "text-amber-400";
    slaText = "SLA Target: 2 Hours";
    dept = "Technical Support Tier-2";
    escalation = "Elevated Queue";
    explanation = `High Severity: Account tier (${tiers[tierVal]}) and scope of users (${users[usersVal]}) exceeds normal triage thresholds.`;
  } else {
    prioText = "P4 — Low";
    prioClass = "text-slate-400";
    slaText = "SLA Target: 24 Hours";
    dept = "General Support";
    escalation = "NO";
    explanation = "Isolated customer inquiry with zero revenue risk and localized single-user impact.";
  }

  const pBadge = document.getElementById("simPriorityBadge");
  if (pBadge) {
    pBadge.textContent = prioText;
    pBadge.className = `text-3xl font-black font-mono tracking-tight ${prioClass}`;
  }

  if (document.getElementById("simSlaCountdown")) document.getElementById("simSlaCountdown").textContent = slaText;
  if (document.getElementById("simDept")) document.getElementById("simDept").textContent = dept;
  if (document.getElementById("simEscalation")) document.getElementById("simEscalation").textContent = escalation;
  if (document.getElementById("simExplanation")) document.getElementById("simExplanation").textContent = explanation;
}

function resetSimulator() {
  playBleep();
  if (document.getElementById("simTierSlider")) document.getElementById("simTierSlider").value = "4";
  if (document.getElementById("simUsersSlider")) document.getElementById("simUsersSlider").value = "4";
  if (document.getElementById("simServiceSlider")) document.getElementById("simServiceSlider").value = "3";
  if (document.getElementById("simRevenueBlocked")) document.getElementById("simRevenueBlocked").checked = true;
  if (document.getElementById("simMessageText")) document.getElementById("simMessageText").value = "Our checkout seems a little slow and customers are complaining that payments take forever.";
  runSimulation();
}

// ==========================================
// 12. INCIDENT & DUPLICATE CLUSTERS
// ==========================================

function renderClusterCards() {
  const container = document.getElementById("clusterCardsContainer");
  if (!container) return;

  container.innerHTML = incidentClusters.map(c => `
    <div class="glass-card rounded-2xl p-5 border-rose-500/30 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div class="flex items-center space-x-3">
          <div class="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 animate-bounce">
            <i data-lucide="alert-octagon" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-mono font-bold text-white text-base">${c.id}: ${c.name}</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-extrabold border border-rose-500/30">${c.severity}</span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">${c.affectedService} • Detected ${c.detectionTime}</p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-xs text-slate-400 font-mono">${c.ticketIds.length} Linked Tickets</span>
          <button onclick="broadcastClusterReply('${c.id}')" class="hover-wiggle px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20">
            <i data-lucide="radio" class="w-3.5 h-3.5"></i> Bulk Reply to All (${c.ticketIds.length})
          </button>
        </div>
      </div>

      <p class="text-xs text-slate-300 leading-relaxed">${c.summary}</p>

      <div class="space-y-1.5 pt-1">
        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Correlated Customer Tickets:</span>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
          ${c.ticketIds.map(tid => {
            const ticketObj = tickets.find(t => t.id === tid);
            return `
              <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition" onclick="openTicketDetails('${tid}')">
                <div>
                  <div class="font-mono text-xs font-bold text-brand-300">${tid}</div>
                  <div class="text-[11px] text-slate-400 truncate max-w-[140px]">${ticketObj?.customerName || "Customer"}</div>
                </div>
                <span class="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  ${ticketObj?.clusterSimilarity || 94}% match
                </span>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `).join("");

  if (window.lucide) lucide.createIcons();
}

function simulateNewOutageReport() {
  playBleep();
  const newTid = `TN-${1055 + tickets.length}`;
  const incoming = {
    id: newTid,
    customerName: "Rohan Vashisht (UrbanCart)",
    customerEmail: "rohan@urbancart.in",
    customerTier: "Scale",
    subject: "Transactions aborted with 504 Gateway on Razorpay checkout",
    description: "Our users cannot pay. Every card transaction is spinning and resulting in 504 gateway timeout. Critical revenue block.",
    product: "Payment Gateway",
    affectedUsers: "Multiple Teams (50-200)",
    status: "OPEN",
    createdAt: new Date().toISOString(),
    slaRemainingMinutes: 14,
    category: "Payment / Service Outage",
    secondaryCategory: "Technical Bug",
    priority: "P1",
    priorityLabel: "P1 — Critical",
    department: "Payments Engineering",
    assignedAgent: "Vikram S. (Tier-3 On-Call)",
    confidence: 96,
    explanation: "High semantic match (95%) with active Outage #INC-89. Automatically grouped to prevent duplicate ticket triage.",
    signals: ["504 Gateway", "Razorpay", "revenue block", "spinning"],
    isAmbiguous: false,
    clusterId: "INC-89",
    clusterSimilarity: 95,
    isHumanCorrected: false,
    notes: ["Automatically grouped under Incident #INC-89."],
    auditTrail: [
      { timestamp: "Just now", actor: "AI Cluster Detector", action: "Matched to Incident #INC-89 with 95% similarity." }
    ]
  };

  tickets.unshift(incoming);
  incidentClusters[0].ticketIds.push(newTid);

  localStorage.setItem("trojanova_tickets", JSON.stringify(tickets));
  localStorage.setItem("trojanova_clusters", JSON.stringify(incidentClusters));

  showToast(`Incoming ticket ${newTid} clustered into Incident #INC-89!`, "warning");
  renderClusterCards();
  updateDashboardMetrics();
}

function broadcastClusterReply(clusterId) {
  playSuccessChime();
  triggerConfetti();
  showToast(`Bulk broadcast sent to all affected customers in #${clusterId}! 📢`, "success");
}

// ==========================================
// 13. ANALYTICS & RETRAINING SIMULATION
// ==========================================

function renderAnalyticsCharts() {
  const ctxAcc = document.getElementById("categoryAccuracyChart");
  if (ctxAcc) {
    if (accuracyChart) accuracyChart.destroy();
    accuracyChart = new Chart(ctxAcc, {
      type: "bar",
      data: {
        labels: ["Payment Outage", "Auth & SSO", "Tech Bugs", "Feature Reqs", "Billing", "Ambiguous Refunds"],
        datasets: [{
          label: "Accuracy %",
          data: [98.2, 96.4, 93.1, 91.5, 88.4, 71.5],
          backgroundColor: ["#10b981", "#10b981", "#6366f1", "#6366f1", "#8b5cf6", "#f59e0b"],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: "#f1f5f9" }, ticks: { color: "#64748b", font: { size: 10 } } },
          y: { min: 50, max: 100, grid: { color: "#f1f5f9" }, ticks: { color: "#64748b", font: { size: 10 } } }
        }
      }
    });
  }

  const ctxRes = document.getElementById("resolutionTimeChart");
  if (ctxRes) {
    if (resolutionChart) resolutionChart.destroy();
    resolutionChart = new Chart(ctxRes, {
      type: "bar",
      data: {
        labels: ["Payments Eng", "Tech Support", "Finance & Billing", "Security & Ops"],
        datasets: [
          {
            label: "AI-Assisted (Min)",
            data: [28, 42, 35, 18],
            backgroundColor: "#10b981",
            borderRadius: 6
          },
          {
            label: "Manual Baseline (Min)",
            data: [110, 165, 140, 95],
            backgroundColor: "#cbd5e1",
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#64748b", font: { size: 11 } }
          }
        },
        scales: {
          x: { grid: { color: "#f1f5f9" }, ticks: { color: "#64748b", font: { size: 10 } } },
          y: { grid: { color: "#f1f5f9" }, ticks: { color: "#64748b", font: { size: 10 } } }
        }
      }
    });
  }
}

function triggerModelRetrain() {
  const btn = document.getElementById("retrainBtn");
  const icon = document.getElementById("retrainIcon");
  if (!btn) return;

  playBleep();
  btn.disabled = true;
  if (icon) icon.classList.add("animate-spin");
  showToast("Initiating SGD backpropagation on human feedback...", "info");

  setTimeout(() => {
    btn.disabled = false;
    if (icon) icon.classList.remove("animate-spin");
    playSuccessChime();
    triggerConfetti();

    const accEl = document.getElementById("sidebarAccuracy");
    const dashAccEl = document.getElementById("statAccuracy");
    if (accEl) accEl.textContent = "96.4%";
    if (dashAccEl) dashAccEl.textContent = "96.4%";

    showToast("✨ Model weights re-calibrated! Accuracy improved to 96.4%.", "success");
  }, 2200);
}

// ==========================================
// 14. AUDIT TRAIL LOG TABLE
// ==========================================

function renderAuditTable() {
  const tbody = document.getElementById("auditTableBody");
  if (!tbody) return;

  tbody.innerHTML = auditLogs.map(a => `
    <tr class="hover:bg-slate-900/60 transition">
      <td class="py-3.5 px-4 font-mono text-slate-400 text-[11px]">${a.timestamp}</td>
      <td class="py-3.5 px-4 font-mono font-bold text-brand-300">${a.ticketId}</td>
      <td class="py-3.5 px-4 text-slate-200 font-bold">${a.agent}</td>
      <td class="py-3.5 px-4 text-rose-300 font-mono text-[11px]">${a.original}</td>
      <td class="py-3.5 px-4 text-emerald-300 font-mono font-bold text-[11px]">${a.corrected}</td>
      <td class="py-3.5 px-4 text-slate-300 max-w-xs text-[11px] leading-relaxed">${a.reason}</td>
      <td class="py-3.5 px-4 text-slate-400 font-mono text-[10px]">${a.modelImpact}</td>
    </tr>
  `).join("");
}

function exportAuditJson() {
  playBleep();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "trojanova_audit_feedback.json");
  dlAnchor.click();
  showToast("Exported audit log JSON", "success");
}

// ==========================================
// 15. DATABASE CONNECTIVITY MANAGER
// ==========================================

function selectDbProvider(provider) {
  playBleep();
  const buttons = document.querySelectorAll(".db-prov-btn");
  buttons.forEach(b => {
    b.classList.remove("bg-indigo-50", "border-indigo-300", "text-indigo-700", "font-bold");
    b.classList.add("bg-white", "border-slate-200", "text-slate-700");
  });

  const activeBtn = document.getElementById(`dbProv-${provider}`);
  if (activeBtn) {
    activeBtn.classList.add("bg-indigo-50", "border-indigo-300", "text-indigo-700", "font-bold");
    activeBtn.classList.remove("bg-white", "border-slate-200", "text-slate-700");
  }

  const connInput = document.getElementById("dbConnString");
  const hostInput = document.getElementById("dbHost");
  const portInput = document.getElementById("dbPort");
  const nameInput = document.getElementById("dbName");
  const engineText = document.getElementById("currentDbEngineText");

  if (provider === "supabase") {
    simulatedDbEngine = "Supabase / PostgreSQL Pool";
    if (connInput) connInput.value = "postgresql://postgres.trojanova:supersecret_pass@aws-0-us-west-1.pooler.supabase.com:6543/postgres?sslmode=require";
    if (hostInput) hostInput.value = "aws-0-us-west-1.pooler.supabase.com";
    if (portInput) portInput.value = "6543";
    if (nameInput) nameInput.value = "postgres";
  } else if (provider === "postgres") {
    simulatedDbEngine = "PostgreSQL 16 Enterprise Cluster";
    if (connInput) connInput.value = "postgresql://trojanova_admin:pass123@db.internal.trojanova.ai:5432/support_intelligence";
    if (hostInput) hostInput.value = "db.internal.trojanova.ai";
    if (portInput) portInput.value = "5432";
    if (nameInput) nameInput.value = "support_intelligence";
  } else if (provider === "neon") {
    simulatedDbEngine = "Neon Cloud Serverless Postgres";
    if (connInput) connInput.value = "postgresql://trojanova_owner:sec_neon_token@ep-blue-shadow-1892.us-east-2.aws.neon.tech/neondb?sslmode=require";
    if (hostInput) hostInput.value = "ep-blue-shadow-1892.us-east-2.aws.neon.tech";
    if (portInput) portInput.value = "5432";
    if (nameInput) nameInput.value = "neondb";
  } else if (provider === "local") {
    simulatedDbEngine = "Browser LocalStorage / IndexedDB";
    if (connInput) connInput.value = "local://trojanova_client_storage_v2.db";
    if (hostInput) hostInput.value = "localhost (in-browser sandbox)";
    if (portInput) portInput.value = "N/A";
    if (nameInput) nameInput.value = "trojanova_local";
  }

  if (engineText) engineText.textContent = simulatedDbEngine;
}

function testDatabaseConnection() {
  playBleep();
  const btn = document.getElementById("testDbBtn");
  const feedback = document.getElementById("dbTestFeedback");

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Testing Handshake...`;
    if (window.lucide) lucide.createIcons();
  }

  setTimeout(() => {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i data-lucide="activity" class="w-4 h-4"></i> Test Connection & Ping DB`;
      if (window.lucide) lucide.createIcons();
    }
    if (feedback) feedback.classList.remove("hidden");
    playSuccessChime();

    const topStatus = document.getElementById("topDbStatusText");
    if (topStatus) {
      topStatus.textContent = `DB: Connected (${simulatedDbEngine.split(" ")[0]})`;
    }

    showToast(`Database ping successful! Latency: 22ms. All 4 tables verified.`, "success");
  }, 1200);
}

function downloadSqlSchema() {
  playBleep();
  const sql = `-- TROJANOVA AI SUPPORT INTELLIGENCE PRODUCTION SCHEMA
CREATE TABLE tickets (
  id VARCHAR(20) PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(120) NOT NULL,
  customer_tier VARCHAR(30) DEFAULT 'Growth',
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_users VARCHAR(50),
  product_affected VARCHAR(80),
  status VARCHAR(30) DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_predictions (
  ticket_id VARCHAR(20) REFERENCES tickets(id),
  predicted_category VARCHAR(80) NOT NULL,
  secondary_category VARCHAR(80),
  predicted_priority VARCHAR(20) NOT NULL,
  predicted_department VARCHAR(80) NOT NULL,
  confidence NUMERIC(5,2) NOT NULL,
  explanation TEXT NOT NULL,
  is_ambiguous BOOLEAN DEFAULT FALSE,
  cluster_id VARCHAR(30)
);

CREATE TABLE audit_feedback (
  id SERIAL PRIMARY KEY,
  ticket_id VARCHAR(20) REFERENCES tickets(id),
  agent_id VARCHAR(50) NOT NULL,
  original_prediction JSONB NOT NULL,
  corrected_values JSONB NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

  const blob = new Blob([sql], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "schema.sql";
  a.click();
  showToast("Downloaded schema.sql file", "success");
}

// ==========================================
// 16. DEMO SCENARIO INJECTORS & NOVA ASSISTANT
// ==========================================

function dismissNovaWidget() {
  const widget = document.getElementById("novaCompanionWidget");
  if (widget) widget.classList.add("hidden");
}

function updateNovaSpeech(text) {
  const speech = document.getElementById("novaCompanionSpeech");
  if (speech) speech.textContent = `"${text}"`;
}

function injectScenario(scenario) {
  playAlertPing();

  if (scenario === "critical-payment") {
    activeTicketId = "TN-1042";
    switchTab("agent-workspace");
    updateNovaSpeech("P1 Outage scenario loaded! Paged on-call engineer Vikram S.");
    showToast("Loaded Scenario: P1 Critical Payment Outage (Hundreds of Users)", "error");
  } else if (scenario === "ambiguous") {
    activeTicketId = "TN-1045";
    switchTab("agent-workspace");
    updateNovaSpeech("Low confidence (62%) detected. Routed to Human Review Queue.");
    showToast("Loaded Scenario: Ambiguous Deducted Refund (Low AI Confidence)", "warning");
  } else if (scenario === "hidden-impact") {
    switchTab("simulator");
    const simMsg = document.getElementById("simMessageText");
    if (simMsg) simMsg.value = "Our checkout seems a little slow and customers are complaining that payments take forever.";
    if (document.getElementById("simTierSlider")) document.getElementById("simTierSlider").value = "4";
    if (document.getElementById("simUsersSlider")) document.getElementById("simUsersSlider").value = "4";
    if (document.getElementById("simServiceSlider")) document.getElementById("simServiceSlider").value = "3";
    if (document.getElementById("simRevenueBlocked")) document.getElementById("simRevenueBlocked").checked = true;
    runSimulation();
    updateNovaSpeech("Notice how polite wording is overrode by Enterprise Tier-0 risk!");
    showToast("Loaded Scenario: Hidden High Business Impact (Calm wording)", "info");
  } else if (scenario === "multilingual") {
    activeTicketId = "TN-1051";
    switchTab("agent-workspace");
    updateNovaSpeech("Hinglish input automatically normalized into English.");
    showToast("Loaded Scenario: Multilingual Hinglish Ticket with Normalized Translation", "info");
  }
}

// ==========================================
// 18. DATA INGESTION, IMPORT & EXPORT HUB
// ==========================================

function download100CustomersCsv() {
  playBleep();
  const a = document.createElement("a");
  a.href = "customers_100_tickets.csv";
  a.download = "customers_100_tickets.csv";
  a.click();
  showToast("Downloading customers_100_tickets.csv (100 Customers)", "success");
}

async function load100CustomersDirectly() {
  playAlertPing();
  showToast("Loading & triaging 100 external customer tickets...", "info");
  try {
    const res = await fetch("customers_100_tickets.csv");
    if (!res.ok) throw new Error("Could not fetch CSV file");
    const text = await res.text();
    processCsvText(text);
  } catch (err) {
    showToast("Error reading CSV: " + err.message, "error");
  }
}

function downloadSampleCsv() {
  playBleep();
  const sampleCsvContent = `Customer Name,Customer Email,Customer Tier,Product,Subject,Description,Affected Users
Arun Patel,arun@nexapay.in,Enterprise,Payment Gateway,Critical 504 Timeout on checkout payment webhook,Customer cards are being debited but webhook fails with 504 timeout on our payment gateway cluster.,All Organization / Public (>1,000)
Jessica Alba,j.alba@globex.com,Enterprise,Auth Service,SAML SSO certificate mismatch for corporate identity,All 450 engineering staff cannot log into the platform this morning after Okta SSO update.,Multiple Teams (50-200)
Manish Tiwari,manish@tiwarilogistics.com,Scale,Billing API,Double billing deduction on monthly invoice renewal,Our credit card was charged twice for invoice #INV-9821 on Oct 10th. Need immediate refund for duplicate charge.,Just 1 User
Sunita Rao,sunita.rao@gmail.com,Growth,Mobile App,Payment kat gaya par order cart me empty dikha raha hai,Mera HDFC bank account se 1499 kat gaya par app me order empty hai. Please verify urgently.,Just 1 User
David Miller,david@zenithcloud.io,Enterprise,Database Cloud,Read-replica lag spike causing slow search checkout,Our checkout search is slow and query latency spiked from 12ms to 4200ms.,All Organization / Public (>1,000)
Preeti Sengupta,preeti.s@voguefashion.in,Growth,Customer Portal,Money deducted but order missing in dashboard,Bank deducted amount Rs 2800 but your portal shows transaction failed. Need refund or delivery confirmation.,Just 1 User
Alexandre Dupont,a.dupont@logitech.fr,Scale,Mobile App,iOS application crashing on launch after v4.2 update,App exits immediately upon tapping the login button on iOS 17.5.,Multiple Teams (50-200)
Rachel Green,rachel@coffeehouse.com,Free,Customer Portal,Would love dark mode support on mobile web view,Can you please add a dark mode toggle to the web analytics reports?,Just 1 User
Karan Oberoi,karan@fintechstack.com,Enterprise,Payment Gateway,Checkout seems a little slow today,Checkout latency is slightly elevated for our store customers. Please investigate.,All Organization / Public (>1,000)
Anil Kapoor,anil@bollywoodstar.in,Free,Auth Service,Cannot reset forgotten account password,I requested a password reset email 30 minutes ago but nothing arrived.,Just 1 User`;

  const blob = new Blob([sampleCsvContent], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "trojanova_sample_tickets.csv";
  a.click();
  showToast("Downloaded sample CSV template with 10 real-world tickets", "success");
}

function handleCsvFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  playBleep();
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    if (file.name.endsWith(".json")) {
      try {
        const json = JSON.parse(text);
        processBatchTickets(json);
      } catch (err) {
        showToast("Invalid JSON file format", "error");
      }
    } else {
      processCsvText(text);
    }
  };
  reader.readAsText(file);
}

function processCsvText(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    showToast("CSV file is empty or has no data rows", "warning");
    return;
  }

  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    if (values.length < 2) continue;

    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] || "";
    });

    rows.push({
      customerName: rowObj["customer name"] || rowObj["name"] || `Customer ${i}`,
      customerEmail: rowObj["customer email"] || rowObj["email"] || `user${i}@domain.com`,
      customerTier: rowObj["customer tier"] || rowObj["tier"] || "Growth",
      product: rowObj["product / service"] || rowObj["product"] || rowObj["service"] || "Payment Gateway",
      subject: rowObj["subject"] || rowObj["title"] || "Customer Inquiry",
      description: rowObj["description"] || rowObj["body"] || rowObj["subject"] || "No description provided",
      affectedUsers: rowObj["affected users"] || rowObj["users"] || "1 User"
    });
  }

  processBatchTickets(rows);
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function processBatchTickets(ticketRows) {
  if (!ticketRows || ticketRows.length === 0) {
    showToast("No valid ticket rows found to import", "warning");
    return;
  }

  const progressBox = document.getElementById("batchProgressContainer");
  const progressBar = document.getElementById("batchProgressBar");
  const progressPct = document.getElementById("batchProgressPct");
  const progressLabel = document.getElementById("batchProgressLabel");
  const progressSummary = document.getElementById("batchProgressSummary");

  if (progressBox) progressBox.classList.remove("hidden");
  if (progressBar) progressBar.style.width = "0%";

  const newTickets = [];

  ticketRows.forEach((row, idx) => {
    const newId = `TN-${1056 + tickets.length + idx}`;
    const result = runClassifierEngine(
      (row.subject || "") + " " + (row.description || ""),
      row.customerTier || "Growth",
      row.affectedUsers || "1 User",
      row.product || "Payment Gateway"
    );

    const slaMins = result.priority === "P1" ? 15 : result.priority === "P2" ? 120 : result.priority === "P3" ? 480 : 1440;

    const tObj = {
      id: newId,
      customerName: row.customerName || "External User",
      customerEmail: row.customerEmail || "client@external.com",
      customerTier: row.customerTier || "Growth",
      subject: row.subject || "Incoming Ticket",
      description: row.description || "Inbound message content",
      product: row.product || "Payment Gateway",
      affectedUsers: row.affectedUsers || "1 User",
      status: "OPEN",
      createdAt: new Date().toISOString(),
      slaRemainingMinutes: slaMins,
      category: result.category,
      secondaryCategory: result.secondaryCategory,
      priority: result.priority,
      priorityLabel: result.priorityLabel,
      department: result.department,
      assignedAgent: result.department === "Payments Engineering" ? "Vikram S. (Tier-3 On-Call)" : "Sneha Roy (Billing Lead)",
      confidence: result.confidence,
      explanation: result.explanation,
      signals: result.signals,
      isAmbiguous: result.isAmbiguous,
      translatedText: result.translatedText,
      clusterId: result.category.includes("Outage") ? "INC-89" : null,
      clusterSimilarity: result.category.includes("Outage") ? 93 : null,
      isHumanCorrected: false,
      notes: ["Imported via Bulk Ingestion Pipeline."],
      auditTrail: [
        { timestamp: "Just now", actor: "Bulk Ingestion Pipeline", action: "Imported and processed" },
        { timestamp: "Just now", actor: "AI Classifier", action: `Assigned: ${result.category} (${result.priority})` }
      ]
    };
    newTickets.push(tObj);
  });

  tickets = [...newTickets, ...tickets];
  localStorage.setItem("trojanova_tickets", JSON.stringify(tickets));

  if (progressBar) progressBar.style.width = "100%";
  if (progressPct) progressPct.textContent = "100%";
  if (progressLabel) progressLabel.textContent = `Batch AI Triage Complete! (${newTickets.length} tickets added)`;
  if (progressSummary) progressSummary.textContent = `Batch classified ${newTickets.length} tickets into P1 (${newTickets.filter(t => t.priority === "P1").length}), P2 (${newTickets.filter(t => t.priority === "P2").length}), and normal priority queues.`;

  playSuccessChime();
  triggerConfetti();
  showToast(`Successfully ingested & triaged ${newTickets.length} tickets! 🎉`, "success");
  updateDashboardMetrics();
}

function loadPrepackagedZendeskTickets() {
  playBleep();
  const demoTickets = [
    {
      customerName: "Sanjay Singhania (Aura Retail)",
      customerEmail: "sanjay@auraretail.in",
      customerTier: "Enterprise",
      product: "Payment Gateway",
      subject: "Stripe checkout failing with 504 across all active stores",
      description: "Our store checkout has ground to a halt. Every card transaction returns 504 Gateway Timeout. Hundreds of customers are calling support.",
      affectedUsers: "All Organization / Public (>1,000)"
    },
    {
      customerName: "Kavya Menon",
      customerEmail: "kavya.m@techflow.io",
      customerTier: "Growth",
      product: "Customer Portal",
      subject: "Account balance deducted but order not showing in cart",
      description: "My bank deducted Rs 3,500 but order is still not confirmed in my account. Please verify if my order is registered or refund my money.",
      affectedUsers: "Just 1 User"
    },
    {
      customerName: "David Sterling (OmniCloud)",
      customerEmail: "d.sterling@omnicloud.com",
      customerTier: "Enterprise",
      product: "Payment Gateway",
      subject: "Our checkout seems a little slow today",
      description: "Checkout latency is slightly higher than usual for our customers. Please check database query times when possible.",
      affectedUsers: "All Organization / Public (>1,000)"
    },
    {
      customerName: "Amitabh Roy",
      customerEmail: "amitabh.r@gmail.com",
      customerTier: "Growth",
      product: "Mobile App",
      subject: "Payment kat gaya bank se par order pending dikha raha hai",
      description: "Mera Google Pay se 999 rupaye kat gaya, lekin app me payment pending status dikha raha hai. Urgent refund karo.",
      affectedUsers: "Just 1 User"
    },
    {
      customerName: "Jennifer Aniston",
      customerEmail: "j.aniston@hollywood.com",
      customerTier: "Scale",
      product: "Auth Service",
      subject: "Okta Single Sign-On certificate error",
      description: "All users logging in via Okta SAML SSO are getting certificate expired error 403.",
      affectedUsers: "Multiple Teams (50-200)"
    },
    {
      customerName: "Farhan Akhtar",
      customerEmail: "farhan@excelent.in",
      customerTier: "Free",
      product: "Customer Portal",
      subject: "Cannot receive password reset email link",
      description: "I clicked forgot password but haven't received the link in my inbox or spam folder.",
      affectedUsers: "Just 1 User"
    }
  ];

  processBatchTickets(demoTickets);
}

function loadSampleJsonInTextarea() {
  playBleep();
  const sample = [
    {
      "customerName": "Rohan Mehra (PayFlow Labs)",
      "customerEmail": "rohan@payflow.io",
      "customerTier": "Enterprise",
      "product": "Payment Gateway",
      "subject": "Payment gateway cluster unresponsive on port 443",
      "description": "Critical outage: transactions failing for all customers with 504 Gateway errors. Direct revenue loss.",
      "affectedUsers": "All Organization / Public (>1,000)"
    },
    {
      "customerName": "Priya Sharma",
      "customerEmail": "priya.s@gmail.com",
      "customerTier": "Growth",
      "product": "Customer Portal",
      "subject": "Money deducted but transaction failed notification received",
      "description": "Rs 1,200 deducted from ICICI bank but order shows failed. Need resolution.",
      "affectedUsers": "Just 1 User"
    }
  ];

  const textarea = document.getElementById("jsonPayloadInput");
  if (textarea) {
    textarea.value = JSON.stringify(sample, null, 2);
    showToast("Pasted sample JSON payload", "info");
  }
}

function handleJsonPayloadImport() {
  const textarea = document.getElementById("jsonPayloadInput");
  if (!textarea || !textarea.value.trim()) {
    showToast("Please enter or paste a JSON array of tickets", "warning");
    return;
  }

  playBleep();
  try {
    const parsed = JSON.parse(textarea.value.trim());
    if (!Array.isArray(parsed)) {
      showToast("JSON payload must be an array of objects [ { ... } ]", "error");
      return;
    }
    processBatchTickets(parsed);
    textarea.value = "";
  } catch (err) {
    showToast(`Invalid JSON syntax: ${err.message}`, "error");
  }
}

function simulateExternalWebhook() {
  playAlertPing();
  const simulatedExternalPayload = {
    customerName: "Stripe Automated Webhook (crm-inbound)",
    customerEmail: "alerts@api.stripe.com",
    customerTier: "Enterprise",
    product: "Payment Gateway",
    subject: "Automated Alert: elevated webhook timeout failure rate (>15%)",
    description: "Production payment webhook endpoint https://api.store.com/webhooks/stripe is returning HTTP 504 Gateway Timeout. 350 transactions impacted in the last 10 minutes.",
    affectedUsers: "All Organization / Public (>1,000)"
  };

  processBatchTickets([simulatedExternalPayload]);
  showToast("Inbound Webhook received & triaged as P1 Critical!", "warning");

  activeTicketId = tickets[0].id;
  switchTab("agent-workspace");
}

function exportTicketsToCsv() {
  playBleep();
  if (tickets.length === 0) {
    showToast("No tickets available to export", "warning");
    return;
  }

  const headers = ["Ticket ID", "Customer Name", "Customer Email", "Customer Tier", "Product", "Subject", "Description", "AI Category", "Priority", "Department", "Confidence", "SLA Remaining (Mins)", "Status", "Human Corrected"];
  
  const csvRows = [headers.join(",")];
  tickets.forEach(t => {
    const row = [
      `"${t.id}"`,
      `"${(t.customerName || '').replace(/"/g, '""')}"`,
      `"${(t.customerEmail || '').replace(/"/g, '""')}"`,
      `"${t.customerTier || ''}"`,
      `"${t.product || ''}"`,
      `"${(t.subject || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${t.category || ''}"`,
      `"${t.priority || ''}"`,
      `"${t.department || ''}"`,
      `"${t.confidence || ''}%"`,
      `"${t.slaRemainingMinutes || 0}"`,
      `"${t.status || 'OPEN'}"`,
      `"${t.isHumanCorrected ? 'YES' : 'NO'}"`
    ];
    csvRows.push(row.join(","));
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `trojanova_tickets_export_${Date.now()}.csv`;
  a.click();
  showToast(`Exported ${tickets.length} tickets to CSV!`, "success");
}

function exportTicketsToJson() {
  playBleep();
  const exportData = {
    platform: "TROJANOVA AI Support Intelligence",
    exportedAt: new Date().toISOString(),
    totalTickets: tickets.length,
    tickets: tickets,
    incidentClusters: incidentClusters,
    auditFeedback: auditLogs
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `trojanova_full_export_${Date.now()}.json`;
  a.click();
  showToast("Exported database to JSON backup", "success");
}

// ==========================================
// 19. GUIDED TOUR & USER-FRIENDLY CONTROLS
// ==========================================

let tourCurrentStep = 0;
const tourSteps = [
  {
    title: "1. AI Command Center & Telemetry",
    icon: "layout-dashboard",
    iconColor: "text-brand-600",
    badge: "Step 1 of 4",
    content: "Welcome to TROJANOVA AI! The Command Center is your executive cockpit: track real-time SLA countdowns, active P1/P2 incidents, and see the exact operational time saved by AI triage (over 74 hours saved vs manual ticket sorting)."
  },
  {
    title: "2. Ingesting External Data from Anywhere",
    icon: "upload-cloud",
    iconColor: "text-indigo-600",
    badge: "Step 2 of 4",
    content: "Easily connect data from outside: Drag & drop CSV/Excel files from Zendesk or Freshdesk, download our ready-to-fill CSV template, paste JSON arrays, or stream live inbound tickets using our REST Webhook endpoint. Batch AI processes all rows in milliseconds."
  },
  {
    title: "3. Explainable AI & Human-in-the-Loop",
    icon: "sparkles",
    iconColor: "text-amber-600",
    badge: "Step 3 of 4",
    content: "No black-box guesses! In the Agent Workspace, inspect highlighted trigger tokens (e.g. '504 Gateway', 'revenue blocked'). When AI detects ambiguity ('Payment deducted, but order missing'), it requests human review. When an agent overrides a prediction, it feeds into the audit log for model fine-tuning."
  },
  {
    title: "4. What-If Simulator & Database Connectivity",
    icon: "database",
    iconColor: "text-emerald-600",
    badge: "Step 4 of 4",
    content: "Test how priority changes dynamically by sliding customer tier, affected users, and revenue risk in the What-If Simulator. Connect to PostgreSQL, Supabase, Neon Serverless, or Browser LocalDB with live handshake verification and downloadable schema.sql."
  }
];

function openTourModal() {
  playBleep();
  tourCurrentStep = 0;
  renderTourStep();
  const modal = document.getElementById("tourModal");
  if (modal) modal.classList.remove("hidden");
}

function closeTourModal() {
  const modal = document.getElementById("tourModal");
  if (modal) modal.classList.add("hidden");
}

function renderTourStep() {
  const step = tourSteps[tourCurrentStep];
  const container = document.getElementById("tourStepContent");
  const dotsContainer = document.getElementById("tourDotsContainer");
  const prevBtn = document.getElementById("tourPrevBtn");
  const nextBtn = document.getElementById("tourNextBtn");

  if (!step || !container) return;

  container.innerHTML = `
    <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <i data-lucide="${step.icon}" class="w-5 h-5 ${step.iconColor}"></i>
          <h4 class="font-bold text-slate-900 text-sm">${step.title}</h4>
        </div>
        <span class="text-[10px] font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">${step.badge}</span>
      </div>
      <p class="text-xs text-slate-600 leading-relaxed font-sans">
        ${step.content}
      </p>
    </div>
  `;

  if (dotsContainer) {
    dotsContainer.innerHTML = tourSteps.map((s, idx) => `
      <span class="w-2 h-2 rounded-full transition-all duration-300 ${idx === tourCurrentStep ? 'bg-brand-600 w-5' : 'bg-slate-300'}"></span>
    `).join("");
  }

  if (prevBtn) prevBtn.disabled = tourCurrentStep === 0;
  if (nextBtn) {
    if (tourCurrentStep === tourSteps.length - 1) {
      nextBtn.innerHTML = `<span>Get Started</span> <i data-lucide="check" class="w-3.5 h-3.5"></i>`;
    } else {
      nextBtn.innerHTML = `<span>Next</span> <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>`;
    }
  }

  if (window.lucide) lucide.createIcons();
}

function nextTourStep() {
  playBleep();
  if (tourCurrentStep < tourSteps.length - 1) {
    tourCurrentStep++;
    renderTourStep();
  } else {
    closeTourModal();
    triggerConfetti();
    showToast("Enjoy exploring TROJANOVA AI! 🚀", "success");
    playSuccessChime();
  }
}

function prevTourStep() {
  playBleep();
  if (tourCurrentStep > 0) {
    tourCurrentStep--;
    renderTourStep();
  }
}

function toggleMobileSidebar() {
  playBleep();
  const sidebar = document.getElementById("mainSidebar");
  if (sidebar) {
    sidebar.classList.toggle("hidden");
    sidebar.classList.toggle("fixed");
    sidebar.classList.toggle("inset-y-0");
    sidebar.classList.toggle("left-0");
    sidebar.classList.toggle("bg-slate-950/95");
  }
}

// Global Keyboard Shortcuts
window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey && e.key === "k") || (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA")) {
    e.preventDefault();
    switchTab("tickets");
    const searchInput = document.getElementById("queueSearchInput");
    if (searchInput) searchInput.focus();
    showToast("Focused Ticket Search (Ctrl+K)", "info");
  }

  if (e.key === "Escape") {
    closeHumanOverrideModal();
    closeTourModal();
  }
});

// ==========================================
// 17. INITIALIZATION ON PAGE LOAD
// ==========================================

window.addEventListener("DOMContentLoaded", () => {
  switchTab("dashboard");
  updateDashboardMetrics();
  if (window.lucide) lucide.createIcons();

  // Show Nova Companion widget after short delay
  setTimeout(() => {
    const widget = document.getElementById("novaCompanionWidget");
    if (widget) widget.classList.remove("hidden");
  }, 1200);

  setInterval(() => {
    let changed = false;
    tickets.forEach(t => {
      if (t.status !== "RESOLVED" && t.slaRemainingMinutes > 0) {
        if (Math.random() > 0.8) {
          t.slaRemainingMinutes = Math.max(0, t.slaRemainingMinutes - 1);
          changed = true;
        }
      }
    });
    if (changed && currentTab === "agent-workspace") {
      const ticket = tickets.find(t => t.id === activeTicketId);
      if (ticket) {
        const slaTimer = document.getElementById("wsSlaTimer");
        if (slaTimer) slaTimer.textContent = `${ticket.slaRemainingMinutes} min remaining`;
      }
    }
  }, 10000);
});
