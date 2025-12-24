import { NextRequest, NextResponse } from 'next/server';
import type { FeedbackValue, FeedbackReason } from '@/types';

// In production, this would connect to your database (Supabase, Firebase, etc.)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { meetingId, userId, value, reason, comment } = body;

    // Validate input
    if (!meetingId || !userId || !value) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate feedback value
    const validValues: FeedbackValue[] = ['worth_it', 'async', 'waste'];
    if (!validValues.includes(value)) {
      return NextResponse.json(
        { error: 'Invalid feedback value' },
        { status: 400 }
      );
    }

    // In production: Save to database
    const feedback = {
      id: `feedback-${Date.now()}`,
      meeting_id: meetingId,
      user_id: userId,
      value,
      reason,
      comment,
      submitted_at: new Date().toISOString(),
    };

    // Log for demo purposes
    console.log('Feedback submitted:', feedback);

    // Return success response
    return NextResponse.json(
      { 
        success: true,
        feedback,
        message: 'Feedback submitted successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get feedback for a specific meeting or team
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const meetingId = searchParams.get('meetingId');
  const teamId = searchParams.get('teamId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    // In production: Query database with filters
    const mockFeedback = [
      {
        id: 'feedback-1',
        meeting_id: meetingId || 'meeting-1',
        user_id: 'user-1',
        value: 'worth_it',
        submitted_at: new Date().toISOString(),
      },
      {
        id: 'feedback-2',
        meeting_id: meetingId || 'meeting-1',
        user_id: 'user-2',
        value: 'async',
        reason: 'could_be_email',
        submitted_at: new Date().toISOString(),
      },
    ];

    return NextResponse.json(
      { 
        feedback: mockFeedback,
        total: mockFeedback.length,
        filters: { meetingId, teamId, startDate, endDate }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
