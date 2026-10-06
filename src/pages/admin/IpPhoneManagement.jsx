import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Phone,
  Plus,
  Search,
  CheckCircle2,
  X,
  AlertCircle,
  UserCheck,
  UserX,
  Server
} from 'lucide-react';

export const AdminIpPhoneManagement = () => {
  const [numbers, setNumbers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Number Form
  const [newNumber, setNewNumber] = useState('');
  const [category, setCategory] = useState('regular');
  const [price, setPrice] = useState('0');
  const [maxDevices, setMaxDevices] = useState('5');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadNumbers = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/ip-phone/admin/all-numbers${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      if (res.data.success) {
        setNumbers(res.data.numbers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNumbers();
  }, []);

  const handleAddNumber = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setAdding(true);

    try {
      const res = await API.post('/ip-phone/admin/add-number', {
        number: newNumber,
        category,
        price,
        max_devices: maxDevices,
      });

      if (res.data.success) {
        setMessage(res.data.message);
        loadNumbers();
        setTimeout(() => {
          setShowAddModal(false);
          setNewNumber('');
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add number');
    } finally {
      setAdding(false);
    }
  };

  const handleRevokeNumber = async (num) => {
    if (!window.confirm(`Revoke 096 number ${num.number} from user ${num.user_name}?`)) return;
    try {
      await API.put(`/ip-phone/admin/numbers/${num.id}/assign-revoke`, { action: 'revoke' });
      loadNumbers();
    } catch (err) {
      alert('Error revoking number');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">096 IP Numbers Pool & Inventory</h1>
          <p className="text-sm sm:text-sm text-slate-500 mt-0.5">
            Add new 096 lines, assign numbers to subscribers, and monitor SIP device allocations.
          </p>
        </div>

        <button
          onClick={() => { setShowAddModal(true); setMessage(''); setError(''); }}
          className="px-5 py-2.5 rounded-xl font-bold text-sm bg-[#12544F] text-white hover:bg-[#092328] shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add 096 Number to Pool</span>
        </button>
      </div>

      {/* Numbers Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-sm">
                <th className="pb-3">096 Number</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Assigned User</th>
                <th className="pb-3">Max Devices</th>
                <th className="pb-3">SIP Username</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">Loading number pool...</td>
                </tr>
              ) : numbers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">No numbers in inventory</td>
                </tr>
              ) : (
                numbers.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#092328] text-sm">{n.number}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-[#12544F]/10 text-[#12544F]">
                        {n.category}
                      </span>
                    </td>
                    <td className="py-3.5">
                      {n.user_name ? (
                        <div>
                          <div className="font-bold text-[#092328]">{n.user_name}</div>
                          <div className="text-[10px] text-slate-400">{n.user_email}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-sm">Unassigned (In Pool)</span>
                      )}
                    </td>
                    <td className="py-3.5 text-slate-700 font-bold text-sm">{n.max_devices} Devices</td>
                    <td className="py-3.5 font-mono text-slate-500 text-sm">{n.sip_username || `sip_${n.number}`}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        n.status === 'assigned' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {n.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {n.status === 'assigned' ? (
                        <button
                          onClick={() => handleRevokeNumber(n)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-sm font-bold cursor-pointer"
                        >
                          Revoke
                        </button>
                      ) : (
                        <span className="text-sm text-slate-400">Available</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Number Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 space-y-5 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-[#12544F]">Inventory Manager</span>
              <h3 className="text-xl font-black text-[#092328] mt-0.5">Add 096 Number</h3>
            </div>

            {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>}
            {message && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">{message}</div>}

            <form onSubmit={handleAddNumber} className="space-y-3.5 text-sm">
              <div>
                <label className="text-slate-700 font-bold block mb-1 text-sm">096 IP Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 096490123756"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden focus:border-[#12544F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden"
                  >
                    <option value="regular">Regular</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold VIP</option>
                    <option value="platinum">Platinum VIP</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1 text-sm">Device Slots</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={maxDevices}
                    onChange={(e) => setMaxDevices(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#092328] focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-[#12544F] text-white hover:bg-[#092328] transition-colors cursor-pointer text-sm shadow-xs"
                >
                  {adding ? 'Adding...' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

