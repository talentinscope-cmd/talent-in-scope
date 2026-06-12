import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, BarChart3, Shield, Globe, ArrowRight, Check } from 'lucide-react';

const translations = {
en: {
hero: {
title: 'Know Your Workforce',
subtitle: 'Before They Leave',
description: 'Track employee movement trends and compare your talent retention against industry standards. Make data-driven decisions to keep your best people.',
ctaPrimary: 'Access Dashboard Now',
ctaSecondary: 'Learn More'
},
features: {
title: 'Everything You Need to Retain Top Talent',
subtitle: 'Powerful insights updated monthly, with industry and job opening comparisons',
items: [
{
icon: 'TrendingUp',
title: 'Real-Time Workforce Intelligence',
description: 'View statistics on employees actively seeking opportunities, fed by multiple data sources, through comprehensive monthly reports.'
},
{
icon: 'BarChart3',
title: 'Department-Level Insights',
description: 'Identify which teams have the highest turnover risk before it\'s too late. Focus retention efforts where they matter most.'
},
{
icon: 'Shield',
title: 'Industry Benchmarking',
description: 'Compare your retention rates against industry peers. Know if you\'re above or below market standards.'
}
]
},
benefits: {
title: 'Why Leading Companies Choose Talent In Scope',
items: [
'Reduce costly employee turnover by identifying flight risks early',
'Benchmark against competitors to stay competitive',
'Make proactive decisions instead of reactive firefighting',
'Simple monthly reports - no complex dashboards to learn',
'Private and secure - your data is never shared'
]
},
contact: {
title: 'Get Started',
subtitle: 'Request information to see how Talent In Scope can help your organization',
emailLabel: 'Corporate Email',
emailPlaceholder: 'you@company.com',
companyLabel: 'Company LinkedIn Page',
companyPlaceholder: 'https://linkedin.com/company/your-company',
profileLabel: 'Or Your LinkedIn Profile',
profilePlaceholder: 'https://linkedin.com/in/your-profile',
submitButton: 'Request Information',
submitting: 'Sending...',
successMessage: 'Thank you! We\'ll be in touch soon.',
errorMessage: 'Something went wrong. Please try again.'
},
footer: {
tagline: 'Workforce Intelligence for Modern Companies',
copyright: '© 2025 Talent In Scope. All rights reserved.'
}
},
tr: {
hero: {
title: 'İşten Ayrılma Sinyallerini',
subtitle: 'Zamanında Alın',
description: 'Çalışan hareketlilik trendlerini takip edin ve yetenek tutma oranınızı sektör standartlarıyla karşılaştırın. En iyi çalışanlarınızı elde tutmak için veriye dayalı kararlar alın.',
ctaPrimary: 'Panele Erişin',
ctaSecondary: 'Daha Fazla Bilgi'
},
features: {
title: 'En İyi Yetenekleri Elde Tutmak İçin İhtiyacınız Olan Her Şey',
subtitle: 'Aylık olarak güncellenen güçlü içgörüler, sektör ve açık iş ilanı karşılaştırmaları',
items: [
{
icon: 'TrendingUp',
title: 'Gerçek Zamanlı İş Gücü İstihbaratı',
description: 'Kapsamlı aylık raporlarla farklı veri kaynaklarından beslenen aktif olarak iş arayan çalışan sayısı istatistiklerini görün.'
},
{
icon: 'BarChart3',
title: 'Departman Düzeyinde İçgörüler',
description: 'Çok geç olmadan hangi ekiplerin en yüksek işten ayrılma riskine sahip olduğunu belirleyin. Elde tutma çabalarınızı en önemli yerlere odaklayın.'
},
{
icon: 'Shield',
title: 'Sektör Kıyaslaması',
description: 'Elde tutma oranlarınızı sektördeki rakiplerinizle karşılaştırın. Pazar standartlarının üstünde mi altında mı olduğunuzu bilin.'
}
]
},
benefits: {
title: 'Önde Gelen Şirketler Neden Talent In Scope\'u Seçiyor',
items: [
'Kaçış risklerini erken belirleyerek maliyetli çalışan kaybını azaltın',
'Rekabetçi kalmak için rakiplerinizle kıyaslama yapın',
'Reaktif yangın söndürme yerine proaktif kararlar alın',
'Basit aylık raporlar - öğrenilecek karmaşık panel yok',
'Özel ve güvenli - verileriniz asla paylaşılmaz'
]
},
contact: {
title: 'Başlayın',
subtitle: 'Talent In Scope\'un organizasyonunuza nasıl yardımcı olabileceğini görmek için bilgi talep edin',
emailLabel: 'Kurumsal E-posta',
emailPlaceholder: 'siz@sirket.com',
companyLabel: 'Şirket LinkedIn Sayfası',
companyPlaceholder: 'https://linkedin.com/company/sirketiniz',
profileLabel: 'Veya LinkedIn Profiliniz',
profilePlaceholder: 'https://linkedin.com/in/profiliniz',
submitButton: 'Bilgi Talep Et',
submitting: 'Gönderiliyor...',
successMessage: 'Teşekkürler! Kısa sürede sizinle iletişime geçeceğiz.',
errorMessage: 'Bir şeyler yanlış gitti. Lütfen tekrar deneyin.'
},
footer: {
tagline: 'Modern Şirketler İçin İş Gücü İstihbaratı',
copyright: '© 2025 Talent In Scope. Tüm hakları saklıdır.'
}
}
};

