'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { VaultItem } from '@/types';
import PasswordGenerator from '@/components/PasswordGenerator';
import VaultList from '@/components/VaultList';
import VaultItemForm from '@/components/VaultItemForm';
import { LogOut, Moon, Sun, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [showVaultForm, setShowVaultForm] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | undefined>();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userPassword, setUserPassword] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    // Check for dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                   (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchVaultItems();
    }
  }, [session]);

  const fetchVaultItems = async () => {
    try {
      const response = await fetch('/api/vault');
      if (response.ok) {
        const data = await response.json();
        setVaultItems(data.items);
      }
    } catch (error) {
      console.error('Failed to fetch vault items:', error);
      toast.error('Failed to load vault items');
    }
  };

  const handleAddItem = () => {
    if (!userPassword) {
      const password = prompt('Enter your master password to add vault items:');
      if (!password) return;
      setUserPassword(password);
    }
    setEditingItem(undefined);
    setShowVaultForm(true);
  };

  const handleEditItem = (item: VaultItem) => {
    if (!userPassword) {
      const password = prompt('Enter your master password to edit vault items:');
      if (!password) return;
      setUserPassword(password);
    }
    setEditingItem(item);
    setShowVaultForm(true);
  };

  const handleSaveItem = async (itemData: Partial<VaultItem>) => {
    try {
      const url = editingItem ? `/api/vault/${editingItem.id}` : '/api/vault';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (response.ok) {
        await fetchVaultItems();
        setShowVaultForm(false);
        setEditingItem(undefined);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save vault item');
      }
    } catch (error) {
      console.error('Failed to save vault item:', error);
      toast.error('Failed to save vault item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/vault/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchVaultItems();
        toast.success('Vault item deleted');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete vault item');
      }
    } catch (error) {
      console.error('Failed to delete vault item:', error);
      toast.error('Failed to delete vault item');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Passgnaret
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {session.user?.email}
              </span>
              
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Password Generator */}
          <div>
            <PasswordGenerator />
          </div>

          {/* Vault */}
          <div>
            <VaultList
              items={vaultItems}
              onAdd={handleAddItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              userPassword={userPassword}
            />
          </div>
        </div>
      </main>

      {/* Vault Item Form Modal */}
      {showVaultForm && (
        <VaultItemForm
          item={editingItem}
          onSave={handleSaveItem}
          onCancel={() => {
            setShowVaultForm(false);
            setEditingItem(undefined);
          }}
          userPassword={userPassword}
        />
      )}
    </div>
  );
}
