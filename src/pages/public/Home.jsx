import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Phone,
  CreditCard,
  Radio,
  Layers,
  Smartphone,
  Headphones,
  Bot,
  Clock3,
  Zap,
  FileAudio,
  Sparkles,
  Shield,
  WalletCards,
  PhoneCall,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import API from "../../services/api";
import heroIllustration from "../../assets/banner1.png";
import cloudPbxIcon from "../../assets/cloud-pbx-icon.png";
import ipPhoneIcon from "../../assets/ip-phone-icon.png";
import { ClientBrandSlider } from "../../components/home/ClientBrandSlider";

const API_ROOT = String(
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");
const mediaUrl = (value, fallback = "") => {
  if (!value) return fallback;
  if (/^(https?:\/\/|data:|blob:)/i.test(value)) return value;
  if (value.startsWith("/uploads/")) return `${API_ROOT}${value}`;
  return value;
};
const parsePayload = (value) => {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};
const ICONS = {
  Layers,
  CreditCard,
  Smartphone,
  Headphones,
  Bot,
  Clock3,
  Zap,
  ShieldCheck,
  FileAudio,
  Radio,
  Sparkles,
  Shield,
  WalletCards,
  PhoneCall,
  BadgeCheck,
};
const iconFor = (name, fallback = ShieldCheck) => ICONS[name] || fallback;

const DEFAULT_ORDER = [
  "hero",
  "service_cards",
  "offerings",
  "advantages",
  "packages",
  "clients",
  "addons",
  "faq",
  "cta",
];
const FALLBACK_HERO = [
  {
    id: "h1",
    title: "Keep Your Team Connected Everywhere.",
    description:
      "Connect employees, customers, and teams through a unified business communication platform built for seamless collaboration.",
    image_url: "/uploads/cms/banner2.png",
    meta: "NEXT-GEN IP PBX & AI VOICE PLATFORM",
    payload: {
      eyebrow: "NEXT-GEN IP PBX & AI VOICE PLATFORM",
      primary_text: "Get Started",
      primary_url: "/register",
      secondary_text: "Explore Packages",
      secondary_url: "/packages",
      badges: ["BTRC IPTSP Telecom", "Min Easy Recharge", "Uptime Guarantee"],
    },
  },
  {
    id: "h2",
    title: "Reliable IP Calling for Modern Businesses.",
    description:
      "Get your dedicated 096 IP phone number, recharge your wallet, manage monthly plans, and run AI voice campaigns from one modern platform.",
    image_url: "/uploads/cms/banner1.png",
    meta: "UNIFIED TELECOM + AI CALLING PLATFORM",
    payload: {
      eyebrow: "UNIFIED TELECOM + AI CALLING PLATFORM",
      primary_text: "Explore Packages",
      primary_url: "/packages",
      secondary_text: "Explore AI Calling",
      secondary_url: "/ai-calling",
      badges: ["Verified 096 IP services", "DGePay online payments"],
    },
  },
  {
    id: "h3",
    title: "Smarter Cloud Communication.",
    description:
      "Manage calls, teams, and customer interactions with cloud PBX and intelligent communication solutions from anywhere.",
    image_url: "/uploads/cms/banner3.png",
    meta: "AI VOICE & CLOUD PBX AUTOMATION",
    payload: {
      eyebrow: "AI VOICE & CLOUD PBX AUTOMATION",
      primary_text: "Get Started",
      primary_url: "/register",
      secondary_text: "Explore AI Calling",
      secondary_url: "/ai-calling",
      badges: ["AI Calling", "Cloud PBX", "Smart Routing"],
    },
  },
];
const FALLBACK_CARDS = [
  {
    id: "c1",
    title: "Cloud PBX",
    description:
      "Manage your business calls with a powerful cloud-based PBX system. Connect your team, manage extensions, and handle calls from anywhere.",
    image_url: "/uploads/cms/cloud-pbx-icon.png",
    link_url: "/features",
    payload: { label: "Learn More" },
  },
  {
    id: "c2",
    title: "AI Calling",
    description:
      "Automate customer conversations with intelligent AI voice calling. Handle repetitive calls and deliver faster, smarter customer support.",
    image_url: "/uploads/cms/ai-calling-icon.png",
    link_url: "/ai-calling",
    payload: { label: "Learn More" },
  },
  {
    id: "c3",
    title: "096 IP Number",
    description:
      "Get your dedicated 096 IP number for professional business communication with easy activation, affordable calling, and reliable connectivity.",
    image_url: "/uploads/cms/096-ip-number-icon.png",
    link_url: "/ip-phone",
    payload: { label: "Learn More" },
  },
  {
    id: "c4",
    title: "IP Phone",
    description:
      "Stay connected with reliable IP phones designed for modern businesses, call centers, and professional communication.",
    image_url: "/uploads/cms/ip-phone-icon.png",
    link_url: "/shop",
    payload: { label: "Learn More" },
  },
];
const FALLBACK_ADVANTAGES = [
  [
    "Unified Platform",
    "Manage IP Phone extensions and automated AI Calling campaigns under one unified dashboard.",
    "Layers",
  ],
  [
    "Easy Online Recharge",
    "Instant top-ups from ৳100 up to ৳10,000 using bKash, Nagad, Rocket, or Visa/Mastercard.",
    "CreditCard",
  ],
  [
    "Multi-Device Access",
    "Connect seamlessly across Android apps, Windows PCs, laptops, and hardware SIP phones.",
    "Smartphone",
  ],
  [
    "Cloud Call Recording",
    "Secure, encrypted call archives with in-browser playback for compliance and training.",
    "Headphones",
  ],
  [
    "AI Bangla Voice Bot",
    "Natural neural text-to-speech engine delivering human-like Bangla outbound call campaigns.",
    "Bot",
  ],
  [
    "24/7 Ticketing Helpdesk",
    "Dedicated Bangladeshi telecom engineers ready to assist with SIP setup and routing.",
    "Clock3",
  ],
  [
    "Zero Hardcoded Limits",
    "100% scalable cloud architecture with flexible add-ons in our digital service marketplace.",
    "Zap",
  ],
  [
    "BTRC Telecom Grade",
    "Official licensed IPTSP routing ensuring crystal-clear audio and 99.9% uptime reliability.",
    "ShieldCheck",
  ],
].map(([title, description, icon], i) => ({
  id: `a${i}`,
  title,
  description,
  icon,
  sort_order: i + 1,
}));
const FALLBACK_ADDONS = [
  [
    "Caller Tune",
    "Play custom corporate brand greeting audio to incoming callers.",
    "৳99/mo",
    "Radio",
  ],
  [
    "Cloud Recording",
    "Encrypted 90-day archive with web playback & MP3 download.",
    "৳199/mo",
    "FileAudio",
  ],
  [
    "5 Extra Devices",
    "Connect 5 additional Android or PC SIP softphones to your line.",
    "৳300/mo",
    "Smartphone",
  ],
  [
    "VIP 096 Number",
    "Memorable repeating digit premium business hotline number.",
    "৳999 one-time",
    "Sparkles",
  ],
].map(([title, description, meta, icon], i) => ({
  id: `ad${i}`,
  title,
  description,
  meta,
  icon,
  sort_order: i + 1,
}));

function AutoSlider({ items, renderItem, interval = 4500, dots = true }) {
  const [index, setIndex] = useState(0);
  const start = useRef(null);
  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(
      () => setIndex((x) => (x + 1) % items.length),
      interval
    );
    return () => clearInterval(t);
  }, [items.length, interval]);
  const safe = Math.min(index, Math.max(items.length - 1, 0));
  return (
    <div
      className="relative overflow-hidden"
      onTouchStart={(e) => {
        start.current = e.touches?.[0]?.clientX;
      }}
      onTouchEnd={(e) => {
        if (start.current == null) return;
        const d = e.changedTouches?.[0]?.clientX - start.current;
        start.current = null;
        if (Math.abs(d) > 45)
          setIndex((x) => (x + (d < 0 ? 1 : -1) + items.length) % items.length);
      }}
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${safe * 100}%)` }}
      >
        {items.map((item, i) => (
          <div key={item.id ?? i} className="w-full shrink-0">
            {renderItem(item, i)}
          </div>
        ))}
      </div>
      {dots && items.length > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === safe ? "w-8 bg-[#12544F]" : "w-2 bg-[#8BBB92]"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const Home = () => {
  const [data, setData] = useState({
    config: {},
    sections: [],
    collections: {},
  });
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [packageTab, setPackageTab] = useState("ip_phone");
  useEffect(() => {
    let live = true;
    (async () => {
      const [cms, pkg] = await Promise.allSettled([
        API.get("/cms/public/home"),
        API.get("/packages"),
      ]);
      if (!live) return;
      if (cms.status === "fulfilled") setData(cms.value.data || {});
      if (pkg.status === "fulfilled")
        setPackages(pkg.value.data?.packages || []);
      setLoading(false);
    })().catch(() => setLoading(false));
    return () => {
      live = false;
    };
  }, []);
  const home = data.config?.home_config || {};
  const visible = {
    hero: true,
    service_cards: true,
    offerings: true,
    clients: true,
    advantages: true,
    packages: true,
    addons: true,
    faq: true,
    cta: true,
    ...(home.section_visibility || {}),
  };
  const titles = useMemo(() => {
    const next = { ...(home.section_titles || {}) };
    (data.sections || []).forEach((section) => {
      if (section?.title) next[section.section_key] = section.title;
    });
    return next;
  }, [home.section_titles, data.sections]);
  const sectionSubtitles = useMemo(() => {
    const next = {};
    (data.sections || []).forEach((section) => {
      if (section?.subtitle) next[section.section_key] = section.subtitle;
    });
    return next;
  }, [data.sections]);
  const c = data.collections || {};
  const slides = c.home_hero_slides?.length
    ? c.home_hero_slides
    : FALLBACK_HERO;
  const cards = c.home_service_cards?.length
    ? c.home_service_cards
    : FALLBACK_CARDS;
  const offerings = c.home_offerings || [];
  const advantages = c.home_advantages?.length
    ? c.home_advantages
    : FALLBACK_ADVANTAGES;
  const addons = c.home_addons?.length ? c.home_addons : FALLBACK_ADDONS;
  const clientList = useMemo(() => {
    const fromCMS = c.home_clients?.length
      ? c.home_clients
      : c.cloud_pbx_clients?.length
      ? c.cloud_pbx_clients
      : [];
    if (fromCMS.length) return fromCMS;
    return [
      { id: "cl-1", title: "OTHORBD", image_url: "/assets/clients/imgi_100_my_buy_bd.jpg" },
      { id: "cl-2", title: "Inotech", image_url: "/assets/clients/imgi_102_rtpu.png" },
      { id: "cl-3", title: "Zirconia Shop", image_url: "/assets/clients/imgi_104_esodai-dot-com.png" },
      { id: "cl-4", title: "Bd Marriage", image_url: "/assets/clients/imgi_113_bahok-courier-Limited.png" },
      { id: "cl-5", title: "Rokomary Shop", image_url: "/assets/clients/imgi_143_kids-gallery-shop.png" },
      { id: "cl-6", title: "TOP N SHOP BD", image_url: "/assets/clients/imgi_152_dhaka-web-host.png" },
      { id: "cl-7", title: "Kids Gallery Shop", image_url: "/assets/clients/imgi_188_kids-gallery-shop.png" },
      { id: "cl-8", title: "Chorki", image_url: "/assets/clients/imgi_154_Staller-Digital-Limited.jpg" },
    ];
  }, [c.home_clients, c.cloud_pbx_clients]);

  // Clients 2-Row Carousel Slider State
  const [clientPage, setClientPage] = useState(0);
  const [isClientPaused, setIsClientPaused] = useState(false);
  const clientTouchStart = useRef(null);

  // Group client items into pairs for 2-row layout per column
  const clientColumns = useMemo(() => {
    const cols = [];
    for (let i = 0; i < clientList.length; i += 2) {
      cols.push([clientList[i], clientList[i + 1]].filter(Boolean));
    }
    return cols;
  }, [clientList]);

  // 5 columns per slide page (5 cols * 2 rows = 10 items)
  const colsPerPage = 5;
  const totalClientPages = Math.max(1, Math.ceil(clientColumns.length / colsPerPage));

  const prevClientSlide = () => {
    setClientPage((prev) => (prev === 0 ? totalClientPages - 1 : prev - 1));
  };

  const nextClientSlide = () => {
    setClientPage((prev) => (prev + 1) % totalClientPages);
  };

  // Auto-play clients carousel with hover pause
  useEffect(() => {
    if (totalClientPages <= 1 || isClientPaused) return;
    const timer = setInterval(() => {
      setClientPage((prev) => (prev + 1) % totalClientPages);
    }, 4500);
    return () => clearInterval(timer);
  }, [totalClientPages, isClientPaused]);

  const sectionRows = useMemo(() => {
    const rows = (data.sections || [])
      .slice()
      .sort(
        (a, b) =>
          Number(a.sort_order) - Number(b.sort_order) ||
          Number(a.id) - Number(b.id)
      );
    // cms_sections is the single source of truth for section order/lifecycle.
    // Never recreate a section that an admin has hidden or deleted.
    return rows.length
      ? rows.map((x) => x.section_key).filter(Boolean)
      : DEFAULT_ORDER;
  }, [data.sections]);
  const pricing = useMemo(
    () =>
      packages.filter(
        (p) => p.status !== "inactive" && p.service_type === packageTab
      ),
    [packages, packageTab]
  );

  const renderHero = () => (
    <>
      <section className="relative overflow-hidden bg-[#e8f8f2] min-h-[520px] sm:min-h-[560px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(42,131,95,.16),transparent_30%),linear-gradient(180deg,#eaf9f4,#d8f4ea)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-10 pb-10">
          <AutoSlider
            items={slides}
            renderItem={(slide) => {
              const p = parsePayload(slide.payload);
              const eyebrow =
                p.eyebrow ||
                slide.meta ||
                "NEXT-GEN IP PBX & AI VOICE PLATFORM";
              return (
                <div className="grid lg:grid-cols-2 items-center gap-5 lg:gap-12 min-h-[430px]">
                  <div className="lg:hidden order-1 col-span-full">
                    <div className="inline-flex items-center gap-2 text-[10px] sm:text-sm font-black uppercase tracking-[.13em] text-[#176454]">
                      <span className="w-7 h-[2px] bg-[#2A835F]" />
                      {eyebrow}
                    </div>
                  </div>
                  <div className="max-w-2xl order-3 lg:order-1">
                    <div className="hidden lg:inline-flex items-center gap-2 text-[10px] sm:text-sm font-black uppercase tracking-[.13em] text-[#176454]">
                      <span className="w-7 h-[2px] bg-[#2A835F]" />
                      {eyebrow}
                    </div>
                    <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[58px] leading-[1.02] font-black tracking-tight text-[#092328]">
                      {slide.title}
                    </h1>
                    <p className="mt-5 text-sm sm:text-base leading-7 text-slate-600 max-w-xl">
                      {slide.description}
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link
                        to={p.primary_url || "/packages"}
                        className="px-6 py-3.5 rounded-xl bg-[#12544F] text-white text-sm font-black shadow-sm"
                      >
                        {p.primary_text || "Get Started"}{" "}
                        <ArrowRight className="inline w-4 h-4 ml-1" />
                      </Link>
                      <Link
                        to={p.secondary_url || "/packages"}
                        className="px-6 py-3.5 rounded-xl bg-white text-[#12544F] border border-[#2A835F]/50 text-sm font-black"
                      >
                        {p.secondary_text || "Explore Packages"}{" "}
                        <ArrowRight className="inline w-4 h-4 ml-1" />
                      </Link>
                    </div>
                    <div className="mt-7 grid grid-cols-3 gap-3 max-w-lg">
                      {(p.badges || []).slice(0, 3).map((b, i) => {
                        const I =
                          [Phone, CreditCard, ShieldCheck][i] || ShieldCheck;
                        return (
                          <div
                            key={i}
                            className="flex items-center gap-2 min-w-0"
                          >
                            <span className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shrink-0">
                              <I className="w-4 h-4 text-[#12544F]" />
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 leading-tight">
                              {b}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="hero-slide-image flex items-center justify-center min-h-[220px] order-2 lg:order-2">
                    <img
                      src={mediaUrl(
                        parsePayload((data.sections || []).find((x) => x.section_key === "hero")?.settings).image_url || slide.image_url,
                        heroIllustration
                      )}
                      alt={slide.title}
                      className="hero-slide-image w-full max-w-[610px] max-h-[380px] object-contain drop-shadow-[0_25px_35px_rgba(9,35,40,.10)]"
                    />
                  </div>
                </div>
              );
            }}
            interval={5200}
          />
        </div>
      </section>
    </>
  );

  const renderServiceCards = () => (
    <section className="home-service-slider relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 lg:-mt-10 bg-transparent">
      <div className="hidden lg:grid lg:grid-cols-4 gap-5">
        {cards.slice(0, 4).map((card) => (
          <ServiceCard key={card.id} card={card} />
        ))}
      </div>
      <div className="lg:hidden">
        <AutoSlider
          items={cards.slice(0, 4)}
          interval={3400}
          renderItem={(card) => (
            <div className="px-1">
              <ServiceCard card={card} />
            </div>
          )}
        />
      </div>
    </section>
  );

  const renderOfferings = () => (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <SectionHeading
        eyebrow="OUR CORE OFFERINGS"
        title={
          titles.offerings ||
          "Two Powerful Telecom Services. One Seamless Platform."
        }
        subtitle={
          sectionSubtitles.offerings ||
          home.offerings_subtitle ||
          "Choose between dedicated corporate IP telephony and automated AI voice campaigns — or leverage both under a single dashboard."
        }
      />
      {/* <div className="grid lg:grid-cols-2 gap-6">
        {offerings.slice(0, 2).map((item) => {
          const p = parsePayload(item.payload);
          return (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8 shadow-sm"
            >
              <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-[#eef8f4]" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0f5c54] flex items-center justify-center shrink-0">
                  <img
                    src={mediaUrl(item.image_url, ipPhoneIcon)}
                    alt=""
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[.12em] text-[#2A835F]">
                    {item.meta || "CATEGORY"}
                  </div>
                  <h3 className="mt-1 text-2xl font-black text-[#092328]">
                    {item.title}
                  </h3>
                </div>
              </div>
              <p className="relative mt-5 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
              <ul className="relative mt-5 space-y-2.5">
                {(p.features || []).map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#2A835F] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={p.button_url || item.link_url || "/features"}
                className="relative mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#12544F] text-white font-black text-sm"
              >
                {p.button_text || "Explore"} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div> */}

      <div className="grid lg:grid-cols-2 gap-6">
        {offerings.slice(0, 2).map((item) => {
          const p = parsePayload(item.payload);

          return (
            <div
              key={item.id}
              className="
          group relative overflow-hidden
          rounded-[2rem]
          border border-slate-200
          bg-white
          p-7 sm:p-8
          shadow-sm
          transition-all duration-500 ease-in-out
          hover:border-[#2A835F]
          hover:shadow-lg
        "
            >
              {/* Decorative rounded circle */}
              <div
                className="
            absolute -top-20 -right-20
            w-48 h-48
            rounded-full
            bg-[#eef8f4]
            transition-all duration-700 ease-in-out
            group-hover:w-60
            group-hover:h-60
            group-hover:-top-24
            group-hover:-right-24
          "
              />

              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0f5c54] flex items-center justify-center shrink-0">
                  <img
                    src={mediaUrl(item.image_url, ipPhoneIcon)}
                    alt=""
                    className="w-8 h-8 object-contain"
                  />
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase tracking-[.12em] text-[#2A835F]">
                    {item.meta || "CATEGORY"}
                  </div>

                  <h3 className="mt-1 text-2xl font-black text-[#092328]">
                    {item.title}
                  </h3>
                </div>
              </div>

              <p className="relative mt-5 text-sm leading-7 text-slate-600">
                {item.description}
              </p>

              <ul className="relative mt-5 space-y-2.5">
                {(p.features || []).map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#2A835F] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to={p.button_url || item.link_url || "/features"}
                className="
            relative mt-6 inline-flex items-center gap-2
            px-5 py-3
            rounded-xl
            bg-[#12544F]
            text-white
            font-black text-sm
            transition-all duration-300
            group-hover:bg-[#0f665d]
          "
              >
                {p.button_text || "Explore"}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );

  const renderClients = () => {
    return (
      <ClientBrandSlider
        title={titles.clients || "Clients We Have Helped with PBX"}
        subtitle={
          sectionSubtitles.clients ||
          home.clients_subtitle ||
          "Teams and businesses across Bangladesh manage their business communication with MyBDPhone."
        }
      />
    );
  };

  const renderAdvantages = () => (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <SectionHeading
        eyebrow="THE MYBDPHONE ADVANTAGE"
        title={titles.advantages || "Why Businesses Across Bangladesh Trust Us"}
        subtitle={
          sectionSubtitles.advantages ||
          home.advantages_subtitle ||
          "Engineered for low latency, maximum telecom compliance, and intelligent voice scalability."
        }
      />
      {/* <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {advantages.slice(0, 8).map((item) => {
          const I = iconFor(item.icon);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#eaf4f1] flex items-center justify-center">
                <I className="w-5 h-5 text-[#12544F]" />
              </div>
              <h3 className="mt-4 text-sm font-black text-[#092328]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm sm:text-sm leading-6 text-slate-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div> */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {advantages.slice(0, 8).map((item) => {
          const I = iconFor(item.icon);

          return (
            <div
              key={item.id}
              className="
          group
          bg-white
          rounded-2xl
          border border-slate-200
          p-5 sm:p-6
          shadow-sm
          transition-all duration-300
          hover:shadow-lg
        "
            >
              <div
                className="
            w-10 h-10
            rounded-xl
            bg-[#eaf4f1]
            flex items-center justify-center
            transition-all duration-300
            group-hover:bg-[#12544F]
          "
              >
                <I
                  className="
              w-5 h-5
              text-[#12544F]
              transition-colors duration-300
              group-hover:text-white
            "
                />
              </div>

              <h3 className="mt-4 text-sm font-black text-[#092328]">
                {item.title}
              </h3>

              <p className="mt-2 text-sm sm:text-sm leading-6 text-slate-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );

  const renderPackages = () => (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <SectionHeading
        eyebrow="TRANSPARENT PRICING"
        title={
          titles.packages || "Choose the Perfect Package for Your Business"
        }
        subtitle={
          sectionSubtitles.packages ||
          home.packages_subtitle ||
          "All prices and features are dynamically managed. No hidden fees."
        }
      />
      <div className="flex justify-center mb-7">
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setPackageTab("ip_phone")}
            className={`px-5 py-2 rounded-lg text-sm font-black ${
              packageTab === "ip_phone"
                ? "bg-[#12544F] text-white"
                : "text-slate-500"
            }`}
          >
            <Phone className="inline w-3.5 h-3.5 mr-1" />
            IP Phone Packages
          </button>
          <button
            onClick={() => setPackageTab("ai_calling")}
            className={`px-5 py-2 rounded-lg text-sm font-black ${
              packageTab === "ai_calling"
                ? "bg-[#12544F] text-white"
                : "text-slate-500"
            }`}
          >
            <Bot className="inline w-3.5 h-3.5 mr-1" />
            AI Calling Packages
          </button>
        </div>
      </div>
      {pricing.length ? (
        <>
          <div className="hidden md:grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {pricing.slice(0, 2).map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} dark={i === 1} />
            ))}
          </div>
          <div className="md:hidden max-w-md mx-auto mobile-package-slider">
            <AutoSlider
              items={pricing.slice(0, 2)}
              interval={4200}
              renderItem={(pkg, i) => (
                <div className="px-1 pb-1">
                  <PackageCard pkg={pkg} dark={i === 1} />
                </div>
              )}
            />
          </div>
        </>
      ) : (
        <div className="text-center text-sm text-slate-500">
          No active packages available right now.
        </div>
      )}
    </section>
  );

  const renderAddons = () => (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[.13em] text-[#2A835F]">
              ADD-ONS & UPGRADES
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black text-[#092328]">
              {titles.addons || "Digital Phone Services Marketplace"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {sectionSubtitles.addons ||
                home.addons_subtitle ||
                "Enhance your 096 line with caller tunes, extra device licenses, VIP numbers, and recording storage."}
            </p>
          </div>
          <Link to="/shop" className="text-sm font-black text-[#12544F]">
            View All Add-ons <ArrowRight className="inline w-4 h-4" />
          </Link>
        </div>
        {/* <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
          {addons.slice(0, 4).map((item) => {
            const I = iconFor(item.icon, Sparkles);
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 p-5 bg-[#fbfdfc]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#eaf4f1] flex items-center justify-center">
                  <I className="w-5 h-5 text-[#2A835F]" />
                </div>
                <h3 className="mt-4 font-black text-[#092328]">{item.title}</h3>
                <p className="mt-2 text-sm leading-5 text-slate-500 min-h-[40px]">
                  {item.description}
                </p>
                <div className="mt-5 text-sm font-black text-[#12544F]">
                  {item.meta}
                </div>
              </div>
            );
          })}
        </div> */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
          {addons.slice(0, 4).map((item) => {
            const I = iconFor(item.icon, Sparkles);

            return (
              <div
                key={item.id}
                className="
          group
          rounded-2xl
          border border-slate-200
          p-5
          bg-[#fbfdfc]
          transition-all duration-300
          hover:border-[#2A835F]
          hover:shadow-lg
        "
              >
                <div
                  className="
            w-10 h-10
            rounded-xl
            bg-[#eaf4f1]
            flex items-center justify-center
            transition-all duration-300
            group-hover:bg-[#12544F]
          "
                >
                  <I
                    className="
              w-5 h-5
              text-[#2A835F]
              transition-colors duration-300
              group-hover:text-white
            "
                  />
                </div>

                <h3 className="mt-4 font-black text-[#092328]">{item.title}</h3>

                <p className="mt-2 text-sm leading-5 text-slate-500 min-h-[40px]">
                  {item.description}
                </p>

                <div className="mt-5 text-sm font-black text-[#12544F]">
                  {item.meta}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  const renderFaq = () => {
    if (!c.faq?.length) return null;
    return (
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-2">
        <SectionHeading
          eyebrow="HELP CENTER"
          title={titles.faq || "Frequently Asked Questions"}
          subtitle={
            home.faq_subtitle ||
            "Answers to common questions about MyBDPhone IP telephony, packages, recharge and AI calling."
          }
        />
        <div className="space-y-3">
          {c.faq.map((item, i) => {
            const p = parsePayload(item.payload);
            const answer =
              p.answer ||
              item.description ||
              item.content_html ||
              "Our support team can help you with this question.";
            return (
              <details
                key={item.id || i}
                className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-sm sm:text-base font-black text-[#092328]">
                  <span>{item.title}</span>
                  <span className="text-[#12544F] text-xl leading-none transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="pt-3 text-sm leading-6 text-slate-600">
                  {/<\/?[a-z][\s\S]*>/i.test(String(answer)) ? (
                    <div dangerouslySetInnerHTML={{ __html: String(answer) }} />
                  ) : (
                    answer
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </section>
    );
  };

  const renderCta = () => (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
      <div className="relative overflow-hidden rounded-[2rem] border border-[#8BBB92]/40 bg-[#eaf8f3] p-7 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="absolute -right-20 -bottom-28 w-72 h-72 rounded-full bg-[#9ee2cb]/35" />
        <div className="relative text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl font-black text-[#092328]">
            {titles.cta || "Ready to Upgrade Your Business Telephony?"}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            {sectionSubtitles.cta ||
              home.cta_subtitle ||
              "Get your 096 IP number within 5 minutes or launch your first automated AI voice campaign today."}
          </p>
        </div>
        <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            to="/register"
            className="px-7 py-3.5 rounded-xl bg-[#12544F] text-white text-sm font-black"
          >
            Create Free Account
          </Link>
          <Link
            to="/contact"
            className="px-7 py-3.5 rounded-xl bg-white border-2 border-[#2A835F] text-[#12544F] text-sm font-black"
          >
            Speak with Sales
          </Link>
        </div>
      </div>
    </section>
  );

  const renderCustomSection = (key) => {
    const section = (data.sections || []).find((x) => x.section_key === key);
    if (!section || section.status !== "active") return null;
    const settings = parsePayload(section.settings);
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-10 shadow-sm">
          {settings.image_url && (
            <div className="mb-6 flex justify-center">
              <img
                src={mediaUrl(settings.image_url)}
                alt={section.title || ""}
                className="max-h-72 max-w-full object-contain rounded-2xl"
              />
            </div>
          )}
          {section.title && (
            <h2 className="text-3xl sm:text-4xl font-black text-[#092328]">
              {section.title}
            </h2>
          )}
          {section.subtitle && (
            <p className="mt-2 text-slate-500">{section.subtitle}</p>
          )}
          {section.content_html && (
            <div
              className="mt-5 prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: section.content_html }}
            />
          )}
        </div>
      </section>
    );
  };

  const renderSection = (key) => {
    const cmsSection = (data.sections || []).find((x) => x.section_key === key);
    if (cmsSection ? cmsSection.status !== "active" : visible[key] === false)
      return null;
    let rendered = null;
    switch (key) {
      case "hero":
        rendered = renderHero();
        break;
      case "service_cards":
        rendered = renderServiceCards();
        break;
      case "offerings":
        rendered = offerings.length ? renderOfferings() : null;
        break;
      case "clients":
        rendered = renderClients();
        break;
      case "advantages":
        rendered = renderAdvantages();
        break;
      case "packages":
        rendered = renderPackages();
        break;
      case "addons":
        rendered = renderAddons();
        break;
      case "faq":
        rendered = renderFaq();
        break;
      case "cta":
        rendered = renderCta();
        break;
      default:
        rendered = renderCustomSection(key);
    }
    if (!rendered) return null;
    return <div>{rendered}</div>;
  };
  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        Loading MyBDPhone…
      </div>
    );
  return (
    <main className="home-page w-full overflow-x-hidden bg-[#f7fafb] pb-8">
      {sectionRows.map((key) => (
        <React.Fragment key={key}>{renderSection(key)}</React.Fragment>
      ))}
    </main>
  );
};

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-9">
      <span className="inline-flex px-3 py-1 rounded-full bg-[#e8f4f1] text-[#2A835F] text-[10px] font-black tracking-[.13em] uppercase">
        {eyebrow}
      </span>
      <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-[#092328]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}
function ServiceCard({ card }) {
  const p = parsePayload(card.payload);
  return (
    <Link
      to={card.link_url || "/features"}
      className="group bg-white rounded-2xl border-t-4 border-t-[#2A835F] border-x border-b border-slate-200 shadow-sm px-6 py-6 min-h-[275px] flex flex-col items-center text-center hover:-translate-y-1 transition-transform"
    >
      <div className="w-20 h-20 rounded-full bg-[#dcf5ee] flex items-center justify-center overflow-hidden">
        <img
          src={mediaUrl(card.image_url, cloudPbxIcon)}
          alt={card.title}
          className="w-14 h-14 object-contain"
        />
      </div>
      <h3 className="mt-4 text-lg font-black text-[#092328]">{card.title}</h3>
      <p className="mt-2 text-sm text-slate-500 leading-6 line-clamp-4">
        {card.description}
      </p>
      <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-black text-[#12544F]">
        {p.label || "Learn More"}{" "}
        <span className="w-5 h-5 rounded-full bg-[#e8f4f1] flex items-center justify-center">
          <ArrowRight className="w-3 h-3" />
        </span>
      </span>
    </Link>
  );
}
function PackageCard({ pkg, dark }) {
  const features = Array.isArray(pkg.features)
    ? pkg.features
    : typeof pkg.features === "string"
    ? pkg.features
        .split(/\n|,/)
        .map((x) => x.trim())
        .filter(Boolean)
    : [];
  return (
    <div
      className={`relative rounded-[1.6rem] border p-6 sm:p-7 min-h-[400px] flex flex-col ${
        dark
          ? "bg-[#073f3d] border-[#2A835F] text-white shadow-xl"
          : "bg-white border-slate-200 text-[#092328] shadow-sm"
      }`}
    >
      {dark && (
        <span className="absolute -top-3 right-8 px-3 py-1 rounded-full bg-[#2A835F] text-white text-[10px] font-black">
          Most Popular
        </span>
      )}
      {!dark && (
        <span className="absolute -top-3 right-8 px-3 py-1 rounded-full bg-[#2A835F] text-white text-[10px] font-black">
          Starter Choice
        </span>
      )}
      <h3 className="text-2xl font-black">{pkg.name || pkg.title}</h3>
      <p
        className={`mt-2 text-sm leading-5 ${
          dark ? "text-slate-200" : "text-slate-500"
        }`}
      >
        {pkg.description ||
          "Professional business communication package with multi-device access."}
      </p>
      <div
        className={`mt-5 text-3xl font-black ${
          dark ? "text-[#9bd7ad]" : "text-[#7dbb8f]"
        }`}
      >
        ৳{Number(pkg.price || 0).toLocaleString()}
        <span
          className={`text-sm font-semibold ml-1 ${
            dark ? "text-slate-300" : "text-slate-500"
          }`}
        >
          /monthly
        </span>
      </div>
      <div
        className={`mt-5 pt-4 border-t space-y-2.5 flex-1 ${
          dark ? "border-white/10" : "border-slate-100"
        }`}
      >
        {features.slice(0, 9).map((f, i) => (
          <div
            key={i}
            className={`flex gap-2 text-sm ${
              dark ? "text-slate-100" : "text-slate-700"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#7dc596] shrink-0" />
            {f}
          </div>
        ))}
      </div>
      <Link
        to="/packages"
        className={`mt-5 w-full text-center py-3 rounded-xl font-black text-sm ${
          dark ? "bg-[#7ec99a] text-[#092328]" : "bg-[#12544F] text-white"
        }`}
      >
        Choose {pkg.name || pkg.title}
      </Link>
    </div>
  );
}

export default Home;
