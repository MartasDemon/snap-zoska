"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Box, Card, CardContent, CardMedia, Typography, IconButton, Avatar, CardHeader, CardActions, Skeleton, Button, Container, Grid } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { fetchPosts, toggleLike, checkLikedPosts } from '@/app/actions/post';
import { useRouter } from 'next/navigation';

// Define the Post type
interface Post {
  id: string;
  userId: string;
  userName: string;
  userImage?: string | null;
  imageUrl: string;
  caption?: string | null;
  createdAt: string | Date;
  likeCount: number;
  isLikedByUser: boolean;
}

// Define the session user type
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Define the toggle like response type
interface ToggleLikeResponse {
  success: boolean;
  liked?: boolean;
  likeCount?: number;
  error?: string;
}

export default function PostsView() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingLikes, setProcessingLikes] = useState<Record<string, boolean>>({});
  const [expandedCaptions, setExpandedCaptions] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const router = useRouter();

  // Get the user ID from the session
  const userId = (session?.user as SessionUser | undefined)?.id;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch posts with the current user ID to get like status
        const fetchedPosts = await fetchPosts(userId);
        console.log("Fetched posts:", fetchedPosts);
        
        // Transform the fetched posts to match our Post interface
        const transformedPosts = fetchedPosts.map((post: any) => ({
          id: post.id,
          userId: post.userId,
          userName: post.user?.name || 'Unknown',
          userImage: post.user?.image,
          imageUrl: post.imageUrl,
          caption: post.caption,
          createdAt: post.createdAt,
          likeCount: post.likeCount,
          isLikedByUser: post.isLikedByUser
        }));
        
        setPosts(transformedPosts);
        
        // Check which posts are liked by the current user
        if (userId) {
          const postIds = transformedPosts.map(post => post.id);
          const likedPostIds = await checkLikedPosts(userId, postIds);
          console.log("Liked post IDs:", likedPostIds);
          setLikedPosts(likedPostIds);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [userId]);

  const handleLike = async (postId: string) => {
    if (!userId) return;
    
    try {
      setProcessingLikes(prev => ({ ...prev, [postId]: true }));
      
      // Find the post
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      
      // Optimistic update
      const isCurrentlyLiked = post.isLikedByUser;
      
      setPosts(prevPosts => 
        prevPosts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              likeCount: isCurrentlyLiked ? p.likeCount - 1 : p.likeCount + 1,
              isLikedByUser: !isCurrentlyLiked
            };
          }
          return p;
        })
      );
      
      // Update liked posts state
      if (isCurrentlyLiked) {
        setLikedPosts(prev => prev.filter(id => id !== postId));
      } else {
        setLikedPosts(prev => [...prev, postId]);
      }
      
      // Actual API call
      console.log(`Toggling like for post ${postId} by user ${userId}`);
      const result = await toggleLike(postId, userId) as ToggleLikeResponse;
      console.log("Toggle like result:", result);
      
      if (!result.success) {
        // Revert optimistic update if failed
        setPosts(prevPosts => 
          prevPosts.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                likeCount: isCurrentlyLiked ? p.likeCount + 1 : p.likeCount - 1,
                isLikedByUser: isCurrentlyLiked
              };
            }
            return p;
          })
        );
        
        // Revert liked posts state
        if (isCurrentlyLiked) {
          setLikedPosts(prev => [...prev, postId]);
        } else {
          setLikedPosts(prev => prev.filter(id => id !== postId));
        }
      } else if (result.likeCount !== undefined) {
        // Update with the actual like count from the server
        setPosts(prevPosts => 
          prevPosts.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                likeCount: result.likeCount!
              };
            }
            return p;
          })
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setProcessingLikes(prev => ({ ...prev, [postId]: false }));
    }
  };

  const toggleCaption = (postId: string) => {
    setExpandedCaptions(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} sekúnd`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minútu' : minutes < 5 ? 'minúty' : 'minút'}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hodinu' : hours < 5 ? 'hodiny' : 'hodín'}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'deň' : days < 5 ? 'dni' : 'dní'}`;
    }
  };

  const handleProfileClick = (userId: string) => {
    router.push(`/profil/${userId}`);
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
        {[1, 2, 3].map((item) => (
          <Card key={item} sx={{ mb: 4 }}>
            <CardHeader
              avatar={<Skeleton variant="circular" width={40} height={40} />}
              title={<Skeleton variant="text" width="80%" />}
              subheader={<Skeleton variant="text" width="40%" />}
            />
            <Skeleton variant="rectangular" height={300} />
            <CardContent>
              <Skeleton variant="text" />
              <Skeleton variant="text" width="80%" />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8} sx={{ mx: 'auto' }}>
          {posts.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ my: 4 }}>
              Žiadne príspevky na zobrazenie
            </Typography>
          ) : (
            posts.map((post) => (
              <Card key={post.id} sx={{ mb: 4 }}>
                <CardHeader
                  avatar={
                    <Avatar 
                      src={post.userImage || undefined} 
                      alt={post.userName}
                      onClick={() => handleProfileClick(post.userId)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {post.userName?.charAt(0).toUpperCase() || '?'}
                    </Avatar>
                  }
                  title={
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'bold', 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => handleProfileClick(post.userId)}
                    >
                      {post.userName}
                    </Typography>
                  }
                  subheader={`pred ${formatTimeAgo(post.createdAt)}`}
                />
                <CardMedia
                  component="img"
                  image={post.imageUrl}
                  alt="Post image"
                  sx={{ height: 'auto', maxHeight: 500, objectFit: 'contain' }}
                />
                <CardContent>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}
                  </Typography>
                  {post.caption && (
                    <Typography variant="body2" color="text.secondary">
                      <Typography 
                        component="span" 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 'bold', 
                          mr: 1,
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={() => handleProfileClick(post.userId)}
                      >
                        {post.userName}
                      </Typography>
                      {expandedCaptions[post.id] || post.caption.length <= 100 
                        ? post.caption 
                        : `${post.caption.substring(0, 100)}...`}
                      {post.caption.length > 100 && (
                        <Button 
                          size="small" 
                          onClick={() => toggleCaption(post.id)}
                          sx={{ ml: 1, p: 0, minWidth: 'auto', textTransform: 'none' }}
                        >
                          {expandedCaptions[post.id] ? 'Zobraziť menej' : 'Zobraziť viac'}
                        </Button>
                      )}
                    </Typography>
                  )}
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton 
                    aria-label="add to favorites" 
                    onClick={() => handleLike(post.id)}
                    disabled={!userId || processingLikes[post.id]}
                    color={post.isLikedByUser ? "error" : "default"}
                    sx={{ 
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.1)' }
                    }}
                  >
                    {post.isLikedByUser ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    {post.likeCount}
                  </Typography>
                </CardActions>
              </Card>
            ))
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
