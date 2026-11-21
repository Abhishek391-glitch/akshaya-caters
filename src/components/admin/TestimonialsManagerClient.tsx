'use client';

import { useState } from 'react';
import { Testimonial } from '@/lib/db/types';
import { Plus, Edit2, Trash2, Check, X, AlertCircle, Star } from 'lucide-react';

interface TestimonialsManagerClientProps {
  initialTestimonials: Testimonial[];
}

export default function TestimonialsManagerClient({
  initialTestimonials,
}: TestimonialsManagerClientProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    review: '',
    rating: 5,
    event_type: 'Wedding Reception',
    image_url: '',
    is_active: true,
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      customer_name: '',
      review: '',
      rating: 5,
      event_type: 'Wedding Reception',
      image_url: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingItem(t);
    setFormData({
      customer_name: t.customer_name,
      review: t.review,
      rating: t.rating,
      event_type: t.event_type,
      image_url: t.image_url || '',
      is_active: t.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const endpoint = editingItem
        ? `/api/admin/testimonials/${editingItem.id}`
        : '/api/admin/testimonials';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save review');

      if (editingItem) {
        setTestimonials((prev) => prev.map((t) => (t.id === data.id ? data : t)));
        setStatusMessage({ type: 'success', text: 'Review updated successfully!' });
      } else {
        setTestimonials((prev) => [data, ...prev]);
        setStatusMessage({ type: 'success', text: 'Review added successfully!' });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete review by "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete review');
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      setStatusMessage({ type: 'success', text: 'Review deleted successfully.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#244C3A]">
            Client Testimonials & Reviews
          </h2>
          <p className="text-xs text-[#747970] mt-0.5">
            Manage feedback and quotes displayed to visitors on the homepage.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#244C3A] hover:bg-[#193629] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C6A66B]" />
          <span>Add Review</span>
        </button>
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

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-xl p-6 border border-[#E5E1D5] hover:border-[#8FA58A] shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < test.rating
                          ? 'text-[#C6A66B] fill-[#C6A66B]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF9F4] text-[#244C3A] border border-[#E5E1D5]">
                  {test.event_type}
                </span>
              </div>

              <p className="text-xs text-[#252923] italic leading-relaxed">
                "{test.review}"
              </p>
            </div>

            <div className="pt-3 border-t border-[#F1EFE5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {test.image_url ? (
                  <img
                    src={test.image_url}
                    alt={test.customer_name}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#244C3A] text-white flex items-center justify-center font-bold text-xs">
                    {test.customer_name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-[#244C3A]">
                    {test.customer_name}
                  </h4>
                  <span className="text-[10px] text-[#747970]">
                    {test.is_active ? 'Active on site' : 'Hidden'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(test)}
                  className="p-1.5 rounded bg-[#FAF9F4] text-[#244C3A] hover:bg-[#F1EFE5] border border-[#E5E1D5]"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(test.id, test.customer_name)}
                  className="p-1.5 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto p-5 sm:p-8 shadow-2xl border border-[#E5E1D5] space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5E1D5] pb-4">
              <h3 className="font-serif text-xl font-bold text-[#244C3A]">
                {editingItem ? 'Edit Review' : 'Add Client Review'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-[#747970]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#252923] mb-1">
                  Customer / Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="e.g. Radhika & Karthik"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252923] mb-1">
                    Event Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                    placeholder="e.g. Wedding Reception"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252923] mb-1">
                    Rating (1 to 5 Stars) *
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252923] mb-1">
                  Review Statement *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  placeholder="Write customer review..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252923] mb-1">
                  Customer Photo URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-[#244C3A]"
                  />
                  <span className="text-xs font-semibold text-[#252923]">Visible on Customer Website</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E5E1D5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#747970] hover:text-[#252923]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#244C3A] hover:bg-[#193629] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all"
                >
                  {isSubmitting ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
