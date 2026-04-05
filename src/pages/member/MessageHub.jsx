import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { initChatClient, getMyConversations } from '../../services/chatService'

export default function MessageHub() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [lastTrainerMsg, setLastTrainerMsg] = useState(null)
  const [unread, setUnread] = useState(0)

  const announcements = [
    { id: 1, title: '🏋️ New Equipment Arrived!', message: "We've added 2 new cable machines and a glute-ham developer to the Forge floor. Come check them out!", time: '2 hours ago', pinned: true },
    { id: 2, title: '⏰ Extended Hours This Week', message: 'The gym will be open from 5 AM to midnight all week. Make the most of it.', time: '1 day ago', pinned: false },
  ]

  // Try to load last message from Twilio
  useEffect(() => {
    let mounted = true
    const identity = user?.id || 'member_demo'

    async function loadLastMessage() {
      try {
        setConnectionStatus('connecting')
        const client = await initChatClient(identity, 'Member')
        if (!mounted) return
        setConnectionStatus('connected')

        const convos = await getMyConversations(client)
        if (!mounted || convos.length === 0) return

        // Get the first (trainer) conversation's last message
        const conv = convos[0]
        const msgs = await conv.getMessages(1)
        const lastMsg = msgs.items[msgs.items.length - 1]
        if (lastMsg && mounted) {
          setLastTrainerMsg({
            text: lastMsg.body,
            time: new Date(lastMsg.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            fromTrainer: lastMsg.author !== identity,
          })
        }
      } catch (err) {
        console.warn('Twilio unavailable:', err.message)
        if (mounted) {
          setConnectionStatus('offline')
          // Fallback text
          setLastTrainerMsg({
            text: 'Tap to start chatting with your trainer',
            time: '',
            fromTrainer: false,
          })
        }
      }
    }

    loadLastMessage()
    return () => { mounted = false }
  }, [user])

  const statusDot = connectionStatus === 'connected' ? 'bg-emerald-400' : connectionStatus === 'connecting' ? 'bg-amber-400 animate-pulse' : 'bg-on-surface-variant/30'

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">

      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-black font-headline text-on-surface uppercase italic">Messages</h1>
        <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
          {connectionStatus === 'connected' ? 'Live' : connectionStatus === 'connecting' ? '...' : 'Offline'}
        </div>
      </div>

      {/* Gym Announcements */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <span className="material-symbols-outlined text-primary text-lg" style={{fontVariationSettings: "'FILL' 1"}}>campaign</span>
          <h2 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Gym Announcements</h2>
        </div>

        <div className="bg-gradient-to-br from-surface-container to-surface-container-low rounded-3xl border border-primary/15 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-container to-primary" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />

          <div className="relative z-10 divide-y divide-outline-variant/10">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-5 hover:bg-primary/5 transition-colors cursor-default">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-on-surface text-sm leading-snug">{ann.title}</h3>
                  {ann.pinned && <span className="material-symbols-outlined text-primary text-sm shrink-0" style={{fontVariationSettings: "'FILL' 1"}}>push_pin</span>}
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-2">{ann.message}</p>
                <span className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">{ann.time}</span>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-outline-variant/10 bg-surface-container-highest/30">
            <p className="text-[10px] text-on-surface-variant text-center font-bold uppercase tracking-widest flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-xs">lock</span>
              Broadcast Only — From Gym Management
            </p>
          </div>
        </div>
      </section>

      {/* Trainer DM */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <span className="material-symbols-outlined text-primary text-lg" style={{fontVariationSettings: "'FILL' 1"}}>chat</span>
          <h2 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Direct Messages</h2>
        </div>

        <button
          onClick={() => navigate('/member/chat/trainer')}
          className="w-full bg-surface-container rounded-2xl p-4 border border-outline-variant/10 shadow-lg hover:border-primary/30 hover:bg-surface-container-high transition-all active:scale-[0.98] text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full border-2 border-primary/40 overflow-hidden group-hover:border-primary transition-colors bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>sports</span>
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-surface-container flex items-center justify-center" style={{backgroundColor: connectionStatus === 'connected' ? '#34d399' : '#6b7280'}}>
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-headline font-black text-on-surface text-base uppercase tracking-tight">Coach Sarah</h3>
                {lastTrainerMsg?.time && (
                  <span className="text-[10px] text-on-surface-variant font-bold tracking-widest">{lastTrainerMsg.time}</span>
                )}
              </div>
              <p className="text-sm text-on-surface-variant truncate leading-snug">
                {lastTrainerMsg?.text || 'Loading...'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {unread > 0 && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-[10px] font-black text-on-primary-fixed">{unread}</span>
                </div>
              )}
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_right</span>
            </div>
          </div>
        </button>
      </section>

      {/* Quick Actions */}
      <section className="bg-surface-container rounded-2xl p-5 border border-outline-variant/5 shadow-md">
        <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-sm">bolt</span>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-surface-container-highest hover:bg-primary/10 rounded-xl p-4 flex flex-col items-center gap-2 transition-colors group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-2xl">support_agent</span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest group-hover:text-on-surface transition-colors">Help Desk</span>
          </button>
          <button className="bg-surface-container-highest hover:bg-primary/10 rounded-xl p-4 flex flex-col items-center gap-2 transition-colors group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-2xl">feedback</span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest group-hover:text-on-surface transition-colors">Feedback</span>
          </button>
        </div>
      </section>
    </div>
  )
}
