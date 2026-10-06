import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronDown,
  LifeBuoy,
  ShieldCheck,
  HelpCircle,
  Headphones,
  SlidersHorizontal,
  Phone,
  Wallet,
  Package,
  Wrench,
  AlertCircle,
  Lock,
  Mail,
  MessageSquare,
  FileText,
  Cpu,
  Users,
  Route,
  Zap,
  Play,
  AudioWaveform,
  PlugZap,
  Building2,
  Store,
  ListTree,
  Megaphone,
  BellRing,
  CalendarDays,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  XCircle
} from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CmsHtml } from '../../components/cms/CmsHtml';
import heroBg from '../../assets/hero-bg.png';

const API_ROOT = String(
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api\/?$/, '');

const mediaUrl = (value, fallback = '') => {
  if (!value) return fallback;
  if (/^(https?:\/\/|data:|blob:)/i.test(value)) return value;
  if (value.startsWith('/uploads/')) return `${API_ROOT}${value}`;
  if (value.startsWith('/')) return `${API_ROOT}${value}`;
  return `${API_ROOT}/${value}`;
};

const parseJson = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Lucide Icon Map
const ICON_MAP = {
  BookOpen,
  PhoneCall,
  Wallet,
  Package,
  Smartphone,
  ShieldCheck,
  Wrench,
  Globe2,
  Layers,
  Bot,
  ReceiptText,
  Clock,
  ChevronDown,
  LifeBuoy,
  HelpCircle,
  Headphones,
  SlidersHorizontal,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Cpu,
  Users,
  Route,
  Zap,
  Play,
  AudioWaveform,
  PlugZap,
  Building2,
  Store,
  ListTree,
  Megaphone,
  BellRing,
  CalendarDays,
  CheckCircle2,
  Sparkles,
};

function DynamicIcon({ name = 'BookOpen', className = 'w-5 h-5' }) {
  const Comp = ICON_MAP[name] || ICON_MAP[name?.replace(/\s+/g, '')] || BookOpen;
  return <Comp className={className} />;
}

// Category Icon Mapping
const CATEGORY_ICONS = {
  'IP Phone & Number': PhoneCall,
  'IP Phone': PhoneCall,
  'Billing & Recharge': Wallet,
  'Recharge & Payment': Wallet,
  'Packages & Subscription': Package,
  'Packages': Package,
  'Apps & Devices': Smartphone,
  'Calling App': Smartphone,
  'Account & Security': ShieldCheck,
  'Account & Login': ShieldCheck,
  'Troubleshooting': Wrench,
  'Virtual Number': Globe2,
  'Cloud PBX': Layers,
  'Auto Dialer': Bot,
};

// Default Help Categories (with aliases & icons)
const DEFAULT_HELP_CATEGORIES = [
  {
    key: 'IP Phone & Number',
    aliases: ['IP Phone & Number', 'IP Phone', 'Virtual Number', 'Number'],
    title: 'IP Phone & Number',
    desc: 'Learn about your 096 IP number, SIP credentials, and calling setup.',
    icon: PhoneCall,
  },
  {
    key: 'Billing & Recharge',
    aliases: ['Billing & Recharge', 'Recharge & Payment', 'Recharge & Billing', 'Recharge', 'Billing'],
    title: 'Billing & Recharge',
    desc: 'Learn how to recharge your account, payment gateways, and ledger.',
    icon: Wallet,
  },
  {
    key: 'Packages & Subscription',
    aliases: ['Packages & Subscription', 'Packages', 'Subscription', 'Pricing'],
    title: 'Packages & Subscription',
    desc: 'View information about monthly packages, activation, and renewal.',
    icon: Package,
  },
  {
    key: 'Apps & Devices',
    aliases: ['Apps & Devices', 'Calling App', 'Softphones', 'Devices'],
    title: 'Apps & Devices',
    desc: 'Guides for using MyBDPhone on Android, iOS, PC, and IP phones.',
    icon: Smartphone,
  },
  {
    key: 'Account & Security',
    aliases: ['Account & Security', 'Account & Login', 'Account', 'Security'],
    title: 'Account & Security',
    desc: 'Manage your account details, password, and security settings.',
    icon: ShieldCheck,
  },
  {
    key: 'Troubleshooting',
    aliases: ['Troubleshooting', 'Trouble Shooting', 'Support'],
    title: 'Troubleshooting',
    desc: 'Find solutions to common calling, payment, and account problems.',
    icon: Wrench,
  }
];

