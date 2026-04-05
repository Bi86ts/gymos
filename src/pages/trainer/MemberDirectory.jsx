import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getMembers, syncCurrentMember, GOAL_LABELS, GOAL_COLORS, EQUIP_LABELS, daysSince, memberStatus } from '../../services/trainerService'

const tabs = ['All', 'Active', 'New', 'Watch', 'At Risk']
const statusMap = { 'Active': 'active', 'New': 'new', 'Watch': 'watch', 'At Risk': 'at-risk' }

export default function MemberDirectory() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [members, setMembers] = useState([])

  useEffect(() => {
    setMembers(syncCurrentMember())
  }, [])

  const filtered = useMemo(() => {
    return members.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
      const matchTab = activeTab === 'All' || memberStatus(m) === statusMap[activeTab]
      return matchSearch && matchTab
    })
  }, [members, search, activeTab])

  const tabCounts = useMemo(() => ({
    All: members.length,
    Active: members.filter(m => memberStatus(m) === 'active').length,
    New: members.filter(m => memberStatus(m) === 'new').length,
    Watch: members.filter(m => memberStatus(m) === 'watch').length,
    'At Risk': members.filter(m => memberStatus(m) === 'at-risk').length,
  }), [members])

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h2 className="font-headline text-2xl font-black uppercase tracking-tight">Members</h2>
        <p className="text-on-surface-variant text-sm">{members.length} assigned to you</p>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
        <input type="text" placeholder="Search by name..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all" />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === tab ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-highest'
            }`}>
            {tab}
            {tabCounts[tab] > 0 && <span className={`text-[9px] ${activeTab === tab ? 'opacity-80' : 'opacity-50'}`}>({tabCounts[tab]})</span>}
          </button>
        ))}
      </div>

      {/* Member List */}
      <div className="space-y-3">
        {filtered.map(m => {
          const status = memberStatus(m)
          const inactive = daysSince(m.lastActive || m.onboardedAt)
          const statusBadge = status === 'at-risk'
            ? { label: 'At Risk', cls: 'text-error bg-error/10 border-error/20' }
            : status === 'watch'
            ? { label: 'Watch', cls: 'text-amber-400 bg-amber-400/10 border-amber-400/20' }
            : status === 'new'
            ? { label: 'New', cls: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' }
            : { label: 'Active', cls: 'text-primary bg-primary/10 border-primary/20' }

          return (
            <Link key={m.id} to={`/trainer/member/${m.id}`}
              className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl hover:bg-surface-container-high transition-all group border border-outline-variant/5">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center flex-shrink-0 relative">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
                {status === 'new' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-surface animate-pulse" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-headline font-bold text-sm truncate group-hover:text-primary transition-colors">{m.name}</h4>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-on-surface-variant flex-wrap">
                  <span className={`font-bold ${GOAL_COLORS[m.objective] || 'text-primary'}`}>{GOAL_LABELS[m.objective] || 'Fitness'}</span>
                  <span>·</span>
                  <span>{m.weight}kg</span>
                  <span>·</span>
                  <span>{m.experience}</span>
                  {m.conditions?.some(c => c !== 'None') && (
                    <>
                      <span>·</span>
                      <span className="text-error flex items-center gap-0.5"><span className="material-symbols-outlined text-[10px]">warning</span>Medical</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status + Ring */}
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${statusBadge.cls}`}>{statusBadge.label}</span>
                <span className="text-[9px] text-on-surface-variant">
                  {inactive === 0 ? 'Today' : inactive === 1 ? 'Yesterday' : `${inactive}d ago`}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-3 opacity-30">search_off</span>
          <p className="text-sm font-medium">No members found</p>
          <p className="text-xs opacity-60 mt-1">Try a different search or filter</p>
        </div>
      )}
    </div>
  )
}
