import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('Profile image update API route called');
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      console.log('Unauthorized profile update attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('User authenticated:', session.user.email);

    // Get form data with the file
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      console.log('No file provided in request');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('File received:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Check file size (max 2MB to avoid database issues)
    if (file.size > 2 * 1024 * 1024) {
      console.log('File too large:', file.size);
      return NextResponse.json({ error: 'File too large (max 2MB)' }, { status: 400 });
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    console.log('Image converted to base64, length:', base64Image.length);

    // Update the user's image in the database
    const userId = session.user.id;
    await prisma.user.update({
      where: { id: userId },
      data: { image: base64Image }
    });
    
    console.log(`Updated profile image for user ${userId}`);

    return NextResponse.json({
      success: true,
      imageUrl: base64Image
    });
  } catch (error) {
    console.error('Error in profile image update API route:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
} 