// Default Popular Articles Fallback
const DEFAULT_POPULAR_ARTICLES = [
  {
    id: 1,
    slug: 'how-to-recharge-your-account',
    title: 'How to Recharge Your Account',
    category: 'Billing & Recharge',
    icon: 'ReceiptText',
    read_time: '3 min read',
    is_popular: 1,
    short_desc: 'Learn how to add balance to your MyBDPhone account using bKash, Nagad, or Bank gateway.',
    full_content: `### 1. Adding Balance to Calling Wallet
- Open your User Portal and navigate to **Billing & Top-up** (or Recharge).
- Enter your desired recharge amount (Minimum ৳100 up to ৳25,000).
- Select your preferred payment method: **bKash, Nagad, Rocket, DGePay, Moneybag**, or **Manual Payment**.

### 2. Instant Payment Gateway vs Manual Payment
- **Instant Gateway:** Pay securely with OTP/PIN on the checkout screen. Your wallet balance updates immediately upon payment completion with automated Mushak-6.3 VAT receipt generation.
- **Manual Payment:** Send money to our official merchant/agent number, submit your Transaction ID and attach the payment screenshot. Admin verifies and approves within 10 to 30 minutes.

### 3. Checking Current Balance
- Your updated balance is visible in real-time on your User Dashboard top widget and in the **Financial Ledger**.`
  },
  {
    id: 2,
    slug: 'how-to-set-up-your-ip-phone',
    title: 'How to Set Up Your IP Phone',
    category: 'IP Phone & Number',
    icon: 'PhoneCall',
    read_time: '5 min read',
    is_popular: 1,
    short_desc: 'Follow the basic steps to configure your Yealink, Grandstream, or Cisco IP phone.',
    full_content: `### 1. Hardware Connection
- Connect the Ethernet cable from your network router or switch to the **LAN / Internet** port of your IP Phone.
- Connect the handset coil cord and plug in the power adapter (or connect via PoE switch).

### 2. Accessing the Web Configuration Interface
- Check your phone screen to find its local IP address (e.g. \`192.168.1.150\`).
- Open your computer browser and enter the IP address. Log in with admin credentials (Default for Yealink: \`admin\` / \`admin\`; for Grandstream: \`admin\` / password printed on bottom sticker).

### 3. Configuring SIP Account Credentials
Navigate to **Account** > **Account 1** > **General Settings**:
- **SIP Server:** \`sip.mybdphone.com\` (Port: 5060)
- **SIP User ID / Extension:** Your 096 line number (e.g., \`09649012375\`)
- **Authentication ID:** Same as your 096 extension
- **SIP Password:** Your secure SIP password from User Dashboard > My IP Phone

### 4. Codecs & Audio Settings
- Set audio codec preference to **G.711u** and **G.729** for HD Bangla voice clarity.
- Click **Save & Apply**. The registration status indicator will turn green.`
  },
  {
    id: 3,
    slug: 'how-to-use-mybdphone-on-android',
    title: 'How to Use MyBDPhone on Android',
    category: 'Apps & Devices',
    icon: 'Smartphone',
    read_time: '4 min read',
    is_popular: 1,
    short_desc: 'Learn how to connect and use your 096 IP number on Android softphone apps.',
    full_content: `### 1. Download Recommended Softphone App
- Open Google Play Store on your Android device.
- Search and install **Grandstream Wave (GS Wave)**, **Linphone**, or **Zoiper**.

### 2. Enter SIP Credentials
- Open the app > **Settings** > **Account Settings** > **Add Account (+)**.
- **Account Name:** MyBDPhone Line
- **SIP Server:** \`sip.mybdphone.com:5060\`
- **SIP User ID:** Your 096 extension number
- **Password:** Your SIP password from User Portal

### 3. Background Push Notifications
- Enable **Keep Alive in Background / Push Notifications** in the app settings so incoming calls ring your mobile even when the phone is locked.
- Allow Microphone and Notification permissions when prompted.`
  },
  {
    id: 4,
    slug: 'how-to-check-your-call-history',
    title: 'How to Check Your Call History',
    category: 'IP Phone & Number',
    icon: 'Layers',
    read_time: '2 min read',
    is_popular: 1,
    short_desc: 'View your recent incoming, outgoing, and missed call logs with audio recordings.',
    full_content: `### 1. Navigate to Call History
- Log in to your MyBDPhone User Portal.
- From the sidebar, click on **My 096 IP Phone** or **Financial Ledger**.

### 2. Filtering Calls & Logs
- Filter calls by **Incoming**, **Outgoing**, or **Missed**.
- Select custom date ranges to audit daily or monthly calling volumes.

### 3. Call Details & Recordings
- View detailed call metadata including duration (seconds/minutes), destination operator, and exact balance deduction.
- For packages with call recording enabled, click the **Play** button to listen to crystal-clear call audio or download MP3 archives.`
  },
  {
    id: 5,
    slug: 'how-to-activate-a-monthly-package',
    title: 'How to Activate a Monthly Package',
    category: 'Packages & Subscription',
    icon: 'Bot',
    read_time: '3 min read',
    is_popular: 1,
    short_desc: 'Learn how to select and activate an IP Phone, PBX, or AI Calling monthly package.',
    full_content: `### 1. Browse Available Packages
- Visit the **Services & Packages** section from your User Dashboard or top navigation bar.
- Compare Starter, Business, and Enterprise IP Phone and Cloud PBX monthly plans.

### 2. Choose Subscription & Payment Method
- Click **Activate Package** or **Subscribe**.
- Choose your preferred payment option:
  - **Wallet Balance Deduction:** Instantly activates using your available account balance.
  - **Online Gateway Checkout:** Pay securely via DGePay, Moneybag, bKash, or Card.

### 3. Automated Activation
- Your package benefits (channels, extension limits, free minutes, and PBX features) are unlocked immediately upon payment confirmation.`
  },
  {
    id: 6,
    slug: 'why-is-my-payment-pending',
    title: 'Why Is My Payment Pending?',
    category: 'Troubleshooting',
    icon: 'ShieldCheck',
    read_time: '3 min read',
    is_popular: 1,
    short_desc: 'Understand manual verification and instant gateway payment statuses.',
    full_content: `### 1. Manual Payments Require Verification
- When you make a **Manual Payment** (sending money to our bKash/Nagad/Bank merchant number manually), your transaction status is set to **Pending**.
- Our billing operations team inspects your submitted Transaction ID, amount, and receipt document to prevent fraud before approving.

### 2. Automated Gateway Payments
- If you pay via **DGePay** or **Moneybag** gateway, payments that complete successfully are marked **Completed** immediately without needing admin approval.
- If you cancel or close the gateway window, the transaction status becomes **Canceled** or **Processing**.

### 3. How to Expedite Approval
- Ensure the Transaction ID you submitted matches your SMS receipt exactly.
- If your pending payment takes longer than 30 minutes, create a **Support Ticket** with your Transaction ID for high-priority review.`
  }
];

