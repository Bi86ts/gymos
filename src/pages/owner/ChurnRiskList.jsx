import { useState } from 'react'
import { Link } from 'react-router-dom'

const members = [
  { id: 1, name: 'Sienna Williams', risk: 95, level: 'Critical', trainer: 'Coach Marcus', lastContact: '3 days ago', lastVisit: '21 days ago', reason: 'Attendance decay — 80% drop', expiry: 'Apr 15' },
  { id: 2, name: 'Marcus Thorne', risk: 88, level: 'Critical', trainer: 'Coach Marcus', lastContact: '5 days ago', lastVisit: '14 days ago', reason: '3 missed PT sessions', expiry: 'Apr 2' },
  { id: 3, name: 'Raj Mehta', risk: 82, level: 'High', trainer: 'Coach Priya', lastContact: '7 days ago', lastVisit: '12 days ago', reason: 'No check-in since plan change', expiry: 'May 1' },
  { id: 4, name: 'Amanda Foster', risk: 76, level: 'High', trainer: 'Coach Marcus', lastContact: '2 days ago', lastVisit: '10 days ago', reason: 'Skip frequency increasing', expiry: 'Apr 20' },
  { id: 5, name: 'Elena Rodriguez', risk: 62, level: 'Medium', trainer: 'Coach Priya', lastContact: '1 day ago', lastVisit: '5 days ago', reason: 'Low intensity detected', expiry: 'May 15' },
  { id: 6, name: 'David Chen', risk: 58, level: 'Medium', trainer: 'Coach Marcus', lastContact: 'Today', lastVisit: '3 days ago', reason: 'Subscription expiring soon', expiry: 'Mar 30' },
  { id: 7, name: 'Priya Sharma', risk: 52, level: 'Medium', trainer: 'Coach Priya', lastContact: '2 days ago', lastVisit: '4 days ago', reason: 'Skipped 2 sessions this week', expiry: 'Apr 10' },
  { id: 8, name: 'Tom Wallace', risk: 45, level: 'Low', trainer: 'Coach Marcus', lastContact: '4 days ago', lastVisit: '2 days ago', reason: 'Slight attendance dip', expiry: 'Jun 1' },
]

const tabs = ['All', 'Critical', 'High', 'Medium', 'Low']
const levelColors = {
  Critical: 'text-error bg-error/10',
  High: 'text-error bg-error/5',
  Medium: 'text-secondary bg-secondary/10',
  Low: 'text-on-surface-variant bg-surface-container-highest',
}

export default function ChurnRiskList() {
  const [activeTab, setActiveTab] = useState('All')
  const [pingedTrainers, setPingedTrainers] = useState({})

  const filtered = activeTab === 'All' ? members : members.filter(m => m.level === activeTab)

  const pingTrainer = (id) => setPingedTrainers(prev => ({ ...prev, [id]: true }))

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label text-primary uppercase tracking-[0.3em] text-xs font-bold mb-2 block">Risk Intelligence</span>
          <h2 className="font-headline text-4xl font-bold tracking-tight">Churn <span className="text-error italic">Risk List</span></h2>
        </div>
        <div className="flex gap-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-error/10 px-4 py-2 rounded-xl text-center">
              <p className="font-headline font-bold text-lg text-error">{members.filter(m => m.level === 'Critical' || m.level === 'High').length}</p>
              <p className="text-[8px] font-bold text-error uppercase">Critical</p>
            </div>
            <div className="bg-secondary/10 px-4 py-2 rounded-xl text-center">
              <p className="font-headline font-bold text-lg text-secondary">{members.filter(m => m.level === 'Medium').length}</p>
              <p className="text-[8px] font-bold text-secondary uppercase">Medium</p>
            </div>
            <div className="bg-surface-container-highest px-4 py-2 rounded-xl text-center">
              <p className="font-headline font-bold text-lg">{members.filter(m => m.level === 'Low').length}</p>
              <p className="text-[8px] font-bold text-on-surface-variant uppercase">Low</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === tab ? 'bg-primary text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-highest'
            }`}>{tab}</button>
        ))}
      </div>

      {/* Member List */}
      <div className="space-y-3">
        {filtered.map((member) => (
          <div key={member.id} className="bg-surface-container p-5 rounded-xl hover:bg-surface-container-high transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant">person</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg">{member.name}</h4>
                  <p className="text-[10px] text-on-surface-variant">{member.trainer} · Expires: {member.expiry}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter ${levelColors[member.level]}`}>{member.level}</span>
                <div className="bg-surface-container-highest px-3 py-1 rounded-full">
                  <span className="font-headline font-bold text-sm">{member.risk}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mb-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-error">warning</span>
              {member.reason}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-on-surface-variant">Last contact: {member.lastContact} · Last visit: {member.lastVisit}</p>
              <button
                onClick={() => pingTrainer(member.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-95 ${
                  pingedTrainers[member.id]
                    ? 'bg-primary/10 text-primary'
                    : 'bg-surface-container-highest text-on-surface hover:bg-surface-bright'
                }`}
              >
                {pingedTrainers[member.id] ? '✓ Pinged' : 'Ping Trainer'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
