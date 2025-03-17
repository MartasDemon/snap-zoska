import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/lib/prisma';

// Define a type for the session user with id
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !('id' in session.user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Type assertion for session.user
    const user = session.user as SessionUser;
    
    // Get the user's image from the database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { image: true }
    });
    
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if the image is a base64 string
    const isBase64 = dbUser.image?.startsWith('data:image/');
    
    return NextResponse.json({
      success: true,
      image: dbUser.image,
      isBase64: isBase64,
      sessionImage: user.image,
      imageMatch: dbUser.image === user.image
    });
  } catch (error) {
    console.error('Error checking profile image:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
} 