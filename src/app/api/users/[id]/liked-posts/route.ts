import { NextRequest, NextResponse } from 'next/server';
import { fetchLikedPosts } from '@/app/actions/post';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log(`API: Fetching liked posts for user ${userId}`);

    // Use the server action to fetch liked posts
    const likedPosts = await fetchLikedPosts(userId);
    
    console.log(`API: Found ${likedPosts.length} liked posts for user ${userId}`);

    return NextResponse.json(likedPosts);
  } catch (error) {
    console.error('Error fetching liked posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 