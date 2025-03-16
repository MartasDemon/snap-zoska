// src/app/actions/posts.ts

"use server";

// Import Prisma client
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Fetch all posts with likes count and user's like status
export async function fetchPosts(currentUserId?: string, profileUserId?: string) {
  try {
    console.log("Fetching posts for user:", currentUserId, "profile user:", profileUserId);
    
    // Build where clause based on parameters
    const whereClause = profileUserId ? { userId: profileUserId } : {};
    
    // Log the where clause for debugging
    console.log("Where clause:", JSON.stringify(whereClause));
    
    // First, let's check how many posts exist in total
    const totalPosts = await prisma.post.count();
    console.log("Total posts in database:", totalPosts);
    
    // Now fetch the posts with the where clause
    const posts = await prisma.post.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        likes: true,
        _count: {
          select: { likes: true }
        }
      },
    });
    
    console.log("Found posts count:", posts.length);
    
    // If we're fetching a specific user's posts and got none, log their user ID for debugging
    if (profileUserId && posts.length === 0) {
      const user = await prisma.user.findUnique({
        where: { id: profileUserId },
        select: { name: true, email: true }
      });
      console.log("User details for empty posts:", user);
    }

    // Transform the posts to include like count and user's like status
    const transformedPosts = posts.map(post => ({
      id: post.id,
      userId: post.userId,
      imageUrl: post.imageUrl,
      caption: post.caption,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: {
        id: post.user.id,
        name: post.user.name,
        email: post.user.email,
        image: post.user.image
      },
      likeCount: post._count.likes,
      isLikedByUser: currentUserId ? post.likes.some(like => like.userId === currentUserId) : false
    }));

    console.log("Transformed posts:", transformedPosts.length);
    return transformedPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Could not fetch posts");
  }
}

