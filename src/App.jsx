import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import { TrendingUp, TrendingDown, Users, AlertCircle, Calendar, Download, LogOut, Globe } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import LandingPage from './LandingPage.jsx';

// Initialize Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Google Sheets URLs
const SHEETS = {
  companies: import.meta.env.VITE_SHEET_COMPANIES,
  users: import.meta.env.VITE_SHEET_USERS,
  monthly: import.meta.env.VITE_SHEET_MONTHLY,
  departments: import.meta.env.VITE_SHEET_DEPARTMENTS,
  trends: import.meta.env.VITE_SHEET_TRENDS
};

// Translations
const translations = {
  en: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    companyCode: 'Company Invite Code',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    createAccount: 'Create Account',
    signInButton: 'Sign In',
    signOut: 'Sign Out',
    talentInScope: 'Talent In Scope',
    lastUpdated: 'Last updated',
    refreshData: 'Refresh Data',
    export: 'Export',
    viewingPeriod: 'Viewing Period',
    compareTo: 'Compare to',
    totalEmployees: 'Total Employees',
    openToWork: 'Open to Work',
    industryAverage: 'Industry Average',
    fromLastMonth: 'from',
    belowIndustry: 'below industry',
    aboveIndustry: 'above industry',
    atIndustryAvg: 'At industry average',
    trendAnalysis: 'Historical Trend Analysis',
    yourCompany: 'Your Company',
    departmentRisk: 'Function Risk Analysis',
    highRisk: 'High Risk',
    mediumRisk: 'Medium Risk',
    lowRisk: 'Low Risk',
    employees: 'employees',
    invalidCredentials: 'Invalid email or password',
    accountInactive: 'Your account has been deactivated. Please contact support.',
    invalidInviteCode: 'Invalid invite code',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    codeRequired: 'Company invite code is required',
    loading: 'Loading...',
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
    // Drill-down page
    departmentDetail: 'Department Detail',
    backToOverview: '← Overview',
    vsIndustryAvg: 'vs Industry Avg',
    departmentSize: 'Department Size',
    riskLevel: 'Risk Level',
    current: 'current',
    sixMonthTrend: '6-Month Trend',
    trendSubtitle: '% open to work vs industry average',
    riskHistory: 'Risk History',
    riskHistorySubtitle: 'Monthly classification',
    seniorityTitle: 'Open to Work by Seniority',
    senioritySubtitle: 'Where is attrition risk concentrated?',
    viewDeptDetail: 'View breakdown →',
    momChange: 'MoM',
    insightLabel: 'Insight',
    legendCompany: 'Your company',
    legendIndustry: 'Industry avg',
  },
  tr: {
    signIn: 'Giriş Yap',
    signUp: 'Kayıt Ol',
    email: 'E-posta',
    password: 'Şifre',
    companyCode: 'Şirket Davet Kodu',
    forgotPassword: 'Şifremi Unuttum?',
    dontHaveAccount: 'Hesabınız yok mu?',
    alreadyHaveAccount: 'Zaten hesabınız var mı?',
    createAccount: 'Hesap Oluştur',
    signInButton: 'Giriş Yap',
    signOut: 'Çıkış Yap',
    talentInScope: 'Talent In Scope',
    lastUpdated: 'Son güncelleme',
    refreshData: 'Verileri Yenile',
    export: 'Dışa Aktar',
    viewingPeriod: 'Görüntülenen Dönem',
    compareTo: 'Karşılaştır',
    totalEmployees: 'Toplam Çalışan',
    openToWork: 'İş Aramakta',
    industryAverage: 'Sektör Ortalaması',
    fromLastMonth: 'önceki aydan',
    belowIndustry: 'sektörün altında',
    aboveIndustry: 'sektörün üstünde',
    atIndustryAvg: 'Sektör ortalamasında',
    trendAnalysis: 'Geçmiş Trend Analizi',
    yourCompany: 'Şirketiniz',
    departmentRisk: 'Fonksiyon Risk Analizi',
    highRisk: 'Yüksek Risk',
    mediumRisk: 'Orta Risk',
    lowRisk: 'Düşük Risk',
    employees: 'çalışan',
    invalidCredentials: 'Geçersiz e-posta veya şifre',
    accountInactive: 'Hesabınız devre dışı bırakıldı. Lütfen destek ile iletişime geçin.',
    invalidInviteCode: 'Geçersiz davet kodu',
    emailRequired: 'E-posta gereklidir',
    passwordRequired: 'Şifre gereklidir',
    codeRequired: 'Şirket davet kodu gereklidir',
    loading: 'Yükleniyor...',
    january: 'Ocak',
    february: 'Şubat',
    march: 'Mart',
    april: 'Nisan',
    may: 'Mayıs',
    june: 'Haziran',
    july: 'Temmuz',
    august: 'Ağustos',
    september: 'Eylül',
    october: 'Ekim',
    november: 'Kasım',
    december: 'Aralık',
    // Drill-down page
    departmentDetail: 'Departman Detayı',
    backToOverview: '← Genel Bakış',
    vsIndustryAvg: 'Sektör Farkı',
    departmentSize: 'Departman Büyüklüğü',
    riskLevel: 'Risk Seviyesi',
    current: 'güncel',
    sixMonthTrend: '6 Aylık Trend',
    trendSubtitle: 'İş arama oranı vs sektör ortalaması',
    riskHistory: 'Risk Geçmişi',
    riskHistorySubtitle: 'Aylık sınıflandırma',
    seniorityTitle: 'Kıdeme Göre İş Arayanlar',
    senioritySubtitle: 'Attrition riski nerede yoğunlaşıyor?',
    viewDeptDetail: 'Detayları gör →',
    momChange: 'AoA',
    insightLabel: 'Yorum',
    legendCompany: 'Şirketiniz',
    legendIndustry: 'Sektör ort.',
  }
};

