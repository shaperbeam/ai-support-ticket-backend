'use client'

import { useMemo, useState, useEffect, type FormEvent } from 'react'
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Cell, Legend as RechartsLegend, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Check,
  CircleHelp,
  Clock3,
  Inbox,
  LayoutDashboard,
  ListTodo,
  Menu,
  MessageCircle,
  Mail,
  MoreHorizontal,
  Sparkles,
  Users,
  Workflow,
  X,
} from 'lucide-react'

const mainItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Inbox', icon: Inbox },
  { label: 'Customers', icon: Users },
]
const workspaceItems = [
  { label: 'Analytics', icon: BarChart3 },
  { label: 'All Tickets', icon: ListTodo },
  { label: 'AI Workflow', icon: Workflow },
  ]
const channelItems = [
  { label: 'Website chats', icon: MessageCircle },
  { label: 'E-mail', icon: CircleHelp },
  { label: 'WhatsApp', icon: MessageCircle },
]

const tickets = [
  { initials: 'SL', name: 'Sofia Lawrence', subject: 'My order has not arrived yet', time: '2m ago', tag: 'Order Status', tone: 'coral', priority: 'High' },
  { initials: 'MR', name: 'Marcus Reed', subject: 'I was charged twice for my order', time: '18m ago', tag: 'Billing', tone: 'violet', priority: 'High' },
  { initials: 'AV', name: 'Amelia Vance', subject: 'Checkout page keeps crashing with errors', time: '34m ago', tag: 'Technical', tone: 'blue', priority: 'Critical' },
  { initials: 'JP', name: 'James Park', subject: 'I need to return a damaged item', time: '1h ago', tag: 'Returns', tone: 'amber', priority: 'Normal' },
]

const initialAnalyticsTickets = [
  { id: '#QX-1048', message: 'My order has not arrived, tracking is not updating', category: 'Order Status & Shipping', department: 'Logistics', priority: 'High', confidence: '95%', reasoning: 'Routed to Logistics for tracking, delays, or lost packages.', status: 'Open', action: 'Assign to logistics' },
  { id: '#QX-1047', message: 'I was charged twice for the same transaction!', category: 'Billing & Payments', department: 'Finance', priority: 'High', confidence: '98%', reasoning: 'Routed to Finance due to charge discrepancies or refund requests.', status: 'In progress', action: 'Escalate to finance' },
  { id: '#QX-1046', message: 'The checkout page crashes with a 500 error when I try to pay', category: 'Technical Issues', department: 'Engineering', priority: 'Critical', confidence: '100%', reasoning: 'Routed to Engineering. Potential system outage affecting revenue.', status: 'Open', action: 'Escalate to engineering' },
  { id: '#QX-1045', message: 'I received a damaged item and want to return it', category: 'Returns & Exchanges', department: 'Customer Success', priority: 'Normal', confidence: '96%', reasoning: 'Routed to CS for RMA, wrong items, or damages.', status: 'Review', action: 'Process return' },
  { id: '#QX-1044', message: 'My promo code is not working at checkout', category: 'Promotions & Discounts', department: 'Customer Success', priority: 'Low', confidence: '92%', reasoning: 'Routed to CS for promo codes or gift card issues.', status: 'Open', action: 'Verify and apply' },
]
type AnalyticsTicket = (typeof initialAnalyticsTickets)[number]


const TEST_DATASETS: Record<string, { name: string; description: string; tickets: string[] }> = {
  ecommerce: {
    name: "🛍️ E-Commerce Core Dataset",
    description: "Standard retail orders, shipping delays, double charges, and returns.",
    tickets: [
      "My order #88921 has not arrived yet, tracking hasn't updated in 4 days.",
      "I was charged twice on my credit card for a single purchase.",
      "The app crashes with a 500 internal server error when I click checkout.",
      "I received a damaged jacket and need to print a return shipping label.",
      "My 20% off promo code isn't applying at checkout."
    ]
  },
  low_confidence: {
    name: "❓ Low Confidence & Human Action Dataset",
    description: "Ambiguous or multi-intent tickets yielding <90% AI confidence to trigger Human Action Required.",
    tickets: [
      "Can I get a discount because my delivery was delayed and also my item was slightly scratched?",
      "Need help regarding something weird that happened on my account last month.",
      "Is it possible to exchange an item if I lost the receipt and opened the box?",
      "Why is my invoice different from the checkout page price?",
      "I want to speak directly to a supervisor about a general concern."
    ]
  },
  edge_cases: {
    name: "⚠️ Edge Cases & Deceptive Tone Dataset",
    description: "Deceptive calm tone hiding critical outages, vague insufficient info, and multi-category requests.",
    tickets: [
      "Hi there, no rush at all! Just letting you know our entire database is deleted and our production site is completely down for all 100,000 users.",
      "It is not working. Please fix it.",
      "The checkout page crashed with a 500 error and charged my credit card 3 times simultaneously!",
      "Oh wonderful, another marvellous update that broke my entire order history. Thanks a lot.",
      "Can I get a refund for my order while also updating my shipping address and changing my account email?"
    ]
  },
  custom: {
    name: "✏️ Custom User-Defined Dataset",
    description: "Manually add your own ticket dataset or paste raw customer messages to test.",
    tickets: []
  },
  saas: {
    name: "⚡ SaaS & Developer Platform Dataset",
    description: "API rate limits, OAuth authentication, billing upgrades, and webhook failures.",
    tickets: [
      "Our API requests are returning 429 Too Many Requests rate limit errors.",
      "Cannot log in via Google SSO OAuth, getting invalid redirect_uri error.",
      "We upgraded to the Enterprise Plan but our seat limit hasn't updated.",
      "Webhooks are failing to deliver events to our production endpoint.",
      "Need a SOC2 Type II compliance report and data processing agreement."
    ]
  },
  logistics: {
    name: "📦 Global Freight & Logistics Dataset",
    description: "Customs clearance holds, package theft, freight tracking, and address corrections.",
    tickets: [
      "Shipment #LX-4412 is stuck in international customs clearance hold.",
      "The courier marked the pallet as delivered but our warehouse has no record.",
      "Urgent: Need to update the delivery address for container #CR-901 before dispatch.",
      "The shipping box arrived completely crushed and items are damaged.",
      "Requesting proof of delivery signature for order #TR-771."
    ]
  },
  fintech: {
    name: "💳 Fintech & Payments Dataset",
    description: "ACH transfer delays, fraud alerts, card declines, and KYC verification.",
    tickets: [
      "My bank transfer has been pending for 5 business days without clearing.",
      "My card was unexpectedly declined during an international purchase.",
      "I received a suspicious transaction notification that I didn't authorize.",
      "My identity verification (KYC) document upload keeps failing.",
      "I need a monthly transaction statement exported in CSV format."
    ]
  }
}

