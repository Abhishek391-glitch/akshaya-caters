'use client';

import { useState } from 'react';
import { Enquiry, EnquiryStatus } from '@/lib/db/types';
import {
  Search,
  Phone,
  MessageSquare,
  Trash2,
  Check,
  X,
  AlertCircle,
  Inbox,
  Calendar,
  Users,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

interface EnquiriesManagerClientProps {
  initialEnquiries: Enquiry[];
}

export default function EnquiriesManagerClient({
  initialEnquiries,
}: EnquiriesManagerClientProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // Notes editing state inside detail modal
  const [tempNotes, setTempNotes] = useState('');
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const statuses: { label: string; value: EnquiryStatus | 'all' }[] = [
    { label: 'All Enquiries', value: 'all' },
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Quotation Sent', value: 'quotation_sent' },
    { label: 'Converted', value: 'converted' },
    { label: 'Closed', value: 'closed' },
  ];

  const handleUpdateStatus = async (id: string, status: EnquiryStatus) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status } : null));
        }
        setStatusMessage({ type: 'success', text: `Status updated to ${status.replace('_', ' ')}` });
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setIsUpdatingNotes(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedEnquiry.status,
          admin_notes: tempNotes,
        }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) =>
            e.id === selectedEnquiry.id ? { ...e, admin_notes: tempNotes } : e
          )
        );
        setSelectedEnquiry((prev) => (prev ? { ...prev, admin_notes: tempNotes } : null));
        setStatusMessage({ type: 'success', text: 'Internal admin notes saved.' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingNotes(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete lead from "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete enquiry');
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEnquiry && selectedEnquiry.id === id) setSelectedEnquiry(null);
      setStatusMessage({ type: 'success', text: 'Enquiry removed successfully.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete' });
    }
  };

  const filteredEnquiries = enquiries.filter((enq) => {
    if (activeTab !== 'all' && enq.status !== activeTab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        enq.customer_name.toLowerCase().includes(q) ||
        enq.phone.includes(q) ||
        enq.email?.toLowerCase().includes(q) ||
        enq.event_type?.toLowerCase().includes(q) ||
        enq.event_location?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">NEW LEAD</span>;
      case 'contacted':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">CONTACTED</span>;
      case 'quotation_sent':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">QUOTATION SENT</span>;
      case 'converted':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">CONVERTED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800">CLOSED</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#244C3A]">
            Customer Enquiries & Leads
          </h2>
          <p className="text-xs text-[#747970] mt-0.5">
            Manage quotations, WhatsApp leads, event bookings, and client notes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#244C3A]">
            Total Leads: {enquiries.length}
          </span>
          <span className="text-[#747970]">•</span>
          <span className="font-bold text-amber-700">
            {enquiries.filter((e) => e.status === 'new').length} New
          </span>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-lg text-xs flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Status Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E1D5] shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {statuses.map((st) => {
              const count =
                st.value === 'all'
                  ? enquiries.length
                  : enquiries.filter((e) => e.status === st.value).length;
              const isSelected = activeTab === st.value;

              return (
                <button
                  key={st.value}
                  onClick={() => setActiveTab(st.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-[#244C3A] text-white'
                      : 'bg-[#FAF9F4] text-[#252923] hover:bg-[#F1EFE5]'
                  }`}
                >
                  {st.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#747970] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
            />
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl border border-[#E5E1D5] shadow-xs overflow-hidden">
        {filteredEnquiries.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#747970] space-y-2">
            <Inbox className="w-10 h-10 text-[#8FA58A] mx-auto opacity-50" />
            <p className="font-semibold text-[#244C3A]">No enquiries found in this category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF9F4] border-b border-[#E5E1D5] text-[#747970] uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-3 font-semibold">Event Type</th>
                  <th className="py-3.5 px-3 font-semibold">Event Date</th>
                  <th className="py-3.5 px-3 font-semibold">Guests</th>
                  <th className="py-3.5 px-3 font-semibold">Status</th>
                  <th className="py-3.5 px-3 font-semibold">Submission Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFE5]">
                {filteredEnquiries.map((enq) => {
                  const cleanPhone = enq.phone.replace(/[^0-9]/g, '');
                  const dateStr = enq.created_at
                    ? new Date(enq.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Recent';

                  return (
                    <tr
                      key={enq.id}
                      className="hover:bg-[#FAF9F4]/70 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedEnquiry(enq);
                        setTempNotes(enq.admin_notes || '');
                      }}
                    >
                      <td className="py-3 px-4">
                        <p className="font-bold text-[#252923]">{enq.customer_name}</p>
                        <p className="text-[11px] text-[#747970]">{enq.phone}</p>
                        {enq.email && <p className="text-[10px] text-[#8FA58A]">{enq.email}</p>}
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-medium text-[#252923]">
                          {enq.event_type || enq.subject || 'Catering Request'}
                        </span>
                        {enq.food_preference && (
                          <span className="block text-[10px] text-[#747970]">
                            Diet: {enq.food_preference}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-[#747970]">
                        {enq.event_date || 'Not specified'}
                      </td>

                      <td className="py-3 px-3 text-[#252923] font-medium">
                        {enq.guest_count ? `${enq.guest_count} guests` : '—'}
                      </td>

                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={enq.status}
                          onChange={(e) =>
                            handleUpdateStatus(enq.id, e.target.value as EnquiryStatus)
                          }
                          className="px-2 py-1 text-[11px] font-semibold rounded-lg border border-[#E5E1D5] bg-[#FAF9F4] focus:outline-none"
                        >
                          <option value="new">New Lead</option>
                          <option value="contacted">Contacted</option>
                          <option value="quotation_sent">Quotation Sent</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      <td className="py-3 px-3 text-[#747970] text-[11px]">
                        {dateStr}
                      </td>

                      <td className="py-3 px-4 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                            `Hello ${enq.customer_name}, thank you for contacting Akshaya Caterers regarding your catering inquiry.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center p-1.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          title="Open WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${enq.phone}`}
                          className="inline-flex items-center p-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                          title="Call Customer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(enq.id, enq.customer_name)}
                          className="p-1.5 rounded bg-rose-50 text-rose-700 hover:bg-rose-100"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto p-5 sm:p-8 shadow-2xl border border-[#E5E1D5] space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E1D5] pb-4">
              <div>
                <span className="text-xs font-bold text-[#8FA58A] uppercase tracking-wider">
                  Enquiry Details
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#244C3A]">
                  {selectedEnquiry.customer_name}
                </h3>
              </div>
              <button onClick={() => setSelectedEnquiry(null)}>
                <X className="w-5 h-5 text-[#747970]" />
              </button>
            </div>

            {/* Quick Contact & Action Buttons */}
            <div className="flex items-center gap-3">
              <a
                href={`tel:${selectedEnquiry.phone}`}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call ({selectedEnquiry.phone})</span>
              </a>

              <a
                href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${selectedEnquiry.customer_name}, this is Akshaya Caterers regarding your recent catering enquiry.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Customer</span>
              </a>
            </div>

            {/* Event Specification Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#FAF9F4] rounded-xl border border-[#E5E1D5] text-xs">
              <div>
                <span className="text-[#747970] block">Event Type</span>
                <span className="font-bold text-[#244C3A]">{selectedEnquiry.event_type || 'General'}</span>
              </div>
              <div>
                <span className="text-[#747970] block">Event Date</span>
                <span className="font-bold text-[#244C3A]">{selectedEnquiry.event_date || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-[#747970] block">Guest Count</span>
                <span className="font-bold text-[#244C3A]">{selectedEnquiry.guest_count || 'Flexible'}</span>
              </div>
              <div>
                <span className="text-[#747970] block">Food Preference</span>
                <span className="font-bold text-[#244C3A]">{selectedEnquiry.food_preference || 'Both'}</span>
              </div>
              <div>
                <span className="text-[#747970] block">Approx Budget</span>
                <span className="font-bold text-[#244C3A]">{selectedEnquiry.budget || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-[#747970] block">Venue</span>
                <span className="font-bold text-[#244C3A] line-clamp-1">{selectedEnquiry.event_location || 'Not specified'}</span>
              </div>
            </div>

            {/* Message Body */}
            {selectedEnquiry.message && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#252923]">
                  Customer Message / Menu Requirements:
                </span>
                <div className="p-3 bg-[#F1EFE5] rounded-lg text-xs text-[#252923] leading-relaxed">
                  {selectedEnquiry.message}
                </div>
              </div>
            )}

            {/* Internal Admin Notes */}
            <div className="space-y-2 pt-2 border-t border-[#E5E1D5]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#244C3A]">
                  Internal Admin Follow-up Notes
                </label>
                <span className="text-[10px] text-[#747970]">Visible only to team</span>
              </div>
              <textarea
                rows={3}
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Log customer discussions, quoted prices, menu adjustments..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isUpdatingNotes}
                className="px-4 py-2 bg-[#244C3A] text-white text-xs font-semibold rounded-lg hover:bg-[#193629] transition-colors"
              >
                {isUpdatingNotes ? 'Saving Notes...' : 'Save Follow-up Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
