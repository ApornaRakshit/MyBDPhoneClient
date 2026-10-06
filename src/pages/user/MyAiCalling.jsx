

import API from '../../services/api';
import {
  
  Plus,
  Play,
  Pause,
  Trash2,
  
  X,
  AlertCircle
} from 'lucide-react';

export const MyAiCalling = () => {
  const [overview, setOverview] = useState(null);
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [voiceType, setVoiceType] = useState('Bangla Natural Female');
  const [scriptTemplate, setScriptTemplate] = useState(
    'আসসালামু আলাইকুম {name}! MyBDPhone এর পক্ষ থেকে আপনাকে শুভেচ্ছা। আমাদের অফার জানতে ১ চাপুন।'
  );
  const [contactsText, setContactsText] = useState('01711000001, Rahim\n01811000002, Karim\n01911000003, Farhana');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [ovRes, vRes] = await Promise.all([
        API.get('/ai-calling/my-overview'),
        API.get('/ai-calling/voices'),
      ]);
      setOverview(ovRes.data?.data || null);
      setVoices(vRes.data?.voices || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setError('');

    // Parse contacts
    const lines = contactsText.split('\n').filter((l) => l.trim().length > 0);
    const contacts = lines.map((line) => {
      const parts = line.split(',');
      return {
        phone_number: parts[0]?.trim() || '',
        contact_name: parts[1]?.trim() || 'Customer',
      };
    });

    if (contacts.length === 0) {
      setError('Please add at least 1 contact number');
      return;
    }

    setCreating(true);
    try {
      await API.post('/ai-calling/campaigns', {
        name,
        voice_type: voiceType,
        script_template: scriptTemplate,
        contacts,
      });
      setShowModal(false);
      setName('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to launch campaign');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'running' ? 'paused' : 'running';
    try {
      await API.put(`/ai-calling/campaigns/${id}/status`, { status: nextStatus });
      loadData();
    } catch (err) {
      alert('Error updating campaign');
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Delete this AI campaign?')) return;
    try {
      await API.delete(`/ai-calling/campaigns/${id}`);
      loadData();
    } catch (err) {
      alert('Error deleting campaign');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-400">Loading AI Calling Studio...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">My AI Calling Studio</h1>
          <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
            Automate outbound customer calls with natural Bangla AI voices and campaign tracking.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#12544F] to-[#2A835F] text-white shadow-md hover:brightness-110 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Campaign</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Remaining AI Minutes</div>
          <div className="text-3xl font-black text-[#2A835F]">{overview?.ai_minutes || 0}</div>
          <p className="text-[11px] text-slate-500">Bangla & English TTS minutes</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Campaigns</div>
          <div className="text-3xl font-black text-[#092328]">{overview?.campaigns_count || 0}</div>
          <p className="text-[11px] text-slate-500">Outbound voice queues</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Automated Calls</div>
          <div className="text-3xl font-black text-[#12544F]">{overview?.total_calls || 0}</div>
          <p className="text-[11px] text-slate-500">{overview?.total_minutes_used || 0} mins delivered</p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-[#092328]">Voice Automation Campaigns</h3>
            <p className="text-sm text-slate-400">Manage campaign schedules, voice models, and delivery status</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Campaign Name</th>
                <th className="pb-3">Voice Model</th>
                <th className="pb-3">Contacts Progress</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {overview?.campaigns?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    No campaigns created yet. Click "Create New Campaign" to start dialing!
                  </td>
                </tr>
              ) : (
                overview?.campaigns?.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="py-3 font-bold text-slate-800">
                      <div>{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate max-w-xs">{c.script_template}</div>
                    </td>
                    <td className="py-3 text-slate-600">{c.voice_type}</td>
                    <td className="py-3">
                      <div className="text-slate-800 font-bold">{c.contacts_completed} / {c.total_contacts}</div>
                      <div className="text-[10px] text-emerald-600">{c.successful_calls} Successful</div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'running' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(c.id, c.status)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        title={c.status === 'running' ? 'Pause Campaign' : 'Resume Campaign'}
                      >
                        {c.status === 'running' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(c.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-[#2A835F]">New Campaign</span>
              <h3 className="text-xl font-black text-[#092328] mt-0.5">Launch Outbound Voice Bot</h3>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-sm">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramadan Customer Greeting"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Select AI Voice Model</label>
                <select
                  value={voiceType}
                  onChange={(e) => setVoiceType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
                >
                  <option value="Bangla Natural Female">Bangla Natural Female (Nusrat - Dhaka Accent)</option>
                  <option value="Bangla Neural Male">Bangla Neural Male (Tanvir - Corporate)</option>
                  <option value="Bangla Expressive Female">Bangla Expressive Female (Farhana)</option>
                  <option value="English Neural Female">English Neural Female (Sarah)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Speech Script Template *</label>
                <textarea
                  required
                  rows={3}
                  value={scriptTemplate}
                  onChange={(e) => setScriptTemplate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
                />
                <p className="text-[10px] text-slate-400 mt-1">Available merge tags: <code>{'{name}'}</code>, <code>{'{company}'}</code></p>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Contact Phone Numbers (1 per line) *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="01711XXXXXX, Customer Name"
                  value={contactsText}
                  onChange={(e) => setContactsText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono focus:bg-white focus:border-[#2A835F] focus:outline-hidden"
                />
                <p className="text-[10px] text-slate-400 mt-1">Format: <code>Phone_Number, Optional_Name</code></p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#12544F] to-[#2A835F] shadow-md"
                >
                  {creating ? 'Initiating Calls...' : 'Launch Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

