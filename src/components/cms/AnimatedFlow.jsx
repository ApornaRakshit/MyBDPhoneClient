import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneIncoming,
  Cpu,
  GitBranch,
  UserCheck,
  Crown,
  Clock,
  Sliders,
  Headphones,
  Play,
  Pause,
  SkipForward,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Radio,
  Layers,
  ShieldCheck,
  Users,
  Smartphone,
  Laptop,
  Monitor,
  Zap,
  ArrowRight,
  PhoneCall,
  Activity,
  Check,
} from 'lucide-react';

const ICON_MAP = {
  PhoneIncoming,
  Cpu,
  GitBranch,
  UserCheck,
  Crown,
  Clock,
  Sliders,
  Headphones,
  Play,
  Pause,
  SkipForward,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Radio,
  Layers,
  ShieldCheck,
  Users,
  Smartphone,
  Laptop,
  Monitor,
  Zap,
  ArrowRight,
  PhoneCall,
  Activity,
  Check,
};

function FlowIcon({ name = 'Cpu', className = 'w-6 h-6' }) {
  const IconComp = ICON_MAP[name] || Cpu;
  return <IconComp className={className} />;
}

const DEFAULT_SCENARIOS = [
  {
    id: 'vip',
    label: 'VIP Customer Priority Route',
    branch: 'vip',
    badge: 'PRIORITY 1',
    description: 'High-value VIP callers bypass general wait queues and connect directly to Senior Account Managers with personalized greeting.',
  },
  {
    id: 'time',
    label: 'After-Hours & Holiday Time Route',
    branch: 'time',
    badge: 'SCHEDULE',
    description: 'Calls outside 9am-6pm redirect automatically to on-call emergency mobile or voicemail with email MP3 delivery.',
  },
  {
    id: 'skill',
    label: 'DTMF Skill & Language Matching',
    branch: 'skill',
    badge: 'INTELLIGENT',
    description: 'Caller selects Bangla/English and Support/Sales to reach the most qualified active agent.',
  },
];

const DEFAULT_STEPS = [
  { id: 1, title: 'Customer Call Received', desc: 'Incoming call hits IP Phone network trunk (096)', icon: 'PhoneIncoming' },
  { id: 2, title: 'Dynamic IVR Engine', desc: 'Fetches Caller ID & checks CRM / database in <120ms', icon: 'Cpu' },
  { id: 3, title: 'Condition Logic Check', desc: 'Evaluates VIP Priority, Time/Region, & DTMF Skill Menu', icon: 'GitBranch' },
  { id: 4, title: 'Route to Exact Agent', desc: 'Connects call to the most qualified available agent / extension', icon: 'UserCheck' },
];

