import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const vaultItems = db.collection('vaultItems');

    const result = await vaultItems.updateOne(
      { 
        _id: new ObjectId(params.id),
        userId: session.user.id 
      },
      {
        $set: {
          title,
          username: username || '',
          password: password || '',
          url: url || '',
          notes: notes || '',
          encryptedData,
          updatedAt: new Date(),
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Vault item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Vault item updated successfully' });
  } catch (error) {
    console.error('Update vault item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const vaultItems = db.collection('vaultItems');

    const result = await vaultItems.deleteOne({
      _id: new ObjectId(params.id),
      userId: session.user.id
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Vault item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Vault item deleted successfully' });
  } catch (error) {
    console.error('Delete vault item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
