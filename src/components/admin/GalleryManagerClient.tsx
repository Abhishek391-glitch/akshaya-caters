'use client';

import { useState } from 'react';
import { GalleryItem } from '@/lib/db/types';
import { Plus, Trash2, Check, X, AlertCircle, Upload, Eye, EyeOff } from 'lucide-react';

interface GalleryManagerClientProps {
  initialGallery: GalleryItem[];
}

export default function GalleryManagerClient({
  initialGallery,
}: GalleryManagerClientProps) {
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    image_url: '',
    caption: '',
    category: 'Weddings',
    display_order: gallery.length + 1,
    is_active: true,
  });

  const categories = [
    'Weddings',
    'Live Counters',
    'Food Close-ups',
    'Buffet Setups',
    'Desserts',
    'Traditional',
    'Corporate',
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setFormData((prev) => ({ ...prev, image_url: data.url }));
    } catch (err: any) {
      alert(err.message || 'Image upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert('Please enter or upload an image');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      setGallery((prev) => [...prev, data]);
      setStatusMessage({ type: 'success', text: 'Photo added to gallery!' });
      setIsModalOpen(false);
      setFormData({
        image_url: '',
        caption: '',
        category: 'Weddings',
        display_order: gallery.length + 2,
        is_active: true,
      });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photograph?')) return;

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete photo');
      setGallery((prev) => prev.filter((g) => g.id !== id));
      setStatusMessage({ type: 'success', text: 'Photo removed from gallery.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#244C3A]">
            Gallery & Food Photography
          </h2>
          <p className="text-xs text-[#747970] mt-0.5">
            Upload photographs of royal wedding banquets, buffets, and live counters.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#244C3A] hover:bg-[#193629] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C6A66B]" />
          <span>Upload Photograph</span>
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl overflow-hidden border border-[#E5E1D5] hover:border-[#8FA58A] shadow-xs flex flex-col justify-between group"
          >
            <div className="aspect-[4/3] relative bg-[#F1EFE5]">
              <img
                src={item.image_url}
                alt={item.caption}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-[#244C3A]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                {item.category}
              </span>
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 p-1.5 bg-rose-600/90 text-white rounded-md hover:bg-rose-700 transition-colors shadow-xs"
                title="Delete Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3">
              <p className="text-xs text-[#252923] font-medium line-clamp-2">
                {item.caption || 'No caption entered'}
              </p>
              <div className="mt-2 pt-2 border-t border-[#F1EFE5] flex items-center justify-between text-[10px] text-[#747970]">
                <span>Order: #{item.display_order}</span>
                <span>{item.is_active ? 'Visible' : 'Hidden'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto p-5 sm:p-8 shadow-2xl border border-[#E5E1D5] space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5E1D5] pb-4">
              <h3 className="font-serif text-xl font-bold text-[#244C3A]">
                Add Photo to Gallery
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-[#747970]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#252923] mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252923] mb-1">
                  Caption / Description
                </label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="e.g. Royal wedding banquet spread with champagne styling"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252923] mb-1">
                  Photograph Source *
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="text"
                    required
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://... or upload"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                  />
                  <label className="w-full sm:w-auto px-4 py-2 bg-[#F1EFE5] hover:bg-[#E5E1D5] text-[#244C3A] text-xs font-semibold rounded-lg border border-[#8FA58A]/30 cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
                {formData.image_url && (
                  <div className="mt-3 aspect-[16/9] rounded-lg overflow-hidden border border-[#E5E1D5]">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
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
                  {isSubmitting ? 'Uploading...' : 'Save Photograph'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
