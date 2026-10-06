import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Bot,
  Sparkles,
  Mic2,
  Volume2,
  FileSpreadsheet,
  Play,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Cpu,
  PhoneCall,
  Activity,
  Layers,
  Check
} from 'lucide-react';

import heroBg from '../../assets/hero-bg.png';

export const AiCalling = () => {
  const [packages, setPackages] = useState([]);
  const [voices, setVoices] = useState([]);
  const [activeVoice, setActiveVoice] = useState(null);
  const [playingVoice, setPlayingVoice] = useState(null);
  const [sampleText, setSampleText] = useState(
    'আসসালামু আলাইকুম! MyBDPhone এর পক্ষ থেকে আপনার ব্যবসার জন্য বিশেষ শুভেচ্ছা।'
  );

  useEffect(() => {
    API.get('/packages?service_type=ai_calling')
      .then((res) => {
        if (res.data.success) setPackages(res.data.packages);
      })
      .catch((err) => console.error(err));

    API.get('/ai-calling/voices')
      .then((res) => {
        if (res.data.success && res.data.voices.length > 0) {
          setVoices(res.data.voices);
          setActiveVoice(res.data.voices[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handlePlayVoice = (voice) => {
    setPlayingVoice(voice.id);
    const audio = new Audio(voice.preview_url);
    audio.play().catch(() => {});
    setTimeout(() => {
      setPlayingVoice(null);
    }, 2500);
  };

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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12544F]/10 border border-[#2A835F]/30 text-sm font-bold text-[#12544F]">
                <Bot className="w-3.5 h-3.5 text-[#2A835F]" />
                <span>Next-Gen Voice Automation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-[#092328]">
                Automate Thousands of Business Calls with Bangla Neural AI
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                Empower your business with programmable outbound voice agents. Conduct customer surveys, dispatch appointment reminders, notify bill due dates, and collect IVR keypad responses automatically.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/packages"
                  className="px-7 py-3.5 rounded-xl font-bold text-sm bg-[#12544F] hover:bg-[#092328] text-white shadow-lg flex items-center gap-2 transition-all"
                >
                  <span>Get AI Calling Package</span>
                  <ArrowRight className="w-4 h-4 text-[#8BBB92]" />
                </Link>
                <Link
                  to="/contact"
                  className="px-7 py-3.5 rounded-xl font-bold text-sm bg-white/90 hover:bg-white text-[#12544F] border-2 border-[#2A835F] hover:border-[#12544F] transition-all"
                >
                  Developer Contact & Docs
                </Link>
              </div>
            </div>

            {/* Interactive Voice Player Previewer */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Mic2 className="w-4 h-4 text-[#2A835F]" />
                    <span className="text-sm font-bold uppercase tracking-wider text-[#092328]">AI Voice Engine Sampler</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#2A835F] bg-[#2A835F]/10 px-2 py-0.5 rounded-full">Bangla Natural TTS</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Select Voice Model:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {voices.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setActiveVoice(v)}
                        className={`p-2.5 rounded-xl text-left border text-sm font-semibold transition-all ${
                          activeVoice?.id === v.id
                            ? 'bg-[#12544F] border-[#12544F] text-white shadow-md'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-bold">{v.gender} • {v.accent}</div>
                        <div className="text-[10px] opacity-80 mt-0.5">{v.tags.join(', ')}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-sm font-semibold text-slate-700">Voice Script Prompt:</label>
                  <textarea
                    value={sampleText}
                    onChange={(e) => setSampleText(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:border-[#2A835F]"
                  />
                </div>

                <button
                  onClick={() => activeVoice && handlePlayVoice(activeVoice)}
                  disabled={playingVoice !== null}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#12544F] to-[#2A835F] hover:from-[#092328] hover:to-[#12544F] text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{playingVoice ? "Generating Audio Stream..." : "Preview AI Voice Speech"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works 3-Step Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-sm font-bold uppercase tracking-wider text-[#2A835F] bg-[#2A835F]/10 px-3 py-1 rounded-full">
            No-Code Automation
          </span>
          <h2 className="text-3xl font-black text-[#092328]">
            Launch a 10,000-Call Campaign in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Upload Contact Numbers",
              desc: "Upload a CSV file containing your customer phone numbers and customized parameter fields.",
              icon: FileSpreadsheet,
            },
            {
              step: "02",
              title: "Compose Voice Script",
              desc: "Write your greeting script in Bangla or English with dynamic merge tags like {name}, {balance}.",
              icon: Mic2,
            },
            {
              step: "03",
              title: "Launch & Track in Real Time",
              desc: "Hit launch and watch live concurrent calls connect with full audio playback and analytics.",
              icon: TrendingUp,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-[#2A835F] hover:shadow-xl transition-all duration-200 space-y-4 relative"
              >
                <div className="text-3xl font-black text-[#8BBB92] opacity-50">{item.step}</div>
                <div className="w-12 h-12 rounded-xl bg-[#2A835F]/10 text-[#2A835F] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-[#092328]">{item.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Calling Packages */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-sm font-bold uppercase tracking-wider text-[#2A835F] bg-[#2A835F]/10 px-3 py-1 rounded-full">
            AI Voice Packages
          </span>
          <h2 className="text-3xl font-black text-[#092328]">
            Scalable Voice Automation Pricing
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Includes outbound AI minutes, contact CSV uploads, and campaign analytics.
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
                    Choose {pkg.name}
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

