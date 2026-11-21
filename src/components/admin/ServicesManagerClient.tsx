'use client';

import { useState } from 'react';
import { Service } from '@/lib/db/types';
import { Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';

interface ServicesManagerClientProps {
  initialServices: Service[];
}

export default function ServicesManagerClient({
  initialServices,
}: ServicesManagerClientProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    featuresText: '',
    display_order: 1,
    is_active: true,
  });

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      featuresText: 'Customized Menus\nLive Food Stations\nProfessional Table Service\nDedicated Captain',
      display_order: services.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (srv: Service) => {
    setEditingService(srv);
    setFormData({
      name: srv.name,
      description: srv.description,
      image_url: srv.image_url,
      featuresText: (srv.features || []).join('\n'),
      display_order: srv.display_order,
      is_active: srv.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    const features = formData.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name,
      description: formData.description,
      image_url: formData.image_url,
      features,
      display_order: formData.display_order,
      is_active: formData.is_active,
    };

    try {
      const endpoint = editingService
        ? `/api/admin/services/${editingService.id}`
        : '/api/admin/services';
      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save service');

      if (editingService) {
        setServices((prev) => prev.map((s) => (s.id === data.id ? data : s)));
        setStatusMessage({ type: 'success', text: 'Service package updated successfully!' });
      } else {
        setServices((prev) => [...prev, data]);
        setStatusMessage({ type: 'success', text: 'Service package created successfully!' });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete service "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete service');
      setServices((prev) => prev.filter((s) => s.id !== id));
      setStatusMessage({ type: 'success', text: `Service "${name}" removed.` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#244C3A]">
            Catering Services & Packages
          </h2>
          <p className="text-xs text-[#747970] mt-0.5">
            Manage your service cards shown across the public website.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#244C3A] hover:bg-[#193629] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C6A66B]" />
          <span>Add Service Package</span>
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

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-xl overflow-hidden border border-[#E5E1D5] hover:border-[#8FA58A] shadow-xs flex flex-col justify-between"
          >
            <div className="aspect-[16/10] relative bg-[#F1EFE5]">
              <img
                src={srv.image_url}
                alt={srv.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-white/90 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                Order: #{srv.display_order}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#244C3A]">
                  {srv.name}
                </h3>
                <p className="text-xs text-[#747970] mt-1 leading-relaxed line-clamp-3">
                  {srv.description}
                </p>

                {srv.features && srv.features.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#F1EFE5] space-y-1">
                    {srv.features.slice(0, 3).map((f, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#252923]">
                        <Check className="w-3 h-3 text-[#244C3A]" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#F1EFE5] flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    srv.is_active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {srv.is_active ? 'Active' : 'Hidden'}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(srv)}
                    className="p-1.5 rounded bg-[#FAF9F4] text-[#244C3A] hover:bg-[#F1EFE5] border border-[#E5E1D5]"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id, srv.name)}
                    className="p-1.5 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
                {editingService ? 'Edit Catering Package' : 'Create Catering Package'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-[#747970]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#252923] mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Wedding Catering"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252923] mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive service description..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252923] mb-1">
                  Features List (One feature per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  placeholder="Enter each package highlight on a new line"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252923] mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252923] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded text-[#244C3A]"
                    />
                    <span className="text-xs font-semibold text-[#252923]">Active</span>
                  </label>
                </div>
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
                  {isSubmitting ? 'Saving...' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