export default function LandingPage({ onAccessDashboard }) {
const [language, setLanguage] = useState(() => {
const saved = localStorage.getItem('language');
if (saved) return saved;
const browserLang = navigator.language.toLowerCase();
return browserLang.startsWith('tr') ? 'tr' : 'en';
});

// Contact form state
const [email, setEmail] = useState('');
const [companyUrl, setCompanyUrl] = useState('');
const [profileUrl, setProfileUrl] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitStatus, setSubmitStatus] = useState(''); // 'success' or 'error'

const t = translations[language];

useEffect(() => {
localStorage.setItem('language', language);
}, [language]);

const handleContactSubmit = async (e) => {
e.preventDefault();

if (!email || (!companyUrl && !profileUrl)) {
return;
}

setIsSubmitting(true);
setSubmitStatus('');

// Simulate form submission - in production, send to your backend
try {
// Here you would send to your backend API
// await fetch('/api/contact', { method: 'POST', body: JSON.stringify({ email, companyUrl, profileUrl }) })

await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

setSubmitStatus('success');
setEmail('');
setCompanyUrl('');
setProfileUrl('');

// Reset success message after 5 seconds
setTimeout(() => setSubmitStatus(''), 5000);
} catch (error) {
setSubmitStatus('error');
} finally {
setIsSubmitting(false);
}
};

