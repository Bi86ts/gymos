import { useState } from 'react'

export default function RenewalScreen() {
  const [selectedPlan, setSelectedPlan] = useState('6mo')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const plans = [
    { id: '1mo', label: '1 Month', price: '$149', billing: 'Billed monthly', highlight: false },
    { id: '6mo', label: '6 Months', price: '$129/mo', billing: 'Billed $774 every 6 months', highlight: true },
    { id: '1yr', label: '12 Months', price: '$99/mo', billing: 'Billed $1188 annually', highlight: false },
  ]

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="h-[calc(100vh-80px)] bg-surface flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-700">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
          <span className="material-symbols-outlined text-5xl text-primary" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
        </div>
        <h1 className="text-4xl font-headline font-black text-on-surface uppercase italic tracking-tight mb-2">Protocol Extended</h1>
        <p className="text-on-surface-variant font-medium">Your membership is now active until Oct 12, 2026. Keep the momentum going!</p>
        <button 
          onClick={() => window.location.href = '/member'}
          className="mt-8 px-8 py-4 bg-primary text-on-primary-fixed rounded-full font-black text-sm tracking-widest uppercase active:scale-95 transition-transform"
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col p-6 max-w-lg mx-auto pb-24 animate-in fade-in duration-500">
      
      {/* Header & Status */}
      <div className="pt-4 pb-8 text-center space-y-2">
        <span className="inline-flex items-center gap-1 bg-error/10 text-error px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-error/20">
          <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse"></span>
          Action Required
        </span>
        <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight">Your protocol expires in <span className="text-error italic">3 days</span>.</h1>
      </div>

      {/* Loss Aversion Card */}
      <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10 shadow-lg relative overflow-hidden mb-8 group hover:border-primary/30 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
          <span className="material-symbols-outlined text-9xl text-error" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
        </div>
        <div className="relative z-10 space-y-2">
          <p className="font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-error" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
            Don't lose your 12-day streak!
          </p>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            You're in the elite top 5% of consistency this month. Renew now to maintain access to your custom protocol and your coach.
          </p>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="space-y-4 mb-8">
        <h3 className="font-headline text-sm font-black text-on-surface-variant uppercase tracking-widest">Select Plan</h3>
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`w-full text-left p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${
              selectedPlan === plan.id 
                ? 'border-primary bg-primary/10' 
                : 'border-outline-variant/10 bg-surface-container hover:border-primary/50 text-on-surface'
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-0 bg-primary text-on-primary-fixed text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-bl-lg shadow-sm">
                Most Popular
              </div>
            )}
            <div className="flex justify-between items-center mb-1">
              <span className={`font-black font-headline text-lg ${selectedPlan === plan.id ? 'text-primary' : 'text-on-surface'}`}>{plan.label}</span>
              <span className={`font-black font-headline text-2xl ${selectedPlan === plan.id ? 'text-primary' : 'text-on-surface'}`}>{plan.price}</span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium tracking-wide">{plan.billing}</p>
          </button>
        ))}
      </div>

      {/* Mock Payment / CTA */}
      <div className="mt-auto">
        <div className="flex items-center justify-center gap-4 text-outline-variant opacity-50 mb-4">
          <span className="material-symbols-outlined text-3xl">currency_rupee</span>
          <span className="material-symbols-outlined text-3xl">credit_card</span>
          <span className="material-symbols-outlined text-3xl">account_balance</span>
        </div>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-primary text-on-primary-fixed py-5 rounded-full font-black text-lg active:scale-95 transition-all shadow-[0_0_20px_rgba(205,255,24,0.3)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3 tracking-widest uppercase"
        >
          {isProcessing ? (
            <span className="material-symbols-outlined animate-spin" style={{fontVariationSettings: "'FILL' 1"}}>sync</span>
          ) : (
            <>
              Confirm & Pay
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>lock</span>
            </>
          )}
        </button>
        <p className="text-center text-[10px] text-on-surface-variant font-medium mt-3 tracking-wide uppercase">Secure encrypted checkout via Razorpay</p>
      </div>

    </div>
  )
}