export default function Page() {
  const [active, setActive] = useState('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [catalogueBlur, setCatalogueBlur] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileName, setProfileName] = useState('Jordan Davis')
  const [occupation, setOccupation] = useState('Support Admin')
  const [textStyle, setTextStyle] = useState('Modern')
    const [analyticsTickets, setAnalyticsTickets] = useState<AnalyticsTicket[]>(initialAnalyticsTickets)
  const [confidenceThreshold, setConfidenceThreshold] = useState(85)
  const [selectedDatasetKey, setSelectedDatasetKey] = useState('ecommerce')
  const [isLoadingDataset, setIsLoadingDataset] = useState(false)
  const [customDatasetModalOpen, setCustomDatasetModalOpen] = useState(false)
  const [customDatasetInput, setCustomDatasetInput] = useState('')
  const [demoMode, setDemoMode] = useState(false)
  const [demoDialogOpen, setDemoDialogOpen] = useState(false)
  const [demoQuery, setDemoQuery] = useState('')
  const [actionTicket, setActionTicket] = useState<AnalyticsTicket | null>(null)
  const [humanOverrideNotice, setHumanOverrideNotice] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatQuery, setChatQuery] = useState('')
  const [chatMessages, setChatMessages] = useState([{ role: 'assistant', text: 'Hi, I’m Lucent. Tell me what you need help with and I’ll guide you step by step.' }])
  const [chatGuide, setChatGuide] = useState<string[]>([])
  const [chatIsTyping, setChatIsTyping] = useState(false)
  const [chatSessionId] = useState(() => `session-${Date.now()}`)

  const PREDEFINED_QUESTIONS = [
    '🗺️ How do I navigate this website?',
    '📦 How do I track my order status?',
    '💳 How does AI classification work?',
    '🧪 How do I test custom datasets?',
    '🔄 What is the return policy?'
  ]

  const submitCustomQuery = async (queryText: string) => {
    const message = queryText.trim()
    if (!message || chatIsTyping) return

    setChatMessages((current) => [...current, { role: 'user', text: message }])
    setChatQuery('')
    setChatIsTyping(true)

    try {
      const res = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id: chatSessionId }),
      })
      if (res.ok) {
        const data = await res.json()
        setChatMessages((current) => [...current, { role: 'assistant', text: data.reply }])
      } else {
        setChatMessages((current) => [...current, { role: 'assistant', text: 'Sorry, I could not reach the support system. Please try again or contact us by email.' }])
      }
    } catch {
      setChatMessages((current) => [...current, { role: 'assistant', text: 'I am having connection issues. Please contact support directly.' }])
    }

    setChatIsTyping(false)
    setChatGuide([])
  }

  const sendChatQuery = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submitCustomQuery(chatQuery)
  }

  const handlePillClick = (label: string) => {
    if (label === 'Import CSV' || label === 'Custom Datasets') {
      setCustomDatasetModalOpen(true)
    } else if (label.startsWith('Go to ')) {
      const targetView = label.replace('Go to ', '').trim()
      if (['Overview', 'Inbox', 'Customers', 'Analytics', 'All Tickets', 'AI Workflow', 'Website chats', 'E-mail', 'WhatsApp', 'Knowledge Base'].includes(targetView)) {
        setActive(targetView)
      }
    }
  }

  const renderMessageContent = (text: string) => {
    const regex = /\[(Go to [^\]]+|Import CSV|Custom Datasets)\]/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      const label = match[1]
      parts.push(
        <button
          key={`${match.index}-${label}`}
          type="button"
          onClick={() => handlePillClick(label)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            margin: '2px 4px',
            padding: '3px 10px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(79,70,229,0.3)',
            transition: 'transform 0.15s ease'
          }}
        >
          ✨ {label}
        </button>
      )
      lastIndex = regex.lastIndex
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  const confirmHumanOverride = () => {
    if (actionTicket) setAnalyticsTickets((current) => current.filter((ticket) => ticket.id !== actionTicket.id))
    setHumanOverrideNotice(true)
    setActionTicket(null)
    window.setTimeout(() => setHumanOverrideNotice(false), 3200)
  }

  useEffect(() => {
    async function loadBackendTickets() {
      try {
        const res = await fetch('http://localhost:8081/api/tickets')
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            const mapped: AnalyticsTicket[] = data.map((t: any) => ({
              id: `#QX-${1040 + t.id}`,
              message: t.customer_message,
              category: t.primary_category,
              department: t.department,
              priority: t.priority,
              confidence: `${t.confidence_score}%`,
              reasoning: t.reasoning,
              status: t.status,
              action: t.confidence_score < 90 ? 'Action required' : 'Action not required'
            }))
            setAnalyticsTickets(mapped)
          }
        }
      } catch (err) {
        console.log('Using default mock tickets:', err)
      }
    }
    loadBackendTickets()
  }, [])

  const handleMockStorefrontTicket = async (cleanMessage: string) => {
    const trimmed = cleanMessage.trim()
    if (!trimmed) return null
    try {
      const res = await fetch('http://localhost:8080/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_message: trimmed })
      })
      if (res.ok) {
        const data = await res.json()
        const newTicket: AnalyticsTicket = {
          id: `#QX-${1040 + data.id}`,
          message: data.customer_message,
          category: data.primary_category,
          department: data.department,
          priority: data.priority,
          confidence: `${data.confidence_score}%`,
          reasoning: data.reasoning,
          status: data.status,
          action: data.confidence_score < confidenceThreshold ? 'Action required' : 'Action not required'
        }
        setAnalyticsTickets((current) => [newTicket, ...current])
        return newTicket
      }
    } catch (e) {}
    return null
  }

  const addDemoTicket = async (message: string) => {
    const cleanMessage = message.trim()
    if (!cleanMessage) return

    try {
      const res = await fetch('http://localhost:8080/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_message: cleanMessage })
      })
      if (res.ok) {
        const data = await res.json()
        const newTicket: AnalyticsTicket = {
          id: `#QX-${1040 + data.id}`,
          message: data.customer_message,
          category: data.primary_category,
          department: data.department,
          priority: data.priority,
          confidence: `${data.confidence_score}%`,
          reasoning: data.reasoning,
          status: data.status,
          action: data.confidence_score < 90 ? 'Action required' : 'Action not required'
        }
        setAnalyticsTickets((current) => [newTicket, ...current])
      } else {
        throw new Error('API request failed')
      }
    } catch (e) {
      setAnalyticsTickets((current) => [{ id: `#QX-${1050 + current.length}`, message: cleanMessage, category: 'General inquiry', department: 'Support', priority: 'Normal', confidence: '91%', reasoning: 'Demo query classified in real time', status: 'Open', action: 'Assign to support' }, ...current])
    }

    setActive('Analytics')
    setDemoQuery('')
    setDemoDialogOpen(false)
  }
  
      const handleCsvFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (!text) return

      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
      if (lines.length === 0) return

      const headerCols = lines[0].toLowerCase().split(/,|;/).map((c) => c.trim().replace(/^["']|["']$/g, ''))
      let msgColIndex = headerCols.findIndex((c) => ['message', 'ticket', 'text', 'customer_message', 'issue', 'description', 'query'].includes(c))
      const hasHeader = msgColIndex !== -1
      if (!hasHeader) msgColIndex = 0

      const startIndex = hasHeader ? 1 : 0
      const extracted: string[] = []

      for (let i = startIndex; i < lines.length; i++) {
        const cols = lines[i].split(/,|;/).map((c) => c.trim().replace(/^["']|["']$/g, ''))
        const val = cols[msgColIndex] || cols[0]
        if (val && val.length > 2) {
          extracted.push(val)
        }
      }

      if (extracted.length > 0) {
        setCustomDatasetInput(extracted.join('\n'))
      }
    }
    reader.readAsText(file)
  }

    const clearAllTickets = async () => {
    setAnalyticsTickets([])
    try {
      fetch('http://localhost:8080/api/tickets', { method: 'DELETE' }).catch((e) => {})
    } catch (e) {}
  }

  const saveCustomDataset = () => {
    const lines = customDatasetInput.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    if (lines.length > 0) {
      TEST_DATASETS.custom.tickets = lines
      setSelectedDatasetKey('custom')
      setCustomDatasetModalOpen(false)
    }
  }

  const runFullDatasetTest = async () => {
    const currentDataset = TEST_DATASETS[selectedDatasetKey]
    if (!currentDataset) return

    setIsLoadingDataset(true)
    for (const message of currentDataset.tickets) {
      try {
        const res = await fetch('http://localhost:8080/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customer_message: message })
        })
        if (res.ok) {
          const data = await res.json()
          const newTicket: AnalyticsTicket = {
            id: `#QX-${1040 + data.id}`,
            message: data.customer_message,
            category: data.primary_category,
            department: data.department,
            priority: data.priority,
            confidence: `${data.confidence_score}%`,
            reasoning: data.reasoning,
            status: data.status,
            action: data.confidence_score < 90 ? 'Action required' : 'Action not required'
          }
          setAnalyticsTickets((current) => [newTicket, ...current])
        }
      } catch (e) {}
    }
    setIsLoadingDataset(false)
    setActive('Analytics')
    setDemoDialogOpen(false)
  }

  const toggleDemoMode = () => {
    setDemoMode((enabled) => !enabled)
  }

  const selectItem = (label: string) => {
    setActive(label)
    setCatalogueBlur(true)
    window.setTimeout(() => setCatalogueBlur(false), 340)
    setSidebarOpen(false)
  }

  return (
    <main className={`app-shell text-style-${textStyle.toLowerCase()} ${demoDialogOpen ? 'demo-open' : ''}`}>
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="mobile-topbar glass-panel">
        <button className="icon-button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu /></button>
        <div className="brand-mark small"><Sparkles /></div>
        <span className="mobile-title">Main</span>
        <button className="icon-button" aria-label="Notifications"><Bell /></button>
      </div>

      <aside className={`sidebar glass-panel ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header sidebar-header-minimal">
          <button className="icon-button close-sidebar" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}><X /></button>
        </div>
        <button className="profile-panel glass-inset" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen}>
          <div className="avatar user-avatar">{profileName.split(' ').map((part) => part[0]).join('')}</div>
          <div className="workspace-copy"><strong>{profileName}</strong><span>{occupation}</span></div><ChevronDown className={profileOpen ? 'profile-chevron-open' : ''} />
        </button>
        {profileOpen && <div className="profile-settings glass-panel">
          <p className="profile-settings-title">Profile settings</p>
          <label>Name<input value={profileName} onChange={(event) => setProfileName(event.target.value)} /></label>
          <label>Occupation<input value={occupation} onChange={(event) => setOccupation(event.target.value)} /></label>
          <fieldset><legend>Text style</legend><div className="text-style-options">{['Modern', 'Classic', 'Friendly'].map((style) => <button type="button" key={style} className={textStyle === style ? 'selected' : ''} onClick={() => setTextStyle(style)}>{style}</button>)}</div></fieldset>
          <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(238,242,255,0.7)', borderRadius: '12px', border: '1px solid #c7d2fe' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, color: '#3730a3' }}>
              <span>Human Correction Threshold</span>
              <span><strong>{confidenceThreshold}%</strong></span>
            </label>
            <input
              type="range"
              min={70}
              max={95}
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              style={{ width: '100%', marginTop: '6px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '9px', color: '#6366f1', display: 'block', marginTop: '3px' }}>Tickets below {confidenceThreshold}% require human action</span>
          </div>
        </div>}
        <nav className="sidebar-nav" aria-label="Primary navigation">
          <NavGroup title="Main" items={mainItems.map((item) => item.label === 'Inbox' ? { ...item, badge: String(analyticsTickets.filter((ticket) => Number.parseInt(ticket.confidence, 10) < confidenceThreshold).length) } : item)} active={active} onSelect={selectItem} />
          <NavGroup title="Workspace &amp; Website chats" items={workspaceItems} active={active} onSelect={selectItem} />
          <NavGroup title="Channels" items={channelItems} active={active} onSelect={selectItem} />
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => selectItem('Knowledge base')}><BookOpen /> <span>Knowledge base</span></button>
          <div className="usage-card glass-inset"><div className="usage-top"><span>AI triage usage</span><span>78%</span></div><div className="usage-bar"><span /></div><p>1,560 of 2,000 tickets classified</p></div>

          {/* LEFT BOTTOM-MOST DATASET SELECTOR DROPDOWN */}
          <div style={{ marginTop: '10px', padding: '12px', borderRadius: '16px', background: 'rgba(238, 242, 255, 0.75)', border: '1px solid rgba(199, 210, 254, 0.9)', boxShadow: '0 4px 12px rgba(99,102,241,0.06)' }}>
            <label style={{ display: 'block', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: '#4f46e5', letterSpacing: '0.08em', marginBottom: '6px' }}>
              🧪 Select Test Dataset
            </label>
            <select
              value={selectedDatasetKey}
              onChange={(e) => setSelectedDatasetKey(e.target.value)}
              style={{ width: '100%', padding: '7px 8px', borderRadius: '10px', border: '1px solid #c7d2fe', background: '#ffffff', color: '#312e81', fontSize: '11px', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
            >
              <option value="ecommerce">🛍️ E-Commerce Dataset</option>
              <option value="edge_cases">⚠️ Edge Cases & Deceptive</option>
              <option value="low_confidence">❓ Low Confidence & Action</option>
              <option value="saas">⚡ SaaS & Platform Dataset</option>
              <option value="logistics">📦 Freight & Logistics</option>
              <option value="fintech">💳 Fintech & Payments</option>
              <option value="custom">✏️ Custom User Dataset</option>
            </select>

            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                onClick={runFullDatasetTest}
                disabled={isLoadingDataset}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: '#ffffff', fontSize: '11px', fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,70,229,0.25)' }}
              >
                {isLoadingDataset ? '⚡ Running Test...' : '⚡ Classify & Run Dataset Test'}
              </button>
              <button
                type="button"
                onClick={() => setCustomDatasetModalOpen(true)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #c7d2fe', background: '#ffffff', color: '#4f46e5', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}
              >
                ✏️ Custom CSV / Add Dataset
              </button>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && <button className="sidebar-overlay" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}

      <section className="content-area">
        <div className="qunexa-topbar" aria-label="Qunexa workspace header">
          <div className="qunexa-cylinder"><span>Q U N Ξ X A</span></div>
        </div>
        <div className={`dashboard-content ${catalogueBlur ? 'catalogue-blur' : ''}`}>
          {active === 'Knowledge base' ? <KnowledgeBaseView /> : active === 'WhatsApp' ? <WhatsAppView /> : active === 'E-mail' ? <EmailView /> : active === 'Website chats' ? <WebsiteChatsView /> : active === 'AI Workflow' ? <AIWorkflowView tickets={analyticsTickets} /> : active === 'Customers' ? <CustomersView /> : active === 'Inbox' ? <><InboxView tickets={analyticsTickets.filter((ticket) => Number.parseInt(ticket.confidence, 10) < confidenceThreshold)} onActionClick={setActionTicket} />{humanOverrideNotice && <div className="override-notice" role="status"><span className="override-notice-icon"><Check /></span><span><strong>Issue has been resolved with human override</strong><small>The ticket has been removed from the inbox.</small></span><button type="button" aria-label="Dismiss notification" onClick={() => setHumanOverrideNotice(false)}><X /></button></div>}{actionTicket && <ActionDialog ticket={actionTicket} threshold={confidenceThreshold} onClose={() => setActionTicket(null)} onConfirm={confirmHumanOverride} />}</> : active === 'Analytics' ? <><AnalyticsView title="Ticket analytics" tickets={analyticsTickets} onUpdate={() => undefined} onActionClick={setActionTicket} />{humanOverrideNotice && <div className="override-notice" role="status"><span className="override-notice-icon"><Check /></span><span><strong>Issue has been resolved with human override</strong><small>The ticket has been updated and routed for human review.</small></span><button type="button" aria-label="Dismiss notification" onClick={() => setHumanOverrideNotice(false)}><X /></button></div>}{actionTicket && <div className="action-dialog-backdrop" role="presentation" onMouseDown={() => setActionTicket(null)}><div className="action-dialog" role="dialog" aria-modal="true" aria-labelledby="action-dialog-title" onMouseDown={(event) => event.stopPropagation()}><button className="demo-dialog-close" type="button" aria-label="Close action details" onClick={() => setActionTicket(null)}><X /></button><p className="eyebrow">Human action</p><h3 id="action-dialog-title">{Number.parseInt(actionTicket.confidence, 10) < 90 ? 'Action required' : 'Action not required'}</h3><p className="action-dialog-message">{actionTicket.message}</p><dl className="action-dialog-details"><div><dt>Ticket</dt><dd>{actionTicket.id}</dd></div><div><dt>AI confidence</dt><dd>{actionTicket.confidence}</dd></div><div><dt>Reasoning</dt><dd>{actionTicket.reasoning}</dd></div><div><dt>Human override</dt><dd>Fix with human override</dd></div></dl><div className="action-dialog-actions"><button className="text-button" type="button" onClick={() => setActionTicket(null)}>No, keep automated</button><button className="demo-submit override-confirm" type="button" onClick={confirmHumanOverride}>Yes, fix it</button></div></div></div>}</> : active === 'All Tickets' ? <>{humanOverrideNotice && <div className="override-notice" role="status"><span className="override-notice-icon"><Check /></span><span><strong>Issue has been resolved with human override</strong><small>The ticket has been updated and routed for human review.</small></span><button type="button" aria-label="Dismiss notification" onClick={() => setHumanOverrideNotice(false)}><X /></button></div>}<TicketTable tickets={analyticsTickets} threshold={confidenceThreshold} onThresholdChange={setConfidenceThreshold} onActionClick={setActionTicket} onClearTickets={clearAllTickets} />{actionTicket && <div className="action-dialog-backdrop" role="presentation" onMouseDown={() => setActionTicket(null)}><div className="action-dialog" role="dialog" aria-modal="true" aria-labelledby="all-tickets-action-title" onMouseDown={(event) => event.stopPropagation()}><button className="demo-dialog-close" type="button" aria-label="Close action details" onClick={() => setActionTicket(null)}><X /></button><p className="eyebrow">Human action</p><h3 id="all-tickets-action-title">Action required</h3><p className="action-dialog-message">{actionTicket.message}</p><dl className="action-dialog-details"><div><dt>Ticket</dt><dd>{actionTicket.id}</dd></div><div><dt>AI confidence</dt><dd>{actionTicket.confidence}</dd></div><div><dt>Fix</dt><dd>Fix with human override</dd></div></dl><div className="action-dialog-actions"><button className="text-button" type="button" onClick={() => setActionTicket(null)}>Cancel</button><button className="demo-submit override-confirm" type="button" onClick={confirmHumanOverride}>Yes, fix it</button></div></div></div>}</> : <>
          <section className="hero-card glass-panel">
            <div className="hero-copy">
              <h2 style={{ fontSize: '42px', fontWeight: 900, lineHeight: '1.05', letterSpacing: '-0.03em', margin: '0 0 12px', color: '#18181b' }}>
                Every<br />conversation,<br /><span style={{ color: '#4f46e5' }}>understood.</span>
              </h2>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.5, margin: '0 0 20px' }}>Lucent sorts, prioritizes, and routes every incoming ticket so your team can focus on what matters.</p>
              <div className="hero-metrics" aria-label="Overview metrics">
                <div><strong>5</strong><span>Tickets sorted</span></div>
                <div><strong>94.6%</strong><span>Lucent accuracy</span></div>
                <div><strong>30s</strong><span>Average response time</span></div>
                <button
                  type="button"
                  onClick={toggleDemoMode}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '3px',
                    padding: '12px 14px',
                    border: demoMode ? '1px solid #818cf8' : '1px solid rgba(255,255,255,.82)',
                    borderRadius: '16px',
                    background: demoMode ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'rgba(255,255,255,.45)',
                    color: demoMode ? '#ffffff' : '#1e293b',
                    boxShadow: demoMode ? '0 8px 20px rgba(79,70,229,0.3)' : 'inset 0 1px 0 rgba(255,255,255,.75), 0 8px 18px rgba(91,77,38,.06)',
                    backdropFilter: 'blur(16px)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <strong style={{ color: demoMode ? '#ffffff' : '#0f172a', fontSize: '13px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    🚀 {demoMode ? 'Demo Mode On' : 'Launch Demo'}
                  </strong>
                  <span style={{ color: demoMode ? '#e0e7ff' : '#64748b', fontSize: '9px', lineHeight: 1.25 }}>
                    {demoMode ? 'Storefront active' : 'Test customer store'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoDialogOpen(true)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '3px',
                    padding: '12px 14px',
                    border: demoDialogOpen ? '1px solid #818cf8' : '1px solid rgba(255,255,255,.82)',
                    borderRadius: '16px',
                    background: demoDialogOpen ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'rgba(255,255,255,.45)',
                    color: demoDialogOpen ? '#ffffff' : '#1e293b',
                    boxShadow: demoDialogOpen ? '0 8px 20px rgba(79,70,229,0.3)' : 'inset 0 1px 0 rgba(255,255,255,.75), 0 8px 18px rgba(91,77,38,.06)',
                    backdropFilter: 'blur(16px)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <strong style={{ color: demoDialogOpen ? '#ffffff' : '#0f172a', fontSize: '13px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    🧪 Test Support System
                  </strong>
                  <span style={{ color: demoDialogOpen ? '#e0e7ff' : '#64748b', fontSize: '9px', lineHeight: 1.25 }}>
                    {demoDialogOpen ? 'System active' : 'Dataset selector & test'}
                  </span>
                </button>
              </div>
            </div>
            <button className="hero-visual" type="button" aria-label="Open Lucent chat assistant" onClick={() => setChatOpen(true)}>
              <div className="orbit orbit-a" aria-hidden="true" />
              <div className="orbit orbit-b" aria-hidden="true" />
              <div className="lucent-logo" aria-hidden="true"><span>L</span></div>
            </button>
          </section>

          <div className="stats-grid"><StatCard label="Open tickets" value="128" delta="12.5%" icon={Inbox} arrowDirection="down" positive /><StatCard label="Avg. response time" value="30s" delta="98.1%" icon={Clock3} positive /><StatCard label="Resolution rate" value="86.4%" delta="4.8%" icon={Sparkles} positive /></div>

          <section className="lower-grid">
            <div className="tickets-card glass-panel"><div className="section-heading"><div><p className="eyebrow">Needs your attention</p><h3>All tickets</h3></div><button className="text-button" onClick={() => selectItem('All Tickets')}>View all <ChevronRight /></button></div><div className="ticket-list">{tickets.map((ticket) => <button className="ticket-row" key={ticket.name} onClick={() => selectItem('All Tickets')}><div className={`avatar ticket-avatar ${ticket.tone}`}>{ticket.initials}</div><div className="ticket-main"><strong>{ticket.subject}</strong><span>{ticket.name} · {ticket.time}</span></div><span className={`ticket-tag ${ticket.tone}`}>{ticket.tag}</span><span className={`priority ${ticket.priority.toLowerCase()}`}><i />{ticket.priority}</span><ChevronRight className="row-arrow" /></button>)}</div></div>
            <div className="channels-card glass-panel"><div className="section-heading"><div><p className="eyebrow">Live overview</p><h3>By channel</h3></div><button className="icon-button"><MoreHorizontal /></button></div><div className="donut-wrap"><div className="donut"><div className="donut-center"><strong>642</strong><span>this week</span></div></div><div className="channel-legend"><Legend label="Website chats" value="48%" color="pink" /><Legend label="E-mail" value="32%" color="purple" /><Legend label="WhatsApp" value="20%" color="blue" /></div></div><div className="mini-insight"><Sparkles /><span>Website chats are up <b>24%</b> this week</span></div></div>
          </section>
          </>}
        </div>
      </section>
    
      {/* Custom Dataset Creator Modal */}
      {customDatasetModalOpen && (
        <div className="action-dialog-backdrop" role="presentation" onMouseDown={() => setCustomDatasetModalOpen(false)}>
          <div className="action-dialog" role="dialog" aria-modal="true" style={{ width: 'min(92%, 500px)', padding: '26px', borderRadius: '24px', background: '#ffffff', color: '#0f172a', border: '1px solid rgba(199,210,254,0.8)', boxShadow: '0 25px 70px rgba(99,102,241,0.25)' }} onMouseDown={(e) => e.stopPropagation()}>
            <button className="demo-dialog-close" type="button" aria-label="Close" onClick={() => setCustomDatasetModalOpen(false)}><X /></button>
            <p className="eyebrow" style={{ color: '#4f46e5', fontWeight: 700 }}>Custom Dataset Creator</p>
            <h3 style={{ margin: '4px 0 8px', fontSize: '22px' }}>Manually Add Your Own Dataset</h3>
            <div style={{ marginBottom: '14px', padding: '12px 14px', background: '#eef2ff', borderRadius: '14px', border: '1px solid #c7d2fe', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#3730a3', marginBottom: '4px' }}>📄 Option A: Import CSV File</label>
              <input 
                type="file" 
                accept=".csv,.txt"
                onChange={handleCsvFileUpload}
                style={{ fontSize: '11px', color: '#334155', cursor: 'pointer' }}
              />
              <p style={{ margin: '4px 0 0', fontSize: '10px', color: '#6366f1' }}>Upload a .csv file containing ticket messages or customer queries.</p>
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>✍️ Option B: Type or Paste Tickets (one per line)</label>
              <textarea
                value={customDatasetInput}
                onChange={(e) => setCustomDatasetInput(e.target.value)}
                placeholder={"e.g.\nMy order #123 was never delivered\nCan I upgrade my subscription plan?\nThe payment gateway threw error 404"}
                rows={5}
                style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontSize: '12px', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="text-button" type="button" onClick={() => setCustomDatasetModalOpen(false)}>Cancel</button>
              <button className="demo-submit" type="button" onClick={saveCustomDataset} disabled={!customDatasetInput.trim()}>
                Save & Select Custom Dataset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Support System & Dataset Selector Modal */}
      {demoDialogOpen && (
        <div
          className="demo-dialog-backdrop"
          role="presentation"
          onMouseDown={() => setDemoDialogOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 20000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            isolation: 'isolate'
          }}
        >
          <div
            className="demo-dialog glass-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-dialog-title"
            style={{ width: 'min(92%, 500px)', padding: '26px', borderRadius: '24px', background: '#ffffff', color: '#0f172a', border: '1px solid rgba(199,210,254,0.9)', boxShadow: '0 25px 70px rgba(0,0,0,0.35)' }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="demo-dialog-close" type="button" aria-label="Close" onClick={() => setDemoDialogOpen(false)}><X /></button>
            <p className="eyebrow" style={{ color: '#4f46e5', fontWeight: 700 }}>Test Support System & Dataset Selector</p>
            <h3 id="demo-dialog-title" style={{ margin: '4px 0 10px', fontSize: '22px', color: '#0f172a' }}>Test Support System</h3>

            <div style={{ marginBottom: '14px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Select Industry Test Dataset</label>
              <select 
                value={selectedDatasetKey} 
                onChange={(e) => setSelectedDatasetKey(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '12px', fontWeight: 600, outline: 'none' }}
              >
                {Object.entries(TEST_DATASETS).map(([key, ds]) => (
                  <option key={key} value={key}>{ds.name}</option>
                ))}
              </select>
              <p style={{ margin: '4px 0 0', fontSize: '10px', color: '#64748b' }}>{TEST_DATASETS[selectedDatasetKey]?.description}</p>
            </div>

            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Click a sample ticket to auto-fill:</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '140px', overflowY: 'auto', paddingRight: '4px' }}>
                {TEST_DATASETS[selectedDatasetKey]?.tickets.map((t, idx) => (
                  <button 
                    key={idx} 
                    type="button"
                    onClick={() => setDemoQuery(t)}
                    style={{ textAlign: 'left', padding: '6px 10px', fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#334155', cursor: 'pointer' }}
                  >
                    "{t}"
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={(event) => { event.preventDefault(); addDemoTicket(demoQuery) }} style={{ textAlign: 'left' }}>
              <label htmlFor="demo-query" style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Or Submit Single Custom Ticket</label>
              <textarea id="demo-query" value={demoQuery} onChange={(event) => setDemoQuery(event.target.value)} placeholder="e.g. Where is my latest order?" style={{ minHeight: '60px', width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1' }} />
              <div className="demo-dialog-actions" style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button className="text-button" type="button" onClick={() => setDemoDialogOpen(false)}>Cancel</button>
                <button className="demo-submit" type="button" onClick={runFullDatasetTest} disabled={isLoadingDataset} style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: '#ffffff', fontWeight: 700, padding: '10px 16px', borderRadius: '12px', border: 'none' }}>
                  {isLoadingDataset ? '⚡ Running Test...' : '⚡ Classify & Run Entire Dataset Test'}
                </button>
                <button className="demo-submit" type="submit" disabled={!demoQuery.trim()} style={{ padding: '10px 16px', borderRadius: '12px' }}>Classify Single Query</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mock Customer Website Demo Modal */}
      {demoMode && (
        <MockStorefrontModal
          onClose={() => setDemoMode(false)}
          onAddTicket={handleMockStorefrontTicket}
          onOpenTestSuite={() => setDemoDialogOpen(true)}
        />
      )}

      {/* Lucent AI Assistant Top-Level Floating Modal */}
      {chatOpen && (
        <div
          className="chat-dialog-backdrop"
          role="presentation"
          onMouseDown={() => setChatOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            isolation: 'isolate'
          }}
        >
          <section
            className="chat-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
            style={{
              position: 'relative',
              width: 'min(92%, 520px)',
              height: 'min(540px, 85vh)',
              padding: '24px',
              borderRadius: '24px',
              background: '#ffffff',
              border: '1px solid rgba(199,210,254,0.9)',
              boxShadow: '0 25px 70px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <button className="demo-dialog-close" type="button" aria-label="Close Lucent chat" onClick={() => setChatOpen(false)}><X /></button>
            <p className="eyebrow" style={{ color: '#4f46e5', fontWeight: 700 }}>Lucent Assistant & Website Guide</p>
            <h3 id="chat-dialog-title" style={{ margin: '2px 0 10px', fontSize: '20px' }}>How can I help you navigate or resolve issues?</h3>
            
            {/* Quick Predefined Questions Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px', maxHeight: '90px', overflowY: 'auto' }}>
              {PREDEFINED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => submitCustomQuery(q)}
                  disabled={chatIsTyping}
                  style={{
                    padding: '5px 11px',
                    borderRadius: '16px',
                    background: '#eef2ff',
                    border: '1px solid #c7d2fe',
                    color: '#3730a3',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="chat-messages" aria-live="polite" style={{ flex: 1, overflowY: 'auto', marginBottom: '12px', padding: '12px', background: '#f8fafc', borderRadius: '16px' }}>
              {chatMessages.map((message, index) => (
                <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.45' }}>
                  {message.role === 'assistant' ? renderMessageContent(message.text) : message.text}
                </div>
              ))}
              {chatIsTyping && <div className="chat-message assistant" style={{ opacity: 0.6, fontStyle: 'italic' }}>Lucent is typing...</div>}
              {chatGuide.length > 0 && (
                <div className="chat-guide">
                  <p className="eyebrow">Suggested next steps</p>
                  <ol>{chatGuide.map((step) => <li key={step}>{step}</li>)}</ol>
                </div>
              )}
            </div>

            <form className="chat-form" onSubmit={sendChatQuery} style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
              <input
                value={chatQuery}
                onChange={(event) => setChatQuery(event.target.value)}
                placeholder="Type your query or click a quick question..."
                aria-label="Your query"
                style={{ flex: 1, padding: '10px 14px', borderRadius: '14px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '12px' }}
              />
              <button className="demo-submit" type="submit" disabled={!chatQuery.trim() || chatIsTyping} style={{ padding: '10px 16px', borderRadius: '14px' }}>
                Send
              </button>
            </form>
          </section>
        </div>
      )}

    </main>
  )
}

function KnowledgeBaseView() {
  const [resources, setResources] = useState([
    { title: 'Getting started with Lucent', type: 'Guide', updated: 'Updated today', articles: ['Create your first workspace', 'Connect your website chat', 'Understand Lucent routing', 'Invite your support team'] },
    { title: 'Ticket routing playbook', type: 'Playbook', updated: 'Updated yesterday', articles: ['Prioritize urgent tickets', 'Route billing questions', 'Escalate to a human', 'Review routing outcomes', 'Tune Lucent confidence rules'] },
    { title: 'Common customer questions', type: 'FAQ', updated: 'Updated 3 days ago', articles: ['Account access questions', 'Billing and invoices', 'Workspace settings', 'Privacy and data requests', 'Response time expectations', 'Contacting support'] },
  ])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState('')
  const [selectedArticle, setSelectedArticle] = useState('')
  const [openedArticle, setOpenedArticle] = useState('')
  const filteredResources = resources.filter((resource) => `${resource.title} ${resource.type} ${resource.articles.join(' ')}`.toLowerCase().includes(search.toLowerCase()))
  const addResource = () => setResources((current) => [...current, { title: 'New Lucent resource', type: 'Guide', updated: 'Draft resource', articles: ['New article'] }])
  const selectedResource = resources.find((resource) => resource.title === selected)
  return <section className="knowledge-view glass-panel" aria-labelledby="knowledge-title"><div className="knowledge-heading"><div><p className="eyebrow">Knowledge base</p><h2 id="knowledge-title">Knowledge Base</h2><p>Resources used to classify and respond to customer tickets.</p></div><button className="knowledge-add" type="button" onClick={addResource}><span>+</span> Add resource</button></div><label className="knowledge-search"><BookOpen /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your knowledge base..." aria-label="Search your knowledge base" /></label><div className="knowledge-grid">{filteredResources.map((resource) => <button className={`knowledge-card ${selected === resource.title ? 'selected' : ''}`} type="button" key={resource.title} onClick={() => setSelected(selected === resource.title ? '' : resource.title)}><span className="knowledge-card-icon"><BookOpen /></span><span className="knowledge-card-copy"><span>{resource.type}</span><strong>{resource.title}</strong><small>{resource.articles.length} {resource.articles.length === 1 ? 'article' : 'articles'} · {resource.updated}</small></span><ChevronRight /></button>)}</div>{selectedResource && <div className="knowledge-articles"><div><p className="eyebrow">{selectedResource.type}</p><h3>{selectedResource.title}</h3><span>{selectedResource.articles.length} articles</span></div><ol>{selectedResource.articles.map((article) => <li key={article}><button type="button" className="knowledge-article-link" onClick={() => setSelectedArticle(selectedArticle === article ? '' : article)}><BookOpen /><span>{article}</span><ChevronRight /></button>{selectedArticle === article && <div className="knowledge-article-content"><strong>{article}</strong><p>Practical guidance for this topic, including the recommended steps, ownership details, and the best response Lucent should provide.</p><button type="button" className="article-action" onClick={() => setOpenedArticle(article)}>Open article</button></div>}</li>)}</ol></div>}{filteredResources.length === 0 && <p className="knowledge-feedback">No resources match “{search}”.</p>}{openedArticle && <div className="article-reader-backdrop" role="presentation" onMouseDown={() => setOpenedArticle('')}><article className="article-reader" role="dialog" aria-modal="true" aria-labelledby="article-reader-title" onMouseDown={(event) => event.stopPropagation()}><button className="article-reader-close" type="button" aria-label="Close article" onClick={() => setOpenedArticle('')}>×</button><p className="eyebrow">Knowledge base article</p><h3 id="article-reader-title">{openedArticle}</h3><p>This article gives Lucent the context it needs to respond accurately and consistently.</p><ol><li>Review the request and identify the customer&apos;s goal.</li><li>Follow the recommended workspace steps for this topic.</li><li>Escalate to a human when the answer needs additional context.</li></ol><button className="article-action" type="button" onClick={() => setOpenedArticle('')}>Done</button></article></div>}</section>
}

function EmailView() {
  return <section className="email-view glass-panel" aria-labelledby="email-title"><p className="eyebrow">E-mail</p><h2 id="email-title">Reach out to us</h2><p className="email-intro">For any queries, send us an email and our team will get back to you.</p><a className="email-contact-card" href="https://mail.google.com/mail/?view=cm&fs=1&to=dg612007@gmail.com&su=Query%20for%20Lucent&body=Hi%20Lucent%20team%2C%0A%0AI%20have%20a%20query%20about%20your%20workspace." target="_blank" rel="noreferrer"><span className="email-icon"><Mail /></span><span><strong>dg612007@gmail.com</strong><small>Contact us for any queries</small></span><ChevronRight /></a></section>
}

function WhatsAppView() {
  return <section className="email-view glass-panel" aria-labelledby="whatsapp-title"><p className="eyebrow">WhatsApp</p><h2 id="whatsapp-title">Reach out to us</h2><p className="email-intro">For any queries, message us on WhatsApp and our team will get back to you.</p><a className="email-contact-card whatsapp-contact-card" href="https://wa.me/917353205575?text=Hi%20Lucent%20team%2C%0A%0AI%20have%20a%20query%20about%20your%20workspace." target="_blank" rel="noreferrer"><span className="email-icon"><MessageCircle /></span><span><strong>Message us on WhatsApp</strong><small>Start a conversation for any queries</small></span><ChevronRight /></a></section>
}

function WebsiteChatsView() {
 const [query, setQuery] = useState('')
 const [submittedQuery, setSubmittedQuery] = useState('')
 const [isResponding, setIsResponding] = useState(false)
 const [guide, setGuide] = useState<string[]>([])
 const submitQuery = (event: FormEvent<HTMLFormElement>) => {
   event.preventDefault()
   const trimmedQuery = query.trim()
   if (!trimmedQuery || isResponding) return
   try {
     fetch('http://localhost:8080/api/tickets', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ customer_message: trimmedQuery })
     }).catch((e) => console.log('FastAPI submit:', e))
   } catch (e) {}
   const normalizedQuery = trimmedQuery.toLowerCase()
   const nextGuide = normalizedQuery.includes('ticket') || normalizedQuery.includes('urgent')
     ? ['Open All Tickets from the sidebar.', 'Filter by Urgent priority and review the highlighted keywords.', 'Open the matching ticket and confirm the department.', 'Escalate it from Inbox if a human response is needed.']
     : normalizedQuery.includes('account') || normalizedQuery.includes('login')
       ? ['Open Customers and locate the customer record.', 'Confirm the account details and recent activity.', 'Review the related tickets for the reported issue.', 'Reply through Website chats or route it to Inbox.']
       : normalizedQuery.includes('billing') || normalizedQuery.includes('invoice')
         ? ['Open All Tickets and search for billing or invoice.', 'Review the customer and payment context.', 'Check the Knowledge base for the billing playbook.', 'Escalate to a human when account details need verification.']
         : ['Open AI Workflow to review the keywords detected in your query.', 'Use the highlighted keywords to find the relevant tickets.', 'Open the matching resource in Knowledge base.', 'Contact the team by E-mail or WhatsApp if you need more help.']
   setSubmittedQuery(trimmedQuery)
   setGuide(nextGuide)
   setIsResponding(true)
   window.setTimeout(() => setIsResponding(false), 700)
 }
 return <section className="website-chat-view lucent-welcome glass-panel" aria-labelledby="website-chat-title"><div className="lucent-welcome-copy"><p className="eyebrow">Website chats</p><h2 id="website-chat-title">Hi, my name is Lucent.</h2><p>How can I help?</p></div><form className="lucent-query-form" onSubmit={submitQuery}><textarea value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type your query here..." aria-label="Type your query" rows={6} /><div className="lucent-query-actions"><span>{isResponding ? 'Lucent is thinking...' : submittedQuery ? `Received: “${submittedQuery}”` : 'Ask anything about your workspace.'}</span><button type="submit" disabled={!query.trim() || isResponding}>{isResponding ? 'Working...' : 'Ask Lucent'}</button></div></form>{guide.length > 0 && <div className="lucent-guide" aria-live="polite"><p className="eyebrow">Lucent&apos;s suggested path</p><h3>Here&apos;s how to handle it</h3><ol>{guide.map((step) => <li key={step}>{step}</li>)}</ol></div>}</section>
}

function AIWorkflowView({ tickets }: { tickets: AnalyticsTicket[] }) {
  const stopWords = new Set(['the', 'my', 'has', 'not', 'yet', 'still', 'about', 'can’t', 'cant', 'with', 'from', 'this', 'that'])
  const getKeywords = (message: string, category: string) => Array.from(new Set(`${message} ${category}`.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter((word) => word.length > 3 && !stopWords.has(word))))
  return <section className="workflow-view analytics-view glass-panel" aria-labelledby="workflow-title"><div className="analytics-heading"><div><p className="eyebrow">Query intelligence</p><h2 id="workflow-title">AI Workflow</h2><p>Extracted keywords per query.</p></div><span className="analytics-count">{tickets.length} queries</span></div><div className="analytics-table-wrap"><table className="analytics-table workflow-table"><thead><tr><th>Query ID</th><th>Keyword</th><th>Department</th><th>Priority</th></tr></thead><tbody>{tickets.map((ticket, idx) => <tr key={`${ticket.id}-${idx}`}><td className="workflow-id-cell"><span className="ticket-id">{ticket.id}</span></td><td className="workflow-keywords-cell"><div className="keyword-list">{getKeywords(ticket.message, ticket.category).map((keyword, kIdx) => <strong className="query-keyword" key={`${keyword}-${kIdx}`}>{keyword}</strong>)}</div></td><td>{ticket.department}</td><td><span className={`table-priority ${ticket.priority.toLowerCase()}`}><i />{ticket.priority}</span></td></tr>)}</tbody></table></div></section>
}

function CustomersView() {
  const continents = [
    { name: 'Asia', count: 284 },
    { name: 'Africa', count: 96 },
    { name: 'North America', count: 218 },
    { name: 'South America', count: 124 },
    { name: 'Antarctica', count: 3 },
    { name: 'Europe', count: 176 },
    { name: 'Oceania', count: 72 },
  ]
  const total = continents.reduce((sum, continent) => sum + continent.count, 0)
  return <section className="analytics-view glass-panel" aria-labelledby="customers-title"><div className="analytics-heading"><div><p className="eyebrow">Customer distribution</p><h2 id="customers-title">Customers by continent</h2><p>Customer geographic breakdown.</p></div><span className="analytics-count">{total.toLocaleString()} customers</span></div><div className="analytics-table-wrap"><table className="analytics-table customers-table"><thead><tr><th>Continent</th><th>Total customers</th><th>Share of customers</th><th>Distribution</th></tr></thead><tbody>{continents.map((continent) => <tr key={continent.name}><td className="ticket-id">{continent.name}</td><td><strong className="customer-total">{continent.count.toLocaleString()}</strong></td><td><span className="customer-share">{Math.round((continent.count / total) * 100)}%</span></td><td><span className="customer-distribution"><i style={{ width: `${Math.round((continent.count / total) * 100)}%` }} /></span></td></tr>)}</tbody></table></div></section>
}

function InboxView({ tickets, onActionClick }: { tickets: AnalyticsTicket[]; onActionClick: (ticket: AnalyticsTicket) => void }) {
  return <section className="inbox-view glass-panel"><div className="analytics-heading"><div><p className="eyebrow">Human attention</p><h2>Inbox</h2><p>Tickets requiring human review.</p></div><span className="analytics-count">{tickets.length} action required</span></div>{tickets.length ? <div className="inbox-list">{tickets.map((ticket, idx) => <button className="inbox-ticket" key={`${ticket.id}-${idx}`} type="button" onClick={() => onActionClick(ticket)}><span className="inbox-ticket-copy"><strong>{ticket.message}</strong><small>{ticket.id} · {ticket.category} · {ticket.confidence} confidence</small></span><span className="human-action-badge required">Action required</span><ChevronRight /></button>)}</div> : <div className="inbox-empty"><span className="override-notice-icon"><Check /></span><div><strong>Inbox is clear</strong><p>All human-action issues have been resolved.</p></div></div>}</section>
}

function ActionDialog({ ticket, threshold, onClose, onConfirm }: { ticket: AnalyticsTicket; threshold: number; onClose: () => void; onConfirm: () => void }) {
  const confVal = Number.parseInt(ticket.confidence, 10) || 0;
  const isBelowThreshold = confVal < threshold;

  return (
    <div className="action-dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="action-dialog" role="dialog" aria-modal="true" style={{ width: 'min(92%, 520px)', padding: '26px', borderRadius: '24px', background: '#ffffff', color: '#0f172a', border: '1px solid rgba(199,210,254,0.8)', boxShadow: '0 25px 70px rgba(99,102,241,0.25)' }} onMouseDown={(e) => e.stopPropagation()}>
        <button className="demo-dialog-close" type="button" aria-label="Close" onClick={onClose}><X /></button>
        <p className="eyebrow" style={{ color: isBelowThreshold ? '#dc2626' : '#16a34a', fontWeight: 700 }}>
          {isBelowThreshold ? '⚠️ Action Required (Below Threshold)' : '✅ Automated Routing Approved'}
        </p>
        <h3 style={{ margin: '4px 0 12px', fontSize: '22px' }}>AI Recommendation Analysis</h3>
        
        <p className="action-dialog-message" style={{ background: '#f8fafc', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0', margin: '0 0 14px', fontSize: '13px', fontWeight: 600 }}>
          "{ticket.message}"
        </p>

        <div style={{ display: 'grid', gap: '10px', fontSize: '12px', textAlign: 'left' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase', display: 'block' }}>AI Confidence Score</span>
              <strong style={{ fontSize: '16px', color: isBelowThreshold ? '#dc2626' : '#16a34a' }}>{ticket.confidence}</strong>
              <small style={{ color: '#64748b', fontSize: '9px', display: 'block' }}>Configured Threshold: {threshold}%</small>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase', display: 'block' }}>Recommendation</span>
              <strong style={{ color: '#4f46e5', fontSize: '13px' }}>{isBelowThreshold ? 'Human Agent Review' : 'Automated Routing'}</strong>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <span style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 700 }}>AI Recommendation Reasoning</span>
            <p style={{ margin: 0, color: '#334155', fontSize: '12px', lineHeight: '1.45' }}>{ticket.reasoning || "Routed based on semantic severity evaluation."}</p>
          </div>
        </div>

        <div className="action-dialog-actions" style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="text-button" type="button" onClick={onClose}>Keep Automated</button>
          <button className="demo-submit override-confirm" type="button" onClick={onConfirm}>Confirm Human Override</button>
        </div>
      </div>
    </div>
  );
}

function TicketTable({ tickets, threshold = 85, onThresholdChange, onActionClick, onClearTickets }: { tickets: AnalyticsTicket[]; threshold?: number; onThresholdChange?: (val: number) => void; onActionClick: (ticket: AnalyticsTicket) => void; onClearTickets?: () => void }) {
  const [detailTicket, setDetailTicket] = useState<AnalyticsTicket | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [tickets.length]);

  const totalPages = Math.ceil(tickets.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTickets = tickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="analytics-view glass-panel" aria-labelledby="all-tickets-title">
      <div className="analytics-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p className="eyebrow">Workspace tickets</p>
          <h2 id="all-tickets-title">All tickets</h2>
          <p>Click any customer message to view full details.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(238,242,255,0.8)', padding: '5px 12px', borderRadius: '16px', border: '1px solid #c7d2fe' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#3730a3' }}>Human Action Threshold: <strong>{threshold}%</strong></span>
            <input
              type="range"
              min={70}
              max={95}
              value={threshold}
              onChange={(e) => onThresholdChange?.(Number(e.target.value))}
              style={{ width: '70px', cursor: 'pointer' }}
            />
          </div>
          <span className="analytics-count">{tickets.length} tickets</span>
          {onClearTickets && (
            <button
              type="button"
              onClick={onClearTickets}
              disabled={tickets.length === 0}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid #fca5a5',
                background: '#fef2f2',
                color: '#dc2626',
                fontSize: '10px',
                fontWeight: 700,
                cursor: tickets.length === 0 ? 'not-allowed' : 'pointer',
                opacity: tickets.length === 0 ? 0.5 : 1
              }}
            >
              🗑️ Clear All Tickets
            </button>
          )}
        </div>
      </div>
      <div className="analytics-table-wrap">
        <table className="analytics-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer message</th>
              <th>Category</th>
              <th>Department</th>
              <th>Priority</th>
              <th>AI confidence</th>
              <th>Reasoning</th>
              <th>Status</th>
              <th>Human action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTickets.map((ticket, idx) => {
              const actionRequired = Number.parseInt(ticket.confidence, 10) < threshold;
              return (
                <tr key={`${ticket.id}-${idx}`}>
                  <td className="ticket-id">{ticket.id}</td>
                  <td 
                    className="message-cell clickable-message" 
                    onClick={() => setDetailTicket(ticket)}
                    title="Click to view full ticket details"
                    style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(79, 70, 229, 0.3)', textUnderlineOffset: '3px' }}
                  >
                    {ticket.message}
                  </td>
                  <td>{ticket.category}</td>
                  <td>{ticket.department}</td>
                  <td><span className={`table-priority ${ticket.priority.toLowerCase()}`}><i />{ticket.priority}</span></td>
                  <td className="confidence-cell">{ticket.confidence}</td>
                  <td className="reasoning-cell">{ticket.reasoning}</td>
                  <td><span className={`table-status-select ${ticket.status.toLowerCase().replace(' ', '-')}`}>{ticket.status}</span></td>
                  <td className="human-action-cell">
                    <button type="button" className={`human-action-badge ${actionRequired ? 'required' : 'not-required'}`} onClick={() => onActionClick(ticket)}>
                      {actionRequired ? 'Action required' : 'Action not required'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      {tickets.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', padding: '10px 4px', fontSize: '11px', color: '#64748b' }}>
          <span>
            Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + ITEMS_PER_PAGE, tickets.length)}</strong> of <strong>{tickets.length}</strong> tickets
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '11px',
                fontWeight: 600,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              Previous
            </button>
            
            <span style={{ fontWeight: 700, color: '#312e81', padding: '0 6px' }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '11px',
                fontWeight: 600,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {detailTicket && (
        <div className="action-dialog-backdrop" role="presentation" onMouseDown={() => setDetailTicket(null)}>
          <div className="action-dialog" role="dialog" aria-modal="true" style={{ width: 'min(92%, 540px)', padding: '28px', borderRadius: '24px', background: '#ffffff', color: '#0f172a', border: '1px solid rgba(199,210,254,0.8)', boxShadow: '0 25px 70px rgba(99,102,241,0.25)' }} onMouseDown={(e) => e.stopPropagation()}>
            <button className="demo-dialog-close" type="button" aria-label="Close details" onClick={() => setDetailTicket(null)}><X /></button>
            <p className="eyebrow" style={{ color: '#6366f1', fontWeight: 700 }}>Ticket Intelligence Details</p>
            <h3 style={{ margin: '4px 0 16px', color: '#0f172a', fontSize: '24px', letterSpacing: '-0.03em' }}>{detailTicket.id}</h3>
            
            <div style={{ display: 'grid', gap: '14px', textAlign: 'left' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>Customer Message</strong>
                <p style={{ margin: 0, color: '#0f172a', fontWeight: '600', fontSize: '14px', lineHeight: '1.5' }}>{detailTicket.message}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>Category</span>
                  <strong style={{ color: '#4f46e5', fontSize: '13px' }}>{detailTicket.category}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>Routed Dept</span>
                  <strong style={{ color: '#0f172a', fontSize: '13px' }}>{detailTicket.department}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>Priority</span>
                  <strong style={{ color: detailTicket.priority.toLowerCase() === 'critical' || detailTicket.priority.toLowerCase() === 'high' ? '#dc2626' : '#2563eb', fontSize: '13px' }}>{detailTicket.priority}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>AI Confidence</span>
                  <strong style={{ color: '#16a34a', fontSize: '13px' }}>{detailTicket.confidence}</strong>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>AI Reasoning & Classification Justification</strong>
                <p style={{ margin: 0, color: '#334155', fontSize: '12px', lineHeight: '1.5' }}>{detailTicket.reasoning}</p>
              </div>
            </div>

            <div style={{ marginTop: '22px', textAlign: 'right' }}>
              <button className="demo-submit" type="button" onClick={() => setDetailTicket(null)}>Close Details</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function AnalyticsView({ title, tickets }: { title: string; tickets: AnalyticsTicket[]; onUpdate: (id: string, status: string) => void; onActionClick: (ticket: AnalyticsTicket) => void }) {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar')
  const chartData = useMemo(() => Object.entries(tickets.reduce<Record<string, number>>((counts, ticket) => { counts[ticket.category] = (counts[ticket.category] ?? 0) + 1; return counts }, {} )).map(([category, count]) => ({ category, value: count })), [tickets])
  const colors = ['#5968df', '#83a7c8', '#d9a85d', '#9a7bc1', '#6bb18b']
  return <section className="analytics-view glass-panel" aria-labelledby="analytics-title">
    <div className="analytics-heading"><div><p className="eyebrow">Workspace insights</p><h2 id="analytics-title">{title}</h2><p>Live ticket distribution by category.</p></div><div className="analytics-actions"><span className="analytics-count">{tickets.length} tickets</span></div></div>
    <div className="chart-toolbar" role="group" aria-label="Chart type"><span>View as</span>{(['bar', 'line', 'pie'] as const).map((type) => <button key={type} type="button" className={`chart-toggle ${chartType === type ? 'active' : ''}`} onClick={() => setChartType(type)}>{type === 'bar' ? 'Bar chart' : type === 'line' ? 'Line chart' : 'Pie chart'}</button>)}</div>
    <div className="analytics-chart" aria-label={`${chartType} chart showing tickets by category`}>
      <ResponsiveContainer width="100%" height="100%">{chartType === 'bar' ? <RechartsBarChart data={chartData} margin={{ top: 12, right: 18, left: 0, bottom: 8 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(112,126,157,.16)" /><XAxis dataKey="category" tick={{ fill: '#7b879b', fontSize: 10 }} tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tick={{ fill: '#7b879b', fontSize: 10 }} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,.8)', background: '#fffdf1', fontSize: 11 }} /><Bar dataKey="value" name="Tickets" radius={[8, 8, 0, 0]} fill="#5968df" /></RechartsBarChart> : chartType === 'line' ? <RechartsLineChart data={chartData} margin={{ top: 12, right: 18, left: 0, bottom: 8 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(112,126,157,.16)" /><XAxis dataKey="category" tick={{ fill: '#7b879b', fontSize: 10 }} tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tick={{ fill: '#7b879b', fontSize: 10 }} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,.8)', background: '#fffdf1', fontSize: 11 }} /><Line type="monotone" dataKey="value" name="Tickets" stroke="#5968df" strokeWidth={3} dot={{ r: 5, fill: '#5968df' }} /></RechartsLineChart> : <RechartsPieChart><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,.8)', background: '#fffdf1', fontSize: 11 }} /><RechartsLegend verticalAlign="bottom" height={28} wrapperStyle={{ fontSize: 10 }} /><Pie data={chartData} dataKey="value" nameKey="category" cx="50%" cy="45%" outerRadius="68%" paddingAngle={3}>{chartData.map((entry, index) => <Cell key={entry.category} fill={colors[index % colors.length]} />)}</Pie></RechartsPieChart>}</ResponsiveContainer>
    </div>
  </section>
}

function NavGroup({ title, items, active, onSelect }: { title: string; items: { label: string; icon: typeof Inbox; badge?: string }[]; active: string; onSelect: (label: string) => void }) {
  return <div className="nav-group">{title && <p className="nav-label">{title}</p>}{items.map(({ label, icon: Icon, badge }) => <button className={`nav-item ${active === label ? 'active' : ''}`} key={label} onClick={() => onSelect(label)}><Icon /><span>{label}</span>{badge && <b className="nav-badge">{badge}</b>}</button>)}</div>
}
function StatCard({ label, value, delta, icon: Icon, positive, arrowDirection }: { label: string; value: string; delta: string; icon: typeof Inbox; positive?: boolean; arrowDirection?: 'up' | 'down' }) { 
  const arrow = arrowDirection === 'down' ? '↓' : arrowDirection === 'up' ? '↑' : (positive ? '↑' : '↓')
  return <div className="stat-card glass-panel"><div className="stat-icon"><Icon /></div><div><span>{label}</span><div className="stat-value">{value} <small className={positive ? 'positive' : ''}>{arrow} {delta}</small></div></div></div> 
}
function Legend({ label, value, color }: { label: string; value: string; color: string }) { return <div className="legend-row"><span><i className={color} />{label}</span><b>{value}</b></div> }

function MockStorefrontModal({
  onClose,
  onAddTicket,
  onOpenTestSuite
}: {
  onClose: () => void
  onAddTicket: (msg: string) => Promise<any>
  onOpenTestSuite?: () => void
}) {
  const [activeTab, setActiveTab] = useState<'shop' | 'support_form' | 'my_tickets'>('shop')
  const [chatOpen, setChatOpen] = useState(true)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'Welcome to Nexus Global Store! ⚡ I am Lucent, your AI Assistant. How can I help with your orders, technical questions, or returns today?' }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [lastSubmittedTicket, setLastSubmittedTicket] = useState<any>(null)
  const [sessionId] = useState(() => `nexus-session-${Date.now()}`)

  // Customer Ticket Submission Form State
  const [formName, setFormName] = useState('Alex Chen')
  const [formEmail, setFormEmail] = useState('alex.chen@nexus-store.com')
  const [formOrderId, setFormOrderId] = useState('NX-99812')
  const [formMessage, setFormMessage] = useState('')
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [submittedTickets, setSubmittedTickets] = useState<any[]>([])

  const handleSend = async (queryText: string) => {
    const message = queryText.trim()
    if (!message || isTyping) return

    setMessages((curr) => [...curr, { role: 'user', text: message }])
    setChatInput('')
    setIsTyping(true)

    const createdTicket = await onAddTicket(message)
    if (createdTicket) {
      setLastSubmittedTicket(createdTicket)
      setSubmittedTickets((curr) => [createdTicket, ...curr])
    }

    try {
      const res = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id: sessionId }),
      })
      if (res.ok) {
        const data = await res.json()
        setMessages((curr) => [...curr, { role: 'assistant', text: data.reply }])
      } else {
        setMessages((curr) => [...curr, { role: 'assistant', text: 'Thank you for contacting customer support. Your ticket has been logged into the Nexus Support Queue.' }])
      }
    } catch {
      setMessages((curr) => [...curr, { role: 'assistant', text: 'Your ticket has been logged directly into the support system queue.' }])
    }

    setIsTyping(false)
  }

  const handleTicketFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formMessage.trim() || isSubmittingForm) return

    setIsSubmittingForm(true)
    const fullMsg = `[Nexus Order #${formOrderId}] ${formMessage.trim()}`
    const created = await onAddTicket(fullMsg)
    if (created) {
      setLastSubmittedTicket(created)
      setSubmittedTickets((curr) => [created, ...curr])
      setFormMessage('')
      setActiveTab('my_tickets')
    }
    setIsSubmittingForm(false)
  }

  const sampleCustomerQueries = [
    "My order #NX-99812 for Sony Headphones has not arrived yet, tracking has not updated in 4 days",
    "I was charged twice on my credit card for order #NX-99745",
    "The checkout payment gateway returned error 500 when attempting payment",
    "I received a defective item and need to generate a return shipping label",
  ]

  return (
    <div className="action-dialog-backdrop" role="presentation" style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(16px)', zIndex: 9999, padding: '16px' }} onMouseDown={onClose}>
      <div
        className="mock-storefront-dialog"
        style={{
          width: 'min(98%, 1160px)',
          height: 'min(94vh, 840px)',
          borderRadius: '28px',
          background: 'linear-gradient(125deg, #ed7753 0%, #f19d82 25%, #cb9cd3 70%, #996ea5 100%)',
          color: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 30px 100px rgba(0,0,0,0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Browser Top URL Bar */}
        <div style={{ background: 'rgba(30, 27, 75, 0.85)', backdropFilter: 'blur(20px)', padding: '9px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '5px 18px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', color: '#94a3b8', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px', width: 'min(100%, 500px)' }}>
            <span style={{ color: '#10b981' }}>🔒</span>
            <strong style={{ color: '#e2e8f0' }}>https://nexus-store.com/customer-portal</strong>
            <span style={{ marginLeft: 'auto', fontSize: '9px', background: '#4f46e5', color: '#fff', padding: '2px 8px', borderRadius: '8px', fontWeight: 800 }}>LIVE DEMO</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: '12px',
              background: '#dc2626',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <X size={14} /> Exit Storefront Demo
          </button>
        </div>

        {/* Live Admin Dashboard Integration Bar */}
        <div style={{ background: 'linear-gradient(90deg, #4f46e5, #6366f1)', padding: '7px 18px', color: '#ffffff', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>⚡ <strong>NEXUS GLOBAL MARKETPLACE</strong>: Test real-time customer support routing. Every customer ticket automatically updates your Admin Dashboard!</span>
          <span style={{ background: 'rgba(255,255,255,0.25)', padding: '2px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: 800 }}>Synced to FastAPI Backend</span>
        </div>

        {/* Storefront Navigation Header (Qunexa Glass Theme) */}
        <header style={{ background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(24px)', padding: '14px 28px', borderBottom: '1px solid rgba(255, 255, 255, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('shop')}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '18px', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}>N</div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 900, letterSpacing: '-0.02em', color: '#1e1b4b' }}>NEXUS GLOBAL STORE</h3>
              <span style={{ fontSize: '10px', color: '#4f46e5', fontWeight: 700 }}>Next-Gen Retail & Support Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '8px', fontSize: '12px', fontWeight: 600 }}>
            <button
              type="button"
              onClick={() => setActiveTab('shop')}
              style={{
                padding: '6px 14px',
                borderRadius: '12px',
                background: activeTab === 'shop' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.25)',
                color: activeTab === 'shop' ? '#4f46e5' : '#334155',
                border: activeTab === 'shop' ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: activeTab === 'shop' ? '0 4px 14px rgba(79,70,229,0.15)' : 'none'
              }}
            >
              🛍️ Storefront Catalog
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('support_form')}
              style={{
                padding: '6px 14px',
                borderRadius: '12px',
                background: activeTab === 'support_form' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.25)',
                color: activeTab === 'support_form' ? '#4f46e5' : '#334155',
                border: activeTab === 'support_form' ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: activeTab === 'support_form' ? '0 4px 14px rgba(79,70,229,0.15)' : 'none'
              }}
            >
              🎟️ Submit Support Ticket
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('my_tickets')}
              style={{
                padding: '6px 14px',
                borderRadius: '12px',
                background: activeTab === 'my_tickets' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.25)',
                color: activeTab === 'my_tickets' ? '#4f46e5' : '#334155',
                border: activeTab === 'my_tickets' ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: activeTab === 'my_tickets' ? '0 4px 14px rgba(79,70,229,0.15)' : 'none'
              }}
            >
              📋 My Tracked Tickets ({submittedTickets.length})
            </button>
            <button
              type="button"
              onClick={() => onOpenTestSuite?.()}
              style={{
                padding: '6px 14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(79,70,229,0.25)'
              }}
            >
              🧪 Test Support System
            </button>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#312e81', background: 'rgba(255,255,255,0.65)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.85)' }}>🛒 Cart (2)</span>
          </div>
        </header>

        {/* Storefront Main View Container (Warm Qunexa Glassmorphism Gradient) */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'transparent', color: '#0f172a', display: 'flex', flexDirection: 'column' }}>

          {/* Alert Banner for Newly Submitted Ticket */}
          {lastSubmittedTicket && (
            <div style={{ margin: '14px 28px 0', padding: '12px 18px', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '16px', color: '#065f46', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(16,185,129,0.1)' }}>
              <div>
                <strong>⚡ Live AI Classification Success!</strong> Ticket <code>{lastSubmittedTicket.id}</code> categorized as <strong>{lastSubmittedTicket.category}</strong> (Routed to <strong>{lastSubmittedTicket.department}</strong>, {lastSubmittedTicket.priority} Priority, {lastSubmittedTicket.confidence} Confidence).
              </div>
              <button type="button" onClick={() => setActiveTab('my_tickets')} style={{ background: '#10b981', color: '#ffffff', border: 0, padding: '4px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '10px', cursor: 'pointer' }}>
                Track Ticket Status
              </button>
            </div>
          )}

          {/* TAB 1: NEXUS STOREFRONT */}
          {activeTab === 'shop' && (
            <>
              {/* Promotional Hero Banner */}
              <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', padding: '24px 28px', color: '#ffffff', textAlign: 'left', margin: '16px 28px', borderRadius: '20px', border: '1px solid #4338ca', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ background: 'rgba(255,255,255,0.15)', color: '#a5b4fc', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '12px', letterSpacing: '0.08em' }}>NEXUS FLASH DEALS</span>
                  <h2 style={{ margin: '6px 0 4px', fontSize: '22px', fontWeight: 900, color: '#ffffff' }}>Next-Gen Tech, Laptops & Smart Electronics</h2>
                  <p style={{ margin: 0, color: '#c7d2fe', fontSize: '12px' }}>Fast 1-2 day express shipping on all orders. Lucent AI Assistant is ready to help below!</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => onOpenTestSuite?.()} style={{ padding: '10px 18px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '12px', fontWeight: 900, border: '1px solid rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                    🧪 Test Support System
                  </button>
                  <button type="button" onClick={() => setActiveTab('support_form')} style={{ padding: '10px 18px', borderRadius: '14px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: '#fff', fontSize: '12px', fontWeight: 900, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.4)' }}>
                    🎟️ Open Support Ticket
                  </button>
                </div>
              </div>

              {/* Product Cards Container */}
              <div style={{ padding: '0 28px 28px' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: '#334155', textAlign: 'left' }}>Featured Store Products</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  
                  {/* Product Card 1 */}
                  <div className="storefront-product-card" style={{ padding: '18px', borderRadius: '22px', border: '1px solid rgba(255,255,255,0.85)', background: 'linear-gradient(145deg, rgba(255,255,255,0.92), rgba(248,250,252,0.85))', backdropFilter: 'blur(16px)', textAlign: 'left', boxShadow: '0 10px 30px rgba(99,102,241,0.06), inset 0 1px 0 rgba(255,255,255,1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ height: '100px', borderRadius: '16px', background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', border: '1px solid rgba(224,231,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.9)' }}>🎧</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#15803d', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <i style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a' }} /> Express Stock
                        </span>
                        <span style={{ color: '#4f46e5', fontWeight: 900, fontSize: '16px', letterSpacing: '-0.02em' }}>$348.00</span>
                      </div>
                      <strong style={{ display: 'block', margin: '8px 0 4px', fontSize: '13px', color: '#0f172a', fontWeight: 800, lineHeight: 1.3 }}>Sony WH-1000XM5 Wireless Headphones</strong>
                      <div style={{ fontSize: '11px', color: '#f59e0b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ⭐⭐⭐⭐⭐ <small style={{ color: '#64748b', fontWeight: 600 }}>(12,450 reviews)</small>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleSend("I was charged twice on my credit card for the Sony Headphones")} style={{ marginTop: '6px', width: '100%', padding: '9px 12px', borderRadius: '12px', border: '1px solid rgba(199,210,254,0.8)', background: 'rgba(238,242,255,0.8)', fontSize: '10px', fontWeight: 800, color: '#3730a3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      💳 Report Double Charge Issue
                    </button>
                  </div>

                  {/* Product Card 2 */}
                  <div className="storefront-product-card" style={{ padding: '18px', borderRadius: '22px', border: '1px solid rgba(255,255,255,0.85)', background: 'linear-gradient(145deg, rgba(255,255,255,0.92), rgba(248,250,252,0.85))', backdropFilter: 'blur(16px)', textAlign: 'left', boxShadow: '0 10px 30px rgba(99,102,241,0.06), inset 0 1px 0 rgba(255,255,255,1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ height: '100px', borderRadius: '16px', background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', border: '1px solid rgba(224,231,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.9)' }}>💻</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#15803d', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <i style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a' }} /> In Stock
                        </span>
                        <span style={{ color: '#4f46e5', fontWeight: 900, fontSize: '16px', letterSpacing: '-0.02em' }}>$1,299.00</span>
                      </div>
                      <strong style={{ display: 'block', margin: '8px 0 4px', fontSize: '13px', color: '#0f172a', fontWeight: 800, lineHeight: 1.3 }}>Apple MacBook Air 15" M3 (512GB)</strong>
                      <div style={{ fontSize: '11px', color: '#f59e0b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ⭐⭐⭐⭐⭐ <small style={{ color: '#64748b', fontWeight: 600 }}>(8,920 reviews)</small>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleSend("My order #NX-99812 for MacBook Air has not arrived yet")} style={{ marginTop: '6px', width: '100%', padding: '9px 12px', borderRadius: '12px', border: '1px solid rgba(199,210,254,0.8)', background: 'rgba(238,242,255,0.8)', fontSize: '10px', fontWeight: 800, color: '#3730a3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      📦 Track Delivery Status
                    </button>
                  </div>

                  {/* Product Card 3 */}
                  <div className="storefront-product-card" style={{ padding: '18px', borderRadius: '22px', border: '1px solid rgba(255,255,255,0.85)', background: 'linear-gradient(145deg, rgba(255,255,255,0.92), rgba(248,250,252,0.85))', backdropFilter: 'blur(16px)', textAlign: 'left', boxShadow: '0 10px 30px rgba(99,102,241,0.06), inset 0 1px 0 rgba(255,255,255,1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ height: '100px', borderRadius: '16px', background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', border: '1px solid rgba(224,231,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.9)' }}>📱</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#15803d', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <i style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a' }} /> In Stock
                        </span>
                        <span style={{ color: '#4f46e5', fontWeight: 900, fontSize: '16px', letterSpacing: '-0.02em' }}>$1,199.00</span>
                      </div>
                      <strong style={{ display: 'block', margin: '8px 0 4px', fontSize: '13px', color: '#0f172a', fontWeight: 800, lineHeight: 1.3 }}>Samsung Galaxy S24 Ultra (512GB)</strong>
                      <div style={{ fontSize: '11px', color: '#f59e0b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ⭐⭐⭐⭐⭐ <small style={{ color: '#64748b', fontWeight: 600 }}>(6,410 reviews)</small>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleSend("My order #NX-88210 for Samsung S24 has not arrived yet, tracking has not updated in 4 days")} style={{ marginTop: '6px', width: '100%', padding: '9px 12px', borderRadius: '12px', border: '1px solid rgba(199,210,254,0.8)', background: 'rgba(238,242,255,0.8)', fontSize: '10px', fontWeight: 800, color: '#3730a3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      🚚 Report Shipping Delay
                    </button>
                  </div>

                  {/* Product Card 4 */}
                  <div className="storefront-product-card" style={{ padding: '18px', borderRadius: '22px', border: '1px solid rgba(255,255,255,0.85)', background: 'linear-gradient(145deg, rgba(255,255,255,0.92), rgba(248,250,252,0.85))', backdropFilter: 'blur(16px)', textAlign: 'left', boxShadow: '0 10px 30px rgba(99,102,241,0.06), inset 0 1px 0 rgba(255,255,255,1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ height: '100px', borderRadius: '16px', background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.9)' }}>🎮</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#c2410c', background: '#ffedd5', border: '1px solid #fed7aa', padding: '3px 9px', borderRadius: '20px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          🔥 High Demand
                        </span>
                        <span style={{ color: '#4f46e5', fontWeight: 900, fontSize: '16px', letterSpacing: '-0.02em' }}>$699.00</span>
                      </div>
                      <strong style={{ display: 'block', margin: '8px 0 4px', fontSize: '13px', color: '#0f172a', fontWeight: 800, lineHeight: 1.3 }}>Sony PlayStation 5 Pro Console</strong>
                      <div style={{ fontSize: '11px', color: '#f59e0b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ⭐⭐⭐⭐⭐ <small style={{ color: '#64748b', fontWeight: 600 }}>(15,800 reviews)</small>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleSend("The checkout payment gateway returned error 500 when attempting PS5 payment")} style={{ marginTop: '6px', width: '100%', padding: '9px 12px', borderRadius: '12px', border: '1px solid rgba(254,202,202,0.8)', background: '#fef2f2', fontSize: '10px', fontWeight: 800, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      ⚠️ Report Payment 500 Error
                    </button>
                  </div>

                  {/* Product Card 5 */}
                  <div className="storefront-product-card" style={{ padding: '18px', borderRadius: '22px', border: '1px solid rgba(255,255,255,0.85)', background: 'linear-gradient(145deg, rgba(255,255,255,0.92), rgba(248,250,252,0.85))', backdropFilter: 'blur(16px)', textAlign: 'left', boxShadow: '0 10px 30px rgba(99,102,241,0.06), inset 0 1px 0 rgba(255,255,255,1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ height: '100px', borderRadius: '16px', background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', border: '1px solid rgba(224,231,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.9)' }}>🖥️</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#15803d', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <i style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a' }} /> In Stock
                        </span>
                        <span style={{ color: '#4f46e5', fontWeight: 900, fontSize: '16px', letterSpacing: '-0.02em' }}>$1,899.00</span>
                      </div>
                      <strong style={{ display: 'block', margin: '8px 0 4px', fontSize: '13px', color: '#0f172a', fontWeight: 800, lineHeight: 1.3 }}>Dell XPS 16 OLED Laptop (64GB RAM)</strong>
                      <div style={{ fontSize: '11px', color: '#f59e0b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ⭐⭐⭐⭐⭐ <small style={{ color: '#64748b', fontWeight: 600 }}>(3,120 reviews)</small>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleSend("I received a damaged laptop package and need to print a return shipping label")} style={{ marginTop: '6px', width: '100%', padding: '9px 12px', borderRadius: '12px', border: '1px solid rgba(199,210,254,0.8)', background: 'rgba(238,242,255,0.8)', fontSize: '10px', fontWeight: 800, color: '#3730a3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      🏷️ Request Damaged Item Return
                    </button>
                  </div>

                  {/* Product Card 6 */}
                  <div className="storefront-product-card" style={{ padding: '18px', borderRadius: '22px', border: '1px solid rgba(255,255,255,0.85)', background: 'linear-gradient(145deg, rgba(255,255,255,0.92), rgba(248,250,252,0.85))', backdropFilter: 'blur(16px)', textAlign: 'left', boxShadow: '0 10px 30px rgba(99,102,241,0.06), inset 0 1px 0 rgba(255,255,255,1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ height: '100px', borderRadius: '16px', background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', border: '1px solid rgba(224,231,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.9)' }}>⌚</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#15803d', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <i style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a' }} /> In Stock
                        </span>
                        <span style={{ color: '#4f46e5', fontWeight: 900, fontSize: '16px', letterSpacing: '-0.02em' }}>$799.00</span>
                      </div>
                      <strong style={{ display: 'block', margin: '8px 0 4px', fontSize: '13px', color: '#0f172a', fontWeight: 800, lineHeight: 1.3 }}>Apple Watch Ultra 2 Titanium</strong>
                      <div style={{ fontSize: '11px', color: '#f59e0b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ⭐⭐⭐⭐⭐ <small style={{ color: '#64748b', fontWeight: 600 }}>(7,490 reviews)</small>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleSend("My 20% promo code SAVE20 is not applying at checkout for Apple Watch")} style={{ marginTop: '6px', width: '100%', padding: '9px 12px', borderRadius: '12px', border: '1px solid rgba(199,210,254,0.8)', background: 'rgba(238,242,255,0.8)', fontSize: '10px', fontWeight: 800, color: '#3730a3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      🎟️ Promo Code Issue
                    </button>
                  </div>

                </div>
              </div>
            </>
          )}

          {/* TAB 2: CUSTOMER TICKET SUPPORT FORM */}
          {activeTab === 'support_form' && (
            <div style={{ padding: '28px', maxWidth: '720px', margin: '0 auto', width: '100%', textAlign: 'left' }}>
              <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', padding: '28px', borderRadius: '24px', border: '1px solid rgba(199,210,254,0.9)', boxShadow: '0 20px 50px rgba(0,0,0,0.06)' }}>
                <p className="eyebrow" style={{ color: '#4f46e5', fontWeight: 700 }}>Nexus Support Portal</p>
                <h3 style={{ margin: '4px 0 16px', fontSize: '22px', color: '#0f172a' }}>Submit Customer Support Ticket</h3>

                <form onSubmit={handleTicketFormSubmit} style={{ display: 'grid', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Your Name</label>
                      <input
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '12px', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Nexus Order Number (Optional)</label>
                      <input
                        value={formOrderId}
                        onChange={(e) => setFormOrderId(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '12px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Describe Your Issue or Request</label>
                    <textarea
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="e.g. My order #NX-99812 was charged twice on my credit card..."
                      rows={5}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '12px', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!formMessage.trim() || isSubmittingForm}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
                      opacity: !formMessage.trim() || isSubmittingForm ? 0.6 : 1
                    }}
                  >
                    {isSubmittingForm ? '⏳ Processing & Routing Ticket...' : '🎟️ Submit Support Ticket to AI Queue'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: MY TRACKED TICKETS */}
          {activeTab === 'my_tickets' && (
            <div style={{ padding: '28px', maxWidth: '880px', margin: '0 auto', width: '100%', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>My Submitted Support Tickets</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>Live classification and routing status of your tickets submitted on Nexus Global Store.</p>
                </div>
                <button type="button" onClick={() => setActiveTab('support_form')} style={{ padding: '8px 14px', borderRadius: '12px', background: '#4f46e5', color: '#fff', fontSize: '11px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  + Submit New Ticket
                </button>
              </div>

              {submittedTickets.length === 0 ? (
                <div style={{ padding: '36px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#64748b' }}>
                  <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 600 }}>No tickets submitted yet.</p>
                  <button type="button" onClick={() => setActiveTab('support_form')} style={{ padding: '8px 16px', borderRadius: '12px', background: '#eef2ff', color: '#3730a3', fontSize: '11px', fontWeight: 700, border: '1px solid #c7d2fe', cursor: 'pointer' }}>
                    Submit a sample ticket
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {submittedTickets.map((t, idx) => (
                    <div key={idx} style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderRadius: '18px', border: '1px solid rgba(199,210,254,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <strong style={{ color: '#4f46e5', fontSize: '13px' }}>{t.id}</strong>
                          <span style={{ fontSize: '10px', background: '#eef2ff', padding: '2px 8px', borderRadius: '6px', color: '#3730a3', border: '1px solid #c7d2fe', fontWeight: 700 }}>{t.category}</span>
                          <span style={{ fontSize: '10px', background: t.priority === 'Critical' || t.priority === 'High' ? '#fef2f2' : '#eff6ff', color: t.priority === 'Critical' || t.priority === 'High' ? '#dc2626' : '#2563eb', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, border: t.priority === 'Critical' || t.priority === 'High' ? '1px solid #fca5a5' : '1px solid #bfdbfe' }}>{t.priority} Priority</span>
                        </div>
                        <p style={{ margin: 0, color: '#0f172a', fontSize: '12px', fontWeight: 600 }}>"{t.message}"</p>
                        <small style={{ color: '#64748b', fontSize: '10px', marginTop: '4px', display: 'block' }}>Routed to {t.department} · {t.confidence} AI Confidence</small>
                      </div>
                      <span style={{ padding: '4px 10px', borderRadius: '10px', background: '#f0fdf4', color: '#166534', fontSize: '10px', fontWeight: 700, border: '1px solid #bbf7d0' }}>
                        Status: Open
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating Lucent Chat Assistant Widget */}
        {chatOpen ? (
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '24px',
              width: '360px',
              height: '460px',
              borderRadius: '24px',
              background: '#ffffff',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              border: '1px solid rgba(199,210,254,0.9)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 100
            }}
          >
            {/* Widget Header */}
            <div style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', padding: '12px 16px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ fontSize: '13px', display: 'block', lineHeight: 1.2 }}>Lucent AI Assistant</strong>
                  <span style={{ fontSize: '9px', opacity: 0.9 }}>Nexus Support Online</span>
                </div>
              </div>
              <button type="button" onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', fontSize: '12px', textAlign: 'left' }}>
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '8px 12px',
                    borderRadius: '14px',
                    background: m.role === 'user' ? '#4f46e5' : '#ffffff',
                    color: m.role === 'user' ? '#ffffff' : '#0f172a',
                    border: m.role === 'user' ? 'none' : '1px solid #e2e8f0',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    lineHeight: '1.4'
                  }}
                >
                  {m.text}
                </div>
              ))}
              {isTyping && <div style={{ opacity: 0.6, fontSize: '11px', fontStyle: 'italic', color: '#64748b' }}>Lucent is typing...</div>}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend(chatInput)
              }}
              style={{ padding: '8px', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', gap: '6px' }}
            >
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Lucent about your order..."
                style={{ flex: 1, padding: '8px 12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '11px', outline: 'none' }}
              />
              <button type="button" onClick={() => handleSend(chatInput)} disabled={!chatInput.trim() || isTyping} style={{ padding: '8px 12px', borderRadius: '12px', background: '#4f46e5', color: '#fff', fontSize: '11px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                Send
              </button>
            </form>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '24px',
              padding: '12px 20px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '12px',
              boxShadow: '0 10px 25px rgba(79,70,229,0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            💬 Chat with Lucent AI
          </button>
        )}
      </div>
    </div>
  )
}
