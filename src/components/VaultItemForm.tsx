'use client';

import { useState } from 'react';
import { VaultItem } from '@/types';
import { encryptData, generateKey, generateSalt } from '@/lib/encryption';
import { copyToClipboard, clearClipboardAfterDelay } from '@/utils/clipboard';
import { Copy, Eye, EyeOff, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface VaultItemFormProps {
  item?: VaultItem;
  onSave: (item: Partial<VaultItem>) => void;
  onCancel: () => void;
  userPassword: string;
}

export default function VaultItemForm({ item, onSave, onCancel, userPassword }: VaultItemFormProps) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    username: item?.username || '',
    password: item?.password || '',
    url: item?.url || '',
    notes: item?.notes || '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsLoading(true);

    try {
      // Create the data object to encrypt
      const dataToEncrypt = {
        title: formData.title,
        username: formData.username,
        password: formData.password,
        url: formData.url,
        notes: formData.notes,
      };

      // Generate salt and key for encryption
      const salt = generateSalt();
      const key = generateKey(userPassword, salt);
      
      // Encrypt the data
      const encryptedData = encryptData(JSON.stringify(dataToEncrypt), key);

      // Prepare the item data
      const itemData: Partial<VaultItem> = {
        title: formData.title,
        username: formData.username,
        password: formData.password,
        url: formData.url,
        notes: formData.notes,
        encryptedData: encryptedData + ':' + salt, // Store salt with encrypted data
      };

      onSave(itemData);
      toast.success(item ? 'Vault item updated' : 'Vault item saved');
    } catch (error) {
      console.error('Encryption error:', error);
      toast.error('Failed to save vault item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success('Copied to clipboard');
      clearClipboardAfterDelay(15000);
    } else {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {item ? 'Edit Vault Item' : 'Add Vault Item'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Gmail Account"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username/Email
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="username@example.com"
                />
                {formData.username && (
                  <button
                    type="button"
                    onClick={() => handleCopy(formData.username)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Copy size={16} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {formData.password && (
                  <button
                    type="button"
                    onClick={() => handleCopy(formData.password)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Copy size={16} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes..."
                rows={3}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Save size={16} />
                <span>{isLoading ? 'Saving...' : (item ? 'Update' : 'Save')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
