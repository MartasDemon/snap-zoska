"use server";

import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { revalidatePath } from "next/cache";

// Toggle like on a post
export async function togglePostLike(postId: string, userId: string) {
  console.log("Server action: togglePostLike called with", { postId, userId });
  
  if (!postId || !userId) {
    console.error("Missing required parameters", { postId, userId });
    return { success: false, error: "Missing required parameters", liked: false, likeCount: 0 };
  }
  
  try {
    // Check if the like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    
    console.log("Existing like:", existingLike);
    
    let isLiked;
    if (existingLike) {
      // Unlike - delete the existing like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      console.log("Like deleted");
      isLiked = false;
    } else {
      // Like - create a new like
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      console.log("Like created");
      isLiked = true;
    }
    
    // Get the updated like count
    const likeCount = await prisma.like.count({
      where: {
        postId,
      },
    });
    
    console.log("Updated like count:", likeCount);
    
    // Revalidate the path to update the UI
    revalidatePath('/');
    
    return { 
      success: true, 
      liked: isLiked,
      likeCount: likeCount
    };
  } catch (error) {
    console.error("Error toggling like:", error);
    return { 
      success: false, 
      error: String(error),
      liked: false,
      likeCount: 0
    };
  }
}

// Get post details with like information
export async function getPostWithLikes(postId: string, userId?: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
        _count: {
          select: { likes: true }
        }
      }
    });
    
    if (!post) {
      return { success: false, error: "Post not found" };
    }
    
    let isLikedByUser = false;
    
    if (userId) {
      const like = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      
      isLikedByUser = !!like;
    }
    
    return {
      success: true,
      post: {
        ...post,
        likeCount: post._count.likes,
        isLikedByUser
      }
    };
  } catch (error) {
    console.error("Error getting post with likes:", error);
    return { success: false, error: String(error) };
  }
}

// Get like count for a post
export async function getPostLikeCount(postId: string) {
  try {
    const count = await prisma.like.count({
      where: {
        postId,
      },
    });
    return { success: true, count };
  } catch (error) {
    console.error("Error getting like count:", error);
    return { success: false, error: String(error) };
  }
}

// Check if a user has liked a post
export async function hasUserLikedPost(postId: string, userId: string) {
  if (!userId) return { success: true, liked: false };
  
  try {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    return { success: true, liked: !!like };
  } catch (error) {
    console.error("Error checking if user liked post:", error);
    return { success: false, error: String(error) };
  }
} 