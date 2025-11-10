"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
  Check,
  AlertCircle,
} from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import { MenuItem } from "./page";
import { createClientHelper } from "@/lib/supabase";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

interface MenuManagementClientProps {
  initialMenuItems: MenuItem[];
}

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  available: boolean;
  image_url: string;
}

const categories = ["Appetizers", "Meats", "Seafood", "Pasta", "Desserts", "Beverages"];

export default function MenuManagementClient({ initialMenuItems }: MenuManagementClientProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    category: "Appetizers",
    available: true,
    image_url: "",
  });

  const supabase = createClientHelper();

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Appetizers",
      available: true,
      image_url: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      available: item.available,
      image_url: item.image_url,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Appetizers",
      available: true,
      image_url: "",
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showNotification('error', 'Image size must be less than 2MB');
      return;
    }

    setUploadingImage(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `menu-items/${fileName}`;

      const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      showNotification('success', 'Image uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      showNotification('error', 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      showNotification('error', 'Please enter item name');
      return false;
    }
    if (!formData.description.trim()) {
      showNotification('error', 'Please enter description');
      return false;
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      showNotification('error', 'Please enter a valid price');
      return false;
    }
    if (!formData.image_url) {
      showNotification('error', 'Please upload an image');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        available: formData.available,
        image_url: formData.image_url,
      };

      if (editingItem) {
        // Update existing item
        const { data, error } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editingItem.id)
          .select()
          .single();

        if (error) throw error;

        setMenuItems(menuItems.map(item => 
          item.id === editingItem.id ? data : item
        ));
        showNotification('success', 'Menu item updated successfully');
      } else {
        // Add new item
        const { data, error } = await supabase
          .from('menu_items')
          .insert([itemData])
          .select()
          .single();

        if (error) throw error;

        setMenuItems([data, ...menuItems]);
        showNotification('success', 'Menu item added successfully');
      }

      closeModal();
    } catch (error: any) {
      console.error('Error saving menu item:', error);
      showNotification('error', 'Failed to save menu item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      setMenuItems(menuItems.filter(item => item.id !== itemToDelete.id));
      showNotification('success', 'Menu item deleted successfully');
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (error: any) {
      console.error('Error deleting menu item:', error);
      showNotification('error', 'Failed to delete menu item');
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteConfirm = (item: MenuItem) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  return (
    <>
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {notification.type === 'success' ? (
                <Check className="text-white" size={20} />
              ) : (
                <AlertCircle className="text-white" size={20} />
              )}
              <p className={`${inter.className} text-white font-medium`}>
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="bg-white/50 backdrop-blur-sm border border-[#E5D9CC] rounded-2xl shadow-lg overflow-hidden">
        {/* Table Header with Add Button */}
        <div className="px-6 py-4 border-b border-[#E5D9CC] flex items-center justify-between">
          <h2 className={`${playfair.className} text-xl font-bold text-[#3B2F2F]`}>
            Menu Items
          </h2>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#D9B26D] text-white rounded-lg hover:bg-[#C4A05E] transition-colors"
          >
            <Plus size={20} />
            <span className={`${inter.className} font-medium`}>Add New Item</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FBF7F2]">
              <tr>
                <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold text-[#3B2F2F]`}>
                  Image
                </th>
                <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold text-[#3B2F2F]`}>
                  Name
                </th>
                <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold text-[#3B2F2F]`}>
                  Description
                </th>
                <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold text-[#3B2F2F]`}>
                  Price
                </th>
                <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold text-[#3B2F2F]`}>
                  Category
                </th>
                <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold text-[#3B2F2F]`}>
                  Availability
                </th>
                <th className={`${inter.className} px-6 py-4 text-left text-sm font-semibold text-[#3B2F2F]`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D9CC]">
              {menuItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className={`${inter.className} text-[#6E6862]`}>
                      No menu items yet. Click "Add New Item" to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FBF7F2] transition-colors">
                    <td className="px-6 py-4">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className={`${inter.className} font-medium text-[#3B2F2F]`}>
                        {item.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`${inter.className} text-sm text-[#6E6862] line-clamp-2 max-w-xs`}>
                        {item.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`${inter.className} font-semibold text-[#D9B26D]`}>
                        ${item.price.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`${inter.className} text-sm text-[#3B2F2F]`}>
                        {item.category}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(item)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-[#E5D9CC] flex items-center justify-between">
                  <h3 className={`${playfair.className} text-2xl font-bold text-[#3B2F2F]`}>
                    {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} className="text-[#6E6862]" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Name */}
                  <div>
                    <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E5D9CC] rounded-lg focus:ring-2 focus:ring-[#D9B26D] focus:border-transparent transition-all"
                      placeholder="Enter item name"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E5D9CC] rounded-lg focus:ring-2 focus:ring-[#D9B26D] focus:border-transparent transition-all resize-none"
                      placeholder="Enter item description"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Price */}
                    <div>
                      <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>
                        Price (USD) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E5D9CC] rounded-lg focus:ring-2 focus:ring-[#D9B26D] focus:border-transparent transition-all"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E5D9CC] rounded-lg focus:ring-2 focus:ring-[#D9B26D] focus:border-transparent transition-all"
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className={`${inter.className} block text-sm font-medium text-[#3B2F2F] mb-2`}>
                      Image *
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[#E5D9CC] rounded-lg hover:border-[#D9B26D] transition-colors">
                          <Upload size={20} className="text-[#D9B26D]" />
                          <span className={`${inter.className} text-sm text-[#6E6862]`}>
                            {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                      {formData.image_url && (
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="available"
                      checked={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="w-5 h-5 text-[#D9B26D] border-[#E5D9CC] rounded focus:ring-2 focus:ring-[#D9B26D]"
                    />
                    <label htmlFor="available" className={`${inter.className} text-sm font-medium text-[#3B2F2F] cursor-pointer`}>
                      Item is available for ordering
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-6 py-3 border border-[#E5D9CC] text-[#3B2F2F] rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || uploadingImage}
                      className="flex-1 px-6 py-3 bg-[#D9B26D] text-white rounded-lg hover:bg-[#C4A05E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && itemToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h3 className={`${playfair.className} text-2xl font-bold text-[#3B2F2F] mb-4`}>
                  Confirm Delete
                </h3>
                <p className={`${inter.className} text-[#6E6862] mb-6`}>
                  Are you sure you want to delete <strong>{itemToDelete.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 border border-[#E5D9CC] text-[#3B2F2F] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
