// src/app/actions/posts.ts

"use server";

// Import Prisma client
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { revalidatePath } from "next/cache";

// Fetch all posts with likes count and user's like status
export async function fetchPosts(currentUserId?: string) {
  try {
    console.log("Fetching posts for user:", currentUserId);
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        likes: true,
        _count: {
          select: { likes: true }
        }
      },
    });

    // Transform the posts to include like count and user's like status
    const transformedPosts = posts.map(post => ({
      id: post.id,
      userId: post.userId,
      imageUrl: post.imageUrl,
      caption: post.caption,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: {
        name: post.user.name,
        image: post.user.image
      },
      likeCount: post._count.likes,
      isLikedByUser: currentUserId ? post.likes.some(like => like.userId === currentUserId) : false
    }));

    console.log("Transformed posts:", transformedPosts);
    return transformedPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Could not fetch posts");
  }
}

// Toggle like on a post
export async function toggleLike(postId: string, userId: string) {
  try {
    console.log("Toggling like for post:", postId, "by user:", userId);
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    console.log("Existing like:", existingLike);

    if (existingLike) {
      // Unlike
      console.log("Deleting existing like");
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      revalidatePath('/');
      return false; // Indicates the post is now unliked
    } else {
      // Like
      console.log("Creating new like");
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      revalidatePath('/');
      return true; // Indicates the post is now liked
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Could not toggle like");
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