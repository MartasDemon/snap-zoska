"use server";

import { prisma } from "@/lib/prisma";

// Define types for the debug data
interface PostWithIssues {
  id: string;
}

// Debug function to check all posts in the database
export async function debugPosts() {
  try {
    console.log("Starting debug posts action");
    
    // Get all posts with user information and like counts
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        likes: true,
        savedBy: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${posts.length} total posts`);
    
    // Check for Jack Doyle's posts specifically
    const jackDoylePosts = posts.filter(post => 
      post.user.name?.toLowerCase().includes('jack doyle') || 
      post.user.email?.toLowerCase().includes('jack') || 
      post.user.email?.toLowerCase().includes('doyle')
    );
    
    console.log(`Found ${jackDoylePosts.length} posts by Jack Doyle`);
    
    // Check for posts with missing data
    let postsWithMissingData = 0;
    const postsWithIssues: PostWithIssues[] = [];
    
    const transformedPosts = posts.map(post => {
      const hasIssues = !post.imageUrl || !post.userId;
      if (hasIssues) {
        postsWithMissingData++;
        postsWithIssues.push({ id: post.id });
      }
      
      return {
        id: post.id,
        userId: post.userId,
        userName: post.user.name || post.user.email?.split('@')[0] || 'Unknown',
        userEmail: post.user.email || 'No email',
        imageUrl: post.imageUrl || 'Missing image URL',
        caption: post.caption,
        createdAt: post.createdAt,
        likeCount: post.likes.length,
        saveCount: post.savedBy.length,
        hasIssues
      };
    });
    
    // Get all users for reference
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    });
    
    console.log(`Found ${users.length} total users`);
    
    return {
      totalPosts: posts.length,
      postsWithMissingData,
      postsWithIssues,
      jackDoylePostCount: jackDoylePosts.length,
      jackDoylePosts: jackDoylePosts.map(post => ({
        id: post.id,
        userId: post.userId,
        userName: post.user.name || post.user.email?.split('@')[0] || 'Unknown',
        userEmail: post.user.email || 'No email',
        imageUrl: post.imageUrl || 'Missing image URL',
        caption: post.caption,
        createdAt: post.createdAt,
        likeCount: post.likes.length,
        saveCount: post.savedBy.length
      })),
      posts: transformedPosts,
      users: users
    };
  } catch (error) {
    console.error("Error in debugPosts:", error);
    throw new Error(`Failed to debug posts: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function createTestPost() {
  try {
    console.log("Starting create test post action");
    
    // Find Jack Doyle user or any admin user
    const jackDoyle = await prisma.user.findFirst({
      where: {
        OR: [
          { name: { contains: 'Jack Doyle', mode: 'insensitive' } },
          { email: { contains: 'jack', mode: 'insensitive' } },
          { email: { contains: 'doyle', mode: 'insensitive' } },
          { email: { contains: 'admin', mode: 'insensitive' } }
        ]
      }
    });
    
    if (!jackDoyle) {
      console.error("Could not find Jack Doyle or admin user");
      return { success: false, error: "Could not find Jack Doyle or admin user" };
    }
    
    console.log(`Found user for test post: ${jackDoyle.name || jackDoyle.email}`);
    
    // Create a test post
    const testPost = await prisma.post.create({
      data: {
        userId: jackDoyle.id,
        imageUrl: "https://source.unsplash.com/random/800x600/?nature",
        caption: "This is a test post created by the debug system",
        createdAt: new Date(),
      }
    });
    
    console.log(`Created test post with ID: ${testPost.id}`);
    
    return {
      success: true,
      post: {
        id: testPost.id,
        userId: testPost.userId,
        userName: jackDoyle.name || jackDoyle.email?.split('@')[0] || 'Unknown',
        imageUrl: testPost.imageUrl,
        caption: testPost.caption,
        createdAt: testPost.createdAt
      }
    };
  } catch (error) {
    console.error("Error creating test post:", error);
    return {
      success: false,
      error: `Failed to create test post: ${error instanceof Error ? error.message : String(error)}`
    };
  }
} 