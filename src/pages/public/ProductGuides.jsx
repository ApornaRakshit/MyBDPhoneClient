import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  PhoneCall,
  Globe2,
  Layers,
  Bot,
  Smartphone,
  ReceiptText,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  X,
  Copy,
  Check,
  ChevronRight,
  LifeBuoy,
  ShieldCheck,
  HelpCircle,
  Headphones,
  SlidersHorizontal,
} from 'lucide-react';
import API from '../../services/api';

const ICON_MAP = {
  PhoneCall,
  Globe2,
  Layers,
  Bot,
  Smartphone,
  ReceiptText,
  BookOpen,
  ShieldCheck,
  LifeBuoy,
};

const DEFAULT_GUIDES = [
  {
    id: 1,
    slug: 'ip-phone-setup-guide',
    title: 'IP Phone Setup & Hardware Guide (Yealink/Grandstream)',
    category: 'IP Phone',
    icon: 'PhoneCall',
    read_time: '5 min read',
    is_popular: 1,
    short_desc: 'Setup, hardware configuration (Yealink/Grandstream), and calling procedure with official 096 lines.',
    full_content: `### 1. Hardware Unboxing & Physical Connection
- Connect the Ethernet cable from your network router/switch to the **LAN / Internet** port of the IP Phone.
- Connect the handset coil cord to the handset port on the side of the phone.
- If your switch does not support Power over Ethernet (PoE), connect the official 5V/12V DC power adapter.

### 2. Identifying the IP Address
- Once the phone finishes booting, press the **Menu** or **OK** button on the phone keypad.
- Select **Status** > **Network / IPv4** to view the assigned local IP address (e.g., \`192.168.1.150\`).

### 3. Accessing the Web Configuration Portal
- Open Google Chrome or Microsoft Edge on a computer connected to the same local network.
- Enter the phone IP address into your browser address bar.
- Log in using standard credentials (Default for Yealink: \`admin\` / \`admin\`; for Grandstream: \`admin\` / password printed on bottom sticker).

### 4. Configuring SIP Account Credentials
Navigate to **Account** > **Account 1** > **General**:
- **Account Active:** Enabled
- **Account Name / Label:** MyBDPhone 096
- **SIP Server / Register Server:** \`sip.mybdphone.com\` (Port: 5060)
- **SIP User ID / Extension:** Your assigned 096 extension (e.g. \`09649012375\`)
- **Authentication ID:** Your assigned 096 extension
- **Password / SIP Secret:** Your secure password from User Portal > My IP Phone

### 5. Codec & Audio Optimization
- Under **Audio Codecs**, prioritize **G.711u (PCMU)** and **G.729** for crystal-clear HD audio across Bangladesh broadband networks.
- Click **Save & Apply**. The account status will switch to **Registered (Green)**.`
  },
  {
    id: 2,
    slug: 'virtual-number-guide',
    title: 'Virtual Number Registration & Usage Guide',
    category: 'Virtual Number',
    icon: 'Globe2',
    read_time: '4 min read',
    is_popular: 1,
    short_desc: 'How to purchase, KYC register, and start using official 096 virtual numbers without geographic limits.',
    full_content: `### 1. Selecting Your Dedicated 096 Number
- Browse available standard, repeating, and VIP Golden numbers from the **Shop** or **IP Phone** tab.
- Add your desired 096 line to your cart and proceed to instant checkout.

### 2. Mandatory KYC Document Upload
In compliance with BTRC regulations, upload:
- Clear scanned copy of National ID (Smart Card / NID).
- Recent passport size photograph.
- Trade License (for corporate business accounts).

### 3. Verification & Automated Provisioning
- Our compliance desk verifies submitted documents within 10 to 30 minutes.
- Once approved, your SIP credentials (SIP Server, Port, User ID, and Authentication Secret) are generated automatically.

### 4. Inbound Call Routing & Multi-Device Linking
- Connect your virtual number to mobile softphones, desktop WebRTC, or hardware IP phones.
- Set up automatic call forwarding to your personal GSM mobile number whenever you are offline.`
  },
  {
    id: 3,
    slug: 'cloud-pbx-setup-guide',
    title: 'Cloud PBX Setup & Dynamic IVR Routing Guide',
    category: 'Cloud PBX',
    icon: 'Layers',
    read_time: '7 min read',
    is_popular: 1,
    short_desc: 'Configuring extensions, dynamic IVR voice menus, hunt groups, and intelligent call routing rules.',
    full_content: `### 1. Extension Management & Ring Groups
- Log in to your Customer Portal and open **Cloud PBX > Extensions**.
- Create internal extension numbers (e.g., Ext 101 for Sales, Ext 102 for Support, Ext 103 for Accounts).
- Assign extensions to team member email accounts or hardware devices.

### 2. Multi-Level IVR (Interactive Voice Response)
- Navigate to **Cloud PBX > IVR Greetings**.
- Upload studio WAV audio or generate natural Bangla speech using our built-in **Bangla Neural TTS Generator**.
- Map keypad digits:
  - **Press 1:** Sales Ring Group (Simultaneous ringing Ext 101-105)
  - **Press 2:** Support Queue (Round-Robin dispatch)
  - **Press 0:** Direct receptionist transfer

### 3. Business Hours & Holiday Schedules
- Define standard operating hours (e.g., Sunday - Thursday: 9:00 AM - 6:00 PM).
- Configure automated after-hours forwarding to emergency mobile numbers or corporate voicemail inbox.`
  },
  {
    id: 4,
    slug: 'auto-dialer-campaign-guide',
    title: 'Auto Dialer & Broadcast Campaign Guide',
    category: 'Auto Dialer',
    icon: 'Bot',
    read_time: '6 min read',
    is_popular: 1,
    short_desc: 'Setting up high-volume outbound broadcast campaigns, lead CSV imports, and predictive dialer usage.',
    full_content: `### 1. Preparing Lead Contacts CSV
- Create an Excel / CSV spreadsheet with required columns: \`Phone\`, \`Name\`, \`Custom_Tag\`, \`Amount\`.
- Clean contact numbers ensuring standard Bangladeshi format (e.g., \`01712345678\` or \`+8801712345678\`).

### 2. Selecting Dialing Modes
- **Broadcast Voice Campaign:** Sends recorded audio or Bangla TTS announcements with DTMF response capture (e.g., Press 1 to confirm).
- **Predictive AI Dialer:** Dials lead batches concurrently and immediately bridges live answered calls to ready sales agents.

### 3. Scheduling & Pacing Rates
- Set broadcast concurrency (from 10 to 1,000+ simultaneous calls).
- Schedule dispatch between legal daytime hours (9:00 AM to 8:00 PM).

### 4. Real-Time Disposition Analytics
- Track answered calls, call durations, DTMF keypress tallies, and export comprehensive CSV summary reports.`
  },
  {
    id: 5,
    slug: 'calling-app-setup-guide',
    title: 'Calling App Guide for Android, iOS & Desktop Softphones',
    category: 'Calling App',
    icon: 'Smartphone',
    read_time: '4 min read',
    is_popular: 1,
    short_desc: 'Setup guide for GS Wave, Linphone, MicroSIP, and Desktop WebRTC softphones with push background wake-up.',
    full_content: `### 1. Installing Recommended Softphone Applications
- **Android & iOS:** Grandstream Wave, Linphone, or Zoiper (Available on Google Play & Apple App Store).
- **Windows / macOS:** MicroSIP, Linphone Desktop, or directly via our WebRTC In-Browser Portal.

### 2. Entering SIP Account Settings
- **Account Name:** MyBDPhone Line
- **SIP Server:** \`sip.mybdphone.com:5060\`
- **SIP User ID / Extension:** Your extension number from dashboard
- **SIP Authentication ID:** Same as extension number
- **Password:** Your SIP authentication secret

### 3. Enabling Push Notifications
- Toggle **Background Push Notifications (Keep Alive)** to allow incoming calls to ring your mobile phone even when the app is swiped away.
- Grant microphone and notification permissions when prompted.`
  },
  {
    id: 6,
    slug: 'recharge-package-guide',
    title: 'Account Recharge & Package Activation Guide',
    category: 'Recharge & Billing',
    icon: 'ReceiptText',
    read_time: '3 min read',
    is_popular: 1,
    short_desc: 'Account recharge via bKash/Nagad/SSLCommerz/DGePay and instant monthly package activation.',
    full_content: `### 1. Adding Balance to Calling Wallet
- Open User Portal > **Recharge**.
- Enter amount (Minimum ৳100 up to ৳25,000).
- Select your preferred instant payment method: **bKash, Nagad, Rocket, Visa, Mastercard, or DGePay**.

### 2. Payment Gateway Verification
- Complete payment via secure OTP / PIN on the gateway screen.
- Balance is credited instantly with automated Mushak-6.3 VAT receipt generation.

### 3. Activating or Upgrading Monthly Packages
- Navigate to **Packages** from the navbar or user panel.
- Select your desired IP Phone or Cloud PBX monthly plan.
- Choose payment method: **DGePay Instant Online** or **Wallet Balance Deduction**.
- Package limits and extensions are updated immediately.`
  }
];

