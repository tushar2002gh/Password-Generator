import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { VaultItem } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const vaultItems = db.collection<VaultItem>('vaultItems');
    
    const items = await vaultItems
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Get vault items error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, username, password, url, notes, encryptedData } = await request.json();

    if (!title || !encryptedData) {
      return NextResponse.json(
        { error: 'Title and encrypted data are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const vaultItems = db.collection<VaultItem>('vaultItems');

    const vaultItem: Omit<VaultItem, 'id'> = {
      userId: session.user.id,
      title,
      username: username || '',
      password: password || '',
      url: url || '',
      notes: notes || '',
      encryptedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await vaultItems.insertOne(vaultItem as VaultItem);

    return NextResponse.json(
      { message: 'Vault item created successfully', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create vault item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
