import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  FileCheck2,
  Lock,
  FileText,
  AlertTriangle,
  Building2,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Download,
  PhoneCall,
  Scale,
  FileSpreadsheet,
  Globe2,
  Check,
} from 'lucide-react';
import API from '../../services/api';

const DEFAULT_SECTIONS = [
  {
    id: 1,
    section_key: 'btrc_info',
    section_type: 'BTRC_INFO',
    title: 'BTRC Licensing & Official Telecom Directives',
    subtitle: 'Approved IP-TSP operations and nationwide interconnectivity standards.',
    content: 'MyBDPhone operates strictly under valid IPTSP licenses issued by the Bangladesh Telecommunication Regulatory Commission (BTRC). All 096 number allocations, white-listed CLI routing, and SIP trunk interconnections adhere to national telecommunications laws.',
    content_json: {
      eyebrow: 'OFFICIAL REGULATORY APPROVAL',
      license_number: 'BTRC/LL/IPTSP/2023-096',
      interconnect_operators: ['Grameenphone', 'Banglalink', 'Robi Axiata', 'Teletalk', 'BTCL Landline'],
      badges: ['BTRC Licensed IPTSP Operator', 'White-Listed 096 Calling Lines', 'End-to-End Telecom Compliance']
    }
  },
  {
    id: 2,
    section_key: 'kyc_verification',
    section_type: 'KYC_REQUIREMENTS',
    title: 'Number Registration & User Verification (KYC)',
    subtitle: 'Mandatory subscriber verification requirements for corporate and individual lines.',
    content: 'To prevent unauthorized telecommunication misuse and satisfy national security regulations, every 096 subscriber must complete identity verification before activation.',
    content_json: {
      eyebrow: 'MANDATORY SUBSCRIBER ONBOARDING',
      documents: [
        {
          type: 'Corporate Subscriber',
          requirements: [
            'Valid Trade License Copy (Current Financial Year)',
            'Company TIN / BIN Certificate',
            'National ID (NID / Smart Card) of Authorized Managing Director',
            'Formal Authorization Letter on Company Letterhead',
            'Passport Size Color Photograph'
          ]
        },
        {
          type: 'Individual / Freelancer Subscriber',
          requirements: [
            'Clear Scanned Copy of Bangladeshi National ID (Smart Card / NID)',
            'Recent Passport Size Photograph',
            'Valid Mobile Number for Real-time OTP Verification',
            'Personal Address Verification Document / Utility Bill'
          ]
        }
      ]
    }
  },
  {
    id: 3,
    section_key: 'responsible_usage',
    section_type: 'USAGE_POLICIES',
    title: 'Responsible Telephony & Anti-Spam Guidelines',
    subtitle: 'Zero-tolerance policy against illegal VoIP termination and automated spam.',
    content: 'Our platform implements automated fraud detection algorithms and real-time CDR analytics to guarantee ethical enterprise calling.',
    content_json: {
      eyebrow: 'SAFE & COMPLIANT TELEPHONY',
      rules: [
        {
          title: 'Anti-Spam & Robocall Restrictions',
          desc: 'Automated broadcast calling campaigns must adhere to permissible calling hours (9:00 AM - 8:00 PM) and respect Do-Not-Disturb (DND) registries.'
        },
        {
          title: 'CLI Masking & Spoofing Prohibition',
          desc: 'Originating caller IDs must strictly match registered 096 numbers assigned to the verified entity. Spoofing is illegal under Bangladesh law.'
        },
        {
          title: 'Illegal Call Termination & Bypass Prevention',
          desc: 'Bypassing official international gateways (IGW) or unauthorized grey routing results in immediate line termination and regulatory reporting.'
        },
        {
          title: 'Call Recording Consent',
          desc: 'Businesses deploying call recording must notify callers via automated IVR disclaimers for transparency and legal validity.'
        }
      ]
    }
  },
  {
    id: 4,
    section_key: 'privacy_security',
    section_type: 'SECURITY_STANDARDS',
    title: 'Data Privacy, Encryption & Security Standards',
    subtitle: 'Military-grade encryption and secure telecom infrastructure in tier-3 Dhaka data centers.',
    content: 'All customer call data records, customer CRM metadata, and audio archives are safeguarded with multi-layered bank-grade security.',
    content_json: {
      eyebrow: 'ENTERPRISE DATA PROTECTION',
      features: [
        {
          title: 'AES-256 Cloud Encryption',
          desc: 'Rest and in-transit encryption for all voice streams and recorded MP3/WAV audio files.'
        },
        {
          title: 'Lawful Interception & Audit Trails',
          desc: 'Immutable CDR logs and tamper-proof access audit trails compliant with regulatory mandates.'
        },
        {
          title: 'Multi-Factor Authentication',
          desc: 'Strict MFA enforcement and IP white-listing for admin and agent SIP dashboards.'
        },
        {
          title: '99.98% High Availability SLA',
          desc: 'Redundant SIP switches across dual Dhaka data centers with automatic carrier failover.'
        }
      ]
    }
  },
  {
    id: 5,
    section_key: 'legal_policies',
    section_type: 'LEGAL_DOCS_ACCORDION',
    title: 'Official Terms, Privacy Policy & Refund Policy',
    subtitle: 'Detailed legal agreements governing service delivery and subscription usage.',
    content: '',
    content_json: {
      eyebrow: 'LEGAL DISCLOSURES',
      policies: [
        {
          id: 'terms',
          title: 'Terms & Conditions of Telecom Service',
          last_updated: 'October 2026',
          content: 'These Terms and Conditions govern the provision of IP Telephony, Cloud PBX, and AI Calling Services by MyBDPhone. By activating an account, the subscriber agrees to comply with all BTRC regulations, timely subscription renewals, and ethical usage standards. Reselling calling lines or CLI manipulation is strictly prohibited.'
        },
        {
          id: 'privacy',
          title: 'Subscriber Privacy & Data Protection Policy',
          last_updated: 'October 2026',
          content: 'MyBDPhone respects subscriber confidentiality. We collect personal and corporate documentation solely for regulatory KYC compliance and billing verification. Call recordings are stored in encrypted vaults and are never accessed by third parties without lawful judicial warrant.'
        },
        {
          id: 'refund',
          title: 'Wallet Balance & Subscription Refund Policy',
          last_updated: 'October 2026',
          content: 'Unused calling wallet balances remain valid for 365 days from the last recharge. Hardware devices returned within 7 days in original packaging with intact warranty seals are eligible for replacement or credit note. Monthly PBX package fees are non-refundable once the billing cycle begins.'
        }
      ]
    }
  }
];