function App() {
  // Show landing page state
  const [showLanding, setShowLanding] = useState(true);
  
  // Language state - auto-detect
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    if (saved) return saved;
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('tr') ? 'tr' : 'en';
  });
  
  const t = translations[language];
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [user, setUser] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState('');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Dashboard state
  const [selectedMonth, setSelectedMonth] = useState('2025-01');
  const [comparisonMonth, setComparisonMonth] = useState('2024-12');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState({});
  const [allDeptData, setAllDeptData] = useState({});
  const [trendData, setTrendData] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [showDrilldown, setShowDrilldown] = useState(false);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (!isAuthenticated) {
        setShowLanding(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      const compId = session.user.user_metadata?.company_id;
      if (compId) {
        setCompanyId(compId);
        await loadCompanyData(compId);
        setIsAuthenticated(true);
        setShowLanding(false);
      }
    }
  };

  // Fetch CSV data
  const fetchCSV = async (url) => {
    const response = await fetch(url);
    const csvText = await response.text();
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data)
      });
    });
  };

  // Load company data from Google Sheets
  const loadCompanyData = async (compId) => {
    try {
      // Fetch companies to get company name
      const companies = await fetchCSV(SHEETS.companies);
      const company = companies.find(c => c.Company_ID === compId);
      if (company) {
        setCompanyName(company.Company_Name);
      }

      // Fetch monthly data
      const monthlyRaw = await fetchCSV(SHEETS.monthly);
      const filteredMonthly = monthlyRaw.filter(row => row.Company_ID === compId);
      const monthlyObj = {};
      filteredMonthly.forEach(row => {
        monthlyObj[row.Month] = {
          totalEmployees: parseInt(row.Total_Employees),
          openToWork: parseFloat(row['Open_To_Work_%']),
          industryAvg: parseFloat(row['Industry_Avg_%'])
        };
      });
      setMonthlyData(monthlyObj);

      // Set initial selected months
      const months = Object.keys(monthlyObj).sort().reverse();
      if (months.length > 0) {
        setSelectedMonth(months[0]);
        if (months.length > 1) {
          setComparisonMonth(months[1]);
        }
      }

      // Fetch department data for all months
      const deptRaw = await fetchCSV(SHEETS.departments);
      const filteredDept = deptRaw.filter(row => row.Company_ID === compId);
      const deptByMonth = {};
      filteredDept.forEach(row => {
        if (!deptByMonth[row.Month]) deptByMonth[row.Month] = [];
        deptByMonth[row.Month].push({
          function: row.Function,
          functionTR: row.Function_TR || '',
          openToWork: parseFloat(row['Open_To_Work_%']),
          employees: parseInt(row.Employees)
        });
      });
      setAllDeptData(deptByMonth);

      // Fetch trend data
      const trendRaw = await fetchCSV(SHEETS.trends);
      const filteredTrend = trendRaw.filter(row => row.Company_ID === compId);
      const trendFormatted = filteredTrend.map(row => ({
        month: row.Month,
        openToWork: parseFloat(row.Open_To_Work),
        industry: parseFloat(row.Industry)
      }));
      setTrendData(trendFormatted);

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load company data');
    }
  };

  // Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError(t.emailRequired);
      return;
    }
    if (!password) {
      setError(t.passwordRequired);
      return;
    }
    if (!inviteCode) {
      setError(t.codeRequired);
      return;
    }

    setLoading(true);
    
    try {
      // Verify invite code exists
      const companies = await fetchCSV(SHEETS.companies);
      const company = companies.find(c => 
        c.Invite_Code === inviteCode && c.Active === 'TRUE'
      );
      
      if (!company) {
        setError(t.invalidInviteCode);
        setLoading(false);
        return;
      }

      // Create user in Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            company_id: company.Company_ID
          }
        }
      });
      
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setUser(data.user);
        setCompanyId(company.Company_ID);
        await loadCompanyData(company.Company_ID);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  // Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError(t.emailRequired);
      return;
    }
    if (!password) {
      setError(t.passwordRequired);
      return;
    }

    setLoading(true);
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (signInError) {
        setError(t.invalidCredentials);
      } else {
        setUser(data.user);
        const compId = data.user.user_metadata?.company_id;
        if (compId) {
          setCompanyId(compId);
          await loadCompanyData(compId);
          setIsAuthenticated(true);
        }
      }
    } catch (err) {
      setError(t.invalidCredentials);
    }
    
    setLoading(false);
  };

  // Sign Out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setInviteCode('');
    setCompanyId(null);
    setCompanyName('');
    setShowLanding(true);
  };

  // Format functions
  const formatDate = (date) => {
    if (language === 'tr') {
      return date.toLocaleDateString('tr-TR');
    }
    return date.toLocaleDateString('en-US');
  };

  const formatNumber = (num) => {
    if (language === 'tr') {
      return num.toString().replace('.', ',');
    }
    return num.toString();
  };

  const formatPercent = (num) => {
    const formatted = formatNumber(num.toFixed(1));
    return language === 'tr' ? `%${formatted}` : `${formatted}%`;
  };

  const getMonthName = (monthNum) => {
    const months = language === 'tr' 
      ? ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNum - 1];
  };

  const formatMonthYear = (dateStr) => {
    const [year, month] = dateStr.split('-');
    return `${getMonthName(parseInt(month))} ${year}`;
  };

  const calculateRisk = (percentage) => {
    if (percentage >= 17) return 'high';
    if (percentage >= 12) return 'medium';
    return 'low';
  };

  const currentData = monthlyData[selectedMonth];
  const previousData = monthlyData[comparisonMonth];
  const availableMonths = Object.keys(monthlyData).sort().reverse();
  const functionData = allDeptData[selectedMonth] || [];
  const comparisonDeptData = allDeptData[comparisonMonth] || [];

  // Show landing page first
  if (showLanding && !isAuthenticated) {
    return <LandingPage onAccessDashboard={() => {
      setShowLanding(false);
      // Add to browser history so back button works
      window.history.pushState({ page: 'login' }, '', window.location.pathname);
    }} />;
  }

  // Auth screens
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm font-medium text-slate-700"
          >
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'EN' : 'TR'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{t.talentInScope}</h1>
          </div>

          {showSignUp ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">{t.signUp}</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.email}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.password}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.companyCode}</label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="demo"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
              >
                {loading ? t.loading : t.createAccount}
              </button>

              <div className="text-center text-sm text-slate-600">
                {t.alreadyHaveAccount}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setShowSignUp(false);
                    setError('');
                  }}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  {t.signIn}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">{t.signIn}</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.email}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.password}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
              >
                {loading ? t.loading : t.signInButton}
              </button>

              <div className="text-center text-sm text-slate-600">
                {t.dontHaveAccount}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setShowSignUp(true);
                    setError('');
                  }}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  {t.signUp}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Main Dashboard
  const mainDashboard = (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{t.talentInScope}</h1>
                <p className="text-sm text-slate-500">{companyName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900"
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'EN' : 'TR'}
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t.signOut}
              </button>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {t.lastUpdated}: {formatDate(lastUpdated)}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Month Selector */}
        <div className="mb-6 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-600" />
            <label className="text-sm font-medium text-slate-700">{t.viewingPeriod}:</label>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableMonths.map(month => (
                <option key={month} value={month}>{formatMonthYear(month)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">{t.compareTo}:</label>
            <select 
              value={comparisonMonth}
              onChange={(e) => setComparisonMonth(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableMonths.filter(m => m !== selectedMonth).map(month => (
                <option key={month} value={month}>{formatMonthYear(month)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        {currentData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">{t.totalEmployees}</span>
                <Users className="w-5 h-5 text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {currentData.totalEmployees}
              </div>
              {previousData && (
                <div className="flex items-center gap-1 text-sm">
                  {currentData.totalEmployees > previousData.totalEmployees ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-medium">
                        +{currentData.totalEmployees - previousData.totalEmployees} {t.fromLastMonth}
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-red-600 font-medium">
                        {currentData.totalEmployees - previousData.totalEmployees} {t.fromLastMonth}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">{t.openToWork}</span>
                <AlertCircle className="w-5 h-5 text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {formatPercent(currentData.openToWork)}
              </div>
              {previousData && (
                <div className="flex items-center gap-1 text-sm">
                  {currentData.openToWork < previousData.openToWork ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-medium">
                        -{formatPercent(Math.abs(currentData.openToWork - previousData.openToWork))} {t.fromLastMonth}
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 text-red-600" />
                      <span className="text-red-600 font-medium">
                        +{formatPercent(currentData.openToWork - previousData.openToWork)} {t.fromLastMonth}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">{t.industryAverage}</span>
                <TrendingUp className="w-5 h-5 text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {formatPercent(currentData.industryAvg)}
              </div>
              <div className="text-sm font-medium">
                {currentData.openToWork < currentData.industryAvg ? (
                  <span className="text-green-600">
                    ✓ {formatPercent(currentData.industryAvg - currentData.openToWork)} {t.belowIndustry}
                  </span>
                ) : currentData.openToWork > currentData.industryAvg ? (
                  <span className="text-red-600">
                    ⚠ {formatPercent(currentData.openToWork - currentData.industryAvg)} {t.aboveIndustry}
                  </span>
                ) : (
                  <span className="text-slate-600">{t.atIndustryAvg}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trend Chart */}
        {trendData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">{t.trendAnalysis}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  formatter={(value) => formatPercent(value)}
                />
                <Legend />
                <Line type="monotone" dataKey="openToWork" stroke="#3b82f6" strokeWidth={3} name={t.yourCompany} dot={{ fill: '#3b82f6', r: 4 }} />
                <Line type="monotone" dataKey="industry" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name={t.industryAverage} dot={{ fill: '#94a3b8', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Department Breakdown */}
        {functionData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">{t.departmentRisk}</h2>
              <span className="text-xs text-slate-500">{formatMonthYear(selectedMonth)}</span>
            </div>
            <div className="space-y-4">
              {functionData.sort((a, b) => b.openToWork - a.openToWork).map((dept) => {
                const risk = calculateRisk(dept.openToWork);
                const riskLabel = risk === 'high' ? t.highRisk : risk === 'medium' ? t.mediumRisk : t.lowRisk;
                const compDept = comparisonDeptData.find(d => d.function === dept.function);
                const diff = compDept ? dept.openToWork - compDept.openToWork : null;
                return (
                  <div
                    key={dept.function}
                    className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={() => { setSelectedDept(dept); setShowDrilldown(true); }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-slate-900">
                            {language === 'tr' && dept.functionTR ? dept.functionTR : dept.function}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            risk === 'high' ? 'bg-red-100 text-red-700' :
                            risk === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {riskLabel}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-slate-900">{formatPercent(dept.openToWork)}</div>
                          {diff !== null && (
                            <div className={`text-xs font-medium flex items-center justify-end gap-1 ${diff > 0 ? 'text-red-600' : diff < 0 ? 'text-green-600' : 'text-slate-500'}`}>
                              {diff > 0 ? <TrendingUp className="w-3 h-3" /> : diff < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                              {diff > 0 ? '+' : ''}{formatPercent(Math.abs(diff))} {t.fromLastMonth} {formatMonthYear(comparisonMonth)}
                            </div>
                          )}
                          <div className="text-xs text-slate-500">{dept.employees} {t.employees}</div>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            risk === 'high' ? 'bg-red-500' :
                            risk === 'medium' ? 'bg-amber-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(dept.openToWork * 5, 100)}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-blue-600 font-medium">{t.viewDeptDetail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ---------- DRILLDOWN PAGE ----------
  if (showDrilldown && selectedDept) {
    return (
      <DepartmentDetail
        dept={selectedDept}
        allDeptData={allDeptData}
        selectedMonth={selectedMonth}
        allDepts={functionData}
        trendData={trendData}
        language={language}
        t={t}
        formatPercent={formatPercent}
        formatMonthYear={formatMonthYear}
        calculateRisk={calculateRisk}
        onBack={() => setShowDrilldown(false)}
        onSelectDept={(d) => setSelectedDept(d)}
        companyName={companyName}
        setLanguage={setLanguage}
        handleSignOut={handleSignOut}
        formatDate={formatDate}
        lastUpdated={lastUpdated}
      />
    );
  }

  return mainDashboard;
}

// ─────────────────────────────────────────────
// DEPARTMENT DETAIL PAGE
// ─────────────────────────────────────────────
function DepartmentDetail({
  dept, allDeptData, selectedMonth, allDepts, trendData,
  language, t, formatPercent, formatMonthYear, calculateRisk,
  onBack, onSelectDept, companyName, setLanguage, handleSignOut,
  formatDate, lastUpdated
}) {
  const deptName = language === 'tr' && dept.functionTR ? dept.functionTR : dept.function;

  // Build 6-month history for this department from allDeptData
  const months = Object.keys(allDeptData).sort();
  const deptHistory = months.map(m => {
    const row = (allDeptData[m] || []).find(d => d.function === dept.function);
    const trendRow = trendData.find(r => r.month === m);
    return {
      month: m,
      value: row ? row.openToWork : null,
      industry: trendRow ? trendRow.industry : null,
    };
  }).filter(r => r.value !== null);

  // Risk history derived from deptHistory
  const riskHistory = deptHistory.map(r => ({
    month: r.month,
    risk: calculateRisk(r.value),
  }));

  const risk = calculateRisk(dept.openToWork);
  const riskLabel = risk === 'high' ? t.highRisk : risk === 'medium' ? t.mediumRisk : t.lowRisk;

  // Month-over-month delta (last two available months for this dept)
  const prev = deptHistory.length >= 2 ? deptHistory[deptHistory.length - 2] : null;
  const delta = prev ? dept.openToWork - prev.value : null;

  // vs industry for current month
  const currentTrend = trendData.find(r => r.month === selectedMonth);
  const vsIndustry = currentTrend ? dept.openToWork - currentTrend.industry : null;

  const riskColors = {
    high: { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA', badge: 'bg-red-100 text-red-700' },
    medium: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A', badge: 'bg-amber-100 text-amber-700' },
    low: { bg: '#F0FDF4', color: '#166534', border: '#BBF7D0', badge: 'bg-green-100 text-green-700' },
  };
  const rc = riskColors[risk];

  const shortMonth = (m) => {
    const [, mon] = m.split('-');
    const idx = parseInt(mon) - 1;
    const en = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const tr = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
    return language === 'tr' ? tr[idx] : en[idx];
  };

  // SVG trend chart
  const W = 480, H = 160, PL = 12, PR = 12, PT = 10, PB = 22;
  const cW = W - PL - PR, cH = H - PT - PB;
  const allVals = deptHistory.flatMap(r => [r.value, r.industry].filter(Boolean));
  const minV = allVals.length ? Math.min(...allVals) - 2 : 0;
  const maxV = allVals.length ? Math.max(...allVals) + 2 : 25;
  const xStep = deptHistory.length > 1 ? cW / (deptHistory.length - 1) : cW;
  const yScale = v => PT + cH - ((v - minV) / (maxV - minV)) * cH;

  const trendPts = deptHistory.map((r, i) => `${PL + i * xStep},${yScale(r.value)}`).join(' ');
  const industryPts = deptHistory.filter(r => r.industry !== null).map((r, i) => `${PL + i * xStep},${yScale(r.industry)}`).join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header — same as main dashboard */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{t.talentInScope}</h1>
                <p className="text-sm text-slate-500">{companyName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900"
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'EN' : 'TR'}
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t.signOut}
              </button>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {t.lastUpdated}: {formatDate(lastUpdated)}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            {t.backToOverview}
          </button>
          <span className="text-slate-400">/</span>
          <span className="font-medium text-slate-900">{deptName}</span>
        </div>

        {/* Department Switcher */}
        <div className="flex flex-wrap gap-2 mb-6">
          {allDepts.map(d => {
            const n = language === 'tr' && d.functionTR ? d.functionTR : d.function;
            const active = d.function === dept.function;
            return (
              <button
                key={d.function}
                onClick={() => onSelectDept(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  active
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}
              >{n}</button>
            );
          })}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Open to Work */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-500">{t.openToWork}</span>
              <AlertCircle className="w-4 h-4 text-slate-300" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{formatPercent(dept.openToWork)}</div>
            {delta !== null && (
              <div className={`text-xs font-medium flex items-center gap-1 mt-1 ${delta > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {delta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {delta > 0 ? '+' : ''}{formatPercent(Math.abs(delta))} {t.momChange}
              </div>
            )}
          </div>

          {/* vs Industry */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-500">{t.vsIndustryAvg}</span>
              <TrendingUp className="w-4 h-4 text-slate-300" />
            </div>
            {vsIndustry !== null ? (
              <>
                <div className={`text-2xl font-bold ${vsIndustry > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {vsIndustry > 0 ? '+' : ''}{formatPercent(Math.abs(vsIndustry))}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {vsIndustry > 0 ? t.aboveIndustry : t.belowIndustry}
                </div>
              </>
            ) : <div className="text-2xl font-bold text-slate-400">—</div>}
          </div>

          {/* Headcount */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-500">{t.departmentSize}</span>
              <Users className="w-4 h-4 text-slate-300" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{dept.employees}</div>
            <div className="text-xs text-slate-400 mt-1">{t.employees}</div>
          </div>

          {/* Risk Level */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-500">{t.riskLevel}</span>
              <AlertCircle className="w-4 h-4 text-slate-300" />
            </div>
            <div className={`text-lg font-bold mt-1 ${risk === 'high' ? 'text-red-600' : risk === 'medium' ? 'text-amber-600' : 'text-green-600'}`}>
              {riskLabel}
            </div>
            <div className="text-xs text-slate-400 mt-1">{t.current}</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Trend Chart — 2/3 width */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-1">{t.sixMonthTrend}</h2>
            <p className="text-xs text-slate-500 mb-4">{t.trendSubtitle}</p>
            {deptHistory.length > 0 ? (
              <>
                <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
                  {/* Grid lines */}
                  {[0,0.25,0.5,0.75,1].map(f => (
                    <line key={f} x1={PL} x2={W-PR} y1={PT + cH * (1-f)} y2={PT + cH * (1-f)} stroke="#e2e8f0" strokeWidth="0.5"/>
                  ))}
                  {/* Industry line */}
                  {industryPts && <polyline points={industryPts} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7"/>}
                  {/* Company line */}
                  <polyline points={trendPts} fill="none" stroke="#3b82f6" strokeWidth="2.5"/>
                  {/* Dots */}
                  {deptHistory.map((r, i) => (
                    <circle key={i} cx={PL + i * xStep} cy={yScale(r.value)} r="4" fill="#3b82f6"/>
                  ))}
                  {/* Month labels */}
                  {deptHistory.map((r, i) => (
                    <text key={i} x={PL + i * xStep} y={H - 4} textAnchor="middle" fontSize="10" fill="#94a3b8">{shortMonth(r.month)}</text>
                  ))}
                </svg>
                <div className="flex items-center gap-5 mt-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-5 h-0.5 bg-blue-500 rounded"/>
                    {t.legendCompany}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-5 border-t-2 border-dashed border-slate-400"/>
                    {t.legendIndustry}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-400 py-8 text-center">
                {language === 'tr' ? 'Geçmiş veri bulunamadı.' : 'No historical data available.'}
              </p>
            )}
          </div>

          {/* Risk History — 1/3 width */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-1">{t.riskHistory}</h2>
            <p className="text-xs text-slate-500 mb-4">{t.riskHistorySubtitle}</p>
            <div className="space-y-2">
              {riskHistory.length > 0 ? riskHistory.map((r, i) => {
                const rc2 = riskColors[r.risk];
                const label = r.risk === 'high' ? t.highRisk : r.risk === 'medium' ? t.mediumRisk : t.lowRisk;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-8 shrink-0">{shortMonth(r.month)}</span>
                    <div
                      className="flex-1 h-6 rounded flex items-center px-2"
                      style={{ background: rc2.bg, border: `1px solid ${rc2.border}` }}
                    >
                      <span className="text-xs font-semibold" style={{ color: rc2.color }}>{label}</span>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-sm text-slate-400">
                  {language === 'tr' ? 'Veri yok.' : 'No data.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Trend Analysis for this dept (recharts, reuse existing data) */}
        {deptHistory.length > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">{t.trendAnalysis}</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={deptHistory.map(r => ({
                month: shortMonth(r.month),
                openToWork: r.value,
                industry: r.industry,
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }}/>
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }}/>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  formatter={(value) => value !== null ? formatPercent(value) : '—'}
                />
                <Legend/>
                <Line type="monotone" dataKey="openToWork" stroke="#3b82f6" strokeWidth={2.5} name={deptName} dot={{ fill: '#3b82f6', r: 4 }}/>
                <Line type="monotone" dataKey="industry" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" name={t.industryAverage} dot={{ fill: '#94a3b8', r: 3 }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;