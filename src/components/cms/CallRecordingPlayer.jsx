import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  AudioWaveform,
  ShieldCheck,
  FileAudio,
  Clock,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Download,
  Search,
  Sliders,
  CheckCircle2,
  Activity,
  Headphones,
  User,
  Copy,
  Check,
  FastForward,
  Rewind,
  FileText,
  Lock,
} from 'lucide-react';

const DEFAULT_SAMPLES = [
  {
    id: 'rec_001',
    title: 'Order Confirmation & Payment Verification',
    agent: 'Tanvir Ahmed (Senior Account Rep)',
    caller_id: '+880 1712-345678',
    call_type: 'Inbound Call',
    channel: 'Dual-Channel Stereo (Agent: Left / Caller: Right)',
    duration: '0:12',
    audio_url: '/uploads/audio/tanvir.mp3',
    date: 'Today, 10:45 AM',
    status: 'AES-256 Encrypted',
    department: 'Sales & Billing',
    transcript: [
      { speaker: 'Agent (Tanvir)', text: 'আসসালামু আলাইকুম। মাই বিডি ফোন থেকে বলছি। আপনার অর্ডারের নিরাপত্তা নিশ্চিত করতে তথ্যটি কনফার্ম করছি।', time: '0:02' },
      { speaker: 'Customer', text: 'ওয়ালাইকুম আসসালাম। হ্যাঁ, আমি কনফার্মেশন কোড পেয়েছি।', time: '0:06' },
      { speaker: 'Agent (Tanvir)', text: 'ধন্যবাদ স্যার, আপনার অর্ডার সফলভাবে প্রসেস করা হয়েছে।', time: '0:10' }
    ]
  },
  {
    id: 'rec_002',
    title: 'Customer Support & Service Activation',
    agent: 'Nusrat Jahan (Customer Success)',
    caller_id: '+880 1987-654321',
    call_type: 'Inbound Call',
    channel: 'Dual-Channel Stereo (Agent: Left / Caller: Right)',
    duration: '0:15',
    audio_url: '/uploads/audio/nusrat.mp3',
    date: 'Today, 09:30 AM',
    status: 'AES-256 Encrypted',
    department: 'Technical Support',
    transcript: [
      { speaker: 'Agent (Nusrat)', text: 'শুভ সকাল! মাই বিডি ফোন কাস্টমার কেয়ারে স্বাগতম। আমি কীভাবে সহায়তা করতে পারি?', time: '0:03' },
      { speaker: 'Customer', text: 'আমার নতুন আইপি ফোন লাইন অ্যাক্টিভেশনের স্ট্যাটাস জানতে চাচ্ছিলাম।', time: '0:08' },
      { speaker: 'Agent (Nusrat)', text: 'অবশ্যই স্যার, আপনার সার্ভিসটি আজ দুপুর ২টার মধ্যেই সম্পূর্ণ অ্যাক্টিভ হয়ে যাবে।', time: '0:13' }
    ]
  },
  {
    id: 'rec_003',
    title: 'Doctor Appointment & Clinic Hotline',
    agent: 'Sabbir Hossain (Medical Coordinator)',
    caller_id: '+880 1823-456789',
    call_type: 'Outbound Automated Follow-up',
    channel: 'Dual-Channel Stereo (Agent: Left / Caller: Right)',
    duration: '0:14',
    audio_url: '/uploads/audio/sabbir.mp3',
    date: 'Yesterday, 04:15 PM',
    status: 'AES-256 Encrypted',
    department: 'Healthcare Telephony',
    transcript: [
      { speaker: 'Agent (Sabbir)', text: 'নমস্কার, আগামীকাল বিকাল ৪টায় আপনার বিশেষজ্ঞ ডাক্তারের অ্যাপয়েন্টমেন্ট নির্ধারিত রয়েছে।', time: '0:04' },
      { speaker: 'Customer', text: 'জি, আমি সময়মতো উপস্থিত থাকব। ধন্যবাদ।', time: '0:09' },
      { speaker: 'Agent (Sabbir)', text: 'ধন্যবাদ। কোনো পরিবর্তন প্রয়োজন হলে আমাদের হটলাইনে কল করতে পারেন।', time: '0:13' }
    ]
  },
  {
    id: 'rec_004',
    title: 'Corporate Billing & Subscription Renewal',
    agent: 'Ayesha Siddiqua (Billing Specialist)',
    caller_id: '+880 1611-223344',
    call_type: 'Inbound Billing Helpdesk',
    channel: 'Dual-Channel Stereo (Agent: Left / Caller: Right)',
    duration: '0:16',
    audio_url: '/uploads/audio/ayesha.mp3',
    date: 'Yesterday, 02:00 PM',
    status: 'AES-256 Encrypted',
    department: 'Accounts & Finance',
    transcript: [
      { speaker: 'Agent (Ayesha)', text: 'প্রিয় গ্রাহক, আপনার কর্পোরেট আইপিবিএক্স সার্ভিসের মাসিক বিল সফলভাবে গৃহীত হয়েছে।', time: '0:04' },
      { speaker: 'Customer', text: 'ই-ইনভয়েস কপি কি ইমেইলে পাঠিয়ে দেওয়া হয়েছে?', time: '0:09' },
      { speaker: 'Agent (Ayesha)', text: 'জি স্যার, আপনার রেজিস্টার্ড ইমেইলে পিডিএফ ইনভয়েস পাঠিয়ে দেওয়া হয়েছে।', time: '0:14' }
    ]
  }
];

