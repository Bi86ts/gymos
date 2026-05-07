import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { initChatClient, getOrCreateConversation, sendMessage } from '../../services/chatService'
import { detectSchedule, getNextDayDate, saveReminder } from '../../utils/scheduleDetector'

export default function TrainerChat() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const messagesEndRef = useRef(null)

  // Check if we arrived with a trainer message from the landing page
  const incomingTrainerMessage = location.state?.trainerMessage || null
  const incomingTrainerName = location.state?.trainerName || null

  const [messages, setMessages] = useState(() => {
    // Seed with the trainer message if navigated from the landing page Reply button
    if (incomingTrainerMessage) {
      return [{
        id: 'trainer-incoming-' + Date.now(),
        text: incomingTrainerMessage,
        sender: 'trainer',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isHighlighted: true,
      }]
    }
    return []
  })
  const [newMessage, setNewMessage] = useState('')
  const [conversation, setConversation] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [sending, setSending] = useState(false)
  const [chatReminderSet, setChatReminderSet] = useState(false)

  const trainerName = incomingTrainerName || 'Coach Sarah'
  const trainerId = 'trainer_demo'

  // Detect schedule in incoming message
  const incomingScheduleInfo = incomingTrainerMessage ? detectSchedule(incomingTrainerMessage) : { isSchedule: false }

  const handleChatReminder = () => {
    if (!incomingScheduleInfo.isSchedule || chatReminderSet) return
    const targetDate = incomingScheduleInfo.day ? getNextDayDate(incomingScheduleInfo.day) : new Date()
    saveReminder({
      text: incomingScheduleInfo.reminderText,
      activity: incomingScheduleInfo.activity,
      day: incomingScheduleInfo.day,
      date: targetDate.toISOString(),
      source: 'trainer_chat',
      trainerName: trainerName,
    })
    setChatReminderSet(true)
  }

  // Init Twilio
  useEffect(() => {
    let mounted = true
    const identity = user?.id || 'member_demo'

    async function connect() {
      try {
        setConnectionStatus('connecting')
        const client = await initChatClient(identity, 'Member')
        const conv = await getOrCreateConversation(client, identity, trainerId, trainerName)
        if (!mounted) return

        setConversation(conv)
        setConnectionStatus('connected')

        const paginator = await conv.getMessages()
        if (!mounted) return
        setMessages(paginator.items.map(m => ({
          id: m.sid,
          text: m.body,
          sender: m.author === identity ? 'user' : 'trainer',
          time: new Date(m.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })))

        conv.on('messageAdded', (msg) => {
          if (!mounted) return
          setMessages(prev => [...prev, {
            id: msg.sid,
            text: msg.body,
            sender: msg.author === identity ? 'user' : 'trainer',
            time: new Date(msg.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }])
        })
      } catch (err) {
        console.warn('Twilio unavailable, local mode:', err.message)
        if (mounted) setConnectionStatus('offline')
      }
    }

    connect()
    return () => { mounted = false }
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return
    const text = newMessage.trim()
    setNewMessage('')
    setSending(true)

    if (conversation && connectionStatus === 'connected') {
      try {
        await sendMessage(conversation, text)
      } catch (err) {
        console.error('Send failed:', err)
        setMessages(prev => [...prev, { id: Date.now(), text, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
      }
    } else {
      setMessages(prev => [...prev, { id: Date.now(), text, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    }
    setSending(false)
  }

  const statusDot = connectionStatus === 'connected' ? 'bg-emerald-400' : connectionStatus === 'connecting' ? 'bg-amber-400 animate-pulse' : 'bg-on-surface-variant/30'

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 10rem)' }}>

      {/* Chat Header — inline, not fixed (parent layout handles fixed header) */}
      <div className="bg-surface-container rounded-2xl px-4 py-3 flex items-center gap-3 border border-outline-variant/10 mb-3 shrink-0">
        <button onClick={() => navigate('/member/chat')} className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div className="w-10 h-10 rounded-full border-2 border-primary/30 bg-surface-container-highest flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>sports</span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-headline font-black text-on-surface text-base leading-tight uppercase tracking-tight">{trainerName}</h2>
          <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${statusDot}`} />
            {connectionStatus === 'connected' ? 'Live' : connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-1 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl opacity-20 mb-3">chat</span>
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs opacity-60 mt-1">Send a message to your trainer</p>
          </div>
        )}
        {messages.map((msg) => {
          const isUser = msg.sender === 'user'
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              {msg.isHighlighted && (
                <div className="flex flex-col items-start gap-2 max-w-[85%]">
                  <span className="text-[10px] font-bold text-[#00FFAA] uppercase tracking-widest flex items-center gap-1 px-1">
                    <span className="material-symbols-outlined text-xs">reply</span>
                    Replying to this message
                  </span>
                  <div className="px-4 py-3 shadow-md bg-surface-container-highest text-on-surface border border-[#00FFAA]/30 rounded-2xl rounded-tl-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00FFAA] rounded-full" />
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-on-surface-variant text-[10px]">
                      <span className="font-bold">{msg.time}</span>
                    </div>
                  </div>

                  {/* Schedule Reminder Card */}
                  {incomingScheduleInfo.isSchedule && (
                    <div className="w-full rounded-2xl border border-[#FF9500]/20 bg-gradient-to-r from-[#FF9500]/8 to-[#FFE600]/8 p-3.5 shadow-md backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FF9500]/15 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[#FF9500] text-xl" style={{fontVariationSettings: "'FILL' 1"}}>event</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-[#FF9500] text-xs">auto_awesome</span>
                            <p className="text-[10px] text-[#FF9500] font-bold uppercase tracking-widest">Schedule Detected</p>
                          </div>
                          <p className="text-sm text-white font-semibold mb-0.5">{incomingScheduleInfo.reminderText}</p>
                          <p className="text-[10px] text-on-surface-variant">From trainer's message — set a reminder so you don't miss it</p>
                        </div>
                      </div>
                      <button
                        onClick={handleChatReminder}
                        disabled={chatReminderSet}
                        className={`w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] ${
                          chatReminderSet
                            ? 'bg-[#00FFAA]/15 text-[#00FFAA] border border-[#00FFAA]/25'
                            : 'bg-gradient-to-r from-[#FF9500]/25 to-[#FFE600]/25 border border-[#FF9500]/30 text-[#FFE600] hover:border-[#FF9500]/60 hover:from-[#FF9500]/35 hover:to-[#FFE600]/35 shadow-lg shadow-[#FF9500]/10'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base" style={{fontVariationSettings: "'FILL' 1"}}>
                          {chatReminderSet ? 'check_circle' : 'alarm_add'}
                        </span>
                        {chatReminderSet ? '✓ Reminder Set — You\'ll be notified' : `Set Reminder for ${incomingScheduleInfo.day || 'Session'}`}
                      </button>
                    </div>
                  )}
                </div>
              )}
              {!msg.isHighlighted && (
                <div className={`max-w-[80%] px-4 py-3 shadow-md ${
                  isUser
                    ? 'bg-primary text-on-primary-fixed rounded-2xl rounded-tr-sm'
                    : 'bg-surface-container-highest text-on-surface border border-outline-variant/10 rounded-2xl rounded-tl-sm'
                }`}>
                  <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 ${isUser ? 'text-on-primary-fixed/70' : 'text-on-surface-variant'} text-[10px]`}>
                    <span className="font-bold">{msg.time}</span>
                    {isUser && connectionStatus === 'connected' && (
                      <span className="material-symbols-outlined text-[12px]">done_all</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input — relative positioning within the flex column, NOT fixed */}
      <div className="bg-surface-container border border-outline-variant/15 rounded-2xl mt-3 p-3 flex items-end gap-2 shrink-0">
        <textarea
          rows={1}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          placeholder="Message your trainer..."
          className="bg-transparent text-on-surface placeholder:text-on-surface-variant/40 outline-none w-full max-h-20 py-2 resize-none custom-scrollbar font-medium text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
          className="p-2.5 bg-primary text-on-primary-fixed rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:bg-surface-container-highest transition-all shrink-0 active:scale-95 shadow-md shadow-primary/20 disabled:shadow-none"
        >
          <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 1"}}>{sending ? 'hourglass_top' : 'send'}</span>
        </button>
      </div>
    </div>
  )
}
