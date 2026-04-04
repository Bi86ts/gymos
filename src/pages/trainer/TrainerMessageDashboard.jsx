import { Link } from 'react-router-dom'

const chats = [
  { id: '1', name: 'Sienna Williams', lastMessage: 'I missed yesterday because of work.', time: '10:30 AM', unread: 1, avatar: 'SW' },
  { id: '2', name: 'Marcus Thorne', lastMessage: 'Copy that, I will do 4 sets.', time: 'Yesterday', unread: 0, avatar: 'MT' },
  { id: '3', name: 'Elena Rodriguez', lastMessage: 'Is the new diet plan rolling out?', time: 'Tue', unread: 0, avatar: 'ER' },
]

export default function TrainerMessageDashboard() {
  return (
    <div className="space-y-6 pb-24">
      <div>
        <h2 className="font-headline text-2xl font-bold mb-1">Messages</h2>
        <p className="text-on-surface-variant text-sm">You have 1 unread message</p>
      </div>

      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full bg-surface-container border border-outline-variant/10 rounded-xl pl-11 pr-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary/30"
        />
      </div>

      <div className="space-y-2">
        {chats.map(chat => (
          <Link key={chat.id} to={`/trainer/messages/${chat.id}`} className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl hover:bg-surface-container-high transition-colors group">
            <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center font-headline font-bold text-lg text-on-surface-variant group-hover:bg-primary/20 group-hover:text-primary transition-colors relative">
              {chat.avatar}
              {chat.unread > 0 && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-error rounded-full border-2 border-surface-container"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className={`font-headline text-md truncate ${chat.unread > 0 ? 'font-black' : 'font-bold text-on-surface-variant'}`}>{chat.name}</h3>
                <span className={`text-[10px] tracking-wider uppercase font-bold ${chat.unread > 0 ? 'text-primary' : 'text-on-surface-variant/60'}`}>{chat.time}</span>
              </div>
              <p className={`text-sm truncate ${chat.unread > 0 ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>{chat.lastMessage}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
