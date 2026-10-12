'use client';

import React, { useEffect, useState } from 'react';
import { 
  Navigation, Save, RefreshCw, Plus, Trash2, Edit3, 
  CheckCircle2, Eye, EyeOff, ArrowUp, ArrowDown, Sparkles, ExternalLink, Sliders
} from 'lucide-react';
import { NavigationConfig, NavItem } from '@/lib/types';

const standardPresets = [
  { label: 'Home', href: '/' },
  { label: 'Destinations', href: '/destinations', badge: '12 Countries' },
  { label: 'Universities', href: '/universities' },
  { label: 'Services', href: '/services' },
  { label: 'Student Reviews', href: '/success-stories' },
  { label: 'Visa Success', href: '/visa-success' },
  { label: 'About Us', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book Appointment', href: '/book-appointment' },
];

export default function AdminNavigationPage() {
  const [nav, setNav] = useState<NavigationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [editingItem, setEditingItem] = useState<{ index: number; item: NavItem } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNav = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/navigation');
      const data = await res.json();
      if (data.success && data.navigation) {
        // Ensure default structure if empty
        const rawList = (data.navigation.items && data.navigation.items.length > 0)
          ? data.navigation.items
          : standardPresets.map((p, idx) => ({ ...p, enabled: true, order: idx + 1 }));

        const initialItems = rawList.filter((it: any) => it.href !== '/blog' && it.label !== 'Blog');
        
        setNav({
          ...data.navigation,
          items: initialItems,
          ctaButton: data.navigation.ctaButton || {
            label: 'Book Free Consultation',
            text: 'Book Free Consultation',
            href: '/book-appointment',
            enabled: true
          }
        });
      }
    } catch (err) {
      console.error('Error fetching navigation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNav();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nav) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nav)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3500);
      } else {
        alert(data.error || 'Failed to save navigation');
      }
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleItem = async (index: number) => {
    if (!nav) return;
    const newItems = [...nav.items];
    const current = newItems[index];
    newItems[index] = {
      ...current,
      enabled: current.enabled === false ? true : false,
    };
    const updatedNav = { ...nav, items: newItems };
    setNav(updatedNav);

    // Auto-save on toggle for seamless instant feedback
    try {
      await fetch('/api/admin/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNav)
      });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (!nav) return;
    const newItems = [...nav.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setNav({ ...nav, items: newItems });
  };

  const handleAddItem = (preset?: { label: string; href: string; badge?: string }) => {
    if (preset && nav) {
      const existingIdx = nav.items.findIndex((it: any) => it.href === preset.href);
      if (existingIdx >= 0) {
        const newItems = [...nav.items];
        newItems[existingIdx].enabled = true;
        setNav({ ...nav, items: newItems });
        return;
      }
      const newItems = [...nav.items, { ...preset, enabled: true }];
      setNav({ ...nav, items: newItems });
      return;
    }

    setEditingItem({
      index: -1,
      item: { label: '', href: '/', badge: '', enabled: true }
    });
    setIsModalOpen(true);
  };

  const handleEditItem = (index: number, item: NavItem) => {
    setEditingItem({ index, item: { ...item, enabled: item.enabled !== false } });
    setIsModalOpen(true);
  };

  const handleDeleteItem = (index: number) => {
    if (!nav) return;
    if (!confirm('Remove this menu item from navigation?')) return;
    const newItems = nav.items.filter((_: any, idx: number) => idx !== index);
    setNav({ ...nav, items: newItems });
  };

  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nav || !editingItem) return;
    const { index, item } = editingItem;
    if (!item.label || !item.href) {
      alert('Label and URL are required');
      return;
    }

    const newItems = [...nav.items];
    if (index >= 0) {
      newItems[index] = item;
    } else {
      newItems.push(item);
    }

    setNav({ ...nav, items: newItems });
    setIsModalOpen(false);
    setEditingItem(null);
  };

  if (loading || !nav) {
    return (
      <div className="py-24 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-500" />
        <p className="font-semibold text-sm">Loading Header & Navigation Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Navigation className="w-6 h-6 text-amber-600" />
            Website Header & Navigation Menu CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Toggle which pages are <strong>visible (ON)</strong> or <strong>hidden (OFF)</strong> on the website header navbar, reorder links, and customize the CTA button.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:brightness-95 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Publishing Changes...' : 'Save & Publish Live'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Success! Navigation settings updated immediately and live on the public header navbar.</span>
        </div>
      )}

      {/* Quick Add Page Presets */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          Quick Add / Enable Standard Pages:
        </div>
        <p className="text-[11px] text-slate-500">
          Click any page preset below to instantly add or activate it in your header menu:
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {standardPresets.map((p, idx) => {
            const exists = nav.items.some((it: any) => it.href === p.href && it.enabled !== false);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddItem(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border shadow-xs ${
                  exists
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border-slate-200 hover:border-amber-300'
                }`}
              >
                <span className="font-bold">{exists ? '✓ Active' : '+ Add'}</span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Header CTA Button Settings */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              Header Call-To-Action (CTA) Button
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configured button displayed in the announcement bar and mobile drawer.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 mb-1.5 font-bold">Button Label Text</label>
            <input
              type="text"
              value={nav.ctaButton?.text || nav.ctaButton?.label || ''}
              onChange={(e) => setNav({ 
                ...nav, 
                ctaButton: { 
                  ...nav.ctaButton, 
                  text: e.target.value,
                  label: e.target.value 
                } 
              })}
              placeholder="e.g. Book Free Consultation"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-slate-700 mb-1.5 font-bold">Button Destination URL</label>
            <input
              type="text"
              value={nav.ctaButton?.href || '/book-appointment'}
              onChange={(e) => setNav({ 
                ...nav, 
                ctaButton: { 
                  ...nav.ctaButton, 
                  href: e.target.value 
                } 
              })}
              placeholder="/book-appointment"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Menu Items Table with ON/OFF Switches */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Header Navigation Pages & Visibility Controls</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click the <strong>Status (ON/OFF)</strong> switch to immediately show or hide any page on your website header.
            </p>
          </div>
          <button
            onClick={() => handleAddItem()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Add Custom Link
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-y border-slate-200 text-[11px] text-slate-600 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Page Title / Label</th>
                <th className="py-3 px-4">Target URL</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4 text-center">Header Visibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {nav.items.map((item: any, idx: number) => {
                const isEnabled = item.enabled !== false;
                return (
                  <tr 
                    key={idx} 
                    className={`transition-colors ${
                      isEnabled ? 'hover:bg-slate-50/80 bg-white' : 'bg-slate-50/50 opacity-60'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveItem(idx, 'up')}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === nav.items.length - 1}
                          onClick={() => handleMoveItem(idx, 'down')}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.href === '/destinations' && (
                          <span className="text-[10px] text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200 font-semibold">
                            Mega Menu
                          </span>
                        )}
                        {item.href === '/universities' && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-semibold">
                            Dropdown
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {item.href}
                    </td>

                    <td className="py-3 px-4">
                      {item.badge ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                          {item.badge}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleItem(idx)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-xs ${
                          isEnabled
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-900 border border-rose-300 hover:bg-rose-200'
                        }`}
                      >
                        {isEnabled ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-700" />
                            <span>ON (Showing on Header)</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-rose-700" />
                            <span>OFF (Hidden)</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEditItem(idx, item)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition mr-1"
                        title="Edit Item"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">
              {editingItem.index >= 0 ? 'Edit Navigation Item' : 'Add New Navigation Link'}
            </h3>

            <form onSubmit={handleModalSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Page / Menu Label</label>
                <input
                  type="text"
                  required
                  value={editingItem.item.label}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, label: e.target.value }
                  })}
                  placeholder="e.g. Scholarships"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Target URL / Path</label>
                <input
                  type="text"
                  required
                  value={editingItem.item.href}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, href: e.target.value }
                  })}
                  placeholder="e.g. /scholarships or https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Badge Text (Optional)</label>
                <input
                  type="text"
                  value={editingItem.item.badge || ''}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, badge: e.target.value }
                  })}
                  placeholder="e.g. New or 98% Rate"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="modalEnabled"
                  checked={editingItem.item.enabled !== false}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, enabled: e.target.checked }
                  })}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
                <label htmlFor="modalEnabled" className="text-xs font-bold text-slate-800">
                  Visible in Header Navbar (ON)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-sm"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