export const ComplianceBtrc = () => {
  const [pageData, setPageData] = useState(null);
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [activeTab, setActiveTab] = useState('btrc_info');
  const [activeLegalDoc, setActiveLegalDoc] = useState('terms');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplianceData = async () => {
      try {
        setLoading(true);
        const res = await API.get('/public/resources/compliance-btrc');
        if (res.data?.success) {
          if (res.data.page) setPageData(res.data.page);
          if (res.data.sections && res.data.sections.length > 0) {
            setSections(res.data.sections);
          }
        }
      } catch (err) {
        console.error('Failed to load compliance data from API, using default data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplianceData();
  }, []);

  const btrcSection = sections.find((s) => s.section_key === 'btrc_info' || s.section_type === 'BTRC_INFO') || DEFAULT_SECTIONS[0];
  const kycSection = sections.find((s) => s.section_key === 'kyc_verification' || s.section_type === 'KYC_REQUIREMENTS') || DEFAULT_SECTIONS[1];
  const usageSection = sections.find((s) => s.section_key === 'responsible_usage' || s.section_type === 'USAGE_POLICIES') || DEFAULT_SECTIONS[2];
  const securitySection = sections.find((s) => s.section_key === 'privacy_security' || s.section_type === 'SECURITY_STANDARDS') || DEFAULT_SECTIONS[3];
  const legalSection = sections.find((s) => s.section_key === 'legal_policies' || s.section_type === 'LEGAL_DOCS_ACCORDION') || DEFAULT_SECTIONS[4];

  const pageTitle = pageData?.title || 'Telecom Compliance, Privacy & BTRC Guidelines';
  const pageSubtitle =
    pageData?.subtitle ||
    'Official regulatory information, user verification (KYC), privacy, and security commitments.';

  const navTabs = [
    { key: 'btrc_info', label: 'BTRC Licensing', icon: Award },
    { key: 'kyc_verification', label: 'KYC & Verification', icon: FileCheck2 },
    { key: 'responsible_usage', label: 'Responsible Usage', icon: AlertTriangle },
    { key: 'privacy_security', label: 'Security & Encryption', icon: Lock },
    { key: 'legal_policies', label: 'Legal Policies', icon: Scale },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#092328] pt-6 pb-20">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden bg-linear-to-b from-[#EBF5F3] via-white to-[#F8FAFC] border-b border-emerald-950/10 py-12 md:py-16">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#12544F]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#12544F] uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>National Regulatory & Security Framework</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#092328] tracking-tight mb-4 max-w-3xl">
            {pageTitle}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed mb-8">
            {pageSubtitle}
          </p>

          {/* Trust Highlights Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white/80 backdrop-blur-xs border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-[#092328]">Licensed IPTSP</div>
                <div className="text-[11px] text-slate-500">BTRC Approved 096 Range</div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-[#092328]">Full Interconnection</div>
                <div className="text-[11px] text-slate-500">GP, Banglalink, Robi, BTCL</div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-[#092328]">AES-256 Vault</div>
                <div className="text-[11px] text-slate-500">Encrypted CDR & Voice Data</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container with Sidebar + Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Navigation Sidebar */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-3 py-2">
                Compliance Topics
              </div>
              <nav className="space-y-1">
                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold transition text-left ${
                        isActive
                          ? 'bg-[#12544F] text-white shadow-md shadow-[#12544F]/20'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-[#092328]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{tab.label}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick KYC Submission Box */}
            <div className="bg-linear-to-br from-[#092328] to-[#12544F] text-white rounded-3xl p-6 shadow-md">
              <FileCheck2 className="w-8 h-8 text-emerald-400 mb-3" />
              <h4 className="text-base font-black mb-1">Verify Your 096 Line</h4>
              <p className="text-sm text-white/80 leading-relaxed mb-4">
                Already registered? Upload your NID or Trade License in seconds for instant line activation.
              </p>
              <Link
                to="/user/profile"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-white text-[#092328] rounded-xl text-sm font-black hover:bg-emerald-50 transition"
              >
                <span>Submit KYC Documents</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Tab Content Display Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. BTRC Licensing Tab */}
            {activeTab === 'btrc_info' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#12544F] bg-[#12544F]/10 px-3 py-1 rounded-full">
                    {btrcSection.content_json?.eyebrow || 'REGULATORY COMPLIANCE'}
                  </span>
                  <h2 className="text-2xl font-black text-[#092328] mt-3">
                    {btrcSection.title}
                  </h2>
                  <p className="text-sm sm:text-sm text-slate-500 mt-1">
                    {btrcSection.subtitle}
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-sm text-slate-700 leading-relaxed">
                  {btrcSection.content}
                </div>

                {/* Operator Interconnection Grid */}
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-3">
                    Nationwide Interconnected Carriers
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(btrcSection.content_json?.interconnect_operators || [
                      'Grameenphone',
                      'Banglalink',
                      'Robi Axiata',
                      'Teletalk',
                      'BTCL Landline',
                    ]).map((op, i) => (
                      <div
                        key={i}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-700 shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{op}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* License Details Box */}
                <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-black text-[#12544F] uppercase tracking-wider">
                      Official License Reference
                    </div>
                    <div className="text-sm font-mono font-bold text-[#092328]">
                      {btrcSection.content_json?.license_number || 'BTRC/LL/IPTSP/2023-096'}
                    </div>
                  </div>
                  <a
                    href="https://btrc.gov.bd"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#12544F] text-white rounded-xl text-sm font-bold hover:bg-[#0c3935] transition shrink-0"
                  >
                    <span>Verify at BTRC Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            )}

            {/* 2. KYC Verification Tab */}
            {activeTab === 'kyc_verification' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#12544F] bg-[#12544F]/10 px-3 py-1 rounded-full">
                    {kycSection.content_json?.eyebrow || 'MANDATORY SUBSCRIBER ONBOARDING'}
                  </span>
                  <h2 className="text-2xl font-black text-[#092328] mt-3">
                    {kycSection.title}
                  </h2>
                  <p className="text-sm sm:text-sm text-slate-500 mt-1">
                    {kycSection.subtitle}
                  </p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-900 leading-relaxed flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>BTRC Notice:</strong> Incomplete or fraudulent KYC submissions will result in immediate rejection and permanent number suspension under Bangladesh Telecom Security Act.
                  </span>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(kycSection.content_json?.documents || DEFAULT_SECTIONS[1].content_json.documents).map((docGroup, i) => (
                    <div key={i} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-[#12544F]/10 text-[#12544F] flex items-center justify-center">
                            {docGroup.type.includes('Corporate') ? <Building2 className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </div>
                          <h4 className="font-bold text-sm text-[#092328]">{docGroup.type}</h4>
                        </div>
                        <ul className="space-y-2">
                          {docGroup.requirements.map((req, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 3. Responsible Usage Tab */}
            {activeTab === 'responsible_usage' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#12544F] bg-[#12544F]/10 px-3 py-1 rounded-full">
                    {usageSection.content_json?.eyebrow || 'SAFE & COMPLIANT TELEPHONY'}
                  </span>
                  <h2 className="text-2xl font-black text-[#092328] mt-3">
                    {usageSection.title}
                  </h2>
                  <p className="text-sm sm:text-sm text-slate-500 mt-1">
                    {usageSection.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(usageSection.content_json?.rules || DEFAULT_SECTIONS[2].content_json.rules).map((rule, idx) => (
                    <div key={idx} className="p-5 border border-slate-200 rounded-2xl bg-white hover:border-[#12544F]/30 transition shadow-2xs">
                      <h4 className="font-black text-sm text-[#092328] mb-1.5 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        {rule.title}
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {rule.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 4. Privacy & Security Tab */}
            {activeTab === 'privacy_security' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#12544F] bg-[#12544F]/10 px-3 py-1 rounded-full">
                    {securitySection.content_json?.eyebrow || 'ENTERPRISE DATA PROTECTION'}
                  </span>
                  <h2 className="text-2xl font-black text-[#092328] mt-3">
                    {securitySection.title}
                  </h2>
                  <p className="text-sm sm:text-sm text-slate-500 mt-1">
                    {securitySection.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(securitySection.content_json?.features || DEFAULT_SECTIONS[3].content_json.features).map((feat, idx) => (
                    <div key={idx} className="p-5 border border-slate-200 rounded-2xl bg-white hover:border-[#12544F]/30 transition shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center mb-3">
                        <Lock className="w-4 h-4" />
                      </div>
                      <h4 className="font-black text-sm text-[#092328] mb-1.5">
                        {feat.title}
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 5. Legal Documents Tab */}
            {activeTab === 'legal_policies' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#12544F] bg-[#12544F]/10 px-3 py-1 rounded-full">
                    {legalSection.content_json?.eyebrow || 'LEGAL DISCLOSURES'}
                  </span>
                  <h2 className="text-2xl font-black text-[#092328] mt-3">
                    {legalSection.title}
                  </h2>
                  <p className="text-sm sm:text-sm text-slate-500 mt-1">
                    {legalSection.subtitle}
                  </p>
                </div>

                {/* Sub-Tabs for Terms, Privacy, Refund */}
                <div className="flex gap-2 border-b border-slate-200 pb-2">
                  {(legalSection.content_json?.policies || DEFAULT_SECTIONS[4].content_json.policies).map((p) => {
                    const isSelected = activeLegalDoc === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setActiveLegalDoc(p.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                          isSelected
                            ? 'bg-[#12544F] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {p.title.split(' ')[0]} Policy
                      </button>
                    );
                  })}
                </div>

                {/* Selected Policy Reader */}
                {(() => {
                  const policies = legalSection.content_json?.policies || DEFAULT_SECTIONS[4].content_json.policies;
                  const currentDoc = policies.find((p) => p.id === activeLegalDoc) || policies[0];
                  return (
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <h3 className="font-bold text-base text-[#092328]">{currentDoc.title}</h3>
                        <span className="text-[11px] text-slate-400 font-medium">Last updated: {currentDoc.last_updated}</span>
                      </div>
                      <p className="text-sm sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {currentDoc.content}
                      </p>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceBtrc;

