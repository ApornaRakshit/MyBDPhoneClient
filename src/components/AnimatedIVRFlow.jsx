import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneIncoming, Cpu, Crown, Clock, Sliders, Headphones, Play, Pause, SkipForward, CheckCircle, RotateCcw } from 'lucide-react';

const SCENARIOS = [
  { id: 'vip', label: 'VIP Caller', branch: 'vip' },
  { id: 'after-hours', label: 'After-Hours Call', branch: 'time' },
  { id: 'standard', label: 'Standard Support', branch: 'skill' },
];

const AnimatedIVRFlow = () => {
  const [activeScenario, setActiveScenario] = useState('vip');
  const [currentStage, setCurrentStage] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  const nextStep = useCallback(() => {
    setCurrentStage((prev) => {
      if (prev >= 5) return 0; // Restart loop or just stop, let's stop at 5
      return prev + 1;
    });
  }, []);

  const playSimulation = () => {
    if (currentStage >= 5) setCurrentStage(1);
    else if (currentStage === 0) setCurrentStage(1);
    setIsPlaying(true);
  };

  const pauseSimulation = () => {
    setIsPlaying(false);
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    setCurrentStage(0);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev >= 4) {
            setIsPlaying(false); // Stop at the end
            return 5;
          }
          return prev + 1;
        });
      }, 2500);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  const handleScenarioChange = (id) => {
    setActiveScenario(id);
    resetSimulation();
  };

  const activeBranch = SCENARIOS.find((s) => s.id === activeScenario).branch;

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

  const NodeCard = ({ title, icon: Icon, state, subtitle }) => {
    const isIdle = state === 'idle';
    const isActive = state === 'active';
    const isCompleted = state === 'completed';

    const baseClass = "relative z-10 flex flex-col items-center justify-center p-5 rounded-2xl backdrop-blur-md border-2 transition-all duration-700 w-full min-h-[140px] text-center";
    const stateClass = isIdle 
      ? "border-slate-700 bg-slate-800/60 text-slate-400" 
      : isActive
      ? "border-emerald-500 bg-emerald-900/40 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105"
      : "border-emerald-500/50 bg-[#092328]/80 text-emerald-100";

    return (
      <div className={`${baseClass} ${stateClass}`}>
        {isCompleted && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="absolute -top-3 -right-3 bg-[#092328] rounded-full p-0.5"
          >
            <CheckCircle className="text-emerald-500 w-6 h-6" />
          </motion.div>
        )}
        <div className={`p-3 rounded-full mb-3 transition-colors duration-500 ${isActive ? 'bg-emerald-500/20 text-emerald-400' : isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
          <Icon className={`w-8 h-8 ${isActive ? 'animate-pulse' : ''}`} />
        </div>
        <h3 className="font-semibold text-sm leading-snug mb-1">{title}</h3>
        {subtitle && (
           <p className={`text-sm mt-1 transition-opacity duration-500 ${isActive || isCompleted ? 'opacity-100 text-emerald-300' : 'opacity-50'}`}>
            {isActive && <span className="inline-block w-2 h-2 mr-1 bg-emerald-500 rounded-full animate-ping" />}
            {subtitle}
          </p>
        )}
      </div>
    );
  };

  const BranchCard = ({ title, icon: Icon, branchType }) => {
    const state = getBranchState(branchType);
    const isTarget = activeBranch === branchType;
    const isIdle = state === 'idle';
    const isActive = state === 'active';
    
    return (
      <div className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 
        ${isActive ? 'border-emerald-500 bg-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] z-10 scale-105' : 
          isTarget && currentStage > 3 ? 'border-emerald-500/50 bg-[#092328]/80 z-10' :
          'border-slate-700/50 bg-slate-800/30 opacity-50 scale-95 z-0'}`}
      >
        <div className={`p-2 rounded-full ${isActive ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-sm font-medium ${isActive || (isTarget && currentStage > 3) ? 'text-white' : 'text-slate-400'}`}>{title}</span>
        {state === 'completed' && (
          <CheckCircle className="text-emerald-500 w-4 h-4 ml-auto" />
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#092328] to-[#0a3a32] p-6 md:p-10 text-slate-200 font-sans rounded-3xl overflow-hidden shadow-2xl relative border border-slate-700/50">
      {/* Glow Effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header & Scenario Switcher */}
      <div className="relative z-20 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Cpu className="text-emerald-500 w-8 h-8" />
            Smart IVR Routing
          </h2>
          <p className="text-emerald-400/80 text-sm md:text-base font-medium tracking-wide uppercase">Interactive Technical Flow</p>
        </div>

        <div className="flex bg-[#07191d] p-1.5 rounded-xl border border-slate-700/50 w-full xl:w-auto overflow-x-auto">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioChange(scenario.id)}
              className={`flex-1 xl:flex-none whitespace-nowrap px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${activeScenario === scenario.id ? 'bg-emerald-600/90 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'}`}
            >
              {scenario.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
          {currentStage >= 5 ? (
            <button onClick={resetSimulation} className="flex flex-1 xl:flex-none justify-center items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          ) : !isPlaying ? (
            <button onClick={playSimulation} className="flex flex-1 xl:flex-none justify-center items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#092328] font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Play className="w-4 h-4" /> {currentStage === 0 ? 'Start Flow' : 'Resume'}
            </button>
          ) : (
            <button onClick={pauseSimulation} className="flex flex-1 xl:flex-none justify-center items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-[#092328] font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Pause className="w-4 h-4" /> Pause
            </button>
          )}
          <button onClick={nextStep} disabled={isPlaying || currentStage >= 5} className="p-2.5 bg-slate-800/80 border border-slate-700/50 hover:bg-slate-700 text-white rounded-xl disabled:opacity-40 transition-colors" title="Step Forward">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Flow Layout */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-8 lg:gap-4 py-8 min-h-[300px]">
        
        {/* Animated Connecting Lines (Desktop) */}
        <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-1 bg-slate-800 -translate-y-1/2 z-0 rounded-full overflow-hidden">
          {currentStage > 0 && (
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
              initial={{ width: "0%" }}
              animate={{ 
                width: currentStage === 1 ? "15%" : 
                       currentStage === 2 ? "45%" : 
                       currentStage === 3 ? "75%" : "100%" 
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </div>

        {/* Animated Connecting Lines (Mobile) */}
        <div className="lg:hidden absolute left-1/2 top-12 bottom-12 w-1 bg-slate-800 -translate-x-1/2 z-0 rounded-full overflow-hidden">
          {currentStage > 0 && (
            <motion.div 
              className="w-full bg-gradient-to-b from-emerald-600 via-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
              initial={{ height: "0%" }}
              animate={{ 
                height: currentStage === 1 ? "15%" : 
                        currentStage === 2 ? "45%" : 
                        currentStage === 3 ? "75%" : "100%" 
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </div>

        {/* Moving Dot / Pulse */}
        <AnimatePresence>
          {isPlaying && currentStage > 0 && currentStage < 4 && (
             <motion.div 
               className="hidden lg:block absolute top-1/2 w-4 h-4 bg-white rounded-full z-10 shadow-[0_0_15px_#fff]"
               initial={{ left: "10%", y: "-50%", opacity: 0 }}
               animate={{ 
                 left: currentStage === 1 ? "25%" : currentStage === 2 ? "55%" : "85%",
                 opacity: [0, 1, 1, 0],
                 scale: [0.5, 1.2, 1, 0.5]
               }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             />
          )}
        </AnimatePresence>

        {/* Stage 1 */}
        <div className="relative z-10 flex-1 flex justify-center w-full max-w-[260px]">
          <NodeCard 
            title="Customer Calls IP Phone Number" 
            icon={PhoneIncoming} 
            state={getNodeState(1)}
            subtitle={currentStage === 1 ? "Ringing..." : ""}
          />
        </div>

        {/* Stage 2 */}
        <div className="relative z-10 flex-1 flex justify-center w-full max-w-[260px]">
          <NodeCard 
            title="Dynamic IVR Engine" 
            subtitle={currentStage === 2 ? "Checking Caller ID & CRM DB..." : ""}
            icon={Cpu} 
            state={getNodeState(2)}
          />
        </div>

        {/* Stage 3 (Branching) */}
        <div className="relative z-10 flex-1 flex flex-col justify-center gap-4 w-full max-w-[300px]">
          <div className="bg-[#0b2b31]/80 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-xl shadow-xl flex flex-col gap-3 relative">
            {currentStage === 3 && (
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-sm animate-pulse -z-10" />
            )}
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider text-center mb-1">Decision Matrix</h4>
            <BranchCard title="VIP / Priority Direct Route" icon={Crown} branchType="vip" />
            <BranchCard title="Time & Region Condition" icon={Clock} branchType="time" />
            <BranchCard title="Skill Matching & DTMF" icon={Sliders} branchType="skill" />
          </div>
        </div>

        {/* Stage 4 */}
        <div className="relative z-10 flex-1 flex justify-center w-full max-w-[260px]">
          <NodeCard 
            title="Route to Agent / PBX" 
            subtitle={currentStage >= 4 ? 'Call Connected Successfully!' : ''}
            icon={Headphones} 
            state={getNodeState(4)}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedIVRFlow;
