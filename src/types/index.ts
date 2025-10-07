export interface User {
  // id is optional because MongoDB uses _id; we map _id to session user id when needed.
  id?: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface VaultItem {
  id?: string;
  userId: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  encryptedData: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordGeneratorOptions {
  length: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeUppercase: boolean;
  includeLowercase: boolean;
  excludeLookalikes: boolean;
}

export interface SessionUser {
  id: string;
  email: string;
}
