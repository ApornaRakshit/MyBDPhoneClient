import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  CreditCard,
  Upload,
} from "lucide-react";

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");
const empty = {
  name: "",
  code: "",
  method_type: "mobile_banking",
  provider: "",
  account_number: "",
  instructions: "",
  sort_order: 1,
  is_active: true,
  logo: null,
};

export const AdminPaymentMethods = () => {
  const [methods, setMethods] = useState([]),
    [form, setForm] = useState(empty),
    [editing, setEditing] = useState(null),
    [show, setShow] = useState(false),
    [saving, setSaving] = useState(false);
  const load = async () => {
    try {
      const r = await API.get("/admin/payment-methods");
      if (r.data.success) setMethods(r.data.methods || []);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setShow(true);
  };
  const openEdit = (m) => {
    setEditing(m);
    setForm({ ...m, is_active: !!m.is_active, logo: null });
    setShow(true);
  };
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      [
        "name",
        "code",
        "method_type",
        "provider",
        "account_number",
        "instructions",
        "sort_order",
      ].forEach((k) => fd.append(k, form[k] ?? ""));
      fd.append("is_active", String(!!form.is_active));
      if (form.logo) fd.append("logo", form.logo);
      const r = editing
        ? await API.put(`/admin/payment-methods/${editing.id}`, fd)
        : await API.post("/admin/payment-methods", fd);
      if (!r.data.success) throw new Error(r.data.message || "Could not save");
      setShow(false);
      setEditing(null);
      setForm(empty);
      await load();
    } catch (e) {
      alert(
        e.response?.data?.message ||
          e.message ||
          "Could not save payment method"
      );
    } finally {
      setSaving(false);
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete this payment method?")) return;
    try {
      await API.delete(`/admin/payment-methods/${id}`);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Delete failed");
    }
  };
  const logoSrc = (url) =>
    url ? (url.startsWith("/") ? `${API_ORIGIN}${url}` : url) : "";
  return (
    <div className="space-y-7 pb-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#092328]">
            Payment Methods & Gateways
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Control payment channels, customer instructions and optional method
            logos.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="p-2.5 rounded-xl border border-slate-200 bg-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openAdd}
            className="px-4 py-2.5 rounded-xl bg-[#12544F] text-white text-sm font-bold flex gap-2 items-center"
          >
            <Plus className="w-4 h-4" />
            Add Payment Method
          </button>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-400">
              <tr>
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Method</th>
                <th className="px-5 py-4">Account / Provider</th>
                <th className="px-5 py-4">Logo</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {methods.map((m, i) => (
                <tr key={m.id}>
                  <td className="px-5 py-4 text-slate-400">#{i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="font-bold">{m.name}</div>
                    <div className="text-sm text-slate-400">{m.code}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-mono text-sm font-bold text-blue-600">
                      {m.account_number || m.provider || "—"}
                    </div>
                    <div className="text-sm text-slate-400 truncate max-w-md">
                      {m.instructions || "—"}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {m.logo_url ? (
                      <img
                        src={logoSrc(m.logo_url)}
                        alt=""
                        className="w-12 h-10 object-contain rounded-lg border border-slate-200 bg-white"
                      />
                    ) : (
                      <div className="w-12 h-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        m.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {m.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => openEdit(m)}
                      className="p-2 border rounded-lg mr-1"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => remove(m.id)}
                      className="p-2 border rounded-lg text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {show && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={save}
            className="bg-white rounded-3xl max-w-lg w-full max-h-[calc(100vh-2rem)] overflow-y-auto p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">
                {editing ? "Edit" : "Add"} Payment Method
              </h2>
              <button
                type="button"
                onClick={() => setShow(false)}
                className="text-slate-400"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="Method name"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="p-3 rounded-xl border"
              />
              <input
                required
                placeholder="Unique code"
                value={form.code || ""}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="p-3 rounded-xl border"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.method_type || "manual"}
                onChange={(e) =>
                  setForm({ ...form, method_type: e.target.value })
                }
                className="p-3 rounded-xl border"
              >
                <option value="gateway">Gateway</option>
                <option value="mobile_banking">Mobile Banking</option>
                <option value="voucher">Voucher</option>
                <option value="bank">Bank</option>
                <option value="manual">Manual</option>
              </select>
              <input
                placeholder="Provider"
                value={form.provider || ""}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
                className="p-3 rounded-xl border"
              />
            </div>
            <input
              placeholder="Account / Merchant number"
              value={form.account_number || ""}
              onChange={(e) =>
                setForm({ ...form, account_number: e.target.value })
              }
              className="w-full p-3 rounded-xl border"
            />
            <textarea
              placeholder="Customer instructions"
              value={form.instructions || ""}
              onChange={(e) =>
                setForm({ ...form, instructions: e.target.value })
              }
              rows="4"
              className="w-full p-3 rounded-xl border"
            />
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">
                Payment Method Logo (optional)
              </label>
              {editing?.logo_url && !form.logo && (
                <div className="mb-2 flex items-center gap-3">
                  <img
                    src={logoSrc(editing.logo_url)}
                    alt="Current logo"
                    className="w-16 h-12 object-contain rounded-xl border border-slate-200"
                  />
                  <span className="text-sm text-slate-500">Current logo</span>
                </div>
              )}
              <label className="flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-300 cursor-pointer hover:bg-slate-50">
                <Upload className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">
                  {form.logo ? form.logo.name : "Choose image file"}
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(e) =>
                    setForm({ ...form, logo: e.target.files?.[0] || null })
                  }
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-slate-400 mt-1">
                PNG, JPG, WEBP or SVG • max 2MB • logo is optional
              </p>
            </div>
            <label className="flex gap-2 items-center text-sm font-bold">
              <input
                type="checkbox"
                checked={!!form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />{" "}
              Active
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-[#12544F] text-white font-bold"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
