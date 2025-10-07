'use client';

import { useState } from 'react';
import { PasswordGeneratorOptions } from '@/types';
import { generatePassword, calculatePasswordStrength } from '@/lib/password-generator';
import { copyToClipboard, clearClipboardAfterDelay } from '@/utils/clipboard';
import { Copy, RefreshCw, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const defaultOptions: PasswordGeneratorOptions = {
  length: 16,
  includeNumbers: true,
  includeSymbols: true,
  includeUppercase: true,
  includeLowercase: true,
  excludeLookalikes: true,
};

export default function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordGeneratorOptions>(defaultOptions);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGenerate = () => {
    try {
      const password = generatePassword(options);
      setGeneratedPassword(password);
    } catch (error) {
      toast.error('Please select at least one character type');
    }
  };

  const handleCopy = async () => {
    if (!generatedPassword) return;
    
    const success = await copyToClipboard(generatedPassword);
    if (success) {
      toast.success('Password copied to clipboard');
      clearClipboardAfterDelay(15000);
    } else {
      toast.error('Failed to copy password');
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const strength = calculatePasswordStrength(generatedPassword);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Password Generator
      </h2>

      {/* Generated Password Display */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <input
            type={showPassword ? 'text' : 'password'}
            value={generatedPassword}
            readOnly
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-lg"
            placeholder="Generated password will appear here"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <button
            onClick={handleCopy}
            disabled={!generatedPassword}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
          >
            <Copy size={20} />
          </button>
        </div>
        
        {/* Password Strength Indicator */}
        {generatedPassword && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Strength:</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-2 w-6 rounded ${
                    level <= strength ? getStrengthColor(strength) : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {strength <= 2 ? 'Weak' : strength <= 3 ? 'Fair' : strength <= 4 ? 'Good' : 'Strong'}
            </span>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-4">
        {/* Length Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Length: {options.length}
          </label>
          <input
            type="range"
            min="4"
            max="64"
            value={options.length}
            onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Character Type Options */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeUppercase}
              onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Uppercase (A-Z)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeLowercase}
              onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Lowercase (a-z)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Numbers (0-9)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Symbols (!@#$)</span>
          </label>
        </div>

        {/* Exclude Lookalikes */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={options.excludeLookalikes}
            onChange={(e) => setOptions({ ...options, excludeLookalikes: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Exclude lookalikes (0, O, 1, l, I, |)</span>
        </label>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <RefreshCw size={20} />
        <span>Generate Password</span>
      </button>
    </div>
  );
}
