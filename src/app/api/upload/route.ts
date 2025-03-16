import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API route called');
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log('Unauthorized upload attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('User authenticated:', session.user.email);

    // Get form data with the file
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      console.log('No file provided in request');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('File received:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('File too large:', file.size);
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // For testing purposes, if we don't have Cloudinary configured, return a placeholder URL
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      console.log('Cloudinary not configured, returning placeholder URL');
      return NextResponse.json({
        success: true,
        imageUrl: 'https://via.placeholder.com/150'
      });
    }

    console.log('Uploading to Cloudinary...');
    
    // Create a new FormData object for Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', 'profile_images'); // Configure this in your Cloudinary dashboard

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData
      }
    );

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      console.error('Cloudinary upload failed:', errorText);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    const cloudinaryData = await cloudinaryResponse.json();
    console.log('Upload successful, image URL:', cloudinaryData.secure_url);

    return NextResponse.json({
      success: true,
      imageUrl: cloudinaryData.secure_url
    });
  } catch (error) {
    console.error('Error in upload API route:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
} 