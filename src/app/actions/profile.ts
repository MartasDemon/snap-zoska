"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// Interface for profile update data
interface ProfileUpdateData {
  bio?: string | null;
  location?: string | null;
  interests?: string[];
}

// Update user profile
export async function updateProfile(userId: string, data: ProfileUpdateData) {
  console.log(`Updating profile for user ${userId}`, data);
  
  try {
    // Verify the user is authorized to update this profile
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== userId) {
      console.error("Unauthorized profile update attempt");
      return { success: false, error: "Unauthorized" };
    }
    
    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId }
    });
    
    let profile;
    
    if (existingProfile) {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { userId },
        data: {
          bio: data.bio !== undefined ? data.bio : existingProfile.bio,
          location: data.location !== undefined ? data.location : existingProfile.location,
          interests: data.interests || existingProfile.interests,
        }
      });
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          userId,
          bio: data.bio || null,
          location: data.location || null,
          interests: data.interests || [],
        }
      });
    }
    
    // Revalidate paths to ensure UI updates
    revalidatePath(`/profil/${userId}`);
    
    return { 
      success: true, 
      profile 
    };
  } catch (error) {
    console.error(`Error updating profile for user ${userId}:`, error);
    return { 
      success: false, 
      error: `Failed to update profile: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
} 