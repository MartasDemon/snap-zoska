"use client";

import React, { useState } from 'react';
import { Container, Typography, Button, Box, Paper, CircularProgress, Divider, Alert } from '@mui/material';
import { debugPosts, createTestPost } from '@/app/actions/debug';
import Image from 'next/image';

// Use any type for now to avoid TypeScript errors
// We can refine these types later when we have more time
export default function DebugPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [createPostResult, setCreatePostResult] = useState<any>(null);
  const [createPostLoading, setCreatePostLoading] = useState(false);

  const runDebug = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const debugResults = await debugPosts();
      console.log("Debug results:", debugResults);
      
      setResults(debugResults);
    } catch (err) {
      console.error("Error running debug:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestPost = async () => {
    try {
      setCreatePostLoading(true);
      setCreatePostResult(null);
      
      const result = await createTestPost();
      console.log("Create test post result:", result);
      
      setCreatePostResult(result);
      
      // Refresh debug results if we successfully created a post
      if (result.success) {
        runDebug();
      }
    } catch (err) {
      console.error("Error creating test post:", err);
      setCreatePostResult({
        success: false,
        error: err instanceof Error ? err.message : "An unknown error occurred"
      });
    } finally {
      setCreatePostLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Debug Page
      </Typography>
      
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={runDebug} 
          disabled={loading}
        >
          {loading ? 'Running...' : 'Debug Posts'}
        </Button>
        
        <Button 
          variant="contained" 
          color="secondary"
          onClick={handleCreateTestPost} 
          disabled={createPostLoading}
        >
          {createPostLoading ? 'Creating...' : 'Create Test Post'}
        </Button>
      </Box>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {createPostLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="secondary" />
        </Box>
      )}
      
      {createPostResult && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: createPostResult.success ? '#e8f5e9' : '#ffebee' }}>
          <Typography variant="h6">{createPostResult.success ? 'Test Post Created' : 'Error Creating Test Post'}</Typography>
          
          {createPostResult.success && createPostResult.post && (
            <Box sx={{ mt: 2 }}>
              <Typography>Post ID: {createPostResult.post.id}</Typography>
              <Typography>User: {createPostResult.post.userName}</Typography>
              <Typography>Caption: {createPostResult.post.caption}</Typography>
              <Typography>Created: {new Date(createPostResult.post.createdAt).toLocaleString()}</Typography>
              <Box sx={{ mt: 2, position: 'relative', width: '100%', height: '300px' }}>
                <Image 
                  src={createPostResult.post.imageUrl} 
                  alt="Test post" 
                  fill
                  style={{ objectFit: 'contain', maxHeight: '300px' }} 
                />
              </Box>
            </Box>
          )}
          
          {createPostResult.success === false && createPostResult.error && (
            <Typography color="error">{createPostResult.error}</Typography>
          )}
        </Paper>
      )}
      
      {error && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: '#ffebee' }}>
          <Typography variant="h6" color="error">Error</Typography>
          <Typography>{error}</Typography>
        </Paper>
      )}
      
      {results && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Debug Results</Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Total Posts: {results.totalPosts}
            </Typography>
            <Typography variant="subtitle1">
              Posts with Missing Data: {results.postsWithMissingData}
            </Typography>
            <Typography variant="subtitle1">
              Jack Doyle&apos;s Posts: {results.jackDoylePostCount}
            </Typography>
          </Box>
          
          {results.jackDoylePostCount > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Jack Doyle&apos;s Posts</Typography>
              
              {results.jackDoylePosts.map((post: any, index: number) => (
                <Paper key={post.id} sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd' }}>
                  <Typography variant="subtitle1">
                    Post {index + 1}: {post.id}
                  </Typography>
                  <Typography>
                    User: {post.userName} ({post.userEmail})
                  </Typography>
                  <Typography>
                    Image URL: {post.imageUrl}
                  </Typography>
                  <Typography>
                    Caption: {post.caption || 'No caption'}
                  </Typography>
                  <Typography>
                    Created: {new Date(post.createdAt).toLocaleString()}
                  </Typography>
                  <Typography>
                    Likes: {post.likeCount}
                  </Typography>
                  <Typography>
                    Saves: {post.saveCount}
                  </Typography>
                </Paper>
              ))}
            </>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>All Posts</Typography>
          
          {results.posts && results.posts.map((post: any, index: number) => (
            <Paper 
              key={post.id} 
              sx={{ 
                p: 2, 
                mb: 2, 
                bgcolor: post.hasIssues ? '#fff3e0' : '#f5f5f5' 
              }}
            >
              <Typography variant="subtitle1">
                Post {index + 1}: {post.id}
              </Typography>
              <Typography>
                User: {post.userName} ({post.userEmail})
              </Typography>
              <Typography>
                Image URL: {post.imageUrl}
              </Typography>
              <Typography>
                Caption: {post.caption || 'No caption'}
              </Typography>
              <Typography>
                Created: {new Date(post.createdAt).toLocaleString()}
              </Typography>
              <Typography>
                Likes: {post.likeCount}
              </Typography>
              <Typography>
                Saves: {post.saveCount}
              </Typography>
              {post.hasIssues && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  This post has missing data
                </Alert>
              )}
            </Paper>
          ))}
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>All Users</Typography>
          
          {results.users && results.users.map((user: any) => (
            <Paper key={user.id} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="subtitle1">
                User ID: {user.id}
              </Typography>
              <Typography>
                Name: {user.name || 'No name'}
              </Typography>
              <Typography>
                Email: {user.email || 'No email'}
              </Typography>
              <Typography>
                Image: {user.image || 'No image'}
              </Typography>
            </Paper>
          ))}
        </Paper>
      )}
    </Container>
  );
} 