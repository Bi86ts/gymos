import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { initChatClient, getOrCreateConversation, sendMessage } from '../../services/chatService'
import { getMemberById, GOAL_LABELS } from '../../services/trainerService'

// Template messages by member goal/status
const templatesByGoal = {
  bulk: [
    { label: 'Progress Check', text: "Hey [Name], how's the bulk going? Are you hitting your caloric targets? Let's review your progress this week." },
    { label: 'Increase Load', text: "Hey [Name], you've been consistent — time to increase the load. Let's add 5kg to your compounds this week." },
  ],
  lean: [
    { label: 'Diet Check', text: "Hey [Name], how's the cut going? Make sure you're staying in a deficit but still getting enough protein for recovery." },
    { label: 'Cardio Reminder', text: "Hey [Name], don't skip your cardio sessions this week. They're crucial for hitting your target weight." },
  ],
  athletic: [
    { label: 'Performance', text: "Hey [Name], your athletic performance is looking great. Let's test your endurance benchmark this week." },
    { label: 'Recovery', text: "Hey [Name], make sure you're foam rolling and stretching after those intense sessions. Recovery = Gains." },
  ],
  default: [
    { label: 'Check In', text: "Hey [Name], just checking in! How are you feeling after your recent sessions?" },
    { label: 'Motivation', text: "Hey [Name], remember why you started: \"[Motivation]\". Keep pushing — you're doing amazing!" },
  ],
}

export default function TrainerMessageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const messagesEndRef = useRef(null)

  const member = useMemo(() => getMemberById(id), [id])
  const memberName = member?.name || 'Member'
  const firstName = memberName.split(' ')[0]
  const templates = templatesByGoal[member?.objective] || templatesByGoal.default

  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState([])
  const [conversation, setConversation] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('connecting') // connecting, connected, offline
  const [sending, setSending] = useState(false)

  // Init Twilio or fall back to local
  useEffect(() => {
    let mounted = true
    const identity = user?.id || 'trainer_demo'

    async function connect() {
      try {
        setConnectionStatus('connecting')
        const client = await initChatClient(identity, 'Trainer')
        const memberId = member?.id || id
        const conv = await getOrCreateConversation(client, identity, memberId, memberName)
        if (!mounted) return

        setConversation(conv)
        setConnectionStatus('connected')

        // Load existing messages
        const paginator = await conv.getMessages()
        if (!mounted) return
        setMessages(paginator.items.map(m => ({
          id: m.sid,
          text: m.body,
          sender: m.author === identity ? 'trainer' : 'member',
          time: new Date(m.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          twilioMsg: m,
        })))

        // Listen for new messages
        conv.on('messageAdded', (msg) => {
          if (!mounted) return
          setMessages(prev => [...prev, {
            id: msg.sid,
            text: msg.body,
            sender: msg.author === identity ? 'trainer' : 'member',
            time: new Date(msg.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            twilioMsg: msg,
          }])
        })
      } catch (err) {
        console.warn('Twilio connection failed, using local mode:', err.message)
        if (mounted) setConnectionStatus('offline')
      }
    }

    connect()
    return () => { mounted = false }
  }, [id, user])

  // Apply preset from URL params
  useEffect(() => {
    const preset = searchParams.get('preset')
    if (preset === 'urgent' && member) {
      setMessageText(`Hey ${firstName}, I've noticed you haven't been in for a while. Let's get you back on track this week — when can you come in?`)
    }
  }, [searchParams, member])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleTemplateClick = (templateText) => {
    let parsed = templateText.replace(/\[Name\]/g, firstName)
    if (member?.motivation) parsed = parsed.replace(/\[Motivation\]/g, member.motivation)
    setMessageText(parsed)
  }

  const handleSend = async (e) => {
    if (e) e.preventDefault()
    if (!messageText.trim() || sending) return

    const text = messageText.trim()
    setMessageText('')
    setSending(true)

    if (conversation && connectionStatus === 'connected') {
      // Send via Twilio
      try {
        await sendMessage(conversation, text)
      } catch (err) {
        console.error('Send failed:', err)
        // Fallback — add locally
        setMessages(prev => [...prev, {
          id: Date.now(),
          text,
          sender: 'trainer',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }])
      }
    } else {
      // Offline mode — local only
      setMessages(prev => [...prev, {
        id: Date.now(),
        text,
        sender: 'trainer',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    }
    setSending(false)
  }

  const statusDot = connectionStatus === 'connected' ? 'bg-emerald-400' : connectionStatus === 'connecting' ? 'bg-amber-400 animate-pulse' : 'bg-on-surface-variant/30'

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col pb-24 max-w-lg mx-auto relative">

      {/* Header */}
      <div className="bg-surface-container/90 backdrop-blur-md px-4 py-4 flex items-center gap-3 border-b border-on-surface-variant/10 z-10 sticky top-0">
        <button type="button" onClick={() => navigate('/trainer/messages')} className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold">
          {memberName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-headline font-black text-on-surface text-lg leading-tight truncate">{memberName}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            {member?.objective && (
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary">
                {GOAL_LABELS[member.objective] || member.objective}
              </span>
            )}
            <span className="flex items-center gap-1 text-[9px] text-on-surface-variant">
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
              {connectionStatus === 'connected' ? 'Live' : connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl opacity-20 mb-2">chat</span>
            <p className="text-sm">No messages yet</p>
            <p className="text-xs opacity-60 mt-1">Send a message to start the conversation</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'trainer' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            {msg.sender === 'system' ? (
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold bg-surface-container px-3 py-1 rounded-full border border-outline-variant/10">
                {msg.text}
              </span>
            ) : msg.sender === 'trainer' ? (
              <div className="max-w-[80%] bg-primary text-on-primary-fixed rounded-2xl rounded-tr-sm px-4 py-3 shadow-md">
                <p className="text-[14px] font-medium leading-relaxed">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1 text-on-primary-fixed/70 text-[10px]">
                  <span className="font-bold">{msg.time}</span>
                  {connectionStatus === 'connected' && <span className="material-symbols-outlined text-[12px]">done_all</span>}
                </div>
              </div>
            ) : (
              <div className="max-w-[80%] bg-surface-container-high text-on-surface rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-outline-variant/10">
                <p className="text-[14px] font-medium leading-relaxed">{msg.text}</p>
                <div className="flex items-center justify-start gap-1 mt-1 text-on-surface-variant text-[10px]">
                  <span className="font-bold">{msg.time}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area & Templates */}
      <div className="fixed bottom-24 left-0 right-0 max-w-2xl mx-auto px-4 z-20">
        <div className="bg-surface-container/95 border border-on-surface-variant/20 rounded-3xl backdrop-blur-xl shadow-2xl p-3 flex flex-col gap-3">

          {/* Template Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {templates.map((template, idx) => (
              <button key={idx} onClick={() => handleTemplateClick(template.text)}
                className="flex-shrink-0 bg-surface-bright border border-primary/20 text-primary px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-primary/10 transition-colors">
                {template.label}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2">
            <textarea rows={2} value={messageText} onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="Type your message..."
              className="bg-surface border border-outline-variant/10 rounded-xl px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none w-full resize-none custom-scrollbar focus:border-primary/50 transition-colors" />
            <button type="button" onClick={handleSend} disabled={!messageText.trim() || sending}
              className="p-3 bg-primary text-on-primary-fixed rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:bg-surface-container-highest transition-all shrink-0 active:scale-95 shadow-md shadow-primary/20 disabled:shadow-none">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>{sending ? 'hourglass_top' : 'send'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
