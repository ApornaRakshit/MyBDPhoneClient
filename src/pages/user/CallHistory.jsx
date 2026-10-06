import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  PhoneCall,
  ArrowUpRight,
  ArrowDownLeft,
  Bot,
  Play,
  Pause,
  Filter,
  Volume2,
  Clock
} from 'lucide-react';

export const UserCallHistory = () => {
  const [calls, setCalls] = useState([]);
  const [callType, setCallType] = useState('');
  const [loading, setLoading] = useState(true);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const loadCalls = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/calls/my${callType ? `?call_type=${callType}` : ''}`);
      if (res.data.success) {
        setCalls(res.data.calls);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalls();
  }, [callType]);

  const handlePlayRecording = (callId, url) => {
    if (playingAudioId === callId) {
      setPlayingAudioId(null);
      return;
    }
    setPlayingAudioId(callId);
    const audio = new Audio(url || 'https://actions.google.com/sounds/v1/telephones/phone_ring.ogg');
    audio.play().catch(() => {});
    audio.onended = () => setPlayingAudioId(null);
  };

  const handleSimulateCall = async () => {
    try {
      await API.post('/calls/simulate', { call_type: 'outgoing', to_number: '01819922883' });
      loadCalls();
    } catch (e) {
      alert('Simulation error');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">Call History & Recordings</h1>
          <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
            Log of all inbound calls, outbound dialed lines, and automated AI voice campaigns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={callType}
            onChange={(e) => setCallType(e.target.value)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 focus:outline-hidden"
          >
            <option value="">All Call Types</option>
            <option value="incoming">Incoming Calls</option>
            <option value="outgoing">Outgoing Calls</option>
            <option value="ai_outbound">AI Voice Outbound</option>
          </select>

          <button
            onClick={handleSimulateCall}
            className="px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#2A835F]" />
            <span>Generate Test Call</span>
          </button>
        </div>
      </div>

      {/* Calls Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Type</th>
                <th className="pb-3">From Number</th>
                <th className="pb-3">To Number</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Cost</th>
                <th className="pb-3">Date & Time</th>
                <th className="pb-3">Recording</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">Loading call history...</td>
                </tr>
              ) : calls.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">No call records found</td>
                </tr>
              ) : (
                calls.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {c.call_type === 'incoming' ? (
                          <span className="p-1 rounded-full bg-blue-50 text-blue-600"><ArrowDownLeft className="w-3.5 h-3.5" /></span>
                        ) : c.call_type === 'ai_outbound' ? (
                          <span className="p-1 rounded-full bg-[#2A835F]/10 text-[#2A835F]"><Bot className="w-3.5 h-3.5" /></span>
                        ) : (
                          <span className="p-1 rounded-full bg-emerald-50 text-emerald-600"><ArrowUpRight className="w-3.5 h-3.5" /></span>
                        )}
                        <span className="capitalize font-bold text-slate-700">{c.call_type.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-3 font-bold text-slate-800 font-mono">{c.from_number}</td>
                    <td className="py-3 font-bold text-slate-800 font-mono">{c.to_number}</td>
                    <td className="py-3 text-slate-600">{c.duration_seconds}s</td>
                    <td className="py-3 font-black text-slate-800">৳{c.cost}</td>
                    <td className="py-3 text-slate-500">{new Date(c.created_at).toLocaleString()}</td>
                    <td className="py-3">
                      {c.recording_url ? (
                        <button
                          onClick={() => handlePlayRecording(c.id, c.recording_url)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                            playingAudioId === c.id
                              ? 'bg-[#2A835F] text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {playingAudioId === c.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          <span>{playingAudioId === c.id ? 'Playing...' : 'Audio'}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">No Audio</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        c.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                        c.status === 'missed' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

