import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Share2,
} from "lucide-react";
import fallbackFooterLogo from "../../assets/footer-logo.png";
import fallbackPayment from "../../assets/Payment.png";
import API from "../../services/api";

const API_ROOT = String(
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");
const mediaUrl = (value, fallback = "") => {
  if (!value) return fallback;
  if (/^(https?:\/\/|data:)/i.test(value)) return value;
  if (value.startsWith("/uploads/")) return `${API_ROOT}${value}`;
  return value;
};
const SOCIAL_ICONS = {
  Facebook: Share2,
  LinkedIn: Share2,
  YouTube: Share2,
  Instagram: Share2,
};

export const Footer = () => {
  const [config, setConfig] = useState({});
  const [global, setGlobal] = useState({});
  useEffect(() => {
    Promise.all([
      API.get("/cms/public/footer"),
      API.get("/settings/public").catch(() => ({ data: { settings: {} } })),
    ])
      .then(([footerRes, settingsRes]) => {
        setConfig(footerRes.data?.config || {});

        setGlobal({
          ...(settingsRes.data?.settings || {}),
          ...(footerRes.data?.global || {}),
        });
      })
      .catch(() => {});
  }, []);
  const columns = Array.isArray(config.columns) ? config.columns : [];
  const social = Array.isArray(config.social)
    ? config.social.filter((x) => x.active !== false && x.url)
    : [];
  return (
    <footer className="relative overflow-hidden bg-[#062f32] text-slate-300 border-t border-[#12544F]/70">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_0%,rgba(42,131,95,.16),transparent_28%),radial-gradient(circle_at_85%_100%,rgba(42,131,95,.12),transparent_32%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-7">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-7 pb-9">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex">
              <img
                src={mediaUrl(config.logo_url, fallbackFooterLogo)}
                alt={global.site_name || "MyBDPhone"}
                className="w-[185px] sm:w-[205px] h-auto max-h-14 object-contain object-left"
              />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              {config.description ||
                "Bangladesh’s premier unified telecommunications & voice AI platform. Equipping startups, enterprises, and contact centers with official 096 IP numbers, cloud PBX, and programmable AI voice automation."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8BBB92]" />
                BTRC IPTSP Compliant
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8BBB92]" />
                99.98% Voice Service SLA
              </span>
            </div>
            {social.length > 0 && (
              <div className="mt-4 flex gap-2">
                {social.map((s) => {
                  const Icon = SOCIAL_ICONS[s.label] || ShieldCheck;
                  return (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
          <FooterColumn
            className="lg:col-span-2"
            title={columns[0]?.title || "IP TELEPHONY"}
            links={
              columns[0]?.links || [
                { label: "096 Number Registration", url: "/ip-phone" },
                { label: "StartUp Monthly (৳500)", url: "/packages" },
                { label: "Pro Monthly (৳1,000)", url: "/packages" },
                { label: "Caller Tune Add-on", url: "/shop" },
                { label: "Cloud Call Recording", url: "/shop" },
                { label: "Multi-Device SIP Support", url: "/ip-phone" },
              ]
            }
          />
          <FooterColumn
            className="lg:col-span-2"
            title={columns[1]?.title || "AI VOICE STUDIO"}
            links={
              columns[1]?.links || [
                { label: "Automated Outbound Calls", url: "/ai-calling" },
                { label: "Bangla Natural Neural TTS", url: "/ai-calling" },
                { label: "AI Calling Packages", url: "/packages" },
                { label: "Voice Campaign Analytics", url: "/ai-calling" },
                { label: "VIP Golden 096 Numbers", url: "/shop" },
                { label: "SIP & Webhook APIs", url: "/features" },
              ]
            }
          />
          <div className="lg:col-span-4">
            <h4 className="text-white text-sm font-black uppercase tracking-wider">
              {columns[2]?.title || "DHAKA SUPPORT HQ"}
            </h4>
            <div className="mt-4 space-y-3 text-sm sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#8BBB92] mt-0.5 shrink-0" />
                <span>
                  {global.office_address ||
                    "Wakil Tower (8th Floor), 131, Gulshan-1, Badda Link Road, Dhaka 1212"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#8BBB92] shrink-0" />
                <a
                  href={`tel:${
                    global.primary_096_number ||
                    global.hotline_phone ||
                    "+8801521561710"
                  }`}
                  className="text-white font-bold hover:underline"
                >
                  {global.primary_096_number ||
                    global.hotline_phone ||
                    "+880 1521561710"}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#8BBB92] shrink-0" />
                <a
                  href={`mailto:${
                    global.support_email || "support@mybdphone.com"
                  }`}
                  className="hover:text-white hover:underline"
                >
                  {global.support_email || "support@mybdphone.com"}
                </a>
              </div>
              <Link
                to="/user/recharge"
                className="mt-2 inline-flex w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2A835F] to-[#4fae78] text-white font-black text-sm"
              >
                Instant Online Recharge
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-center py-5 border-b border-white/10">
          <img
            src={mediaUrl(config.payment_image_url, fallbackPayment)}
            alt="Supported payment gateways"
            className="w-[430px] max-w-full h-auto object-contain"
          />
        </div>
        <div className="pt-5 text-center">
          <p className="text-sm sm:text-sm font-medium text-slate-300">
            {config.copyright ||
              `© ${new Date().getFullYear()} ${
                global.site_name || "MyBDPhone"
              } Limited. All rights reserved.`}
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            {config.footer_note ||
              "Designed with modern telecom precision for Bangladesh."}
          </p>
        </div>
      </div>
    </footer>
  );
};

function FooterColumn({ title, links, className = "" }) {
  return (
    <div className={className}>
      <h4 className="text-white text-sm font-black uppercase tracking-wider">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {links
          .filter((x) => x.active !== false)
          .map((x, i) => (
            <li key={`${x.label}-${i}`}>
              <Link
                to={x.url || "#"}
                className="text-sm sm:text-sm text-slate-300 hover:text-white transition-colors"
              >
                {x.label}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
