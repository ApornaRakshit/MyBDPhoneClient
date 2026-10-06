import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Phone,
  Smartphone,
  Laptop,
  Monitor,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

import heroBg from '../../assets/hero-bg.png';

export const IpPhone = () => {
  const [packages, setPackages] = useState([]);
  const [numbers, setNumbers] = useState([]);

  useEffect(() => {
    API.get('/packages?service_type=ip_phone')
      .then((res) => {
        if (res.data.success) setPackages(res.data.packages);
      })
      .catch((err) => console.error(err));

    API.get('/ip-phone/available-numbers?limit=6')
      .then((res) => {
        if (res.data.success) setNumbers(res.data.numbers.slice(0, 6));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-20 pb-20">

      {/* Hero */}
      <section
        className="relative overflow-hidden bg-[#eaf6f2] bg-no-repeat bg-cover bg-center text-[#092328] py-16 lg:py-24 border-b border-[#8BBB92]/30"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12544F]/10 border border-[#2A835F]/30 text-sm font-bold text-[#12544F]">
              <Phone className="w-3.5 h-3.5 text-[#2A835F]" />
              <span>Bangladeshi 096 Telephony Solutions</span>
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-[#092328]">
              Enterprise IP Phone & Cloud PBX For Modern Businesses
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Get an official 096XXXXXXXX IP number with crystal-clear voice clarity. Connect simultaneously across Android apps, PCs, laptops, and dedicated IP desktop phones.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/packages"
                className="px-7 py-3.5 rounded-xl font-bold text-sm bg-[#12544F] hover:bg-[#092328] text-white shadow-lg flex items-center gap-2 transition-all"
              >
                <span>Get 096 Number</span>
                <ArrowRight className="w-4 h-4 text-[#8BBB92]" />
              </Link>
              <Link
                to="/user/recharge"
                className="px-7 py-3.5 rounded-xl font-bold text-sm bg-white/90 hover:bg-white text-[#12544F] border-2 border-[#2A835F] hover:border-[#12544F] transition-all"
              >
                Recharge Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Device Support Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-sm font-bold uppercase tracking-wider text-[#2A835F] bg-[#2A835F]/10 px-3 py-1 rounded-full">
            Any Device. Anywhere in Bangladesh.
          </span>
          <h2 className="text-3xl font-black text-[#092328]">
            Supported Devices & Softphone Clients
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            MyBDPhone standard SIP protocol works out of the box with your favorite applications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Android App",
              desc: "Make & receive calls on your smartphone using Zoiper, Grandstream Wave, or Linphone.",
              icon: Smartphone,
              tag: "Mobile Freedom",
            },
            {
              title: "Windows PC",
              desc: "Turn your office computer into a multi-line PBX workstation with headset support.",
              icon: Monitor,
              tag: "Workstation",
            },
            {
              title: "Laptop & Mac",
              desc: "Ideal for remote team members and executives traveling across Bangladesh or abroad.",
              icon: Laptop,
              tag: "Remote Ready",
            },
            {
              title: "Hardware IP Phones",
              desc: "Direct SIP registration on Grandstream, Yealink, Fanvil, and Cisco desktop desk phones.",
              icon: Phone,
              tag: "Executive Desk",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#12544F] hover:shadow-lg transition-all duration-200 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#12544F]/10 text-[#12544F] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-700 uppercase">
                    {item.tag}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-[#092328]">{item.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Available IP Numbers Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 bg-slate-50 border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-[#12544F]">Live Available Numbers</span>
              <h3 className="text-2xl font-black text-[#092328] mt-1">Available 096 Numbers Pool</h3>
            </div>
            <Link to="/packages" className="text-sm font-bold text-[#12544F] hover:underline flex items-center gap-1">
              Select & Register <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {numbers.map((num) => (
              <div key={num.id} className="p-3.5 rounded-xl bg-white border border-slate-200 text-center space-y-1 shadow-2xs">
                <div className="text-sm font-black text-[#092328]">{num.number}</div>
                <div className="text-[10px] font-bold text-emerald-600 uppercase">{num.category}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly IP Phone Packages */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-sm font-bold uppercase tracking-wider text-[#2A835F] bg-[#2A835F]/10 px-3 py-1 rounded-full">
            Monthly IP Phone Plans
          </span>
          <h2 className="text-3xl font-black text-[#092328]">
            Simple, Transparent Monthly Telephony Packages
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Choose StartUp or Pro to instantly activate your 096 line.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {packages.map((pkg) => {
            const isRecommended = pkg.is_recommended;
            return (
              <div
                key={pkg.id}
                className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all ${
                  isRecommended
                    ? 'bg-gradient-to-b from-[#092328] to-[#12544F] text-white shadow-2xl ring-2 ring-[#2A835F]'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                }`}
              >
                {pkg.badge_text && (
                  <div className="absolute -top-3.5 right-8">
                    <span className="px-3 py-1 rounded-full text-sm font-extrabold bg-[#2A835F] text-white">
                      {pkg.badge_text}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className={`text-2xl font-black ${isRecommended ? 'text-white' : 'text-[#092328]'}`}>
                      {pkg.name}
                    </h3>
                    <p className={`text-sm mt-1 ${isRecommended ? 'text-slate-300' : 'text-slate-500'}`}>
                      {pkg.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 py-2">
                    <span className="text-4xl font-black text-[#8BBB92]">
                      ৳{parseFloat(pkg.price).toLocaleString()}
                    </span>
                    <span className={`text-sm font-semibold ${isRecommended ? 'text-slate-300' : 'text-slate-500'}`}>
                      /Month
                    </span>
                  </div>

                  <div className={`border-t pt-4 space-y-2.5 ${isRecommended ? 'border-white/15' : 'border-slate-100'}`}>
                    {Array.isArray(pkg.features) &&
                      pkg.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4 text-[#8BBB92] shrink-0 mt-0.5" />
                          <span className={isRecommended ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    to="/packages"
                    className={`w-full py-3.5 rounded-xl font-bold text-sm text-center block transition-all shadow-md ${
                      isRecommended
                        ? 'bg-gradient-to-r from-[#2A835F] to-[#8BBB92] text-[#092328] hover:brightness-110'
                        : 'bg-[#12544F] hover:bg-[#092328] text-white'
                    }`}
                  >
                    Choose {pkg.name === 'Pro Monthly' ? 'Pro' : 'StartUp'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

