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
  { label: '3 Days', days: 3 },
  { label: '1 Week', days: 7 },
  { label: '2 Weeks', days: 14 },
  { label: '1 Month', days: 30 },
]

const audienceOptions = [
  { id: 'all', label: 'All Active Members', icon: 'groups', count: 852 },
  { id: 'expiring', label: 'Expiring Soon (<15 days)', icon: 'hourglass_empty', count: 124 },
  { id: 'inactive', label: 'Inactive/Past Members', icon: 'person_off', count: 430 },
  { id: 'leads', label: 'New Leads (Never Joined)', icon: 'hub', count: 189 },
]

const backgroundThemes = [
  { id: 'gym', label: 'Premium Gym', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop' },
  { id: 'weights', label: 'Heavy Weights', url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop' },
  { id: 'yoga', label: 'Yoga & Zen', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop' },
  { id: 'crossfit', label: 'CrossFit Intense', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop' },
  { id: 'none', label: 'Clean Gradient', url: '' }
]

const initialActiveOffers = [
  {
    id: 'active-1',
    name: 'Summer Offer',
    emoji: '☀️',
    offerValue: '25% OFF',
    tagline: 'Get Summer Body Ready!',
    gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    textColor: '#1a1a2e',
    notified: 840,
    daysLeft: 12,
    validity: '1 Month',
    launchedOn: 'Mar 18, 2026',
    scarcity: null,
  }
]

const pastOffers = [
  { name: 'Holi Offer', emoji: '🎨', discount: 15, membersJoined: 28, revenue: '₹42,000', date: 'Mar 1 — Mar 14' },
  { name: 'New Year Offer', emoji: '🎉', discount: 20, membersJoined: 45, revenue: '₹90,000', date: 'Dec 25 — Jan 15' },
  { name: 'Diwali Offer', emoji: '🪔', discount: 20, membersJoined: 52, revenue: '₹1,04,000', date: 'Oct 20 — Nov 10' },
]

function OfferCreativePreview({ offer, offerType, offerValue, validity, gymName, bgThemeUrl }) {
  // We use CSS blend modes to mesh the image with the gradient
  const backgroundStyle = bgThemeUrl 
    ? {
        backgroundImage: `${offer.gradient}, url(${bgThemeUrl})`,
        backgroundBlendMode: 'multiply, normal',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : { background: offer.gradient }

  // Adjust text color logic if image is dark. Multiply blend usually makes things very dark, so white text is safer.
  const dynamicTextColor = bgThemeUrl ? '#ffffff' : offer.textColor

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl relative" style={{ ...backgroundStyle, maxWidth: '400px', margin: '0 auto', aspectRatio: '4/5' }}>
      {bgThemeUrl && <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>}
      <div className="relative p-8 text-center h-full flex flex-col items-center justify-center" style={{ color: dynamicTextColor }}>
        <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-80 mb-2 drop-shadow-sm">{gymName || 'YOUR GYM'} Presents</p>
        <div className="text-6xl mb-3 drop-shadow-md">{offer.emoji}</div>
        <h3 className="text-4xl font-black mb-2 leading-tight drop-shadow-md" style={{ fontFamily: 'Space Grotesk' }}>{offer.name}</h3>
        <p className="text-sm font-medium opacity-90 mb-8 drop-shadow-sm">{offer.tagline}</p>
        
        <div className="inline-block rounded-3xl px-8 py-5 mb-6 backdrop-blur-md shadow-lg border border-white/20" style={{ background: 'rgba(255,255,255,0.15)' }}>
          {offerType === 'percentage' && (
             <>
               <span className="text-6xl font-black drop-shadow-md" style={{ fontFamily: 'Space Grotesk' }}>{offerValue}%</span>
               <p className="text-xl font-bold -mt-1 drop-shadow-md">OFF</p>
             </>
          )}
          {offerType === 'flat' && (
             <>
               <span className="text-5xl font-black drop-shadow-md" style={{ fontFamily: 'Space Grotesk' }}>₹{offerValue}</span>
               <p className="text-xl font-bold mt-1 drop-shadow-md">DISCOUNT</p>
             </>
          )}
          {offerType === 'freebie' && (
             <>
               <span className="text-4xl font-black drop-shadow-md leading-tight" style={{ fontFamily: 'Space Grotesk' }}>{offerValue}</span>
               <p className="text-lg font-bold mt-2 drop-shadow-md uppercase">Included Free</p>
             </>
          )}
        </div>
        
        <p className="text-sm font-bold opacity-80 drop-shadow-sm mb-4">on Memberships</p>
        
        <div className="mt-auto w-full pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <p className="text-xs font-black uppercase tracking-widest bg-white/20 inline-block px-4 py-1.5 rounded-full backdrop-blur-sm">Valid for {validity}</p>
        </div>
      </div>
    </div>
  )
}

export default function OffersDashboard() {
  const [activeOffers, setActiveOffers] = useState(initialActiveOffers)
  const [selectedOffer, setSelectedOffer] = useState(null)
  
  // Wizard State
  const [customName, setCustomName] = useState('')
  const [customTagline, setCustomTagline] = useState('')
  const [offerType, setOfferType] = useState('percentage') // percentage, flat, freebie
  const [offerValue, setOfferValue] = useState(15) 
  const [validityIdx, setValidityIdx] = useState(1)
  const [targetAudience, setTargetAudience] = useState('all')
  const [scarcityLimit, setScarcityLimit] = useState(0) // 0 means no limit
  const [channels, setChannels] = useState({ push: true, whatsapp: true, email: false })
  const [bgTheme, setBgTheme] = useState('weights')

  const [showModal, setShowModal] = useState(false)
  const [launchSuccess, setLaunchSuccess] = useState(false)
  const [showPastOffers, setShowPastOffers] = useState(false)

  const openOfferModal = (offer) => {
    setSelectedOffer(offer)
    setOfferType('percentage')
    setOfferValue(offer.defaultDiscount)
    setValidityIdx(1)
    setTargetAudience('all')
    setScarcityLimit(0)
    setChannels({ push: true, whatsapp: true, email: false })
    setBgTheme('weights')
    setCustomName('')
    setCustomTagline('')
    setLaunchSuccess(false)
    setShowModal(true)
  }

  const getFormatOfferValue = () => {
    if (offerType === 'percentage') return `${offerValue}% OFF`
    if (offerType === 'flat') return `₹${offerValue} OFF`
    return `Free: ${offerValue}`
  }

  const launchOffer = () => {
    const offer = selectedOffer
    const newActive = {
      id: `active-${Date.now()}`,
      name: offer.id === 'custom' && customName ? customName : offer.name,
      emoji: offer.emoji,
      offerValue: getFormatOfferValue(),
      tagline: offer.id === 'custom' && customTagline ? customTagline : offer.tagline,
      gradient: offer.gradient,
      textColor: offer.textColor,
      notified: audienceOptions.find(a => a.id === targetAudience)?.count || 0,
      daysLeft: validityOptions[validityIdx].days,
      validity: validityOptions[validityIdx].label,
      launchedOn: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      scarcity: scarcityLimit > 0 ? scarcityLimit : null,
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
            <p className="text-on-surface-variant text-sm mt-2">Launch campaigns, target prospects & circulate visually stunning pamphlets. 🎯</p>
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
            Live Campaigns
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
                      <span className="font-headline text-2xl md:text-3xl font-black">{offer.offerValue}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.15)' }}>
                      📢 {offer.notified} targeted
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.15)' }}>
                      ⏳ {offer.daysLeft} days left
                    </span>
                    {offer.scarcity && (
                       <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.15)' }}>
                         🔥 Limit: {offer.scarcity}
                       </span>
                    )}
                  </div>
                  <button
                    onClick={() => endOffer(offer.id)}
                    className="mt-4 text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95 hover:opacity-90"
                    style={{ background: 'rgba(0,0,0,0.2)', color: offer.textColor }}
                  >
                    End Campaign
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
          Create New Campaign
        </h3>
        <p className="text-on-surface-variant text-sm mb-6">Select a template below to open the advanced campaign builder. Customise visuals, targeting, and distribution.</p>

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
                <div className="mt-3 flex items-center gap-1 text-[10px] font-bold opacity-60">
                  <span>BUILD CAMPAIGN</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </div>
              </div>
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
            </button>
          ))}
        </div>
      </section>

      {/* MODAL — Launch Offer */}
      {showModal && selectedOffer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
          <div
            className="relative bg-surface-container-low rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-outline-variant/10"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/10 shrink-0">
              <h3 className="font-headline text-2xl font-bold flex items-center gap-3">
                <span className="text-3xl">{selectedOffer.emoji}</span>
                {launchSuccess ? 'Campaign Successfully Deployed!' : 'Campaign Builder'}
              </h3>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-bright transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {!launchSuccess ? (
              <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Left Side: Builder Form */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pr-2 md:border-r border-outline-variant/10">
                  
                  {/* Name & Title */}
                  <div className="space-y-4">
                    <h4 className="font-headline text-lg font-bold flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-base">edit_note</span> Basics
                    </h4>
                    {selectedOffer.id === 'custom' ? (
                        <>
                          <div>
                            <label className="font-label text-xs font-bold uppercase text-on-surface-variant block mb-2">Offer Name</label>
                            <input
                              type="text"
                              value={customName}
                              onChange={e => setCustomName(e.target.value)}
                              placeholder="e.g. Fit February"
                              className="w-full bg-surface-container px-4 py-3 rounded-xl text-sm text-on-surface focus:border-primary transition-colors border border-outline-variant/20 outline-none"
                            />
                          </div>
                          <div>
                            <label className="font-label text-xs font-bold uppercase text-on-surface-variant block mb-2">Tagline</label>
                            <input
                              type="text"
                              value={customTagline}
                              onChange={e => setCustomTagline(e.target.value)}
                              placeholder="e.g. Commit to be fit!"
                              className="w-full bg-surface-container px-4 py-3 rounded-xl text-sm text-on-surface focus:border-primary transition-colors border border-outline-variant/20 outline-none"
                            />
                          </div>
                        </>
                    ) : (
                       <div className="bg-surface-container p-4 rounded-xl flex items-center justify-between">
                         <div>
                            <p className="font-bold text-on-surface text-lg">{selectedOffer.name}</p>
                            <p className="text-sm text-on-surface-variant">{selectedOffer.tagline}</p>
                         </div>
                         <button onClick={() => openOfferModal(offerTemplates.find(o => o.id === 'custom'))} className="bg-surface-container-highest px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-surface-bright transition-colors">Edit Text</button>
                       </div>
                    )}
                  </div>

                  {/* Visual Theme Selection */}
                  <div className="space-y-4">
                    <h4 className="font-headline text-lg font-bold flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-base">palette</span> Visual Theme
                    </h4>
                    <p className="text-xs text-on-surface-variant">Select high-quality imagery to mesh with your template gradient.</p>
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                      {backgroundThemes.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => setBgTheme(theme.id)}
                          className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden relative border-2 transition-all ${bgTheme === theme.id ? 'border-primary scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        >
                          {theme.url ? (
                             <img src={theme.url} alt={theme.label} className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full" style={{ background: selectedOffer.gradient }}></div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-1 text-[9px] font-bold text-white text-center">
                            {theme.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Core Offer Structure */}
                  <div className="space-y-4">
                    <h4 className="font-headline text-lg font-bold flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-base">loyalty</span> Offer Value
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                       {['percentage', 'flat', 'freebie'].map(type => (
                         <button
                           key={type}
                           onClick={() => setOfferType(type)}
                           className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${offerType === type ? 'bg-primary/10 border-primary text-primary' : 'bg-surface-container border-outline-variant/10 text-on-surface-variant'}`}
                         >
                           {type === 'percentage' && '% Off'}
                           {type === 'flat' && 'Flat Amount'}
                           {type === 'freebie' && 'Add-on'}
                         </button>
                       ))}
                    </div>

                    <div>
                      {offerType === 'percentage' && (
                        <div className="mt-3">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-bold text-on-surface">Discount: {offerValue}%</span>
                           </div>
                           <input type="range" min="5" max="60" step="5" value={typeof offerValue === 'number' ? offerValue : 15} onChange={e => setOfferValue(Number(e.target.value))} className="w-full" />
                        </div>
                      )}
                      {offerType === 'flat' && (
                        <div className="mt-3">
                           <label className="text-xs text-on-surface-variant mb-1 block">Discount Amount (₹)</label>
                           <input type="number" value={typeof offerValue === 'number' ? offerValue : ''} onChange={e => setOfferValue(Number(e.target.value))} placeholder="e.g. 500" className="w-full bg-surface-container px-4 py-3 rounded-xl text-sm border outline-none border-outline-variant/20 focus:border-primary" />
                        </div>
                      )}
                      {offerType === 'freebie' && (
                        <div className="mt-3">
                           <label className="text-xs text-on-surface-variant mb-1 block">Included Freebie</label>
                           <input type="text" value={typeof offerValue === 'string' ? offerValue : ''} onChange={e => setOfferValue(e.target.value)} placeholder="e.g. 1 Month Free PT" className="w-full bg-surface-container px-4 py-3 rounded-xl text-sm border outline-none border-outline-variant/20 focus:border-primary" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Targeting & Logistics */}
                  <div className="space-y-4">
                    <h4 className="font-headline text-lg font-bold flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-base">my_location</span> Targeting & Channels
                    </h4>
                    
                    <div>
                      <label className="text-xs font-bold uppercase text-on-surface-variant block mb-2">Audience</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {audienceOptions.map(aud => (
                           <button 
                             key={aud.id}
                             onClick={() => setTargetAudience(aud.id)}
                             className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${targetAudience === aud.id ? 'bg-primary/10 border-primary text-primary' : 'bg-surface-container border-outline-variant/10 text-on-surface'}`}
                           >
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">{aud.icon}</span>
                                <span className="text-sm font-bold">{aud.label}</span>
                              </div>
                              <span className="text-xs font-mono bg-black/20 px-2 py-0.5 rounded-full">{aud.count}</span>
                           </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                       <div>
                         <label className="text-xs font-bold uppercase text-on-surface-variant block mb-2">Validity</label>
                         <select value={validityIdx} onChange={e => setValidityIdx(Number(e.target.value))} className="w-full bg-surface-container px-4 py-3 rounded-xl text-sm outline-none border border-outline-variant/20 focus:border-primary">
                           {validityOptions.map((v, i) => (
                              <option key={i} value={i}>{v.label}</option>
                           ))}
                         </select>
                       </div>
                       <div>
                         <label className="text-xs font-bold uppercase text-on-surface-variant block mb-2">Scarcity</label>
                         <select value={scarcityLimit} onChange={e => setScarcityLimit(Number(e.target.value))} className="w-full bg-surface-container px-4 py-3 rounded-xl text-sm outline-none border border-outline-variant/20 focus:border-primary">
                           <option value={0}>No Limit</option>
                           <option value={20}>First 20 Members</option>
                           <option value={50}>First 50 Members</option>
                           <option value={100}>First 100 Members</option>
                         </select>
                       </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-on-surface-variant block mb-2 mt-4">Distribution Channels</label>
                      <div className="flex gap-2">
                         <button onClick={() => setChannels({...channels, push: !channels.push})} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${channels.push ? 'bg-secondary text-black' : 'bg-surface-container text-on-surface border-outline-variant/20'}`}>App Push</button>
                         <button onClick={() => setChannels({...channels, whatsapp: !channels.whatsapp})} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${channels.whatsapp ? 'bg-[#25D366] text-white' : 'bg-surface-container text-on-surface border-outline-variant/20'}`}>
                            WhatsApp
                         </button>
                         <button onClick={() => setChannels({...channels, email: !channels.email})} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${channels.email ? 'bg-primary text-black' : 'bg-surface-container text-on-surface border-outline-variant/20'}`}>Email</button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Side: Creative Preview & Publish */}
                <div className="w-full md:w-[480px] bg-surface-container-lowest p-6 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <h4 className="font-headline text-lg font-bold flex items-center justify-between mb-4">
                      Pamphlet Preview
                      <span className="text-xs font-normal text-on-surface-variant bg-surface-container px-2 py-1 rounded">Live Update</span>
                    </h4>
                    
                    <div className="w-full p-2 bg-surface-container rounded-3xl mb-6 shadow-inner">
                       <OfferCreativePreview
                         offer={displayOffer}
                         offerType={offerType}
                         offerValue={offerValue}
                         validity={validityOptions[validityIdx].label}
                         gymName="GYMOS"
                         bgThemeUrl={backgroundThemes.find(t => t.id === bgTheme)?.url}
                       />
                    </div>
                    
                    {/* Summary before launch */}
                    <div className="bg-surface-container/50 rounded-xl p-4 border border-outline-variant/10 mb-6">
                      <p className="text-xs font-bold mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-sm text-secondary">summarize</span> Campaign Summary</p>
                      <ul className="space-y-2 text-xs text-on-surface-variant">
                         <li className="flex justify-between"><span>Audience:</span> <span className="font-bold text-on-surface">{audienceOptions.find(a => a.id === targetAudience)?.label} ({audienceOptions.find(a => a.id === targetAudience)?.count} people)</span></li>
                         <li className="flex justify-between"><span>Channels:</span> <span className="font-bold text-on-surface">{[channels.push&&'Push', channels.whatsapp&&'WhatsApp', channels.email&&'Email'].filter(Boolean).join(', ')}</span></li>
                         {scarcityLimit > 0 && <li className="flex justify-between text-secondary"><span>Urgency Drop:</span> <span className="font-bold">Limited to {scarcityLimit} slots</span></li>}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={launchOffer}
                    disabled={!offerValue}
                    className="w-full kinetic-gradient py-4 rounded-2xl font-headline text-xl font-bold text-on-primary-fixed hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(243,255,202,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>campaign</span>
                    Deplopy Campaign
                  </button>
                </div>
              </div>
            ) : (
              /* Success State */
              <div className="p-8 text-center flex-1 flex flex-col items-center justify-center space-y-6 overflow-y-auto">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto ring-8 ring-primary/10">
                  <span className="material-symbols-outlined text-primary text-5xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                </div>
                <div>
                  <h3 className="font-headline text-3xl font-bold text-primary">Campaign Live! 🚀</h3>
                  <p className="text-on-surface-variant text-base mt-3 max-w-md mx-auto">
                    Your <strong>{displayOffer.name}</strong> has been deployed. Pamphlets are being sent to <strong>{audienceOptions.find(a => a.id === targetAudience)?.count}</strong> targeted members via selected channels.
                  </p>
                </div>

                <div className="flex gap-8 items-center mt-6">
                  {/* High quality final preview */}
                  <div className="transform scale-90 origin-center shadow-2xl">
                    <OfferCreativePreview
                      offer={displayOffer}
                      offerType={offerType}
                      offerValue={offerValue}
                      validity={validityOptions[validityIdx].label}
                      gymName="GYMOS"
                      bgThemeUrl={backgroundThemes.find(t => t.id === bgTheme)?.url}
                    />
                  </div>

                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <button
                      className="w-full bg-surface-container-highest p-4 rounded-xl font-label text-sm font-bold hover:bg-surface-bright transition-all flex items-center justify-center gap-2 shadow-lg"
                      onClick={() => alert('HD Pamphlet image saved! Ready for Instagram & FB ads.')}
                    >
                      <span className="material-symbols-outlined">download</span>
                      Download HD Poster
                    </button>
                    <button
                      className="w-full bg-[#25D366] text-white p-4 rounded-xl font-label text-sm font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
                      onClick={() => alert('Opening WhatsApp to forward to contacts...')}
                    >
                      <span className="material-symbols-outlined">share</span>
                      Forward on WhatsApp
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="w-full bg-transparent border border-outline-variant p-4 rounded-xl font-label text-sm font-bold hover:bg-surface-container transition-all text-on-surface"
                    >
                      Close Dashboard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
