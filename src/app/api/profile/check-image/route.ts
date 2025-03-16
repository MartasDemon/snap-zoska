import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user's image from the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if the image is a base64 string
    const isBase64 = user.image?.startsWith('data:image/');
    
    return NextResponse.json({
      success: true,
      image: user.image,
      isBase64: isBase64,
      sessionImage: session.user.image,
      imageMatch: user.image === session.user.image
    });
  } catch (error) {
    console.error('Error checking profile image:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
} 