// Toggle like on a post
export async function toggleLike(postId: string, userId: string) {
  console.log(`Toggling like for post ${postId} by user ${userId}`);
  
  try {
    // Check if the post is already liked by the user
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId
        }
      }
    });
    
    console.log(`Existing like: ${existingLike ? 'Found' : 'Not found'}`);
    
    let liked = false;
    
    if (existingLike) {
      // If already liked, remove the like
      console.log(`Removing like for post ${postId} by user ${userId}`);
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId
          }
        }
      });
      liked = false;
    } else {
      // If not liked, add a new like
      console.log(`Adding like for post ${postId} by user ${userId}`);
      await prisma.like.create({
        data: {
          userId: userId,
          postId: postId
        }
      });
      liked = true;
    }
    
    // Get updated like count
    const likeCount = await prisma.like.count({
      where: {
        postId: postId
      }
    });
    
    // Revalidate paths to ensure UI updates
    revalidatePath('/');
    revalidatePath('/profil/[id]');
    
    return { 
      success: true, 
      liked: liked, 
      likeCount: likeCount
    };
  } catch (error) {
    console.error(`Error toggling like for post ${postId}:`, error);
    return { 
      success: false, 
      error: `Failed to toggle like: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

// Fetch liked posts for a user
export async function fetchLikedPosts(userId: string) {
  console.log(`Fetching liked posts for user ${userId}`);
  
  try {
    if (!userId) {
      console.log('No user ID provided');
      return [];
    }
    
    const likedPosts = await prisma.like.findMany({
      where: {
        userId: userId
      },
      include: {
        post: {
          include: {
            user: true,
            _count: {
              select: { likes: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`Found ${likedPosts.length} liked posts for user ${userId}`);
    
    // Transform the data to match the format expected by the frontend
    const transformedPosts = likedPosts.map(like => ({
      id: like.post.id,
      userId: like.post.userId,
      imageUrl: like.post.imageUrl,
      caption: like.post.caption,
      createdAt: like.post.createdAt,
      updatedAt: like.post.updatedAt,
      user: {
        name: like.post.user.name,
        image: like.post.user.image
      },
      likeCount: like.post._count.likes,
      isLikedByUser: true
    }));
    
    return transformedPosts;
  } catch (error) {
    console.error(`Error fetching liked posts for user ${userId}:`, error);
    return [];
  }
}

// Check if posts are liked by a user
export async function checkLikedPosts(userId: string, postIds: string[]) {
  console.log(`Checking liked posts for user ${userId}, posts: ${postIds.join(', ')}`);
  
  try {
    if (!userId || !postIds.length) {
      console.log('No user ID or post IDs provided');
      return [];
    }
    
    const likedPosts = await prisma.like.findMany({
      where: {
        userId: userId,
        postId: {
          in: postIds
        }
      },
      select: {
        postId: true
      }
    });
    
    const likedPostIds = likedPosts.map(like => like.postId);
    console.log(`Found ${likedPostIds.length} liked posts for user ${userId}`);
    
    return likedPostIds;
  } catch (error) {
    console.error(`Error checking liked posts for user ${userId}:`, error);
    return [];
  }
}

// Get like count for a post
export async function getLikeCount(postId: string) {
  try {
    const count = await prisma.like.count({
      where: {
        postId,
      },
    });
    return count;
  } catch (error) {
    console.error("Error getting like count:", error);
    throw new Error("Could not get like count");
  }
}

// Fetch posts by a specific user ID
export async function fetchPostsByUserId(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        likes: true,
        _count: {
          select: { likes: true }
        }
      }
    });

    return posts.map(post => ({
      ...post,
      likeCount: post._count.likes,
      isLikedByUser: false
    }));
  } catch (error) {
    console.error("Error fetching posts by userId:", error);
    throw new Error("Could not fetch posts");
  }
}

// Create a new post
export async function createPost(userId: string, imageUrl: string, caption?: string) {
  try {
    const newPost = await prisma.post.create({
      data: {
        userId,
        imageUrl,
        caption,
      },
    });

    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Could not create post");
  }
}

// Toggle save on a post
export async function toggleSavePost(postId: string, userId: string) {
  console.log(`Toggling save for post ${postId} by user ${userId}`);
  
  try {
    // Check if the post is already saved by the user
    const existingSave = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId
        }
      }
    });
    
    console.log(`Existing save: ${existingSave ? 'Found' : 'Not found'}`);
    
    if (existingSave) {
      // If already saved, remove the save
      console.log(`Removing save for post ${postId} by user ${userId}`);
      await prisma.savedPost.delete({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId
          }
        }
      });
      return { saved: false, message: "Post unsaved successfully" };
    } else {
      // If not saved, add a new save
      console.log(`Adding save for post ${postId} by user ${userId}`);
      await prisma.savedPost.create({
        data: {
          userId: userId,
          postId: postId
        }
      });
      return { saved: true, message: "Post saved successfully" };
    }
  } catch (error) {
    console.error(`Error toggling save for post ${postId}:`, error);
    throw new Error(`Failed to toggle save: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Fetch saved posts for a user
export async function fetchSavedPosts(userId: string) {
  console.log(`Fetching saved posts for user ${userId}`);
  
  try {
    if (!userId) {
      console.log('No user ID provided');
      return [];
    }
    
    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId: userId
      },
      include: {
        post: {
          include: {
            user: true,
            _count: {
              select: { likes: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`Found ${savedPosts.length} saved posts for user ${userId}`);
    
    // Transform the data to match the format expected by the frontend
    const transformedPosts = savedPosts.map(savedPost => ({
      id: savedPost.post.id,
      imageUrl: savedPost.post.imageUrl,
      caption: savedPost.post.caption,
      createdAt: savedPost.post.createdAt,
      userId: savedPost.post.userId,
      userName: savedPost.post.user.name || savedPost.post.user.email?.split('@')[0] || 'Unknown',
      userImage: savedPost.post.user.image,
      likeCount: savedPost.post._count.likes,
      isSaved: true // Since these are saved posts
    }));
    
    return transformedPosts;
  } catch (error) {
    console.error(`Error fetching saved posts for user ${userId}:`, error);
    return [];
  }
}

// Check if posts are saved by a user
export async function checkSavedPosts(userId: string, postIds: string[]) {
  console.log(`Checking saved posts for user ${userId}, posts: ${postIds.join(', ')}`);
  
  try {
    if (!userId || !postIds.length) {
      console.log('No user ID or post IDs provided');
      return [];
    }
    
    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId: userId,
        postId: {
          in: postIds
        }
      },
      select: {
        postId: true
      }
    });
    
    const savedPostIds = savedPosts.map(save => save.postId);
    console.log(`Found ${savedPostIds.length} saved posts for user ${userId}`);
    
    return savedPostIds;
  } catch (error) {
    console.error(`Error checking saved posts for user ${userId}:`, error);
    return [];
  }
}