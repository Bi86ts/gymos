import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'

// Mock member context database for template generation
const memberContexts = {
  '1': { name: 'Sienna Williams', risk: 'high', consistency: 22, issue: '80% attendance decay (21 days)', identityGoal: 'I want to be a healthy, energetic role model for my kids.' },
  '2': { name: 'Marcus Thorne', risk: 'high', consistency: 35, issue: '3 missed PT sessions in a row', identityGoal: 'I am a powerhouse who consistently builds strength.' },
  '3': { name: 'Elena Rodriguez', risk: 'medium', consistency: 58, issue: 'Low intensity detected last 3 workouts', identityGoal: 'I want to feel limitless and capable in my daily life.' },
  '4': { name: 'David Chen', risk: 'medium', consistency: 62, issue: 'Subscription expiring in 48 hours', identityGoal: 'I am an athlete building my ultimate physique.' },
  '5': { name: 'Priya Sharma', risk: 'medium', consistency: 65, issue: 'Skipped 2 sessions this week', identityGoal: 'I am a runner who embraces endurance.' },
  'default': { name: 'Member', risk: 'low', consistency: 90, issue: 'Doing great', identityGoal: 'I am an athlete.' }
}

const chatHistories = {
  '1': [
    { id: 1, text: "Hey Sienna, noticed you've been missing sessions. Everything okay?", sender: "trainer", time: "10:00 AM" },
    { id: 2, text: "I missed yesterday because of work.", sender: "member", time: "10:30 AM" }
  ],
  '2': [
    { id: 1, text: "Marcus, great PR today. Let's increase the weight next week.", sender: "trainer", time: "Monday" },
    { id: 2, text: "Copy that, I will do 4 sets.", sender: "member", time: "Yesterday" }
  ],
  '3': [
    { id: 1, text: "Elena, the new nutrition guidelines are key for your goal.", sender: "trainer", time: "Mon" },
    { id: 2, text: "Is the new diet plan rolling out?", sender: "member", time: "Tue" }
  ],
  'default': [
    { id: 1, text: "Trainer notes: Ensure to keep them motivated.", sender: "system", time: "System Info" }
  ]
}

const templatesByRisk = {
  high: [
    { label: 'Missed Sessions', text: "Hey [Name], I noticed you haven't been in for a while. Remember your goal: '[Goal]'. Let's get you back on track this week. When can you come in?" },
    { label: 'Recovery Needed', text: "Hey [Name], falling off the wagon happens. Don't let it ruin your momentum to become a [Goal]. I've attached a light recovery plan. Let's do it tomorrow." },
  ],
  medium: [
    { label: 'Intensity Drop', text: "Hey [Name], your attendance is okay but intensity seems down. You're building that '[Goal]' identity. Let's push a bit harder on the next session. Need any adjustments?" },
    { label: 'Schedule Check', text: "Hey [Name], you've skipped a couple of sessions. Let me know if the current schedule isn't working for you and we can adjust. Consistency is key for a [Goal]." },
  ],
  low: [
    { label: 'Streak Praise', text: "Hey [Name]! Incredible streak you've got going. You are absolutely crushing your goal to become a [Goal]." },
    { label: 'New PR', text: "Hey [Name], that's a new PR! The dedication is showing. Let's keep this momentum going!" },
  ]
}

export default function TrainerMessageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preset = searchParams.get('preset')

  const member = memberContexts[id] || memberContexts['default']
  const availableTemplates = templatesByRisk[member.risk] || templatesByRisk['low']

  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState(chatHistories[id] || chatHistories['default'])

  useEffect(() => {
    if (preset === 'urgent') {
      setMessageText(`Hey ${member.name.split(' ')[0]}, I've noticed a significant drop in your attendance. Your goal was: "${member.identityGoal}". Let's jump on a quick call to recalibrate your routine so we don't lose progress.`)
    } else if (preset === 'medium') {
      setMessageText(`Hey ${member.name.split(' ')[0]}, just checking in. Remember your goal: "${member.identityGoal}". Let's make sure you hit your targets this week.`)
    }
  }, [preset, member])

  const handleTemplateClick = (templateText) => {
    // Replace placeholders with actual member data
    let parsedText = templateText.replace('[Name]', member.name.split(' ')[0])
    parsedText = parsedText.replace('[Goal]', member.identityGoal)
    parsedText = parsedText.replace('[Goal]', member.identityGoal) // just in case
    
    setMessageText(parsedText)
  }

  const handleSend = (e) => {
    if (e) e.preventDefault()
    if (!messageText.trim()) return
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: messageText,
      sender: "trainer",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
    setMessageText('')
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col pb-24 max-w-lg mx-auto relative">
      
      {/* Header */}
      <div className="bg-surface-container/90 backdrop-blur-md px-4 py-4 flex items-center gap-3 border-b border-on-surface-variant/10 z-10 sticky top-0">
        <button type="button" onClick={() => navigate('/trainer/messages')} className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold">
          {member.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h2 className="font-headline font-black text-on-surface text-lg leading-tight truncate">{member.name}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
              member.risk === 'high' ? 'bg-error/10 text-error' : member.risk === 'medium' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
            }`}>
              {member.risk} Risk
            </span>
          </div>
        </div>
      </div>

      {/* Member Context Panel */}
      <div className="mx-4 mt-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
        <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">psychology</span>
          Member Context
        </h4>
        <p className="text-xs text-on-surface italic mb-2">"{member.identityGoal}"</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-surface-container-highest text-on-surface-variant px-2 py-1 rounded font-bold uppercase tracking-wider">
            Issue: {member.issue}
          </span>
          <span className="text-[10px] bg-surface-container-highest text-on-surface-variant px-2 py-1 rounded font-bold uppercase tracking-wider">
            Att: {member.consistency}%
          </span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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
                  <span className="material-symbols-outlined text-[12px]">done_all</span>
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
      </div>

      {/* Input Area & Templates */}
      <div className="fixed bottom-24 left-0 right-0 max-w-2xl mx-auto px-4 z-20">
        <div className="bg-surface-container/95 border border-on-surface-variant/20 rounded-3xl backdrop-blur-xl shadow-2xl p-3 flex flex-col gap-3">
          
          {/* Template Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {availableTemplates.map((template, idx) => (
              <button 
                key={idx}
                onClick={() => handleTemplateClick(template.text)}
                className="flex-shrink-0 bg-surface-bright border border-primary/20 text-primary px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-primary/10 transition-colors"
              >
                {template.label}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2">
            <textarea 
              rows={3}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message or select a template above..."
              className="bg-surface border border-outline-variant/10 rounded-xl px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none w-full resize-none custom-scrollbar focus:border-primary/50 transition-colors"
            />
            <button 
              type="button"
              onClick={handleSend}
              disabled={!messageText.trim()}
              className="p-3 bg-primary text-on-primary-fixed rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:bg-surface-container-highest transition-all shrink-0 active:scale-95 shadow-md shadow-primary/20 disabled:shadow-none"
            >
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