const mediaUrl = (url = '') => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:')) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const CallRecordingPlayer = ({ section = {} }) => {
  const settings = section.custom_settings || section.settings || {};
  const parsedSettings = typeof settings === 'string' ? JSON.parse(settings || '{}') : settings;
  const rawSamples = Array.isArray(parsedSettings.samples) && parsedSettings.samples.length > 0 
    ? parsedSettings.samples 
    : DEFAULT_SAMPLES;

  const [samples, setSamples] = useState(rawSamples);
  const [activeSample, setActiveSample] = useState(rawSamples[0] || DEFAULT_SAMPLES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(14);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [channelMode, setChannelMode] = useState('stereo'); // 'stereo' | 'agent' | 'caller'
  const [activeTab, setActiveTab] = useState('transcript'); // 'transcript' | 'metadata' | 'compliance'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (parsedSettings.samples && parsedSettings.samples.length > 0) {
      setSamples(parsedSettings.samples);
      setActiveSample(parsedSettings.samples[0]);
    }
  }, [section]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [volume, isMuted, playbackSpeed]);

  const parseDurationSec = (durStr) => {
    if (typeof durStr === 'number') return durStr;
    if (typeof durStr === 'string' && durStr.includes(':')) {
      const parts = durStr.split(':').map(Number);
      return parts[0] * 60 + parts[1];
    }
    return 14;
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectSample = (sample) => {
    pauseAudio();
    setActiveSample(sample);
    setCurrentTime(0);
    setDuration(parseDurationSec(sample.duration));
  };

  const playAudio = () => {
    setIsPlaying(true);
    if (audioRef.current && activeSample?.audio_url) {
      audioRef.current
        .play()
        .catch(() => {
          startSimulatedPlayback();
        });
    } else {
      startSimulatedPlayback();
    }
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setCurrentTime(0);
    playAudio();
  };

  const skipTime = (seconds) => {
    let nextTime = currentTime + seconds;
    if (nextTime < 0) nextTime = 0;
    if (nextTime > duration) nextTime = duration;
    setCurrentTime(nextTime);
    if (audioRef.current) {
      audioRef.current.currentTime = nextTime;
    }
  };

  const startSimulatedPlayback = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const totalSec = parseDurationSec(activeSample?.duration || 14);
    let cur = currentTime >= totalSec ? 0 : currentTime;

    timerRef.current = setInterval(() => {
      cur += 0.2 * playbackSpeed;
      setCurrentTime(cur);
      if (cur >= totalSec) {
        clearInterval(timerRef.current);
        setIsPlaying(false);
        setCurrentTime(0);
      }
    }, 200);
  };

  const handleSeek = (e) => {
    const pct = parseFloat(e.target.value);
    const newTime = (pct / 100) * (duration || 14);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  const handleCopyTranscript = () => {
    if (!activeSample?.transcript) return;
    const text = activeSample.transcript.map(t => `[${t.time}] ${t.speaker}: ${t.text}`).join('\n');
    navigator.clipboard?.writeText(text);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const progressPercent = duration ? Math.min((currentTime / duration) * 100, 100) : 0;

  const filteredSamples = samples.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title?.toLowerCase().includes(q) ||
      s.agent?.toLowerCase().includes(q) ||
      s.caller_id?.toLowerCase().includes(q) ||
      s.department?.toLowerCase().includes(q)
    );
  });

  const title = section.title || 'Live Call Recording & Audio Storage Console';
  const subtitle = section.subtitle || 'Listen to carrier-grade dual-channel audio recordings with interactive waveform analysis, speaker isolation, and real-time transcript synchronization.';
  const eyebrow = parsedSettings.eyebrow || 'INTERACTIVE AUDIO ARCHIVE';

  return (
    <div className="w-full bg-[#061619] border border-emerald-950/70 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl text-slate-100 overflow-hidden relative">
      {/* Background Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="text-center max-w-3xl mx-auto mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-sm font-black uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{eyebrow}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Main Dual Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Column: Sample Recordings Archive List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <FileAudio className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-black uppercase tracking-wider text-slate-300">
                Call Recordings Archive ({filteredSamples.length})
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">24-Bit / 48kHz HD</span>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Agent, Caller ID or Topic..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0b2125] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Recordings List */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredSamples.map((sample) => {
              const isSelected = activeSample?.id === sample.id;
              return (
                <motion.button
                  key={sample.id}
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectSample(sample)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative group flex items-start gap-3.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/15'
                      : 'bg-[#0b2125]/80 border-slate-800/80 hover:bg-[#0f2c31] hover:border-slate-700 text-slate-300'
                  }`}
                >
                  {/* Left Call Icon Indicator */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 text-[#061619] shadow-md shadow-emerald-500/30'
                        : 'bg-white/5 text-slate-400 group-hover:text-white'
                    }`}
                  >
                    {sample.call_type?.includes('Outbound') ? (
                      <PhoneOutgoing className="w-4 h-4" />
                    ) : (
                      <PhoneIncoming className="w-4 h-4" />
                    )}
                  </div>

                  {/* Call Session Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`font-black text-sm truncate ${
                          isSelected ? 'text-white' : 'text-slate-200'
                        }`}
                      >
                        {sample.title}
                      </h4>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                      <span className="font-mono text-emerald-400 font-bold">{sample.caller_id}</span>
                      <span>•</span>
                      <span className="truncate">{sample.agent?.split('(')[0]}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-400 font-mono">
                        {sample.duration}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 font-semibold">
                        {sample.department || 'Dual Track'}
                      </span>
                      <span className="text-slate-500 ml-auto font-mono">{sample.date?.split(',')[0]}</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Player & Audio Visualizer Console */}
        <div className="lg:col-span-7 bg-[#0b2125] border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative">
          
          {/* Active Call Metadata Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {activeSample?.call_type || 'INBOUND CALL'}
                </span>
                <span className="text-sm font-mono text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeSample?.status || 'AES-256 Verified'}</span>
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white mt-1.5 leading-snug">
                {activeSample?.title}
              </h3>
              <p className="text-sm sm:text-sm text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Agent: <strong className="text-slate-200">{activeSample?.agent}</strong></span>
                <span>•</span>
                <span>Caller: <strong className="text-emerald-400 font-mono">{activeSample?.caller_id}</strong></span>
              </p>
            </div>

            {/* Top Right Channel Mode Switcher */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setChannelMode('stereo')}
                title="Both Channels (Stereo)"
                className={`px-2.5 py-1 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  channelMode === 'stereo'
                    ? 'bg-emerald-500 text-[#061619]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Stereo
              </button>
              <button
                type="button"
                onClick={() => setChannelMode('agent')}
                title="Isolate Agent Audio"
                className={`px-2.5 py-1 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  channelMode === 'agent'
                    ? 'bg-emerald-500 text-[#061619]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Agent L
              </button>
              <button
                type="button"
                onClick={() => setChannelMode('caller')}
                title="Isolate Caller Audio"
                className={`px-2.5 py-1 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  channelMode === 'caller'
                    ? 'bg-emerald-500 text-[#061619]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Caller R
              </button>
            </div>
          </div>

          {/* Animated Dual-Track Audio Waveform Display */}
          <div className="p-4 sm:p-6 rounded-2xl bg-black/60 border border-emerald-950/40 relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase">
              <span className="flex items-center gap-1 text-emerald-400">
                <Activity className="w-3.5 h-3.5" />
                <span>Channel L: Agent Audio Track</span>
              </span>
              <span className="text-teal-300">Channel R: Caller Audio Track</span>
            </div>

            {/* Waveform Bars Grid */}
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 h-20 overflow-hidden">
              {[
                30, 60, 40, 85, 55, 95, 70, 45, 90, 65, 35, 80, 50, 100, 75, 40, 85, 60, 95, 45, 70, 35, 90, 55, 80, 40, 65, 30
              ].map((h, i) => {
                const isLeftChannel = i < 14;
                const isDimmed =
                  (channelMode === 'agent' && !isLeftChannel) ||
                  (channelMode === 'caller' && isLeftChannel);

                return (
                  <motion.div
                    key={i}
                    animate={
                      isPlaying && !isDimmed
                        ? {
                            height: [
                              `${Math.max(12, h * 0.25)}%`,
                              `${h}%`,
                              `${Math.max(16, h * 0.6)}%`,
                            ],
                          }
                        : { height: `${isDimmed ? 8 : 18}%` }
                    }
                    transition={
                      isPlaying && !isDimmed
                        ? {
                            repeat: Infinity,
                            duration: 0.5 + (i % 5) * 0.08,
                            ease: 'easeInOut',
                          }
                        : { duration: 0.3 }
                    }
                    className={`w-1.5 rounded-full transition-all duration-200 ${
                      isDimmed
                        ? 'bg-slate-800/40 opacity-30'
                        : isPlaying
                        ? isLeftChannel
                          ? 'bg-gradient-to-t from-emerald-600 via-emerald-400 to-teal-200 shadow-sm shadow-emerald-500/50'
                          : 'bg-gradient-to-t from-teal-600 via-teal-300 to-cyan-200 shadow-sm shadow-teal-400/50'
                        : 'bg-slate-800'
                    }`}
                  />
                );
              })}
            </div>

            {/* Track Balance Marker */}
            <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
              <span>Stereo Separation: 100%</span>
              <span>Bitrate: 320 kbps MP3 / WAV</span>
            </div>
          </div>

          {/* Timeline & Scrubber Bar */}
          <div className="space-y-1.5">
            <div className="relative group">
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercent}
                onChange={handleSeek}
                className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
            <div className="flex justify-between text-sm font-mono text-slate-400">
              <span className="text-emerald-400 font-bold">{formatTime(currentTime)}</span>
              <span>{formatTime(duration || 14)}</span>
            </div>
          </div>

          {/* Player Transport Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2.5">
              {/* Rewind 5s */}
              <button
                type="button"
                onClick={() => skipTime(-5)}
                title="Rewind 5 seconds"
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer"
              >
                <Rewind className="w-4 h-4" />
              </button>

              {/* Play / Pause */}
              <button
                type="button"
                onClick={togglePlay}
                className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#061619] font-black text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play Call Recording</span>
                  </>
                )}
              </button>

              {/* Fast Forward 5s */}
              <button
                type="button"
                onClick={() => skipTime(5)}
                title="Fast forward 5 seconds"
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer"
              >
                <FastForward className="w-4 h-4" />
              </button>

              {/* Restart */}
              <button
                type="button"
                onClick={restartAudio}
                title="Restart from beginning"
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Speed & Volume Tools */}
            <div className="flex items-center gap-3">
              {/* Speed Toggle */}
              <button
                type="button"
                onClick={cycleSpeed}
                title="Toggle playback speed"
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-slate-800 text-sm font-mono font-bold text-emerald-300 cursor-pointer"
              >
                {playbackSpeed}x Speed
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Sub-Tabs: Transcript vs Call Details */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('transcript')}
                  className={`text-sm font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'transcript'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Synchronized Dialogue Transcript
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('metadata')}
                  className={`text-sm font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'metadata'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Audit & Compliance Info
                </button>
              </div>

              {activeTab === 'transcript' && (
                <button
                  type="button"
                  onClick={handleCopyTranscript}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                >
                  {copiedTranscript ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Dialogue</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {activeTab === 'transcript' ? (
              <div className="p-4 rounded-2xl bg-black/40 border border-slate-800/80 space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {activeSample?.transcript && activeSample.transcript.length > 0 ? (
                  activeSample.transcript.map((item, idx) => (
                    <div key={idx} className="space-y-0.5 text-sm">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-[10px] text-slate-500">[{item.time}]</span>
                        <span className={`font-bold ${item.speaker.startsWith('Agent') ? 'text-emerald-400' : 'text-teal-300'}`}>
                          {item.speaker}:
                        </span>
                      </div>
                      <p className="text-slate-300 pl-6 leading-relaxed font-sans">{item.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No text transcript available for this recording.</p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-black/40 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Call Session ID</span>
                  <span className="font-mono text-slate-300">{activeSample?.id || 'REC-884920'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Encryption</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    AES-256 GCM
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Storage Tier</span>
                  <span className="text-slate-300">Hot Cloud Tier</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Retention Policy</span>
                  <span className="text-slate-300">90 Days / Auto-Archive</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">BTRC Compliance</span>
                  <span className="text-emerald-400 font-semibold">Compliant IPTSP</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">MD5 Checksum</span>
                  <span className="font-mono text-slate-400 text-[11px]">e9b4...2a1f</span>
                </div>
              </div>
            )}
          </div>

          {/* Native HTML5 Audio Element */}
          {activeSample?.audio_url && (
            <audio
              ref={audioRef}
              src={mediaUrl(activeSample.audio_url)}
              onTimeUpdate={(e) => {
                setCurrentTime(e.target.currentTime);
                if (e.target.duration && !isNaN(e.target.duration)) {
                  setDuration(e.target.duration);
                }
              }}
              onLoadedMetadata={(e) => {
                if (e.target.duration && !isNaN(e.target.duration)) {
                  setDuration(e.target.duration);
                }
              }}
              onEnded={() => {
                setIsPlaying(false);
                setCurrentTime(0);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CallRecordingPlayer;

