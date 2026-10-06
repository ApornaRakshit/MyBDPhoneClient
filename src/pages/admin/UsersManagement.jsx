import React, { useEffect, useMemo, useState } from 'react';
import API from '../../services/api';
import {
  Users, Search, Wallet, CheckCircle2, Ban, Plus, Minus, X,
  RefreshCw, UserRound, CreditCard, Phone, ShieldCheck, Receipt,
  ShoppingBag, PhoneCall, Bot, LifeBuoy, Activity, Pencil, Save,
  AlertCircle, Clock3
} from 'lucide-react';

const money = (value) => `৳${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const dateTime = (value) => value ? new Date(value).toLocaleString() : '—';

const StatusBadge = ({ value, tone }) => {
  const classes = tone || (value === 'active' || value === 'verified'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : value === 'pending' || value === 'unsubmitted'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-rose-50 text-rose-700 border-rose-200');
  return <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${classes}`}>{value || '—'}</span>;
};

export const AdminUsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({ name:'', email:'', phone:'', password:'', company_name:'', address:'', initial_balance:'0' });

  const [adjAmount, setAdjAmount] = useState('');
  const [adjDirection, setAdjDirection] = useState('credit');
  const [adjReason, setAdjReason] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  const [editForm, setEditForm] = useState({ name: '', phone: '', company_name: '', address: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [kycNote, setKycNote] = useState('');
  const [savingKyc, setSavingKyc] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());
      const res = await API.get(`/admin/users?${params.toString()}`);
      if (res.data.success) setUsers(res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (userId, keepTab = false) => {
    setDetailLoading(true);
    setError('');
    try {
      const res = await API.get(`/admin/users/${userId}`);
      if (res.data.success) {
        setDetail(res.data.data);
        const u = res.data.data.user;
        setEditForm({ name: u.name || '', phone: u.phone || '', company_name: u.company_name || '', address: u.address || '' });
        if (!keepTab) setActiveTab('overview');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user details');
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, [statusFilter]);

  const openDetails = async (user) => {
    setSelectedUser(user);
    setNotice('');
    setError('');
    setActiveTab('overview');
    setAdjAmount('500');
    setAdjDirection('credit');
    setAdjReason('Promotional Credit / Manual Adjustment');
    setKycNote('');
    await loadDetail(user.id);
  };

  const closeDetails = () => {
    setSelectedUser(null);
    setDetail(null);
    setError('');
    setNotice('');
  };

  const refreshCurrent = async () => {
    await loadUsers();
    if (selectedUser?.id) await loadDetail(selectedUser.id, true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreatingUser(true); setError(''); setNotice('');
    try {
      const res = await API.post('/admin/users', { ...newUser, initial_balance: Number(newUser.initial_balance || 0) });
      if (res.data.success) {
        setNotice('Customer account created successfully.');
        setShowCreateUser(false);
        setNewUser({ name:'', email:'', phone:'', password:'', company_name:'', address:'', initial_balance:'0' });
        await loadUsers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create customer');
    } finally { setCreatingUser(false); }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`${nextStatus === 'suspended' ? 'Suspend' : 'Activate'} ${user.name}?`)) return;
    try {
      await API.put(`/admin/users/${user.id}/status`, { status: nextStatus });
      setNotice(`Account ${nextStatus === 'active' ? 'activated' : 'suspended'} successfully.`);
      await refreshCurrent();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating user status');
    }
  };

  const handleAdjustBalance = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setAdjusting(true); setError(''); setNotice('');
    try {
      const res = await API.post('/recharge/admin/adjust-balance', {
        user_id: selectedUser.id,
        amount: adjAmount,
        direction: adjDirection,
        reason: adjReason,
      });
      if (res.data.success) {
        setNotice(`${res.data.message}. New balance: ${money(res.data.new_balance)}`);
        await refreshCurrent();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to adjust balance');
    } finally {
      setAdjusting(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!detail?.user?.id) return;
    setSavingProfile(true); setError(''); setNotice('');
    try {
      const res = await API.put(`/admin/users/${detail.user.id}/profile`, editForm);
      if (res.data.success) {
        setNotice('User profile updated successfully.');
        await refreshCurrent();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleKyc = async (status) => {
    if (!detail?.user?.id) return;
    setSavingKyc(true); setError(''); setNotice('');
    try {
      const res = await API.put(`/admin/users/${detail.user.id}/kyc`, { status, note: kycNote });
      if (res.data.success) {
        setNotice(`KYC marked as ${status}.`);
        await refreshCurrent();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update KYC');
    } finally {
      setSavingKyc(false);
    }
  };

  const summaryCards = useMemo(() => {
    if (!detail) return [];
    return [
      { label: 'Wallet', value: money(detail.user.balance), icon: Wallet },
      { label: 'Active Plans', value: detail.summary.active_subscriptions, icon: CreditCard },
      { label: '096 Numbers', value: detail.summary.assigned_numbers, icon: Phone },
      { label: 'Calls', value: detail.summary.total_calls, icon: PhoneCall },
      { label: 'Open Tickets', value: detail.summary.open_tickets, icon: LifeBuoy },
    ];
  }, [detail]);

  const tabs = [
    ['overview', 'Overview', UserRound],
    ['wallet', 'Wallet', Wallet],
    ['subscriptions', 'Subscriptions', CreditCard],
    ['kyc', 'KYC', ShieldCheck],
    ['numbers', '096 / SIP', Phone],
    ['calls', 'Calls', PhoneCall],
    ['ai', 'AI Calling', Bot],
    ['orders', 'Orders', ShoppingBag],
    ['payments', 'Payments', Receipt],
    ['tickets', 'Support', LifeBuoy],
    ['activity', 'Activity', Activity],
  ];

  const renderRows = (items, columns, empty = 'No records found') => (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider">
          <tr>{columns.map(([key, label]) => <th key={key} className="px-4 py-3 font-bold">{label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {!items?.length ? <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">{empty}</td></tr> : items.map((item, idx) => (
            <tr key={item.id || idx} className="hover:bg-slate-50/70">
              {columns.map(([key]) => <td key={key} className="px-4 py-3 text-slate-700">{typeof key === 'function' ? key(item) : item[key] ?? '—'}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTab = () => {
    if (!detail) return null;
    if (activeTab === 'overview') return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {summaryCards.map(({ label, value, icon: Icon }) => <div key={label} className="p-4 rounded-2xl bg-slate-50 border border-slate-200"><Icon className="w-4 h-4 text-[#12544F]"/><div className="text-lg font-black text-[#092328] mt-2">{value}</div><div className="text-[10px] font-bold text-slate-400 uppercase">{label}</div></div>)}
        </div>
        <form onSubmit={handleProfileSave} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-black text-[#092328]">Customer Profile</h3><Pencil className="w-4 h-4 text-slate-400"/></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[['name','Name'],['phone','Phone'],['company_name','Company']].map(([key,label]) => <label key={key} className="text-sm font-bold text-slate-600">{label}<input value={editForm[key]} onChange={e=>setEditForm({...editForm,[key]:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-[#12544F]" /></label>)}
            <label className="text-sm font-bold text-slate-600 md:col-span-2">Address<textarea value={editForm.address} onChange={e=>setEditForm({...editForm,address:e.target.value})} rows="2" className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-[#12544F]" /></label>
          </div>
          <button disabled={savingProfile} className="px-4 py-2.5 rounded-xl bg-[#12544F] text-white text-sm font-bold inline-flex items-center gap-2"><Save className="w-4 h-4"/>{savingProfile ? 'Saving...' : 'Save Profile'}</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white"><h3 className="font-black text-[#092328] mb-3">Account</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-slate-400">Email</span><b>{detail.user.email}</b></div><div className="flex justify-between"><span className="text-slate-400">Role</span><b>{detail.user.role}</b></div><div className="flex justify-between"><span className="text-slate-400">Created</span><b>{dateTime(detail.user.created_at)}</b></div><div className="flex justify-between"><span className="text-slate-400">Last login</span><b>{dateTime(detail.user.last_login)}</b></div></div></div>
          <div className="p-5 rounded-2xl border border-slate-200 bg-white"><h3 className="font-black text-[#092328] mb-3">KYC</h3><div className="flex items-center justify-between"><StatusBadge value={detail.user.kyc_status}/><button onClick={()=>setActiveTab('kyc')} className="text-sm font-bold text-[#12544F]">Manage KYC →</button></div><p className="text-sm text-slate-500 mt-3">NID / Passport: <b className="text-slate-700">{detail.user.nid_number || 'Not submitted'}</b></p></div>
        </div>
      </div>
    );

    if (activeTab === 'wallet') return <div className="space-y-5"><div className="p-5 rounded-2xl bg-[#092328] text-white flex items-center justify-between"><div><div className="text-sm text-slate-300">Current wallet</div><div className="text-3xl font-black mt-1">{money(detail.user.balance)}</div></div><Wallet className="w-8 h-8 text-[#8BBB92]"/></div><form onSubmit={handleAdjustBalance} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4"><h3 className="font-black text-[#092328]">Manual Wallet Adjustment</h3><div className="grid grid-cols-2 gap-2"><button type="button" onClick={()=>setAdjDirection('credit')} className={`p-3 rounded-xl font-bold text-sm ${adjDirection==='credit'?'bg-[#12544F] text-white':'bg-slate-100 text-slate-600'}`}><Plus className="w-4 h-4 inline mr-1"/>Credit</button><button type="button" onClick={()=>setAdjDirection('debit')} className={`p-3 rounded-xl font-bold text-sm ${adjDirection==='debit'?'bg-rose-600 text-white':'bg-slate-100 text-slate-600'}`}><Minus className="w-4 h-4 inline mr-1"/>Debit</button></div><input required min="0.01" type="number" step="0.01" value={adjAmount} onChange={e=>setAdjAmount(e.target.value)} placeholder="Amount" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm"/><input required value={adjReason} onChange={e=>setAdjReason(e.target.value)} placeholder="Reason" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm"/><button disabled={adjusting} className="w-full py-3 rounded-xl bg-[#12544F] text-white text-sm font-bold">{adjusting?'Processing...':'Execute Adjustment'}</button></form>{renderRows(detail.transactions,[['transaction_code','Code'],['type','Type'],['description','Description'],[x=>`${x.direction==='credit'?'+':'-'}${money(x.amount)}`,'Amount'],['balance_after','Balance After'],['status','Status'],['created_at','Date']])}</div>;

    if (activeTab === 'subscriptions') return renderRows(detail.subscriptions,[['package_name','Package'],['service_type','Service'],['status','Status'],['assigned_number','Number'],['started_at','Started'],['expires_at','Expires'],['auto_renew','Auto Renew']]);
    if (activeTab === 'kyc') return <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-5"><div className="flex items-center justify-between"><div><h3 className="font-black text-[#092328]">KYC Review</h3><p className="text-sm text-slate-500 mt-1">User submission stays pending until an administrator reviews it.</p></div><StatusBadge value={detail.user.kyc_status}/></div><div className="grid md:grid-cols-2 gap-4 text-sm"><div className="p-4 rounded-xl bg-slate-50"><span className="text-slate-400">NID / Passport</span><div className="font-bold mt-1">{detail.user.nid_number || 'Not submitted'}</div></div><div className="p-4 rounded-xl bg-slate-50"><span className="text-slate-400">Address</span><div className="font-bold mt-1">{detail.user.address || 'Not submitted'}</div></div></div><textarea value={kycNote} onChange={e=>setKycNote(e.target.value)} placeholder="Optional admin note" rows="3" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm"/><div className="flex flex-wrap gap-2"><button disabled={savingKyc} onClick={()=>handleKyc('verified')} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold">Approve</button><button disabled={savingKyc} onClick={()=>handleKyc('rejected')} className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold">Reject</button><button disabled={savingKyc} onClick={()=>handleKyc('pending')} className="px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-bold">Request Review</button><button disabled={savingKyc} onClick={()=>handleKyc('unsubmitted')} className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 text-sm font-bold">Reset</button></div></div>;
    if (activeTab === 'numbers') return <div className="space-y-4">{detail.numbers.map(n=><div key={n.id} className="p-5 rounded-2xl border border-slate-200 bg-white grid md:grid-cols-4 gap-4 text-sm"><div><div className="text-slate-400">096 Number</div><div className="font-black text-lg font-mono text-[#12544F]">{n.number}</div></div><div><div className="text-slate-400">Status</div><div className="mt-1"><StatusBadge value={n.status}/></div></div><div><div className="text-slate-400">SIP Username</div><div className="font-mono font-bold mt-1">{n.sip_username || '—'}</div></div><div><div className="text-slate-400">Devices</div><div className="font-bold mt-1">{n.device_count || 0} / {n.max_devices}</div></div></div>)}{!detail.numbers.length && <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border">No assigned 096 number.</div>}</div>;
    if (activeTab === 'calls') return renderRows(detail.calls,[['call_type','Type'],['from_number','From'],['to_number','To'],['duration_seconds','Duration (sec)'],[x=>money(x.cost),'Cost'],['status','Status'],['created_at','Date']]);
    if (activeTab === 'ai') return renderRows(detail.campaigns,[['name','Campaign'],['status','Status'],['voice_type','Voice'],['total_contacts','Contacts'],['successful_calls','Successful'],['failed_calls','Failed'],['created_at','Created']]);
    if (activeTab === 'orders') return renderRows(detail.orders,[['order_number','Order'],['item_title','Item'],[x=>money(x.amount),'Amount'],['payment_method','Payment'],['payment_status','Payment Status'],['status','Status'],['created_at','Date']]);
    if (activeTab === 'payments') return renderRows(detail.payments,[['gateway_unique_txn_id','Gateway Txn'],['gateway','Gateway'],[x=>money(x.amount),'Amount'],['gateway_status','Gateway Status'],['status','Status'],['paid_at','Paid At'],['created_at','Created']]);
    if (activeTab === 'tickets') return renderRows(detail.tickets,[['ticket_code','Ticket'],['subject','Subject'],['priority','Priority'],['status','Status'],['reply_count','Replies'],['created_at','Created']]);
    if (activeTab === 'activity') return renderRows(detail.activity,[['action','Action'],['description','Description'],['admin_name','Admin'],['created_at','Date']]);
    return null;
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#092328]">Users & Subscriber Directory</h1><p className="text-sm text-slate-500 mt-1">One customer record shared by Admin and User panels through the same database and protected APIs.</p></div>
        <div className="flex gap-2"><button onClick={()=>setShowCreateUser(true)} className="px-4 py-2 rounded-xl bg-[#12544F] text-white text-sm font-bold inline-flex items-center gap-2"><Plus className="w-4 h-4"/>Add Customer</button><button onClick={refreshCurrent} className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 inline-flex items-center gap-2"><RefreshCw className="w-4 h-4"/>Refresh</button></div>
      </div>

      {(error || notice) && <div className={`p-3 rounded-xl border text-sm font-bold ${error?'bg-rose-50 border-rose-200 text-rose-700':'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>{error || notice}</div>}

      <div className="flex flex-col sm:flex-row gap-3"><form onSubmit={e=>{e.preventDefault();loadUsers();}} className="flex-1 relative"><Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, email, phone, company..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-[#092328] focus:outline-none focus:border-[#12544F]"/></form><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="p-3 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700"><option value="">All Statuses</option><option value="active">Active</option><option value="suspended">Suspended</option><option value="inactive">Inactive</option></select></div>

      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-sm"><th className="pb-3">User</th><th className="pb-3">Contact</th><th className="pb-3">Wallet</th><th className="pb-3">Plans</th><th className="pb-3">KYC</th><th className="pb-3">Status</th><th className="pb-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{loading?<tr><td colSpan="7" className="py-10 text-center text-slate-400">Loading users...</td></tr>:users.length===0?<tr><td colSpan="7" className="py-10 text-center text-slate-400">No users found</td></tr>:users.map(u=><tr key={u.id} className="hover:bg-slate-50"><td className="py-4"><div className="font-bold text-[#092328]">{u.name}</div><div className="text-[11px] text-slate-400">{u.email}</div>{u.company_name&&<div className="text-[11px] text-[#2A835F] font-semibold">{u.company_name}</div>}</td><td className="py-4 font-mono text-sm">{u.phone||'N/A'}</td><td className="py-4"><div className="font-black text-emerald-600">{money(u.balance)}</div><div className="text-[10px] text-slate-400">{u.ai_minutes||0} AI mins</div></td><td className="py-4"><span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#12544F]/10 text-[#12544F]">{u.active_plans_count} Active</span></td><td className="py-4"><StatusBadge value={u.kyc_status}/></td><td className="py-4"><StatusBadge value={u.status}/></td><td className="py-4 text-right"><div className="flex justify-end gap-2"><button onClick={()=>openDetails(u)} className="px-3 py-2 rounded-lg bg-[#12544F] text-white text-sm font-bold">View / Manage</button>{u.role!=='admin'&&<button onClick={()=>handleToggleStatus(u)} className={`px-3 py-2 rounded-lg text-sm font-bold border ${u.status==='active'?'bg-rose-50 text-rose-700 border-rose-200':'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{u.status==='active'?'Suspend':'Activate'}</button>}</div></td></tr>)}</tbody></table></div></div>

      {showCreateUser && <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4"><form onSubmit={handleCreateUser} className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-4"><div className="flex justify-between items-center"><div><h2 className="text-xl font-black text-[#092328]">Add New Customer</h2><p className="text-sm text-slate-500 mt-1">Create a normal subscriber account. It will be available immediately in the User Panel.</p></div><button type="button" onClick={()=>setShowCreateUser(false)} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5"/></button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{[['name','Full name'],['email','Email'],['phone','Phone'],['password','Temporary password'],['company_name','Company name'],['initial_balance','Initial wallet balance']].map(([key,label])=><label key={key} className="text-sm font-bold text-slate-600">{label}<input required={['name','email','password'].includes(key)} type={key==='initial_balance'?'number':key==='password'?'password':'text'} min={key==='initial_balance'?'0':undefined} value={newUser[key]} onChange={e=>setNewUser({...newUser,[key]:e.target.value})} className="mt-1 w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#12544F]"/></label>)}</div><label className="text-sm font-bold text-slate-600 block">Address<textarea value={newUser.address} onChange={e=>setNewUser({...newUser,address:e.target.value})} rows="2" className="mt-1 w-full p-3 rounded-xl border border-slate-200 bg-slate-50"/></label><div className="flex justify-end gap-2"><button type="button" onClick={()=>setShowCreateUser(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold">Cancel</button><button disabled={creatingUser} className="px-5 py-2.5 rounded-xl bg-[#12544F] text-white text-sm font-bold">{creatingUser?'Creating...':'Create Customer'}</button></div></form></div>}

      {selectedUser && <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"><div className="bg-[#F8FAFC] rounded-3xl w-full max-w-7xl h-[94vh] overflow-hidden shadow-2xl border border-white/20 flex flex-col"><div className="bg-white border-b border-slate-200 p-4 sm:p-6 flex items-start justify-between gap-4"><div><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-2xl bg-[#12544F] text-white flex items-center justify-center font-black">{detail?.user?.name?.charAt(0)?.toUpperCase()||'U'}</div><div><h2 className="text-xl sm:text-2xl font-black text-[#092328]">{detail?.user?.name || selectedUser.name}</h2><p className="text-sm text-slate-500">{detail?.user?.email || selectedUser.email} · {detail?.user?.phone || selectedUser.phone || 'No phone'}</p></div></div><div className="flex flex-wrap gap-2 mt-3"><StatusBadge value={detail?.user?.status || selectedUser.status}/><StatusBadge value={detail?.user?.kyc_status || selectedUser.kyc_status}/>{detail?.user?.balance!==undefined&&<span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{money(detail.user.balance)}</span>}</div></div><div className="flex items-center gap-2"><button onClick={()=>detail&&loadDetail(detail.user.id,true)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><RefreshCw className={`w-4 h-4 ${detailLoading?'animate-spin':''}`}/></button><button onClick={closeDetails} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="w-5 h-5"/></button></div></div><div className="px-4 sm:px-6 pt-3 bg-white border-b border-slate-200 overflow-x-auto"><div className="flex gap-1 min-w-max">{tabs.map(([key,label,Icon])=><button key={key} onClick={()=>setActiveTab(key)} className={`px-3 py-2.5 rounded-t-xl text-sm font-bold flex items-center gap-1.5 ${activeTab===key?'bg-[#12544F] text-white':'text-slate-500 hover:bg-slate-100'}`}><Icon className="w-3.5 h-3.5"/>{label}</button>)}</div></div><div className="flex-1 overflow-y-auto p-4 sm:p-6">{detailLoading&&!detail?<div className="py-20 text-center text-slate-400">Loading customer record...</div>:detail?renderTab():<div className="py-20 text-center text-rose-500">Unable to load customer data.</div>}</div></div></div>}
    </div>
  );
};
