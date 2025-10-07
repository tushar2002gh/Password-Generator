import CryptoJS from 'crypto-js';

// Generate a key from user's password
export function generateKey(password: string, salt: string): string {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 10000
  }).toString();
}

// Encrypt data
export function encryptData(data: string, key: string): string {
  return CryptoJS.AES.encrypt(data, key).toString();
}

// Decrypt data
export function decryptData(encryptedData: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Generate a random salt
export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
}