const scrollToSection = (id) => {
document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const iconComponents = {
TrendingUp,
BarChart3,
Shield
};

return (
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
{/* Header */}
<header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
<div className="max-w-7xl mx-auto px-6 py-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
<Users className="w-6 h-6 text-white" />
</div>
<span className="text-xl font-bold text-slate-900">Talent In Scope</span>
</div>
<div className="flex items-center gap-4">
<button
onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
>
<Globe className="w-4 h-4" />
{language === 'en' ? 'EN' : 'TR'}
</button>
<button
onClick={onAccessDashboard}
className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
>
{t.hero.ctaPrimary}
</button>
</div>
</div>
</div>
</header>

{/* Hero Section */}
<section className="relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-70" />
<div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
<div className="text-center max-w-4xl mx-auto">
<div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
<TrendingUp className="w-4 h-4" />
{t.features.subtitle}
</div>
<h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
{t.hero.title}
<br />
<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
{t.hero.subtitle}
</span>
</h1>
<p className="text-xl text-slate-600 mb-12 leading-relaxed">
{t.hero.description}
</p>
<div className="flex flex-col sm:flex-row gap-4 justify-center">
<button
onClick={onAccessDashboard}
className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
>
{t.hero.ctaPrimary}
<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
</button>
<button
onClick={() => scrollToSection('features')}
className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-md hover:shadow-lg border border-slate-200"
>
{t.hero.ctaSecondary}
</button>
</div>
</div>
</div>
</section>

{/* Features Section */}
<section id="features" className="py-24 bg-white">
<div className="max-w-7xl mx-auto px-6">
<div className="text-center mb-16">
<h2 className="text-4xl font-bold text-slate-900 mb-4">
{t.features.title}
</h2>
<p className="text-xl text-slate-600">
{t.features.subtitle}
</p>
</div>
<div className="grid md:grid-cols-3 gap-8">
{t.features.items.map((feature, index) => {
const IconComponent = iconComponents[feature.icon];
return (
<div key={index} className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-xl transition-all border border-slate-200">
<div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
<IconComponent className="w-7 h-7 text-white" />
</div>
<h3 className="text-xl font-bold text-slate-900 mb-3">
{feature.title}
</h3>
<p className="text-slate-600 leading-relaxed">
{feature.description}
</p>
</div>
);
})}
</div>
</div>
</section>

{/* Benefits Section */}
<section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
<div className="max-w-7xl mx-auto px-6">
<div className="grid md:grid-cols-2 gap-12 items-center">
<div>
<h2 className="text-4xl font-bold text-slate-900 mb-6">
{t.benefits.title}
</h2>
<ul className="space-y-4">
{t.benefits.items.map((benefit, index) => (
<li key={index} className="flex items-start gap-3">
<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
<Check className="w-4 h-4 text-white" />
</div>
<span className="text-lg text-slate-700">{benefit}</span>
</li>
))}
</ul>
</div>

{/* Contact Form */}
<div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
<div className="text-center mb-6">
<h3 className="text-2xl font-bold text-slate-900 mb-2">
{t.contact.title}
</h3>
<p className="text-slate-600">
{t.contact.subtitle}
</p>
</div>

{submitStatus === 'success' && (
<div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
{t.contact.successMessage}
</div>
)}

{submitStatus === 'error' && (
<div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
{t.contact.errorMessage}
</div>
)}

<form onSubmit={handleContactSubmit} className="space-y-4">
<div>
<label className="block text-sm font-medium text-slate-700 mb-2">
{t.contact.emailLabel} *
</label>
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder={t.contact.emailPlaceholder}
required
className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>

<div>
<label className="block text-sm font-medium text-slate-700 mb-2">
{t.contact.companyLabel}
</label>
<input
type="url"
value={companyUrl}
onChange={(e) => setCompanyUrl(e.target.value)}
placeholder={t.contact.companyPlaceholder}
className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>

<div className="text-center text-sm text-slate-500">
{language === 'en' ? 'or' : 'veya'}
</div>

<div>
<label className="block text-sm font-medium text-slate-700 mb-2">
{t.contact.profileLabel}
</label>
<input
type="url"
value={profileUrl}
onChange={(e) => setProfileUrl(e.target.value)}
placeholder={t.contact.profilePlaceholder}
className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>

<button
type="submit"
disabled={isSubmitting || !email || (!companyUrl && !profileUrl)}
className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
>
{isSubmitting ? t.contact.submitting : t.contact.submitButton}
</button>
</form>
</div>
</div>
</div>
</section>

{/* CTA Section */}
<section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
<div className="max-w-4xl mx-auto px-6 text-center">
<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
{language === 'en'
? 'Ready to Reduce Turnover?'
: 'İşten Ayrılmaları Azaltmaya Hazır mısınız?'}
</h2>
<p className="text-xl text-blue-100 mb-8">
{language === 'en'
? 'Join leading companies using data to retain their best talent.'
: 'En iyi yeteneklerini elde tutmak için veri kullanan önde gelen şirketlere katılın.'}
</p>
<button
onClick={onAccessDashboard}
className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl"
>
{t.hero.ctaPrimary}
</button>
</div>
</section>

{/* Footer */}
<footer className="bg-slate-900 text-slate-300 py-12">
<div className="max-w-7xl mx-auto px-6">
<div className="flex flex-col md:flex-row justify-between items-center gap-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
<Users className="w-6 h-6 text-white" />
</div>
<div>
<div className="font-bold text-white">Talent In Scope</div>
<div className="text-sm text-slate-400">{t.footer.tagline}</div>
</div>
</div>
<div className="text-sm text-slate-400">
{t.footer.copyright}
</div>
</div>
</div>
</footer>
</div>
);
}
