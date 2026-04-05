import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { initChatClient, getMyConversations } from '../../services/chatService'
import { getMembers, syncCurrentMember, GOAL_LABELS } from '../../services/trainerService'

export default function TrainerMessageDashboard() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [conversations, setConversations] = useState([])
  const [members, setMembers] = useState([])
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMembers(syncCurrentMember())
  }, [])

  // Try to connect to Twilio and load conversations
  useEffect(() => {
    let mounted = true
    const identity = user?.id || 'trainer_demo'

    async function loadConversations() {
      try {
        setConnectionStatus('connecting')
        const client = await initChatClient(identity, 'Trainer')
        if (!mounted) return

        setConnectionStatus('connected')
        const convos = await getMyConversations(client)
        if (!mounted) return

        // Enrich with last message
        const enriched = await Promise.all(convos.map(async (conv) => {
          const msgs = await conv.getMessages(1)
          const lastMsg = msgs.items[msgs.items.length - 1]
          return {
            sid: conv.sid,
            uniqueName: conv.uniqueName,
            friendlyName: conv.friendlyName,
            lastMessage: lastMsg?.body || '',
            lastTime: lastMsg?.dateCreated ? new Date(lastMsg.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            unread: 0, // Twilio SDK tracks this but requires more setup
          }
        }))
        setConversations(enriched)
      } catch (err) {
        console.warn('Twilio not available, showing member roster:', err.message)
        if (mounted) setConnectionStatus('offline')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadConversations()
    return () => { mounted = false }
  }, [user])

  // Map conversations to member IDs or show member roster as fallback
  const chatList = useMemo(() => {
    if (connectionStatus === 'connected' && conversations.length > 0) {
      return conversations.map(conv => {
        // Try to find the member from the conversation unique name
        const memberIdMatch = conv.uniqueName?.match(/dm_.*?_(.*?)$/)
        const memberId = memberIdMatch?.[1]
        const member = members.find(m => m.id === memberId)
        return {
          id: memberId || conv.sid,
          name: member?.name || conv.friendlyName || 'Unknown',
          avatar: (member?.name || 'U').charAt(0),
          lastMessage: conv.lastMessage || 'Start a conversation',
          time: conv.lastTime || '',
          unread: conv.unread,
          objective: member?.objective,
        }
      })
    }
    // Fallback: show all members as potential chats
    return members.map(m => ({
      id: m.id,
      name: m.name,
      avatar: m.name.charAt(0),
      lastMessage: 'Tap to start chatting',
      time: '',
      unread: 0,
      objective: m.objective,
    }))
  }, [conversations, members, connectionStatus])

  const filtered = search
    ? chatList.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : chatList

  const statusDot = connectionStatus === 'connected' ? 'bg-emerald-400' : connectionStatus === 'connecting' ? 'bg-amber-400 animate-pulse' : 'bg-on-surface-variant/30'

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-black uppercase tracking-tight">Messages</h2>
          <p className="text-on-surface-variant text-sm flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
            {connectionStatus === 'connected' ? 'Connected to Twilio' : connectionStatus === 'connecting' ? 'Connecting...' : 'Offline mode'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
        <input type="text" placeholder="Search conversations..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary/40 transition-all" />
      </div>

      {/* Chat List */}
      <div className="space-y-2">
        {filtered.map(chat => (
          <Link key={chat.id} to={`/trainer/messages/${chat.id}`}
            className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl hover:bg-surface-container-high transition-colors group border border-outline-variant/5">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center font-headline font-bold text-lg text-on-surface-variant group-hover:bg-primary/20 group-hover:text-primary transition-colors relative shrink-0">
              {chat.avatar}
              {chat.unread > 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error rounded-full border-2 border-surface-container flex items-center justify-center">
                  <span className="text-[8px] font-black text-white">{chat.unread}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className={`font-headline text-sm truncate ${chat.unread > 0 ? 'font-black' : 'font-bold'}`}>{chat.name}</h3>
                {chat.time && (
                  <span className={`text-[10px] tracking-wider uppercase font-bold shrink-0 ml-2 ${chat.unread > 0 ? 'text-primary' : 'text-on-surface-variant/60'}`}>{chat.time}</span>
                )}
              </div>
              <p className={`text-xs truncate ${chat.unread > 0 ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>{chat.lastMessage}</p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl opacity-20 mb-2">forum</span>
          <p className="text-sm">No conversations found</p>
        </div>
      )}
    </div>
  )
}
