import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Bot,
  Sparkles,
  PhoneCall,
  Activity,
  Mic2,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminAiCallingManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/ai-calling/admin/all-campaigns')
      .then((res) => {
        if (res.data.success) {
          setCampaigns(res.data.campaigns || []);
          setRecentLogs(res.data.recentLogs || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">AI Calling & Voice Bot Orchestrator</h1>
        <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
          Monitor all active outbound campaign pipelines, concurrency loads, and Bangla TTS delivery statistics.
        </p>
      </div>

      {/* Global Campaigns */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-[#092328]">System-Wide Campaigns ({campaigns.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-sm">
                <th className="pb-3">Campaign Name & User</th>
                <th className="pb-3">Voice Model</th>
                <th className="pb-3">Contacts Progress</th>
                <th className="pb-3">Successful Calls</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">Loading campaign pipelines...</td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">No campaigns launched yet</td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-[#092328]">{c.name}</div>
                      <div className="text-[11px] text-slate-400">{c.user_name} ({c.user_email})</div>
                    </td>
                    <td className="py-3.5 text-slate-600 text-sm font-semibold">{c.voice_type}</td>
                    <td className="py-3.5 font-bold text-slate-700">{c.contacts_completed} / {c.total_contacts}</td>
                    <td className="py-3.5 font-bold text-emerald-600">{c.successful_calls} Passed</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        c.status === 'running' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400 text-sm">{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global AI Call Logs */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-[#092328]">Live AI Call Stream</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-sm">
                <th className="pb-3">User</th>
                <th className="pb-3">From Number</th>
                <th className="pb-3">To Destination</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Cost</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">No recent AI call records</td>
                </tr>
              ) : (
                recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 font-bold text-[#092328]">{log.user_name}</td>
                    <td className="py-3.5 font-mono text-slate-500 text-sm">{log.from_number}</td>
                    <td className="py-3.5 font-mono text-[#092328] font-bold text-sm">{log.to_number}</td>
                    <td className="py-3.5 text-slate-600 text-sm">{log.duration_seconds}s</td>
                    <td className="py-3.5 font-bold text-emerald-600">৳{log.cost}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400 text-sm">{new Date(log.created_at).toLocaleTimeString()}</td>
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

