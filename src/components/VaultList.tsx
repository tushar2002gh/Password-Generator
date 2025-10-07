'use client';

import { useState } from 'react';
import { VaultItem } from '@/types';
import { decryptData, generateKey } from '@/lib/encryption';
import { copyToClipboard, clearClipboardAfterDelay } from '@/utils/clipboard';
import { Search, Plus, Edit, Trash2, Copy, Eye, EyeOff, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface VaultListProps {
  items: VaultItem[];
  onAdd: () => void;
  onEdit: (item: VaultItem) => void;
  onDelete: (id: string) => void;
  userPassword: string;
}

export default function VaultList({ items, onAdd, onEdit, onDelete, userPassword }: VaultListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [decryptedItems, setDecryptedItems] = useState<Map<string, any>>(new Map());

  // FIXED: Check item.id is string before using as key
  const decryptItem = (item: VaultItem) => {
    if (typeof item.id === 'string' && decryptedItems.has(item.id)) {
      return decryptedItems.get(item.id);
    }

    try {
      const [encryptedData, salt] = item.encryptedData.split(':');
      const key = generateKey(userPassword, salt);
      const decryptedData = JSON.parse(decryptData(encryptedData, key));
      
      if (typeof item.id === 'string') {
        setDecryptedItems(prev => new Map(prev).set(item.id, decryptedData));
      }
      return decryptedData;
    } catch (error) {
      console.error('Decryption error:', error);
      toast.error('Failed to decrypt item');
      return null;
    }
  };

  const filteredItems = items.filter(item => {
    if (!searchTerm) return true;
    
    const decrypted = decryptItem(item);
    if (!decrypted) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      decrypted.title.toLowerCase().includes(searchLower) ||
      decrypted.username.toLowerCase().includes(searchLower) ||
      decrypted.url.toLowerCase().includes(searchLower) ||
      decrypted.notes.toLowerCase().includes(searchLower)
    );
  });

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success('Copied to clipboard');
      clearClipboardAfterDelay(15000);
    } else {
      toast.error('Failed to copy');
    }
  };

  const togglePasswordVisibility = (itemId: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleDelete = (item: VaultItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      onDelete(item.id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Password Vault
        </h2>
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search vault items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:b[...]"
        />
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No items match your search' : 'No vault items yet. Add your first password!'}
          </div>
        ) : (
          filteredItems.map((item) => {
            const decrypted = decryptItem(item);
            if (!decrypted) return null;

            const isPasswordVisible = visiblePasswords.has(item.id);

            return (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {decrypted.title}
                    </h3>
                    
                    {decrypted.username && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Username:</span>
                        <span className="text-sm text-gray-900 dark:text-white font-mono">
                          {decrypted.username}
                        </span>
                        <button
                          onClick={() => handleCopy(decrypted.username)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    )}

                    {decrypted.password && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Password:</span>
                        <span className="text-sm text-gray-900 dark:text-white font-mono">
                          {isPasswordVisible ? decrypted.password : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(item.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          {isPasswordVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          onClick={() => handleCopy(decrypted.password)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    )}

                    {decrypted.url && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">URL:</span>
                        <a
                          href={decrypted.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
                        >
                          {decrypted.url}
                        </a>
                        <button
                          onClick={() => handleCopy(decrypted.url)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          <Copy size={14} />
                        </button>
                        <a
                          href={decrypted.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    )}

                    {decrypted.notes && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Notes:</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {decrypted.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}