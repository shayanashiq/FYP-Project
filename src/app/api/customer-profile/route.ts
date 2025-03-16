import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import prisma from '@/lib/prisma';

// Helper function to verify authentication
async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return null;
  }
  
  return session.user.id;
}

// GET - Fetch customer profile
export async function GET() {
  const userId = await getAuthenticatedUserId();
  
  if (!userId) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const customerProfile = await prisma.customerProfile.findFirst({
      where: {
        user: {
          id: userId
        }
      }
    });
    
    return NextResponse.json({
      message: 'Profile fetched successfully',
      data: customerProfile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// POST - Create customer profile
export async function POST(request: NextRequest) {
  const userId = await getAuthenticatedUserId();
  
  if (!userId) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const body = await request.json();
    const { firstName, lastName, phone, address, city, country, zipCode } = body;
    
    // Check if profile already exists
    const existingProfile = await prisma.customerProfile.findFirst({
      where: {
        user: {
          id: userId
        }
      }
    });
    
    if (existingProfile) {
      return NextResponse.json(
        { message: 'Profile already exists. Use PUT to update.' },
        { status: 400 }
      );
    }
    
    // Create new profile
    const customerProfile = await prisma.customerProfile.create({
      data: {
        firstName,
        lastName,
        phone,
        address,
        city,
        country,
        zipCode,
        user: {
          connect: { id: userId }
        }
      }
    });
    
    // Update user's isProfileComplete status
    await prisma.user.update({
      where: { id: userId },
      data: { isProfileComplete: true }
    });
    
    return NextResponse.json(
      { message: 'Profile created successfully', data: customerProfile },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { message: 'Failed to create profile' },
      { status: 500 }
    );
  }
}

// PUT - Update customer profile
export async function PUT(request: NextRequest) {
  const userId = await getAuthenticatedUserId();
  
  if (!userId) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const body = await request.json();
    const { firstName, lastName, phone, address, city, country, zipCode } = body;
    
    const customerProfile = await prisma.customerProfile.update({
      where: {
        userId: userId
      },
      data: {
        firstName,
        lastName,
        phone,
        address,
        city,
        country,
        zipCode
      }
    });
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      data: customerProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}