export const AnimatedFlow = ({
  section = {},
  customSettings = null,
}) => {
  const settings = customSettings || section.custom_settings || section.settings || {};
  const scenarios = Array.isArray(settings.scenarios) && settings.scenarios.length > 0 ? settings.scenarios : DEFAULT_SCENARIOS;
  const steps = Array.isArray(settings.steps) && settings.steps.length > 0 ? settings.steps : DEFAULT_STEPS;
  const eyebrow = settings.eyebrow || 'INTERACTIVE ARCHITECTURE SIMULATOR';
  const title = section.title || 'How Smart IVR Routing Works';
  const subtitle = section.subtitle || 'Intelligent routing based on CRM history, caller location, time, and skills.';
  const contentBody = section.content_body || section.content_html || '';

  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0]?.id || 'vip');
  const [currentStage, setCurrentStage] = useState(0); // 0 = idle, 1 = stage1, 2 = stage2, 3 = stage3, 4 = stage4, 5 = completed
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];
  const activeBranch = activeScenario?.branch || 'vip';

  const resetSimulation = () => {
    setIsPlaying(false);
    setCurrentStage(0);
  };

  const startSimulation = () => {
    if (currentStage >= 5 || currentStage === 0) {
      setCurrentStage(1);
    }
    setIsPlaying(true);
  };

  const pauseSimulation = () => {
    setIsPlaying(false);
  };

  const nextStep = useCallback(() => {
    setCurrentStage((prev) => {
      if (prev >= 4) {
        setIsPlaying(false);
        return 5;
      }
      return prev + 1;
    });
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev >= 4) {
            setIsPlaying(false);
            return 5;
          }
          return prev + 1;
        });
      }, 2200);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  const handleScenarioChange = (id) => {
    setActiveScenarioId(id);
    resetSimulation();
  };

  const getNodeState = (stageNumber) => {
    if (currentStage === stageNumber) return 'active';
    if (currentStage > stageNumber) return 'completed';
    return 'idle';
  };

  const getBranchState = (branchType) => {
    if (activeBranch !== branchType) return 'idle';
    if (currentStage === 3) return 'active';
    if (currentStage > 3) return 'completed';
    return 'idle';
  };

  return (
    <div className="w-full rounded-[2.5rem] bg-gradient-to-br from-[#06181b] via-[#092328] to-[#0e3b37] text-white p-5 sm:p-8 lg:p-10 shadow-2xl border border-emerald-500/20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-black uppercase tracking-wider mb-3">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          {eyebrow}
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        )}
        {contentBody && (
          <p className="text-slate-300 text-sm sm:text-sm mt-2 max-w-2xl mx-auto">
            {contentBody}
          </p>
        )}
      </div>

      {/* Scenario Tabs */}
      <div className="relative z-10 mb-8">
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {scenarios.map((sc) => {
            const isSelected = activeScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleScenarioChange(sc.id)}
                className={`relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-sm sm:text-sm font-black transition-all duration-300 flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-emerald-500 text-[#092328] border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{sc.label}</span>
                {sc.badge && (
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      isSelected
                        ? 'bg-[#092328]/20 text-[#092328]'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {sc.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Scenario info card */}
        {activeScenario && (
          <motion.div
            key={activeScenario.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 max-w-2xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center text-sm sm:text-sm text-emerald-200/90 leading-relaxed flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{activeScenario.description}</span>
          </motion.div>
        )}
      </div>

      {/* Interactive Simulation Controls */}
      <div className="relative z-10 flex items-center justify-center gap-3 mb-10">
        {!isPlaying ? (
          <button
            type="button"
            onClick={startSimulation}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#092328] font-bold text-sm sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{currentStage === 0 ? 'Start Live Simulation' : 'Resume Flow'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={pauseSimulation}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-sm flex items-center gap-2 transition-all active:scale-95"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>Pause</span>
          </button>
        )}

        <button
          type="button"
          onClick={nextStep}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-sm flex items-center gap-1.5 border border-white/15 transition-all"
          title="Step Forward"
        >
          <SkipForward className="w-4 h-4" />
          <span className="hidden sm:inline">Next Stage</span>
        </button>

        <button
          type="button"
          onClick={resetSimulation}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-sm flex items-center gap-1.5 border border-white/15 transition-all"
          title="Reset Flow"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <div className="ml-2 text-sm font-mono px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-emerald-400">
          Stage: {currentStage === 0 ? 'READY' : currentStage === 5 ? 'CONNECTED' : `${currentStage}/4`}
        </div>
      </div>

      {/* ── FLOW ARCHITECTURE DIAGRAM ──────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 items-stretch">
          
          {/* Node 1: Customer Call */}
          <div className="relative flex flex-col">
            <NodeCard
              stepNumber="01"
              title={steps[0]?.title || 'Customer Call Received'}
              subtitle={steps[0]?.desc || 'Inbound hit on 096 trunk'}
              icon={steps[0]?.icon || 'PhoneIncoming'}
              state={getNodeState(1)}
            />
            {/* Connecting pulse line (desktop) */}
            <ConnectingLine active={currentStage >= 1} />
          </div>

          {/* Node 2: Dynamic IVR Engine */}
          <div className="relative flex flex-col">
            <NodeCard
              stepNumber="02"
              title={steps[1]?.title || 'Dynamic IVR Engine'}
              subtitle={steps[1]?.desc || 'CRM query & caller scoring'}
              icon={steps[1]?.icon || 'Cpu'}
              state={getNodeState(2)}
            />
            <ConnectingLine active={currentStage >= 2} />
          </div>

          {/* Node 3: Condition Logic Check (Branching Hub) */}
          <div className="relative flex flex-col">
            <div className={`p-5 rounded-2xl border-2 transition-all duration-500 h-full flex flex-col justify-between ${
              getNodeState(3) === 'active'
                ? 'border-emerald-400 bg-emerald-950/60 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                : getNodeState(3) === 'completed'
                ? 'border-emerald-500/60 bg-[#072421]/90'
                : 'border-slate-800 bg-slate-900/60 text-slate-400'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  STEP 03 · DECISION HUB
                </span>
                {getNodeState(3) === 'completed' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
              </div>

              <div className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-emerald-400" />
                <span>{steps[2]?.title || 'Condition Logic Check'}</span>
              </div>

              {/* Branch options inside step 3 */}
              <div className="space-y-2">
                <BranchItem
                  title="VIP Route"
                  desc="CRM Score > 90"
                  icon={Crown}
                  state={getBranchState('vip')}
                />
                <BranchItem
                  title="Time Route"
                  desc="Off-Hours 18:00+"
                  icon={Clock}
                  state={getBranchState('time')}
                />
                <BranchItem
                  title="Skill Match"
                  desc="DTMF Skill Queue"
                  icon={Sliders}
                  state={getBranchState('skill')}
                />
              </div>
            </div>
            <ConnectingLine active={currentStage >= 3} />
          </div>

          {/* Node 4: Routed Agent / Destination */}
          <div className="relative flex flex-col">
            <NodeCard
              stepNumber="04"
              title={steps[3]?.title || 'Route to Exact Agent'}
              subtitle={
                activeBranch === 'vip'
                  ? 'VIP Senior Executive Line'
                  : activeBranch === 'time'
                  ? 'After-Hours On-Call Mobile'
                  : 'Qualified Skill Queue Agent'
              }
              icon={steps[3]?.icon || 'UserCheck'}
              state={getNodeState(4)}
              isFinal
            />
          </div>

        </div>
      </div>

      {/* ── REAL-TIME PACKET FLOW TRACKER ────────────────────────── */}
      <div className="relative z-10 bg-black/40 rounded-2xl border border-white/10 p-4 sm:p-5 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div className="text-sm sm:text-sm font-mono text-emerald-300">
            {currentStage === 0 && 'System Idle · Ready to simulate inbound call'}
            {currentStage === 1 && 'Call Received · Ingesting SIP packet from 096 trunk...'}
            {currentStage === 2 && 'Querying CRM database for Caller ID & VIP status (<120ms)...'}
            {currentStage === 3 && `Evaluating condition rules for [${activeScenario.label}]...`}
            {currentStage === 4 && `Dispatching call to destination: ${activeScenario.label}...`}
            {currentStage === 5 && '✓ Call Connected Successfully with full caller context!'}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400 font-mono">
          <span>Latency:</span>
          <span className="text-emerald-400 font-bold">&lt; 150ms</span>
        </div>
      </div>
    </div>
  );
};

/* ── Helper: NodeCard ─────────────────────────────────────── */
function NodeCard({ stepNumber, title, subtitle, icon, state, isFinal = false }) {
  const isIdle = state === 'idle';
  const isActive = state === 'active';
  const isCompleted = state === 'completed';

  return (
    <div
      className={`relative p-5 rounded-2xl border-2 transition-all duration-500 h-full flex flex-col justify-between ${
        isActive
          ? 'border-emerald-400 bg-emerald-950/60 shadow-[0_0_25px_rgba(16,185,129,0.35)] scale-[1.02]'
          : isCompleted
          ? 'border-emerald-500/60 bg-[#072421]/90'
          : 'border-slate-800 bg-slate-900/60 text-slate-400'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
          STEP {stepNumber}
        </span>
        {isCompleted && (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-in fade-in" />
        )}
      </div>

      <div className="my-2">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors duration-500 ${
            isActive
              ? 'bg-emerald-500 text-[#092328]'
              : isCompleted
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-slate-800 text-slate-500'
          }`}
        >
          <FlowIcon name={icon} className={`w-6 h-6 ${isActive ? 'animate-bounce' : ''}`} />
        </div>
        <h3 className="font-bold text-sm text-white mb-1">{title}</h3>
        {subtitle && (
          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">{subtitle}</p>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
        <span className="text-slate-400">Status</span>
        <span
          className={`font-bold capitalize ${
            isActive
              ? 'text-emerald-400 animate-pulse'
              : isCompleted
              ? 'text-emerald-300'
              : 'text-slate-500'
          }`}
        >
          {isActive ? 'Processing...' : isCompleted ? 'Passed' : 'Waiting'}
        </span>
      </div>
    </div>
  );
}

/* ── Helper: BranchItem ───────────────────────────────────── */
function BranchItem({ title, desc, icon: Icon, state }) {
  const isActive = state === 'active';
  const isCompleted = state === 'completed';

  return (
    <div
      className={`p-2.5 rounded-xl border transition-all text-sm flex items-center justify-between gap-2 ${
        isActive
          ? 'border-emerald-400 bg-emerald-500/20 text-white font-bold'
          : isCompleted
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
          : 'border-slate-800/80 bg-slate-900/40 text-slate-500'
      }`}
    >
      <div className="flex items-center gap-2 truncate">
        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300 animate-pulse' : ''}`} />
        <div className="truncate">
          <div className="font-semibold leading-tight truncate">{title}</div>
          <div className="text-[10px] opacity-75 truncate">{desc}</div>
        </div>
      </div>
      {(isActive || isCompleted) && (
        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      )}
    </div>
  );
}

/* ── Helper: ConnectingLine ───────────────────────────────── */
function ConnectingLine({ active }) {
  return (
    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-500 ${
          active
            ? 'bg-emerald-500 text-[#092328] shadow-md shadow-emerald-500/50'
            : 'bg-slate-800 text-slate-600'
        }`}
      >
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}

export default AnimatedFlow;
