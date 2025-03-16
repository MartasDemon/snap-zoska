// src/app/profil/[id]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Container, 
  Box, 
  Typography, 
  Avatar, 
  Grid, 
  Button, 
  Divider, 
  Tabs, 
  Tab, 
  Card, 
  CardMedia,
  CircularProgress
} from '@mui/material';
import { fetchPosts, fetchLikedPosts } from "@/app/actions/post";
import EditProfileModal from '@/components/EditProfileModal';

// Define interfaces
interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  profile?: Profile | null;
}

interface Profile {
  bio: string | null;
  location: string | null;
  interests: string[];
}

interface Post {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: Date;
  likeCount: number;
}

export default function UserProfilePage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user data
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      const userData = await response.json();
      
      console.log("Fetched user data:", userData);
      console.log("User image URL:", userData.image);
      
      setUser(userData);
      
      // Check if this is the current user's profile
      const sessionUserId = session?.user && 'id' in session.user ? session.user.id : null;
      const isCurrentUserProfile = sessionUserId === id;
      setIsCurrentUser(isCurrentUserProfile);
      
      // Fetch user's posts
      const userPosts = await fetchPosts(sessionUserId, id as string);
      console.log("Fetched user posts:", userPosts);
      setPosts(userPosts);
      
      // If this is the current user, fetch liked posts
      if (isCurrentUserProfile && sessionUserId) {
        try {
          // Fetch liked posts directly from the server action
          const likedPostsData = await fetchLikedPosts(sessionUserId);
          console.log("Fetched liked posts:", likedPostsData);
          setLikedPosts(likedPostsData);
        } catch (error) {
          console.error("Error fetching liked posts:", error);
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserData();
    }
  }, [id, session]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditProfileClick = () => {
    setEditProfileOpen(true);
  };

  const handleProfileUpdated = () => {
    // Refetch user data after profile update
    fetchUserData();
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          Používateľ nebol nájdený
        </Typography>
      </Container>
    );
  }

  // Debug the image URL
  console.log("Rendering profile with image URL:", user.image);
  
  // Helper function to render post grid
  const renderPostGrid = (postsToRender: Post[]) => (
    <Grid container spacing={1}>
      {postsToRender.length > 0 ? (
        postsToRender.map((post) => (
          <Grid item xs={4} key={post.id}>
            <Card 
              sx={{ 
                position: 'relative',
                paddingTop: '100%', // 1:1 Aspect ratio
                cursor: 'pointer',
                '&:hover': {
                  '& .overlay': {
                    opacity: 1
                  }
                }
              }}
            >
              <CardMedia
                component="img"
                image={post.imageUrl}
                alt={post.caption || 'Post image'}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <Box 
                className="overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  color: 'white'
                }}
              >
                <Typography sx={{ mr: 2 }}>
                  ❤️ {post.likeCount}
                </Typography>
                <Typography>
                  💬 0
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))
      ) : (
        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Žiadne príspevky
          </Typography>
        </Box>
      )}
    </Grid>
  );

  return (
    <Container sx={{ py: 4, mb: 8 }}>
      {/* Profile Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', mb: 4 }}>
        <Avatar
          src={user.image || undefined}
          alt={user.name || 'User'}
          imgProps={{
            onError: (e) => {
              console.log("Profile image failed to load:", user.image);
              // The fallback initial will be shown automatically when the image fails to load
            }
          }}
          sx={{ 
            width: { xs: 100, sm: 150 }, 
            height: { xs: 100, sm: 150 },
            mr: { xs: 0, sm: 4 },
            mb: { xs: 2, sm: 0 },
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            bgcolor: '#1976d2'
          }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
        </Avatar>
        
        <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <Typography variant="h5" component="h1" sx={{ mr: 2 }}>
              {user.name || 'Používateľ'}
            </Typography>
            
            {!isCurrentUser && (
              <Button 
                variant="contained" 
                size="small"
                sx={{ 
                  backgroundColor: '#0095f6',
                  '&:hover': { backgroundColor: '#0086e0' }
                }}
              >
                Sledovať
              </Button>
            )}
            
            {isCurrentUser && (
              <Button 
                variant="outlined" 
                size="small"
                sx={{ borderColor: '#dbdbdb', color: '#262626' }}
                onClick={handleEditProfileClick}
              >
                Upraviť profil
              </Button>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' }, my: 2 }}>
            <Typography sx={{ mr: 3 }}>
              <strong>{posts.length}</strong> príspevkov
            </Typography>
            <Typography sx={{ mr: 3 }}>
              <strong>0</strong> sledovateľov
            </Typography>
            <Typography>
              <strong>0</strong> sledovaných
            </Typography>
          </Box>
          
          {user.profile?.bio && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              {user.profile.bio}
            </Typography>
          )}
          
          {user.profile?.location && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {user.profile.location}
            </Typography>
          )}
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Tabs */}
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        centered
        sx={{ mb: 3 }}
      >
        <Tab label="Príspevky" />
        <Tab label="Označené" disabled={!isCurrentUser} />
      </Tabs>
      
      {/* Posts Grid */}
      {tabValue === 0 && renderPostGrid(posts)}
      
      {/* Liked Posts */}
      {tabValue === 1 && isCurrentUser && renderPostGrid(likedPosts)}
      
      {/* Edit Profile Modal */}
      {isCurrentUser && (
        <EditProfileModal
          open={editProfileOpen}
          onClose={() => setEditProfileOpen(false)}
          currentBio={user?.profile?.bio || null}
          currentImage={user?.image || null}
          onProfileUpdated={fetchUserData}
        />
      )}
    </Container>
  );
} 