// Default FAQs Fallback
const DEFAULT_FAQS = [
  {
    id: 1,
    category: 'Billing & Recharge',
    question: 'How can I recharge my account?',
    answer: 'Open your User Dashboard → Billing & Top-up (Recharge), enter the amount you wish to add (from ৳100 to ৳25,000), select your preferred payment method (bKash, Nagad, Rocket, DGePay, Moneybag, or Manual payment), and complete the payment. Your wallet balance is updated instantly for automated gateway payments or upon quick admin review for manual payments.'
  },
  {
    id: 2,
    category: 'Packages & Subscription',
    question: 'How can I activate a package?',
    answer: 'Navigate to Services & Packages from your dashboard or top navigation bar, select the IP Phone or Cloud PBX package that fits your business needs, and click "Get Started" or "Subscribe". You can pay using your wallet balance or complete instant checkout via DGePay/bKash. Features activate immediately upon payment.'
  },
  {
    id: 3,
    category: 'Apps & Devices',
    question: 'How can I use my IP number on mobile?',
    answer: 'Download a recommended softphone app such as Grandstream Wave (GS Wave), Linphone, or Zoiper from Google Play Store or Apple App Store. Open the app, go to Settings → Add SIP Account, and enter your SIP Domain (sip.mybdphone.com:5060), Extension ID (e.g. 09649012375), and SIP Password from your User Dashboard.'
  },
  {
    id: 4,
    category: 'Account & Security',
    question: 'Where can I find my SIP password?',
    answer: 'Log in to your User Portal and click on "My 096 IP Phone" or "Account details". Under your Active SIP Account card, you will find your SIP Server Host, Extension ID, and a secure password box with a reveal/copy button.'
  },
  {
    id: 5,
    category: 'Troubleshooting',
    question: 'Why is my payment pending?',
    answer: 'If you made a manual payment (sending money directly to our merchant number or bank account), your transaction status remains "Pending" while our admin team verifies your Transaction ID and proof document. If you pay via automated gateways (DGePay/Moneybag), your payment completes instantly. If a gateway payment is canceled or closed midway, it will show Canceled or Processing.'
  },
  {
    id: 6,
    category: 'Account & Security',
    question: 'How can I change my password?',
    answer: 'Go to User Dashboard → Security & Password (or Profile). In the Security tab, enter your current password, type your new secure password, confirm it, and click "Save Changes". You will receive an instant confirmation notification.'
  }
];