export const ProductGuides = () => {
  const [pageData, setPageData] = useState(null);
  const [guides, setGuides] = useState(DEFAULT_GUIDES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageAndGuides = async () => {
      try {
        setLoading(true);
        const res = await API.get('/public/resources/product-guides');
        if (res.data?.success) {
          if (res.data.page) setPageData(res.data.page);
          if (res.data.guides && res.data.guides.length > 0) {
            setGuides(res.data.guides);
          }
        }
      } catch (err) {
        console.error('Failed to load product guides from API, using defaults:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPageAndGuides();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(['All']);
    guides.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return Array.from(set);
  }, [guides]);

  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      const matchCat = selectedCategory === 'All' || g.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        g.title?.toLowerCase().includes(query) ||
        g.short_desc?.toLowerCase().includes(query) ||
        g.category?.toLowerCase().includes(query) ||
        g.full_content?.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });
  }, [guides, selectedCategory, searchQuery]);

  const handleCopySip = () => {
    navigator.clipboard.writeText('sip.mybdphone.com:5060');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pageTitle = pageData?.title || 'MyBDPhone Product & User Guides';
  const pageSubtitle =
    pageData?.subtitle ||
    'Learn how to configure, set up, and manage your IP Phone, Cloud PBX, and Calling Apps step-by-step.';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#092328] pt-6 pb-20">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden bg-linear-to-b from-[#EBF5F3] via-white to-[#F8FAFC] border-b border-emerald-950/10 py-12 md:py-16">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#12544F]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#12544F] uppercase tracking-wider mb-3">
            <BookOpen className="w-4 h-4" />
            <span>Official Documentation & Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#092328] tracking-tight mb-4 max-w-3xl">
            {pageTitle}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed mb-8">
            {pageSubtitle}
          </p>

          {/* Search Box */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides (e.g. Grandstream, IVR setup, bKash recharge, SIP)..."
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#12544F]/30 focus:border-[#12544F] text-sm text-[#092328] placeholder-slate-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#12544F] text-white shadow-md shadow-[#12544F]/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-[#092328]">No guides found</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              No documentation matches your search "{searchQuery}". Try another keyword or reset the category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-[#12544F] text-white rounded-xl text-sm font-bold hover:bg-[#0c3935]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide, idx) => {
              const IconComponent = ICON_MAP[guide.icon] || BookOpen;
              return (
                <motion.div
                  key={guide.id || guide.slug || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 group"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#12544F]/10 text-[#12544F] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#12544F] group-hover:text-white transition-all duration-300">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {guide.category}
                      </span>
                    </div>

                    {/* Title & Short Desc */}
                    <h3 className="font-black text-lg text-[#092328] mb-2 leading-snug group-hover:text-[#12544F] transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-6">
                      {guide.short_desc}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{guide.read_time || '5 min read'}</span>
                    </div>

                    <button
                      onClick={() => setSelectedGuide(guide)}
                      className="inline-flex items-center gap-1 text-sm font-bold text-[#12544F] group-hover:text-[#2A835F] hover:underline"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom Quick Help Card */}
        <div className="mt-16 bg-linear-to-r from-[#092328] to-[#12544F] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Need Direct Engineering Assistance?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Can't configure your device or softphone?
            </h2>
            <p className="text-sm text-white/80 leading-relaxed mb-6">
              Our 24/7 Dhaka NOC engineers can assist you with Asterisk trunking, FreePBX provisioning, or physical IP Phone setup via AnyDesk or remote session.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/user/support"
                className="px-6 py-3 bg-white text-[#092328] rounded-xl text-sm font-black hover:bg-emerald-50 transition shadow"
              >
                Create Support Ticket
              </Link>
              <a
                href="tel:096490123756"
                className="px-6 py-3 bg-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/20 transition border border-white/20"
              >
                Call Hotline: 096490123756
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Detail Modal */}
      <AnimatePresence>
        {selectedGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                <div className="pr-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#12544F]/10 text-[#12544F]">
                      {selectedGuide.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {selectedGuide.read_time}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#092328]">
                    {selectedGuide.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm leading-relaxed text-slate-700">
                {/* SIP Fast Info Callout */}
                <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-[#12544F] uppercase tracking-wider">
                      Standard SIP Server
                    </div>
                    <div className="text-sm font-mono font-bold text-slate-800">
                      sip.mybdphone.com:5060
                    </div>
                  </div>
                  <button
                    onClick={handleCopySip}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#12544F] text-white rounded-xl text-sm font-bold hover:bg-[#0c3935] transition shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy SIP Host'}</span>
                  </button>
                </div>

                {/* Markdown / Step Content */}
                <div className="prose prose-sm max-w-none text-slate-700 space-y-4">
                  {selectedGuide.full_content ? (
                    selectedGuide.full_content.split('\n\n').map((paragraph, i) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h4 key={i} className="text-base font-black text-[#092328] mt-4 mb-2">
                            {paragraph.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (paragraph.startsWith('- ')) {
                        const items = paragraph.split('\n- ');
                        return (
                          <ul key={i} className="list-disc pl-5 space-y-1.5 text-sm sm:text-sm text-slate-600">
                            {items.map((it, idx) => (
                              <li key={idx}>{it.replace(/^- /, '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={i} className="text-sm sm:text-sm text-slate-600 leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })
                  ) : (
                    <p>{selectedGuide.short_desc}</p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium hidden sm:inline">
                  Need more help? Open a support ticket anytime.
                </span>
                <div className="flex gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setSelectedGuide(null)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-bold transition"
                  >
                    Close
                  </button>
                  <Link
                    to="/contact"
                    className="px-4 py-2 bg-[#12544F] hover:bg-[#0c3935] text-white rounded-xl text-sm font-bold transition flex items-center gap-1"
                  >
                    <span>Contact Support</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGuides;

