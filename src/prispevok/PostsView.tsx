"use client";

// React imports
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
// Icons
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

// Server action import
import { fetchPosts } from "@/app/actions/post";
import { togglePostLike } from "@/app/actions/like";

// Post interface
interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    image?: string | null;
  };
  likeCount: number;
  isLikedByUser: boolean;
}

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Interface for optimistic updates
interface OptimisticLikeUpdate {
  isLiked: boolean;
  likeCount: number;
}

// Interface for togglePostLike response
interface ToggleLikeResponse {
  success: boolean;
  liked?: boolean;
  likeCount?: number;
  error?: string;
}

const PostsView = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [expandedCaptions, setExpandedCaptions] = useState<Set<string>>(new Set());
  const [likeUpdates, setLikeUpdates] = useState<Map<string, OptimisticLikeUpdate>>(new Map());
  const [processingLikes, setProcessingLikes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const userId = (session?.user as SessionUser | undefined)?.id;
        console.log("Loading posts with user ID:", userId);
        const fetchedPosts: Post[] = await fetchPosts(userId);
        console.log("Fetched posts:", fetchedPosts);
        setPosts(fetchedPosts);
        // Reset optimistic updates when posts are loaded
        setLikeUpdates(new Map());
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    if (status !== "loading") {
      loadPosts();
    }
  }, [session?.user, status]);

  // Get the current like state for a post (considering optimistic updates)
  const getPostLikeState = (post: Post): { isLiked: boolean; likeCount: number } => {
    const update = likeUpdates.get(post.id);
    if (update) {
      return {
        isLiked: Boolean(update.isLiked),
        likeCount: update.likeCount
      };
    }
    return {
      isLiked: post.isLikedByUser,
      likeCount: post.likeCount
    };
  };

  const handleLike = async (postId: string) => {
    const userId = (session?.user as SessionUser | undefined)?.id;
    
    if (!userId || processingLikes.has(postId)) {
      return;
    }

    try {
      // Mark this post as processing a like
      setProcessingLikes((prevSet) => {
        const newSet = new Set(prevSet);
        newSet.add(postId);
        return newSet;
      });
      
      // Find the current post
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      
      // Get current state
      const currentState = getPostLikeState(post);
      
      // Set optimistic update (toggle the current state)
      const newIsLiked = !currentState.isLiked;
      const newLikeCount = currentState.likeCount + (newIsLiked ? 1 : -1);
      
      setLikeUpdates((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(postId, {
          isLiked: newIsLiked,
          likeCount: newLikeCount
        });
        return newMap;
      });
      
      // Call the server action
      const response: ToggleLikeResponse = await togglePostLike(postId, userId);
      console.log("Toggle like response:", response);
      
      if (response.success) {
        // Update with the actual server response
        setLikeUpdates((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.set(postId, {
            isLiked: Boolean(response.liked),
            likeCount: response.likeCount !== undefined ? response.likeCount : currentState.likeCount
          });
          return newMap;
        });
      } else {
        console.error("Failed to toggle like:", response.error);
        
        // If there was an error, revert the optimistic update
        setLikeUpdates((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.delete(postId);
          return newMap;
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      
      // Revert optimistic update on error
      setLikeUpdates((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.delete(postId);
        return newMap;
      });
    } finally {
      // Mark this post as no longer processing a like
      setProcessingLikes((prevSet) => {
        const newSet = new Set(prevSet);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handleSave = (postId: string) => {
    setSavedPosts(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(postId)) {
        newSaved.delete(postId);
      } else {
        newSaved.add(postId);
      }
      return newSaved;
    });
  };

  const toggleCaption = (postId: string) => {
    setExpandedCaptions(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(postId)) {
        newExpanded.delete(postId);
      } else {
        newExpanded.add(postId);
      }
      return newExpanded;
    });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Príspevky
      </Typography>
      
      <Grid container spacing={2}>
        {posts.map((post) => {
          const { isLiked, likeCount } = getPostLikeState(post);
          const isProcessing = processingLikes.has(post.id);
          
          return (
            <Grid item xs={12} key={post.id}>
              <Card sx={{ maxWidth: 600, mx: "auto" }}>
                <CardHeader
                  avatar={
                    <Avatar
                      src={post.user.image || undefined}
                      alt={post.user.name || "User"}
                    />
                  }
                  title={post.user.name || "Neznámy používateľ"}
                  sx={{ 
                    '& .MuiCardHeader-title': { 
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }
                  }}
                />
                <CardMedia
                  component="img"
                  image={post.imageUrl}
                  alt={post.caption || "Príspevok bez popisu"}
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "600px",
                    objectFit: "contain",
                    bgcolor: "black",
                  }}
                />
                <CardActions disableSpacing sx={{ pt: 1, pb: 0 }}>
                  <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    <Box>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLike(post.id);
                        }}
                        style={{ 
                          background: isLiked ? 'rgba(255, 0, 0, 0.05)' : 'none',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: isProcessing || !session ? 'default' : 'pointer',
                          padding: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '8px',
                          transition: 'all 0.2s ease-in-out',
                          opacity: isProcessing ? 0.7 : 1
                        }}
                        disabled={isProcessing || !session}
                      >
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          width: '24px',
                          height: '24px'
                        }}>
                          {/* Liked icon with transition */}
                          <FavoriteIcon 
                            sx={{ 
                              color: 'red',
                              position: 'absolute',
                              opacity: isLiked ? 1 : 0,
                              transform: isLiked ? 'scale(1)' : 'scale(0.5)',
                              transition: 'all 0.2s ease-in-out'
                            }} 
                          />
                          {/* Unliked icon with transition */}
                          <FavoriteBorderIcon 
                            sx={{ 
                              position: 'absolute',
                              opacity: isLiked ? 0 : 1,
                              transform: isLiked ? 'scale(1.5)' : 'scale(1)',
                              transition: 'all 0.2s ease-in-out'
                            }} 
                          />
                        </div>
                        <span style={{ 
                          marginLeft: '8px',
                          transition: 'all 0.2s ease-in-out',
                          fontWeight: isLiked ? 'bold' : 'normal'
                        }}>
                          {likeCount}
                        </span>
                      </button>
                      <IconButton sx={{ p: 1 }}>
                        <ChatBubbleOutlineIcon />
                      </IconButton>
                    </Box>
                    <IconButton onClick={() => handleSave(post.id)} sx={{ p: 1 }}>
                      {savedPosts.has(post.id) ? (
                        <BookmarkIcon />
                      ) : (
                        <BookmarkBorderIcon />
                      )}
                    </IconButton>
                  </Box>
                </CardActions>
                <CardContent sx={{ pt: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                  </Typography>
                  {post.caption && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 'bold' }}>
                        {post.user.name || "Neznámy používateľ"}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          display: 'inline',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {expandedCaptions.has(post.id) 
                          ? post.caption 
                          : post.caption.length > 100 
                            ? post.caption.slice(0, 100) + '...'
                            : post.caption
                        }
                        {post.caption.length > 100 && (
                          <Typography
                            component="span"
                            onClick={() => toggleCaption(post.id)}
                            sx={{
                              color: 'text.secondary',
                              cursor: 'pointer',
                              ml: 1
                            }}
                          >
                            {expandedCaptions.has(post.id) ? 'less' : 'more'}
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  )}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, cursor: 'pointer' }}
                  >
                    View all comments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default PostsView;
