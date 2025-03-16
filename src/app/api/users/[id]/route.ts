import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log(`API: Fetching user data for user ${userId}`);

    // Find user in database with their profile
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
        posts: {
          select: {
            id: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          select: {
            postId: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log(`API: Found user ${user.name || user.email} with ${user.posts.length} posts and ${user.likes.length} likes`);

    // Return user data (excluding sensitive information)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      postCount: user.posts.length,
      likeCount: user.likes.length,
      profile: user.profile ? {
        bio: user.profile.bio,
        location: user.profile.location,
        interests: user.profile.interests,
      } : null,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 