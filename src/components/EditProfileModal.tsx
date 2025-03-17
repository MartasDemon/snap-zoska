import React, { useState, useRef, ChangeEvent } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box, 
  Avatar, 
  Typography, 
  CircularProgress,
  IconButton
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import { updateProfile } from '@/app/actions/profile';
import { useSession } from 'next-auth/react';

// Define a type for the session user with id
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  currentBio: string | null;
  currentImage: string | null;
  onProfileUpdated: () => void;
}

export default function EditProfileModal({ 
  open, 
  onClose, 
  currentBio, 
  currentImage,
  onProfileUpdated 
}: EditProfileModalProps) {
  const { data: session, update } = useSession();
  const [bio, setBio] = useState(currentBio || '');
  const [imagePreview, setImagePreview] = useState<string | null>(currentImage);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBio(e.target.value);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Obrázok je príliš veľký. Maximálna veľkosť je 2MB.');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Prosím, vyberte obrázok.');
        return;
      }
      
      setImageFile(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image directly to the profile image update API
  const uploadProfileImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/profile/update-image', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Upload failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!session?.user || !('id' in session.user)) return;
    
    // Type assertion for session.user
    const user = session.user as SessionUser;
    
    try {
      setLoading(true);
      setError(null);
      
      let imageUrl = currentImage;
      
      // Upload image if a new one was selected
      if (imageFile) {
        try {
          imageUrl = await uploadProfileImage(imageFile);
          if (!imageUrl) {
            throw new Error('Nepodarilo sa nahrať obrázok');
          }
          
          // Force refresh the session to reflect the new image
          await update({ image: imageUrl });
          
          // Force reload the page to ensure the image is updated everywhere
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : 'Nepodarilo sa nahrať obrázok');
        }
      }
      
      // Update profile bio only (image is already updated)
      const result = await updateProfile(user.id, {
        bio
      });
      
      if (result.success) {
        onProfileUpdated();
        onClose();
      } else {
        throw new Error(result.error || 'Nepodarilo sa aktualizovať profil');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Nastala chyba pri aktualizácii profilu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Upraviť profil
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={onClose} 
          aria-label="close"
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box 
            sx={{ 
              position: 'relative',
              mb: 2 
            }}
          >
            <Avatar
              src={imagePreview || undefined}
              alt="Profile"
              sx={{ 
                width: 120, 
                height: 120,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8
                }
              }}
              onClick={handleImageClick}
            />
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }}
              onClick={handleImageClick}
            >
              <PhotoCameraIcon />
            </IconButton>
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Kliknutím zmeníte profilovú fotku
          </Typography>
        </Box>
        
        <TextField
          label="Bio"
          multiline
          rows={4}
          value={bio}
          onChange={handleBioChange}
          fullWidth
          variant="outlined"
          placeholder="Napíšte niečo o sebe..."
          disabled={loading}
          sx={{ mb: 2 }}
        />
        
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          disabled={loading}
        >
          Zrušiť
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Ukladám...' : 'Uložiť zmeny'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 