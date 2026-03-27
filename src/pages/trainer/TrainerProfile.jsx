import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function TrainerProfile() {
  const [notifications, setNotifications] = useState({ urgentAlerts: true, dailySummary: true, memberCheckins: false, renewalAlerts: true })

  const toggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Profile Header */}
      <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-surface-container-highest flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">person</span>
          </div>
          <div>
            <h2 className="font-headline text-2xl font-bold">Coach Marcus</h2>
            <p className="text-on-surface-variant text-sm">Senior Trainer · Kinetic Forge</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Active since Jan 2023</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container p-4 rounded-xl text-center">
          <p className="font-headline font-bold text-2xl">10</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Members</p>
        </div>
        <div className="bg-surface-container p-4 rounded-xl text-center">
          <p className="font-headline font-bold text-2xl text-primary">85%</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Retention</p>
        </div>
        <div className="bg-surface-container p-4 rounded-xl text-center">
          <p className="font-headline font-bold text-2xl">142</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Sessions</p>
        </div>
      </div>

      {/* Notification Settings */}
      <div>
        <h3 className="font-headline text-lg font-bold mb-4">Notification Preferences</h3>
        <div className="space-y-2">
          {[
            { key: 'urgentAlerts', label: 'Urgent Risk Alerts', desc: 'When a member reaches HIGH risk status' },
            { key: 'dailySummary', label: 'Daily Action Summary', desc: 'Morning briefing of today\'s queue' },
            { key: 'memberCheckins', label: 'Member Check-ins', desc: 'When assigned members check in' },
            { key: 'renewalAlerts', label: 'Renewal Alerts', desc: 'When members approach renewal date' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-surface-container rounded-xl">
              <div>
                <p className="font-bold text-sm">{item.label}</p>
                <p className="text-[10px] text-on-surface-variant">{item.desc}</p>
              </div>
              <button
                onClick={() => toggleNotif(item.key)}
                className={`w-12 h-6 rounded-full flex items-center transition-all ${
                  notifications[item.key] ? 'bg-primary justify-end' : 'bg-surface-container-highest justify-start'
                }`}
              >
                <div className={`w-5 h-5 rounded-full mx-0.5 transition-colors ${notifications[item.key] ? 'bg-on-primary-fixed' : 'bg-on-surface-variant'}`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="font-headline text-lg font-bold mb-4">Settings</h3>
        <div className="space-y-2">
          {[
            { icon: 'edit', label: 'Edit Profile' },
            { icon: 'description', label: 'Message Templates' },
            { icon: 'fitness_center', label: 'Workout Templates' },
            { icon: 'help', label: 'Help & Support' },
          ].map(item => (
            <button key={item.label} className="w-full flex items-center gap-4 p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-all text-left">
              <span className="material-symbols-outlined text-on-surface-variant">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm ml-auto">chevron_right</span>
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <Link to="/" className="w-full flex items-center justify-center gap-2 p-4 bg-surface-container rounded-xl text-error font-bold text-sm uppercase tracking-widest hover:bg-error/5 transition-colors">
        <span className="material-symbols-outlined text-sm">logout</span>
        Switch Role
      </Link>
    </div>
  )
}