export const Support = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openFaqId, setOpenFaqId] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [copied, setCopied] = useState(false);

  // Dynamic CMS States
  const [cmsPage, setCmsPage] = useState({
    title: 'Knowledgebase',
    subtitle: 'Find quick answers and helpful guides for using MyBDPhone.',
    featured_image: '',
    content_html: '',
    seo_description: '',
  });
  const [cmsSections, setCmsSections] = useState([]);
  const [cmsCollections, setCmsCollections] = useState({});
  const [resourceGuides, setResourceGuides] = useState([]);
  const [resourceFaqs, setResourceFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch full dynamic CMS page, sections, collections, guides, and FAQs
  useEffect(() => {
    let isMounted = true;
    const loadAllKnowledgebaseData = async () => {
      setLoading(true);
      try {
        // 1. Fetch CMS Page, Sections & Collections from /cms/public/page/support
        try {
          const cmsRes = await API.get('/cms/public/page/support');
          if (isMounted && cmsRes.data?.success && cmsRes.data.page) {
            setCmsPage(cmsRes.data.page);
            if (Array.isArray(cmsRes.data.sections)) {
              setCmsSections(cmsRes.data.sections);
            }
            if (cmsRes.data.collections) {
              setCmsCollections(cmsRes.data.collections);
            }
          }
        } catch {
          // fallback to public resources page
          try {
            const rRes = await API.get('/public/resources/support');
            if (isMounted && rRes.data?.page?.title) {
              setCmsPage((p) => ({
                ...p,
                title: rRes.data.page.title,
                subtitle: rRes.data.page.subtitle || p.subtitle,
                content_html: rRes.data.page.content_html || p.content_html,
                featured_image: rRes.data.page.featured_image || p.featured_image,
              }));
            }
          } catch {}
        }

        // 2. Fetch Guides from /resources/guides
        try {
          const guidesRes = await API.get('/resources/guides');
          if (isMounted && Array.isArray(guidesRes.data?.guides) && guidesRes.data.guides.length > 0) {
            setResourceGuides(guidesRes.data.guides);
          }
        } catch {}

        // 3. Fetch FAQs from /resources/faqs
        try {
          const faqsRes = await API.get('/resources/faqs');
          if (isMounted && Array.isArray(faqsRes.data?.faqs) && faqsRes.data.faqs.length > 0) {
            setResourceFaqs(faqsRes.data.faqs);
          }
        } catch {}
      } catch (err) {
        console.error('Support Knowledgebase load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAllKnowledgebaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Merge FAQs from:
  // 1) Linked CMS collections (FAQ Manager)
  // 2) Resources CMS FAQs (/resources/faqs)
  // 3) Default fallbacks
  const mergedFaqs = useMemo(() => {
    const map = new Map();

    // 1. CMS Items from FAQ Manager (/admin/cms/faq)
    if (Array.isArray(cmsCollections?.faq) && cmsCollections.faq.length > 0) {
      cmsCollections.faq.forEach((item) => {
        const q = (item.title || '').trim();
        const a = item.payload?.answer || item.description || item.content_html || '';
        if (q && a) {
          map.set(q.toLowerCase(), {
            id: `cms_${item.id}`,
            question: q,
            answer: a,
            category: item.meta || item.payload?.category || 'General',
            sort_order: Number(item.sort_order || 0),
          });
        }
      });
    }

    // 2. Resource FAQs from Resources CMS (/admin/cms/resources)
    if (Array.isArray(resourceFaqs) && resourceFaqs.length > 0) {
      resourceFaqs.forEach((item) => {
        const q = (item.question || '').trim();
        const a = item.answer || '';
        const key = q.toLowerCase();
        if (q && a && !map.has(key)) {
          map.set(key, {
            id: `rf_${item.id}`,
            question: q,
            answer: a,
            category: item.category || 'General',
            sort_order: Number(item.sort_order || 0),
          });
        }
      });
    }

    // 3. Fallback to default FAQs if none exist
    if (map.size === 0) {
      DEFAULT_FAQS.forEach((item) => {
        map.set(item.question.toLowerCase().trim(), item);
      });
    }

    return Array.from(map.values()).sort((a, b) => (Number(a.sort_order || 0) - Number(b.sort_order || 0)));
  }, [cmsCollections, resourceFaqs]);

  // Merge Guides from Resources CMS (/resources/guides) + Defaults
  const mergedGuides = useMemo(() => {
    if (Array.isArray(resourceGuides) && resourceGuides.length > 0) {
      const prioritySlugs = [
        'how-to-recharge-your-account',
        'how-to-set-up-your-ip-phone',
        'how-to-use-mybdphone-on-android',
        'how-to-check-your-call-history',
        'how-to-activate-a-monthly-package',
        'why-is-my-payment-pending'
      ];
      return [...resourceGuides].sort((a, b) => {
        const aIdx = prioritySlugs.indexOf(a.slug);
        const bIdx = prioritySlugs.indexOf(b.slug);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return Number(b.is_popular || 0) - Number(a.is_popular || 0);
      });
    }
    return DEFAULT_POPULAR_ARTICLES;
  }, [resourceGuides]);

  // Dynamic Help Categories generated from guides & FAQs
  const dynamicCategories = useMemo(() => {
    const catMap = new Map();

    // Seed with standard categories for rich descriptions and icons
    DEFAULT_HELP_CATEGORIES.forEach((cat) => {
      catMap.set(cat.key, {
        ...cat,
        count: 0,
      });
    });

    // Count items and add any new custom categories
    mergedGuides.forEach((g) => {
      const cName = (g.category || 'General').trim();
      let matchedKey = null;
      for (const [k, obj] of catMap.entries()) {
        if (k.toLowerCase() === cName.toLowerCase() || obj.aliases?.some(a => a.toLowerCase() === cName.toLowerCase())) {
          matchedKey = k;
          break;
        }
      }
      if (matchedKey) {
        catMap.get(matchedKey).count += 1;
      } else {
        catMap.set(cName, {
          key: cName,
          title: cName,
          aliases: [cName],
          desc: `Browse guides and FAQs for ${cName}.`,
          icon: CATEGORY_ICONS[cName] || BookOpen,
          count: 1,
        });
      }
    });

    mergedFaqs.forEach((f) => {
      const cName = (f.category || 'General').trim();
      let matchedKey = null;
      for (const [k, obj] of catMap.entries()) {
        if (k.toLowerCase() === cName.toLowerCase() || obj.aliases?.some(a => a.toLowerCase() === cName.toLowerCase())) {
          matchedKey = k;
          break;
        }
      }
      if (matchedKey) {
        catMap.get(matchedKey).count += 1;
      } else {
        catMap.set(cName, {
          key: cName,
          title: cName,
          aliases: [cName],
          desc: `Frequently asked questions regarding ${cName}.`,
          icon: CATEGORY_ICONS[cName] || HelpCircle,
          count: 1,
        });
      }
    });

    return Array.from(catMap.values());
  }, [mergedGuides, mergedFaqs]);

  // Category matching helper
  const isCategoryMatch = (itemCategory, targetCategoryKey) => {
    if (targetCategoryKey === 'All') return true;
    const cat = dynamicCategories.find((c) => c.key === targetCategoryKey);
    if (!cat) return itemCategory?.toLowerCase().includes(targetCategoryKey.toLowerCase());
    return cat.aliases.some((alias) => itemCategory?.toLowerCase().includes(alias.toLowerCase()));
  };

  // Filtered popular articles
  const filteredArticles = useMemo(() => {
    return mergedGuides.filter((article) => {
      const matchCat = isCategoryMatch(article.category, selectedCategory);
      if (!searchQuery.trim()) return matchCat;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        article.title?.toLowerCase().includes(q) ||
        article.short_desc?.toLowerCase().includes(q) ||
        article.category?.toLowerCase().includes(q) ||
        article.full_content?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [mergedGuides, selectedCategory, searchQuery, dynamicCategories]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return mergedFaqs.filter((faq) => {
      const matchCat = isCategoryMatch(faq.category, selectedCategory);
      if (!searchQuery.trim()) return matchCat;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        faq.question?.toLowerCase().includes(q) ||
        faq.answer?.toLowerCase().includes(q) ||
        faq.category?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [mergedFaqs, selectedCategory, searchQuery, dynamicCategories]);

  // Set default open FAQ when FAQs are loaded
  useEffect(() => {
    if (filteredFaqs.length > 0 && openFaqId === null) {
      setOpenFaqId(filteredFaqs[0].id || 0);
    }
  }, [filteredFaqs]);

  // Copy guide full content
  const handleCopyGuide = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCategoryClick = (catKey) => {
    if (selectedCategory === catKey) {
      setSelectedCategory('All');
    } else {
      setSelectedCategory(catKey);
    }
  };

  // Active sorted CMS sections
  const activeSections = useMemo(() => {
    const list = cmsSections.filter((s) => s.status === 'active' || s.is_visible !== 0);
    return list.sort((a, b) => (Number(a.sort_order ?? a.display_order ?? 0) - Number(b.sort_order ?? b.display_order ?? 0)));
  }, [cmsSections]);

  // Section Type Checks
  const isGuideSection = (sec) => {
    const k = (sec.section_key || '').toLowerCase();
    const t = (sec.section_type || '').toLowerCase();
    const title = (sec.title || '').toLowerCase();
    return (
      t === 'articles' ||
      t === 'guides' ||
      t === 'popular_articles' ||
      t === 'how_it_works' ||
      t === 'steps' ||
      k.includes('guide') ||
      k.includes('setup') ||
      k.includes('article') ||
      k.includes('tutorial') ||
      title.includes('softphone') ||
      title.includes('guide') ||
      title.includes('article') ||
      title.includes('popular') ||
      title.includes('configure')
    );
  };

  const isFaqSection = (sec) => {
    const k = (sec.section_key || '').toLowerCase();
    const t = (sec.section_type || '').toLowerCase();
    const title = (sec.title || '').toLowerCase();
    return (
      t === 'faq' ||
      t === 'faq_accordion' ||
      k === 'faq' ||
      k.includes('faq') ||
      title.includes('faq') ||
      title.includes('frequently asked') ||
      title.includes('question')
    );
  };

  const isCtaSection = (sec) => {
    const k = (sec.section_key || '').toLowerCase();
    const t = (sec.section_type || '').toLowerCase();
    const title = (sec.title || '').toLowerCase();
    return (
      t === 'cta' ||
      t === 'cta_banner' ||
      t === 'consultation' ||
      t === 'final_cta' ||
      k.includes('cta') ||
      k.includes('helpdesk') ||
      k.includes('assistance') ||
      title.includes('assistance') ||
      title.includes('still need') ||
      title.includes('technical assistance') ||
      title.includes('help')
    );
  };

  const isFeatureGridSection = (sec) => {
    const t = (sec.section_type || '').toLowerCase();
    return (
      t === 'feature_grid' ||
      t === 'benefits' ||
      t === 'benefits_grid' ||
      t === 'solutions_grid' ||
      t === 'key_features'
    );
  };

  const isTextImageSplitSection = (sec) => {
    const t = (sec.section_type || '').toLowerCase();
    return t === 'text_image_split' || t === 'image_text';
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 text-slate-800 font-sans">
      
      {/* =========================================================================
          SECTION 1: KNOWLEDGEBASE HEADER (Controlled 100% by Admin CMS Page)
         ========================================================================= */}
      <section
        className="relative overflow-hidden bg-[#eaf6f2] bg-no-repeat bg-cover bg-center text-[#092328] py-16 sm:py-20 border-b border-[#8BBB92]/30 shadow-xs"
        style={{
          backgroundImage: `url(${mediaUrl(cmsPage.featured_image, heroBg)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#092328]/10 backdrop-blur-[1px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12544F]/10 border border-[#2A835F]/30 text-[#12544F] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Support & Documentation Hub</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#092328] tracking-tight">
            {cmsPage.title || 'Knowledgebase'}
          </h1>

          {/* Subtitle / Main Description from Admin CMS */}
          {(cmsPage.seo_description || cmsPage.subtitle || cmsPage.content_html) && (
            <div className="text-slate-700 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              {cmsPage.content_html ? (
                <CmsHtml html={cmsPage.content_html} className="prose prose-slate max-w-none text-slate-700" />
              ) : (
                <p>{cmsPage.seo_description || cmsPage.subtitle}</p>
              )}
            </div>
          )}

          {/* Live Search Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center shadow-lg rounded-2xl bg-white border-2 border-[#12544F]/20 focus-within:border-[#12544F] focus-within:ring-4 focus-within:ring-[#12544F]/10 transition-all overflow-hidden">
              <div className="pl-4 pr-2 text-[#12544F]">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a guide, topic, configuration, or question..."
                className="w-full py-4 pr-10 text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent border-none outline-hidden font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="pr-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Quick search stats */}
            {searchQuery && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
                <span>
                  Showing results for: <span className="text-[#12544F]">"{searchQuery}"</span>
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">{filteredArticles.length} articles</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">{filteredFaqs.length} FAQs</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-rose-600 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-16">
        
        {/* =========================================================================
            SECTION 2: DYNAMIC HELP CATEGORIES
           ========================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A835F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Explore by Topic
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#092328]">
                Help Categories
              </h2>
            </div>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="self-start sm:self-auto text-xs font-bold text-[#12544F] bg-[#12544F]/10 hover:bg-[#12544F]/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Show All Categories
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {dynamicCategories.map((cat) => {
              const Icon = cat.icon || BookOpen;
              const isSelected = selectedCategory === cat.key;
              return (
                <div
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  className={`group relative p-6 rounded-2xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-white border-[#12544F] ring-2 ring-[#12544F]/20 shadow-md transform -translate-y-0.5'
                      : 'bg-white border-slate-200/90 hover:border-[#12544F]/40 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                        isSelected
                          ? 'bg-[#12544F] text-white border-[#12544F]'
                          : 'bg-[#12544F]/10 text-[#12544F] border-[#12544F]/20 group-hover:bg-[#12544F] group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-base text-[#092328] group-hover:text-[#12544F] transition-colors truncate">
                          {cat.title}
                        </h3>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#12544F] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            DYNAMIC SECTIONS (Controlled 100% by Admin CMS Sections & Sort Order)
           ========================================================================= */}
        {activeSections.length > 0 ? (
          activeSections.map((sec, secIndex) => {
            const settings = parseJson(sec.settings || sec.custom_settings, {});
            const secImage = sec.image_url || settings.image_url || settings.image || '';
            const secEyebrow = settings.eyebrow || sec.subtitle || '';

            // 1. Guides / Setup / Articles Section
            if (isGuideSection(sec)) {
              // Check if custom items exist in settings.items or cmsCollections
              const customItems = Array.isArray(settings.items) && settings.items.length > 0
                ? settings.items
                : settings.collection_key && Array.isArray(cmsCollections[settings.collection_key])
                ? cmsCollections[settings.collection_key]
                : null;

              const displayArticles = customItems || filteredArticles;

              return (
                <section key={sec.id || `sec-${secIndex}`} className="space-y-6 pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      {secEyebrow && (
                        <span className="text-xs font-bold uppercase tracking-wider text-[#2A835F] flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> {secEyebrow}
                        </span>
                      )}
                      <h2 className="text-2xl sm:text-3xl font-black text-[#092328]">
                        {sec.title || 'Configure Your Softphone in Minutes'}
                      </h2>
                    </div>
                    <div className="text-xs text-slate-500 font-semibold">
                      Showing {displayArticles.length} guide{displayArticles.length === 1 ? '' : 's'}
                    </div>
                  </div>

                  {secImage && (
                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                      <img src={mediaUrl(secImage)} alt={sec.title} className="w-full max-h-80 object-cover" />
                    </div>
                  )}

                  {sec.content_html && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                      <CmsHtml html={sec.content_html} className="prose prose-slate max-w-none text-slate-700" />
                    </div>
                  )}

                  {displayArticles.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                      <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                      <h4 className="font-bold text-slate-700">No articles found</h4>
                      <p className="text-xs text-slate-500">Try modifying your search or select a different category.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('All');
                        }}
                        className="text-xs font-bold text-[#12544F] underline cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayArticles.map((article, aIdx) => {
                        const catName = article.category || 'General';
                        const CategoryIcon = CATEGORY_ICONS[catName] || BookOpen;
                        return (
                          <div
                            key={article.slug || article.id || aIdx}
                            className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#12544F]/50 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#12544F] bg-[#12544F]/10 px-2.5 py-0.5 rounded-full border border-[#12544F]/20">
                                  <CategoryIcon className="w-3 h-3" />
                                  {catName}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                                  <Clock className="w-3 h-3" />
                                  {article.read_time || '3 min read'}
                                </span>
                              </div>

                              <h3 className="font-bold text-base text-[#092328] group-hover:text-[#12544F] transition-colors line-clamp-2">
                                {article.title}
                              </h3>

                              <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
                                {article.short_desc || article.description}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              <button
                                onClick={() => setSelectedGuide(article)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12544F] group-hover:text-[#2A835F] group-hover:translate-x-0.5 transition-all cursor-pointer"
                              >
                                <span>Read Guide</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            }

            // 2. FAQ Accordion Section
            if (isFaqSection(sec)) {
              const customFaqs = Array.isArray(settings.items) && settings.items.length > 0
                ? settings.items.map((it, idx) => ({
                    id: `sec_faq_${idx}`,
                    question: it.q || it.question || it.title,
                    answer: it.a || it.answer || it.description || it.content_html,
                    category: it.category || 'General',
                  }))
                : settings.collection_key && Array.isArray(cmsCollections[settings.collection_key])
                ? cmsCollections[settings.collection_key].map((it) => ({
                    id: `col_faq_${it.id}`,
                    question: it.title,
                    answer: it.payload?.answer || it.description || it.content_html,
                    category: it.meta || 'General',
                  }))
                : null;

              const displayFaqs = customFaqs || filteredFaqs;

              return (
                <section key={sec.id || `sec-${secIndex}`} className="space-y-6 pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      {secEyebrow && (
                        <span className="text-xs font-bold uppercase tracking-wider text-[#2A835F] flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5" /> {secEyebrow}
                        </span>
                      )}
                      <h2 className="text-2xl sm:text-3xl font-black text-[#092328]">
                        {sec.title || 'Frequently Asked Questions'}
                      </h2>
                    </div>
                    <div className="text-xs text-slate-500 font-semibold">
                      Showing {displayFaqs.length} question{displayFaqs.length === 1 ? '' : 's'}
                    </div>
                  </div>

                  {secImage && (
                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                      <img src={mediaUrl(secImage)} alt={sec.title} className="w-full max-h-80 object-cover" />
                    </div>
                  )}

                  {sec.content_html && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                      <CmsHtml html={sec.content_html} className="prose prose-slate max-w-none text-slate-700" />
                    </div>
                  )}

                  {displayFaqs.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                      <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
                      <h4 className="font-bold text-slate-700">No questions found</h4>
                      <p className="text-xs text-slate-500">Try searching for other keywords or reset your category filter.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('All');
                        }}
                        className="text-xs font-bold text-[#12544F] underline cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {displayFaqs.map((faq, index) => {
                        const isOpen = openFaqId === (faq.id || index);
                        return (
                          <div
                            key={faq.id || index}
                            className={`rounded-2xl border transition-all overflow-hidden ${
                              isOpen
                                ? 'bg-white border-[#12544F]/40 shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <button
                              onClick={() => setOpenFaqId(isOpen ? null : (faq.id || index))}
                              className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer"
                            >
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#12544F]/10 text-[#12544F]">
                                    {faq.category || 'General'}
                                  </span>
                                </div>
                                <h4 className="font-bold text-base text-[#092328]">
                                  {faq.question}
                                </h4>
                              </div>
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                                  isOpen
                                    ? 'bg-[#12544F] text-white rotate-180'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            </button>

                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-100 text-sm text-slate-600 font-normal leading-relaxed"
                                >
                                  {faq.answer}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            }

            // 3. Support CTA / Technical Assistance Section
            if (isCtaSection(sec)) {
              const primaryBtnText = settings.primary_text || settings.primary_btn?.text || 'Create Support Ticket';
              const primaryBtnUrl = settings.primary_url || settings.primary_btn?.url || (user ? '/user/support' : '/login?redirect=/user/support');
              const secondaryBtnText = settings.secondary_text || settings.secondary_btn?.text || 'Contact Sales';
              const secondaryBtnUrl = settings.secondary_url || settings.secondary_btn?.url || '/contact';
              const phoneHotline = settings.phone || '096490123756';
              const supportEmail = settings.email || 'support@mybdphone.com';

              return (
                <section key={sec.id || `sec-${secIndex}`} className="pt-4">
                  <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#092328] via-[#12544F] to-[#092328] text-white p-8 sm:p-12 shadow-xl border border-[#2A835F]/30">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-[#8BBB92]/10 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 rounded-full bg-[#2A835F]/20 blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#8BBB92] text-xs font-bold uppercase tracking-wider border border-white/10">
                          <Headphones className="w-3.5 h-3.5" /> {secEyebrow || '24/7 Dedicated Support'}
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                          {sec.title || 'Still Need Technical Assistance?'}
                        </h3>
                        <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
                          {sec.subtitle || "Can't find the answer you're looking for? Our support team is ready to help."}
                        </p>

                        {sec.content_html && (
                          <div className="pt-2">
                            <CmsHtml html={sec.content_html} className="prose prose-invert max-w-none text-slate-200 text-sm" />
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300 font-semibold">
                          {phoneHotline && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-[#8BBB92]" />
                              <span>Hotline: {phoneHotline}</span>
                            </div>
                          )}
                          {supportEmail && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-[#8BBB92]" />
                              <span>Email: {supportEmail}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                        <Link
                          to={primaryBtnUrl}
                          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#8BBB92] hover:bg-[#8BBB92]/90 text-[#092328] font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                        >
                          <LifeBuoy className="w-4 h-4" />
                          <span>{primaryBtnText}</span>
                        </Link>

                        {secondaryBtnText && (
                          <Link
                            to={secondaryBtnUrl}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{secondaryBtnText}</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );
            }

            // 4. Feature Grid / Benefits Section
            if (isFeatureGridSection(sec)) {
              const items = Array.isArray(settings.items)
                ? settings.items
                : Array.isArray(settings.features)
                ? settings.features
                : Array.isArray(settings.benefits)
                ? settings.benefits
                : settings.collection_key && Array.isArray(cmsCollections[settings.collection_key])
                ? cmsCollections[settings.collection_key]
                : [];
              const columns = settings.columns || 3;
              const colClass = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3';

              return (
                <section key={sec.id || `sec-${secIndex}`} className="space-y-6 pt-4">
                  <div className="border-b border-slate-200 pb-4">
                    {secEyebrow && (
                      <span className="text-xs font-bold uppercase tracking-wider text-[#2A835F]">
                        {secEyebrow}
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-black text-[#092328]">
                      {sec.title}
                    </h2>
                    {sec.subtitle && <p className="text-slate-500 text-sm mt-1">{sec.subtitle}</p>}
                  </div>

                  <div className={`grid grid-cols-1 ${colClass} gap-6`}>
                    {items.map((it, idx) => (
                      <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-[#12544F]/10 text-[#12544F] flex items-center justify-center">
                          <DynamicIcon name={it.icon || 'Sparkles'} className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-base text-[#092328]">{it.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{it.desc || it.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            // 5. Text Image Split Section
            if (isTextImageSplitSection(sec)) {
              const orientation = (sec.layout_orientation || settings.layout_orientation || 'IMAGE_RIGHT').toUpperCase();
              const isImageLeft = orientation === 'IMAGE_LEFT' || settings.image_position === 'left';
              const badges = Array.isArray(settings.badges) ? settings.badges : [];

              return (
                <section key={sec.id || `sec-${secIndex}`} className="space-y-6 pt-4">
                  <div className={`flex flex-col gap-8 items-center ${isImageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                    <div className="flex-1 space-y-4">
                      {secEyebrow && (
                        <span className="text-xs font-bold uppercase tracking-wider text-[#2A835F]">
                          {secEyebrow}
                        </span>
                      )}
                      <h2 className="text-2xl sm:text-3xl font-black text-[#092328]">
                        {sec.title}
                      </h2>
                      {sec.subtitle && <p className="text-slate-600 font-medium">{sec.subtitle}</p>}
                      {sec.content_html && (
                        <CmsHtml html={sec.content_html} className="prose prose-slate max-w-none text-slate-600 text-sm" />
                      )}
                      {badges.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                          {badges.map((b, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {secImage && (
                      <div className="flex-1 w-full flex justify-center">
                        <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md">
                          <img src={mediaUrl(secImage)} alt={sec.title} className="w-full max-h-[380px] object-cover" />
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );
            }

            // 6. Custom Section added by Admin (Rich Text / General)
            return (
              <section key={sec.id || `sec-${secIndex}`} className="space-y-6 pt-4">
                <div className="border-b border-slate-200 pb-4">
                  {secEyebrow && (
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2A835F]">
                      {secEyebrow}
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-3xl font-black text-[#092328]">
                    {sec.title}
                  </h2>
                  {sec.subtitle && (
                    <p className="text-slate-500 text-sm mt-1">{sec.subtitle}</p>
                  )}
                </div>

                {secImage && (
                  <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs">
                    <img
                      src={mediaUrl(secImage)}
                      alt={sec.title || cmsPage.title}
                      className="w-full max-h-[460px] object-cover"
                    />
                  </div>
                )}

                {sec.content_html && (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                    <CmsHtml html={sec.content_html} className="prose prose-slate max-w-none text-slate-700 leading-relaxed" />
                  </div>
                )}
              </section>
            );
          })
        ) : (
          // Default fallback if no CMS sections exist
          <>
            {/* Default Popular Articles */}
            <section className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2A835F] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Step-by-Step Guides
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#092328]">
                    Configure Your Softphone in Minutes
                  </h2>
                </div>
                <div className="text-xs text-slate-500 font-semibold">
                  Showing {filteredArticles.length} guide{filteredArticles.length === 1 ? '' : 's'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => {
                  const CategoryIcon = CATEGORY_ICONS[article.category] || BookOpen;
                  return (
                    <div
                      key={article.slug || article.id}
                      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#12544F]/50 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#12544F] bg-[#12544F]/10 px-2.5 py-0.5 rounded-full border border-[#12544F]/20">
                            <CategoryIcon className="w-3 h-3" />
                            {article.category}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                            <Clock className="w-3 h-3" />
                            {article.read_time || '3 min read'}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-[#092328] group-hover:text-[#12544F] transition-colors line-clamp-2">
                          {article.title}
                        </h3>

                        <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
                          {article.short_desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedGuide(article)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12544F] group-hover:text-[#2A835F] group-hover:translate-x-0.5 transition-all cursor-pointer"
                        >
                          <span>Read Guide</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Default FAQs */}
            <section className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2A835F] flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Instant Answers
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#092328]">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="text-xs text-slate-500 font-semibold">
                  Showing {filteredFaqs.length} question{filteredFaqs.length === 1 ? '' : 's'}
                </div>
              </div>

              <div className="space-y-3">
                {filteredFaqs.map((faq, index) => {
                  const isOpen = openFaqId === (faq.id || index);
                  return (
                    <div
                      key={faq.id || index}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isOpen
                          ? 'bg-white border-[#12544F]/40 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaqId(isOpen ? null : (faq.id || index))}
                        className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#12544F]/10 text-[#12544F]">
                              {faq.category || 'General'}
                            </span>
                          </div>
                          <h4 className="font-bold text-base text-[#092328]">
                            {faq.question}
                          </h4>
                        </div>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                            isOpen
                              ? 'bg-[#12544F] text-white rotate-180'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-100 text-sm text-slate-600 font-normal leading-relaxed"
                          >
                            {faq.answer}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Default CTA */}
            <section className="pt-4">
              <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#092328] via-[#12544F] to-[#092328] text-white p-8 sm:p-12 shadow-xl border border-[#2A835F]/30">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#8BBB92] text-xs font-bold uppercase tracking-wider border border-white/10">
                      <Headphones className="w-3.5 h-3.5" /> 24/7 Dedicated Support
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      Still Need Technical Assistance?
                    </h3>
                    <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
                      Can't find the answer you're looking for? Our support team is ready to help.
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                    <Link
                      to={user ? '/user/support' : '/login?redirect=/user/support'}
                      className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#8BBB92] hover:bg-[#8BBB92]/90 text-[#092328] font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      <LifeBuoy className="w-4 h-4" />
                      <span>Create Support Ticket</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

      </div>

      {/* =========================================================================
          GUIDE READER MODAL
         ========================================================================= */}
      <AnimatePresence>
        {selectedGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 bg-linear-to-r from-[#092328] to-[#12544F] text-white flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#8BBB92] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                      {selectedGuide.category || 'Guide'}
                    </span>
                    <span className="text-[11px] text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {selectedGuide.read_time || '3 min read'}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {selectedGuide.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 max-h-[calc(90vh-160px)]">
                {(selectedGuide.short_desc || selectedGuide.description) && (
                  <p className="text-sm font-semibold text-[#12544F] bg-[#12544F]/5 p-4 rounded-xl border border-[#12544F]/10">
                    {selectedGuide.short_desc || selectedGuide.description}
                  </p>
                )}

                <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4 text-slate-700">
                  {selectedGuide.full_content ? (
                    selectedGuide.full_content.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h4 key={pIdx} className="text-base font-bold text-[#092328] pt-2 border-b border-slate-100 pb-1">
                            {paragraph.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (paragraph.startsWith('- ')) {
                        return (
                          <ul key={pIdx} className="space-y-1.5 pl-5 list-disc">
                            {paragraph.split('\n').map((item, iIdx) => (
                              <li key={iIdx} className="text-slate-700 font-medium">
                                {item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={pIdx} className="font-normal">
                          {paragraph}
                        </p>
                      );
                    })
                  ) : selectedGuide.content_html ? (
                    <CmsHtml html={selectedGuide.content_html} />
                  ) : (
                    <p>{selectedGuide.short_desc || selectedGuide.description}</p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
                <button
                  onClick={() => handleCopyGuide(selectedGuide.full_content || selectedGuide.short_desc || selectedGuide.title)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#12544F] px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-xs transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Guide Text</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedGuide(null)}
                  className="px-5 py-2 rounded-xl bg-[#12544F] hover:bg-[#092328] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Support;
