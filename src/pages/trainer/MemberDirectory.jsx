import { useState } from 'react'
import { Link } from 'react-router-dom'

const allMembers = [
  { id: '1', name: 'Sienna Williams', risk: 'high', consistency: 22, lastVisit: '21 days ago', plan: 'Weight Loss', status: 'At Risk' },
  { id: '2', name: 'Marcus Thorne', risk: 'high', consistency: 35, lastVisit: '14 days ago', plan: 'Build Muscle', status: 'At Risk' },
  { id: '3', name: 'Elena Rodriguez', risk: 'medium', consistency: 58, lastVisit: '5 days ago', plan: 'General Health', status: 'Watch' },
  { id: '4', name: 'David Chen', risk: 'medium', consistency: 62, lastVisit: '3 days ago', plan: 'Build Muscle', status: 'Watch' },
  { id: '5', name: 'Priya Sharma', risk: 'medium', consistency: 65, lastVisit: '4 days ago', plan: 'Stamina', status: 'Watch' },
  { id: '6', name: 'Alex Turner', risk: 'low', consistency: 88, lastVisit: 'Today', plan: 'Build Muscle', status: 'Active' },
  { id: '7', name: 'Jordan Blake', risk: 'low', consistency: 92, lastVisit: 'Today', plan: 'Build Muscle', status: 'Active' },
  { id: '8', name: 'Riley Kim', risk: 'low', consistency: 85, lastVisit: 'Yesterday', plan: 'Weight Loss', status: 'Active' },
  { id: '9', name: 'Sam Patel', risk: 'low', consistency: 78, lastVisit: '2 days ago', plan: 'General Health', status: 'Active' },
  { id: '10', name: 'Morgan Lee', risk: 'low', consistency: 91, lastVisit: 'Today', plan: 'Stamina', status: 'Active' },
]

const riskColor = { high: 'text-error bg-error/10', medium: 'text-secondary bg-secondary/10', low: 'text-primary bg-primary/10' }
const tabs = ['All', 'At Risk', 'Watch', 'Active']

export default function MemberDirectory() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')

  const filtered = allMembers.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    const matchTab = activeTab === 'All' || m.status === activeTab
    return matchSearch && matchTab
  })

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="font-headline text-2xl font-bold mb-1">Member Directory</h2>
        <p className="text-on-surface-variant text-sm">{allMembers.length} assigned members</p>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface-container border border-outline-variant/10 rounded-xl pl-11 pr-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-primary text-on-primary-fixed'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Member List */}
      <div className="space-y-3">
        {filtered.map((member) => (
          <Link
            key={member.id}
            to={`/trainer/member/${member.id}`}
            className="flex items-center gap-4 p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">person</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-headline font-bold text-sm truncate">{member.name}</h4>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${riskColor[member.risk]}`}>
                  {member.risk}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-on-surface-variant">
                <span>{member.plan}</span>
                <span>·</span>
                <span>Last: {member.lastVisit}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="relative w-10 h-10">
                <svg className="performance-ring w-full h-full" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="16" fill="transparent" stroke="#23262a" strokeWidth="3"></circle>
                  <circle cx="20" cy="20" r="16" fill="transparent" stroke={member.risk === 'high' ? '#ff7351' : member.risk === 'medium' ? '#ece856' : '#beee00'} strokeDasharray="100.5" strokeDashoffset={100.5 - (member.consistency / 100) * 100.5} strokeLinecap="round" strokeWidth="3"></circle>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">{member.consistency}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
          <p className="text-sm">No members found</p>
        </div>
      )}
    </div>
  )
}
