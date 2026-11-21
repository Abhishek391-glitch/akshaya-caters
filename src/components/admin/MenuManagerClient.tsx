'use client';

import { useState } from 'react';
import { MenuItem, Category } from '@/lib/db/types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Check,
  X,
  AlertCircle,
  Sparkles,
  UtensilsCrossed,
  Eye,
  EyeOff,
} from 'lucide-react';

interface MenuManagerClientProps {
  initialItems: MenuItem[];
  categories: Category[];
}

export default function MenuManagerClient({
  initialItems,
  categories,
}: MenuManagerClientProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: categories[0]?.id || '',
    dietary_type: 'veg' as 'veg' | 'non-veg',
    price: 100,
    unit: 'portion',
    image_url: '',
    is_featured: false,
    is_popular: false,
    is_active: true,
    display_order: 1,
  });

  // Fast inline price editing
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category_id: categories[0]?.id || '',
      dietary_type: 'veg',
      price: 100,
      unit: 'portion',
      image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      is_featured: false,
      is_popular: false,
      is_active: true,
      display_order: items.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category_id: item.category_id,
      dietary_type: item.dietary_type,
      price: item.price,
      unit: item.unit || 'portion',
      image_url: item.image_url,
      is_featured: item.is_featured,
      is_popular: item.is_popular,
      is_active: item.is_active,
      display_order: item.display_order,
    });
    setIsModalOpen(true);
  };

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
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const endpoint = editingItem
        ? `/api/admin/menu/${editingItem.id}`
        : '/api/admin/menu';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const savedItem = await res.json();
      if (!res.ok) throw new Error(savedItem.error || 'Failed to save item');

      if (editingItem) {
        setItems((prev) => prev.map((i) => (i.id === savedItem.id ? savedItem : i)));
        setStatusMessage({ type: 'success', text: 'Item updated successfully!' });
      } else {
        setItems((prev) => [...prev, savedItem]);
        setStatusMessage({ type: 'success', text: 'Item created successfully!' });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error saving item' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
      setItems((prev) => prev.filter((i) => i.id !== id));
      setStatusMessage({ type: 'success', text: `"${name}" removed successfully.` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete' });
    }
  };

  const handleToggleActive = async (item: MenuItem) => {
    const updatedStatus = !item.is_active;
    try {
      const res = await fetch(`/api/admin/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, is_active: updatedStatus }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, is_active: updatedStatus } : i))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveInlinePrice = async (id: string) => {
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, price: tempPrice }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, price: tempPrice } : i))
        );
        setEditingPriceId(null);
        setStatusMessage({ type: 'success', text: 'Price updated and live on website!' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredItems = items.filter((item) => {
    if (categoryFilter !== 'all' && item.category_id !== categoryFilter) return false;
    if (dietaryFilter !== 'all' && item.dietary_type !== dietaryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category_name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#244C3A]">
            Food Menu Management
          </h2>
          <p className="text-xs text-[#747970] mt-0.5">
            Add dishes, edit descriptions, change live prices, and configure featured items.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#244C3A] hover:bg-[#193629] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C6A66B]" />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* Status Alert Notification */}
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E1D5] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#747970] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu items..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4] flex-1 md:flex-initial"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={dietaryFilter}
            onChange={(e) => setDietaryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4] flex-1 md:flex-initial"
          >
            <option value="all">All Diets</option>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl border border-[#E5E1D5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F4] border-b border-[#E5E1D5] text-[#747970] uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Dish</th>
                <th className="py-3.5 px-3 font-semibold">Category</th>
                <th className="py-3.5 px-3 font-semibold">Diet</th>
                <th className="py-3.5 px-3 font-semibold">Price (₹)</th>
                <th className="py-3.5 px-3 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFE5]">
              {filteredItems.map((item) => {
                const isVeg = item.dietary_type === 'veg';
                const isEditingPrice = editingPriceId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-[#FAF9F4]/70 transition-colors">
                    {/* Dish & Image */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-11 h-11 rounded-lg object-cover border border-[#E5E1D5] shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#252923]">{item.name}</span>
                            {item.is_featured && (
                              <span className="px-1.5 py-0.2 bg-[#C6A66B]/20 text-[#244C3A] rounded text-[9px] font-bold">
                                Featured
                              </span>
                            )}
                            {item.is_popular && (
                              <span className="px-1.5 py-0.2 bg-[#8FA58A]/30 text-[#244C3A] rounded text-[9px] font-bold">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#747970] line-clamp-1 max-w-xs mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 text-[#747970]">
                      <span className="px-2 py-0.5 rounded-full bg-[#FAF9F4] border border-[#E5E1D5] text-[10px] font-medium text-[#252923]">
                        {item.category_name}
                      </span>
                    </td>

                    {/* Diet */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          isVeg
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isVeg ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                        ></span>
                        <span>{isVeg ? 'Veg' : 'Non-Veg'}</span>
                      </span>
                    </td>

                    {/* Price with Inline Edit */}
                    <td className="py-3 px-3 font-semibold text-[#244C3A]">
                      {isEditingPrice ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(Number(e.target.value))}
                            className="w-16 px-1.5 py-1 text-xs border border-[#244C3A] rounded bg-white"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveInlinePrice(item.id)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            title="Save Price"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="p-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingPriceId(item.id);
                            setTempPrice(item.price);
                          }}
                          className="cursor-pointer hover:underline flex items-center gap-1 group/price"
                          title="Click to quickly edit price"
                        >
                          <span>₹{item.price}</span>
                          <span className="text-[10px] text-[#747970] font-normal">
                            / {item.unit || 'portion'}
                          </span>
                          <span className="opacity-0 group-hover/price:opacity-100 text-[10px] text-[#C6A66B]">
                            ✎
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Active Status */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          item.is_active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title="Click to toggle visibility"
                      >
                        {item.is_active ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded bg-gray-50 text-[#244C3A] hover:bg-[#F1EFE5] border border-[#E5E1D5]"
                        title="Edit Dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-1.5 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                        title="Delete Dish"
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
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto p-5 sm:p-8 shadow-2xl border border-[#E5E1D5] space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5E1D5] pb-4">
              <h3 className="font-serif text-xl font-bold text-[#244C3A]">
                {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#747970] hover:text-[#252923]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Dish Name */}
              <div>
                <label className="block text-xs font-semibold text-[#252923] mb-1">
                  Food Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Malai Kofta Curry"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                />
              </div>

              {/* Category & Diet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252923] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252923] mb-1">
                    Dietary Classification *
                  </label>
                  <select
                    value={formData.dietary_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dietary_type: e.target.value as 'veg' | 'non-veg',
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                  >
                    <option value="veg">Vegetarian (Pure Veg)</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              {/* Price & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252923] mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252923] mb-1">
                    Serving / Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. plate (2 pcs), serving, cup"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#252923] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ingredients, preparation style, texture notes..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                />
              </div>

              {/* Image Upload / URL & Preview */}
              <div>
                <label className="block text-xs font-semibold text-[#252923] mb-1">
                  Food Photograph
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://... or upload below"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                  />
                  <label className="w-full sm:w-auto px-4 py-2 bg-[#F1EFE5] hover:bg-[#E5E1D5] text-[#244C3A] text-xs font-semibold rounded-lg border border-[#8FA58A]/30 cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
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
                  <div className="mt-3 flex items-center gap-3 p-2 bg-[#FAF9F4] rounded-lg border border-[#E5E1D5]">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-14 h-14 rounded-lg object-cover border border-[#E5E1D5]"
                    />
                    <span className="text-[11px] text-[#747970]">
                      Image preview verified and ready to save.
                    </span>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-[#E5E1D5] cursor-pointer bg-[#FAF9F4]">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded text-[#244C3A]"
                  />
                  <span className="text-xs font-semibold text-[#252923]">Featured on Home</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-[#E5E1D5] cursor-pointer bg-[#FAF9F4]">
                  <input
                    type="checkbox"
                    checked={formData.is_popular}
                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    className="rounded text-[#244C3A]"
                  />
                  <span className="text-xs font-semibold text-[#252923]">Popular Badge</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-[#E5E1D5] cursor-pointer bg-[#FAF9F4]">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-[#244C3A]"
                  />
                  <span className="text-xs font-semibold text-[#252923]">Active on Menu</span>
                </label>
              </div>

              {/* Submit Buttons */}
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
                  className="px-6 py-2.5 bg-[#244C3A] hover:bg-[#193629] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all"
                >
                  {isSubmitting ? 'Saving...' : editingItem ? 'Update Dish' : 'Create Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
