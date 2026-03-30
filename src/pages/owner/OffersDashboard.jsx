import { useState } from 'react'

const offerTemplates = [
  { id: 'holi', name: 'Holi Offer', emoji: '🎨', defaultDiscount: 15, tagline: 'Splash into Fitness!', gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%)', textColor: '#1a1a2e' },
  { id: 'diwali', name: 'Diwali Offer', emoji: '🪔', defaultDiscount: 20, tagline: 'Light Up Your Fitness Journey!', gradient: 'linear-gradient(135deg, #FF9933 0%, #FFD700 50%, #FF6600 100%)', textColor: '#1a1a2e' },
  { id: 'summer', name: 'Summer Offer', emoji: '☀️', defaultDiscount: 25, tagline: 'Get Summer Body Ready!', gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', textColor: '#1a1a2e' },
  { id: 'winter', name: 'Winter Offer', emoji: '❄️', defaultDiscount: 10, tagline: 'Stay Warm, Stay Fit!', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', textColor: '#ffffff' },
  { id: 'rainy', name: 'Rainy Season Offer', emoji: '🌧️', defaultDiscount: 15, tagline: 'Rain or Shine, We Train!', gradient: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)', textColor: '#ffffff' },
  { id: 'anniversary', name: 'Anniversary Offer', emoji: '🎂', defaultDiscount: 30, tagline: 'Celebrating Together!', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', textColor: '#ffffff' },
  { id: 'newyear', name: 'New Year Offer', emoji: '🎉', defaultDiscount: 20, tagline: 'New Year, New You!', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', textColor: '#1a1a2e' },
  { id: 'fitness', name: 'Fitness Month', emoji: '💪', defaultDiscount: 15, tagline: 'Transform Your Body This Month!', gradient: 'linear-gradient(135deg, #cafd00 0%, #a8e600 50%, #7bc200 100%)', textColor: '#1a1a2e' },
  { id: 'referral', name: 'Referral Bonus', emoji: '🤝', defaultDiscount: 10, tagline: 'Bring a Friend, Get Rewarded!', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', textColor: '#1a1a2e' },
  { id: 'independence', name: 'Independence Day', emoji: '🇮🇳', defaultDiscount: 15, tagline: 'Freedom to Be Fit!', gradient: 'linear-gradient(135deg, #FF9933 0%, #ffffff 50%, #138808 100%)', textColor: '#1a1a2e' },
  { id: 'womensday', name: "Women's Day Offer", emoji: '👩', defaultDiscount: 20, tagline: 'Strength Has No Gender!', gradient: 'linear-gradient(135deg, #ff6a88 0%, #ff99ac 100%)', textColor: '#1a1a2e' },
  { id: 'custom', name: 'Custom Offer', emoji: '✨', defaultDiscount: 15, tagline: 'Your Special Offer!', gradient: 'linear-gradient(135deg, #f3ffca 0%, #cafd00 100%)', textColor: '#1a1a2e' },
]

const validityOptions = [
  { label: '1 Week', days: 7 },
  { label: '2 Weeks', days: 14 },
  { label: '1 Month', days: 30 },
  { label: '2 Months', days: 60 },
]

const initialActiveOffers = [
  {
    id: 'active-1',
    name: 'Summer Offer',
    emoji: '☀️',
    discount: 25,
    tagline: 'Get Summer Body Ready!',
    gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    textColor: '#1a1a2e',
    notified: 840,
    daysLeft: 12,
    validity: '1 Month',
    launchedOn: 'Mar 18, 2026',
  }
]

const pastOffers = [
  { name: 'Holi Offer', emoji: '🎨', discount: 15, membersJoined: 28, revenue: '₹42,000', date: 'Mar 1 — Mar 14' },
  { name: 'New Year Offer', emoji: '🎉', discount: 20, membersJoined: 45, revenue: '₹90,000', date: 'Dec 25 — Jan 15' },
  { name: 'Diwali Offer', emoji: '🪔', discount: 20, membersJoined: 52, revenue: '₹1,04,000', date: 'Oct 20 — Nov 10' },
]

function OfferCreativePreview({ offer, discount, validity, gymName }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: offer.gradient, maxWidth: '400px', margin: '0 auto' }}>
      <div className="p-8 text-center" style={{ color: offer.textColor }}>
        <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-70 mb-2">{gymName || 'YOUR GYM'} Presents</p>
        <div className="text-6xl mb-3">{offer.emoji}</div>
        <h3 className="text-3xl font-black mb-1" style={{ fontFamily: 'Space Grotesk' }}>{offer.name}</h3>
        <p className="text-sm font-medium opacity-80 mb-6">{offer.tagline}</p>
        <div className="inline-block rounded-2xl px-8 py-4 mb-4" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <span className="text-6xl font-black" style={{ fontFamily: 'Space Grotesk' }}>{discount}%</span>
          <p className="text-lg font-bold -mt-1">OFF</p>
        </div>
        <p className="text-sm font-bold opacity-70">on Membership Fees</p>
        <div className="mt-6 pt-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
          <p className="text-xs font-bold uppercase tracking-widest opacity-60">Valid for {validity}</p>
        </div>
      </div>
    </div>
  )
}

export default function OffersDashboard() {
  const [activeOffers, setActiveOffers] = useState(initialActiveOffers)
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [discount, setDiscount] = useState(15)
  const [validityIdx, setValidityIdx] = useState(0)
  const [customName, setCustomName] = useState('')
  const [customTagline, setCustomTagline] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [launchSuccess, setLaunchSuccess] = useState(false)
  const [showPastOffers, setShowPastOffers] = useState(false)

  const openOfferModal = (offer) => {
    setSelectedOffer(offer)
    setDiscount(offer.defaultDiscount)
    setValidityIdx(0)
    setCustomName('')
    setCustomTagline('')
    setLaunchSuccess(false)
    setShowModal(true)
  }

  const launchOffer = () => {
    const offer = selectedOffer
    const newActive = {
      id: `active-${Date.now()}`,
      name: offer.id === 'custom' && customName ? customName : offer.name,
      emoji: offer.emoji,
      discount,
      tagline: offer.id === 'custom' && customTagline ? customTagline : offer.tagline,
      gradient: offer.gradient,
      textColor: offer.textColor,
      notified: 1240,
      daysLeft: validityOptions[validityIdx].days,
      validity: validityOptions[validityIdx].label,
      launchedOn: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
    }
    setActiveOffers(prev => [newActive, ...prev])
    setLaunchSuccess(true)
  }

  const endOffer = (id) => {
    setActiveOffers(prev => prev.filter(o => o.id !== id))
  }

  const displayOffer = selectedOffer ? {
    ...selectedOffer,
    name: selectedOffer.id === 'custom' && customName ? customName : selectedOffer.name,
    tagline: selectedOffer.id === 'custom' && customTagline ? customTagline : selectedOffer.tagline,
  } : null

  return (
    <div className="space-y-10 pb-12">
      {/* Hero */}
      <section className="relative">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-label text-secondary uppercase tracking-[0.3em] text-xs font-bold mb-2 block">Grow Your Gym</span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface">Special <span className="text-secondary italic">Offers</span></h2>
            <p className="text-on-surface-variant text-sm mt-2">Launch festival offers, attract new members & reward existing ones 🎯</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-surface-container-highest px-5 py-3 rounded-xl text-center">
              <p className="font-headline font-bold text-2xl text-secondary">{activeOffers.length}</p>
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Active Now</p>
            </div>
            <div className="bg-surface-container-highest px-5 py-3 rounded-xl text-center">
              <p className="font-headline font-bold text-2xl text-primary">{pastOffers.length}</p>
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Past Offers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Offers */}
      {activeOffers.length > 0 && (
        <section>
          <h3 className="font-headline text-xl font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>campaign</span>
            Live Offers Right Now
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeOffers.map(offer => (
              <div key={offer.id} className="rounded-xl overflow-hidden relative" style={{ background: offer.gradient }}>
                <div className="p-6" style={{ color: offer.textColor }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-3xl mb-1">{offer.emoji}</p>
                      <h4 className="font-headline text-xl font-bold">{offer.name}</h4>
                      <p className="text-sm opacity-80">{offer.tagline}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-headline text-4xl font-black">{offer.discount}%</span>
                      <p className="text-xs font-bold opacity-60">OFF</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.15)' }}>
                      📢 {offer.notified} members notified
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.15)' }}>
                      ⏳ {offer.daysLeft} days left
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.15)' }}>
                      📅 Launched: {offer.launchedOn}
                    </span>
                  </div>
                  <button
                    onClick={() => endOffer(offer.id)}
                    className="mt-4 text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95 hover:opacity-90"
                    style={{ background: 'rgba(0,0,0,0.2)', color: offer.textColor }}
                  >
                    End Offer Early
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Choose an Offer to Launch */}
      <section>
        <h3 className="font-headline text-xl font-bold mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>local_offer</span>
          Choose an Offer to Launch
        </h3>
        <p className="text-on-surface-variant text-sm mb-6">Pick a festival or season → set discount → launch! Your members will be notified instantly 🚀</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {offerTemplates.map(offer => (
            <button
              key={offer.id}
              onClick={() => openOfferModal(offer)}
              className="group relative rounded-xl overflow-hidden transition-all hover:scale-[1.03] active:scale-95 text-left"
              style={{ background: offer.gradient }}
            >
              <div className="p-5" style={{ color: offer.textColor }}>
                <div className="text-3xl mb-2">{offer.emoji}</div>
                <h4 className="font-headline text-sm font-bold leading-tight">{offer.name}</h4>
                <p className="text-[10px] opacity-70 mt-1">{offer.defaultDiscount}% off</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] font-bold opacity-60">
                  <span>TAP TO LAUNCH</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </div>
              </div>
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(255,255,255,0.08)' }}></div>
            </button>
          ))}
        </div>
      </section>

      {/* Past Offers */}
      <section>
        <button
          onClick={() => setShowPastOffers(!showPastOffers)}
          className="font-headline text-xl font-bold flex items-center gap-2 w-full text-left group"
        >
          <span className="material-symbols-outlined text-on-surface-variant" style={{fontVariationSettings: "'FILL' 1"}}>history</span>
          Past Offers
          <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${showPastOffers ? 'rotate-180' : ''}`}>expand_more</span>
          <span className="text-xs font-normal text-on-surface-variant ml-2">({pastOffers.length} offers)</span>
        </button>

        {showPastOffers && (
          <div className="mt-4 space-y-3">
            {pastOffers.map((offer, i) => (
              <div key={i} className="bg-surface-container p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{offer.emoji}</span>
                  <div>
                    <h4 className="font-headline font-bold">{offer.name}</h4>
                    <p className="text-[10px] text-on-surface-variant">{offer.date}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="text-center">
                    <span className="font-headline font-bold text-primary">{offer.discount}%</span>
                    <p className="text-[9px] text-on-surface-variant uppercase">Discount</p>
                  </div>
                  <div className="text-center">
                    <span className="font-headline font-bold text-secondary">{offer.membersJoined}</span>
                    <p className="text-[9px] text-on-surface-variant uppercase">New Members</p>
                  </div>
                  <div className="text-center">
                    <span className="font-headline font-bold text-on-surface">{offer.revenue}</span>
                    <p className="text-[9px] text-on-surface-variant uppercase">Revenue</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL — Launch Offer */}
      {showModal && selectedOffer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div
            className="relative bg-surface-container-low rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/10"
            onClick={e => e.stopPropagation()}
          >
            {!launchSuccess ? (
              <>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 pb-0">
                  <h3 className="font-headline text-xl font-bold flex items-center gap-2">
                    <span className="text-2xl">{selectedOffer.emoji}</span>
                    {selectedOffer.id === 'custom' ? 'Create Custom Offer' : `Launch ${selectedOffer.name}`}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-bright transition-colors">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Custom Name & Tagline (for custom offers) */}
                  {selectedOffer.id === 'custom' && (
                    <div className="space-y-4">
                      <div>
                        <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Offer Name</label>
                        <input
                          type="text"
                          value={customName}
                          onChange={e => setCustomName(e.target.value)}
                          placeholder="e.g. Ganesh Chaturthi Offer"
                          className="w-full bg-surface-container px-4 py-3 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none border border-outline-variant/20 focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Tagline</label>
                        <input
                          type="text"
                          value={customTagline}
                          onChange={e => setCustomTagline(e.target.value)}
                          placeholder="e.g. Celebrate with Fitness!"
                          className="w-full bg-surface-container px-4 py-3 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none border border-outline-variant/20 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Discount Slider */}
                  <div>
                    <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">
                      Discount Percentage — <span className="text-primary text-lg font-headline">{discount}%</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={discount}
                      onChange={e => setDiscount(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #cafd00 0%, #cafd00 ${((discount - 5) / 45) * 100}%, #23262a ${((discount - 5) / 45) * 100}%, #23262a 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-[10px] text-on-surface-variant mt-1">
                      <span>5%</span>
                      <span>50%</span>
                    </div>
                  </div>

                  {/* Validity */}
                  <div>
                    <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">How Long Should This Offer Run?</label>
                    <div className="grid grid-cols-4 gap-2">
                      {validityOptions.map((v, i) => (
                        <button
                          key={v.label}
                          onClick={() => setValidityIdx(i)}
                          className={`px-3 py-3 rounded-xl text-xs font-bold text-center transition-all ${
                            i === validityIdx
                              ? 'bg-primary text-on-primary-fixed scale-105 shadow-[0_0_12px_rgba(243,255,202,0.3)]'
                              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-highest'
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Creative Preview */}
                  <div>
                    <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">Preview — Your Offer Creative</label>
                    <OfferCreativePreview
                      offer={displayOffer}
                      discount={discount}
                      validity={validityOptions[validityIdx].label}
                      gymName="GYMOS"
                    />
                    <p className="text-[10px] text-on-surface-variant text-center mt-2">This creative will be sent to all members & can be used for marketing</p>
                  </div>

                  {/* What happens on launch */}
                  <div className="bg-surface-container rounded-xl p-4">
                    <p className="text-xs font-bold text-on-surface mb-2">📋 What happens when you launch?</p>
                    <ul className="text-[11px] text-on-surface-variant space-y-1">
                      <li>✅ All 1,240 gym members will be notified instantly</li>
                      <li>✅ Offer creative will be ready to download & share</li>
                      <li>✅ New members can avail this discount when joining</li>
                      <li>✅ You can end this offer anytime from the dashboard</li>
                    </ul>
                  </div>

                  {/* Launch Button */}
                  <button
                    onClick={launchOffer}
                    className="w-full kinetic-gradient py-4 rounded-xl font-headline text-lg font-bold text-on-primary-fixed hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(243,255,202,0.3)] flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>rocket_launch</span>
                    Launch Offer & Notify Members 🚀
                  </button>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                </div>
                <div>
                  <h3 className="font-headline text-2xl font-bold text-primary">Offer Launched! 🎉</h3>
                  <p className="text-on-surface-variant text-sm mt-2">
                    Your <strong>{displayOffer.name}</strong> with <strong>{discount}% off</strong> is now live!
                  </p>
                </div>
                <div className="bg-surface-container rounded-xl p-4 space-y-2 text-left">
                  <p className="text-xs text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">notifications_active</span>
                    1,240 members notified
                  </p>
                  <p className="text-xs text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">timer</span>
                    Running for {validityOptions[validityIdx].label}
                  </p>
                  <p className="text-xs text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">percent</span>
                    {discount}% discount on membership fees
                  </p>
                </div>

                {/* Mini Creative Preview */}
                <div className="transform scale-75 origin-top">
                  <OfferCreativePreview
                    offer={displayOffer}
                    discount={discount}
                    validity={validityOptions[validityIdx].label}
                    gymName="GYMOS"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-surface-container-highest px-4 py-3 rounded-xl font-label text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-bright transition-all flex items-center justify-center gap-2"
                    onClick={() => {
                      // Simulate download
                      alert('Creative image saved! You can share it on WhatsApp, Instagram, etc.')
                    }}
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Download for Marketing
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 kinetic-gradient px-4 py-3 rounded-xl font-label text-xs font-bold uppercase tracking-widest text-on-primary-fixed hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Done ✓
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
