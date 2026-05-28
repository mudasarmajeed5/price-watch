import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/services/notification.service';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    const service = new NotificationService();
    
    await service.notifyPriceDrop(
      new ObjectId(userId),
      new ObjectId('507f1f77bcf86cd799439011'), // test product ID
      1000,
      500,
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}