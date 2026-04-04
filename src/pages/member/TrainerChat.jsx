import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TrainerChat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey Alex! Checked your recent numbers. You're really building that powerhouse identity we talked about. Deadlift form is looking much better. Feeling any lower back tension?", sender: "trainer", time: "10:30 AM", read: true },
    { id: 2, text: "Not at all, the cue you gave me about engaging lats helped a ton.", sender: "user", time: "10:35 AM", read: true },
    { id: 3, text: "Boom. That's what I like to hear. We're upping the load by 5% next week. Let me know if tomorrow's recovery feels too light.", sender: "trainer", time: "11:00 AM", read: true }
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSend = () => {
    if (!newMessage.trim()) return
    setMessages([...messages, {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    }])
    setNewMessage("")
  }

  return (
    <div className="h-[calc(100vh-80px)] bg-surface flex flex-col pb-24 max-w-lg mx-auto overflow-hidden">
      
      {/* Header Profile */}
      <div className="bg-surface-container/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-on-surface-variant/10 shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/member/chat')} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=200&auto=format&fit=crop" alt="Sarah" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-surface"></div>
          </div>
          <div>
            <h2 className="font-headline font-black text-on-surface text-lg leading-tight uppercase tracking-tight">Coach Sarah</h2>
            <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full inline-block animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">info</span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Date divider */}
        <div className="flex justify-center mb-6">
          <span className="text-[10px] bg-surface-container px-3 py-1 rounded-full text-on-surface-variant font-bold tracking-[0.2em] uppercase">Today</span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.sender === 'user'
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[75%] px-4 py-3 shadow-md ${
                isUser 
                  ? 'bg-primary text-on-primary-fixed rounded-2xl rounded-tr-sm' 
                  : 'bg-surface-container-highest text-on-surface border border-outline-variant/10 rounded-2xl rounded-tl-sm'
              }`}>
                <p className={`text-[15px] font-medium leading-relaxed ${isUser ? 'font-medium' : ''}`}>{msg.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${isUser ? 'text-on-primary-fixed/70' : 'text-on-surface-variant'} text-[10px]`}>
                  <span className="font-bold">{msg.time}</span>
                  {isUser && (
                    <span className="material-symbols-outlined text-[12px]">done_all</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Input Area */}
      <div className="bg-surface-container/90 px-4 py-3 border-t border-on-surface-variant/10 fixed bottom-24 left-0 right-0 max-w-md mx-auto rounded-3xl backdrop-blur-md shadow-2xl flex items-end gap-2 z-20 mx-4">
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full shrink-0">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>add_circle</span>
        </button>
        <textarea 
          rows={1}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask form advice, tweak protocol..."
          className="bg-transparent text-on-surface placeholder:text-on-surface-variant/40 outline-none w-full max-h-24 py-2 resize-none custom-scrollbar font-medium"
        />
        <button 
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="p-3 bg-primary text-on-primary-fixed rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:bg-surface-container-highest transition-all shrink-0 active:scale-95 shadow-[0_0_15px_rgba(205,255,24,0.3)] disabled:shadow-none"
        >
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
        </button>
      </div>

    </div>
  )
}
