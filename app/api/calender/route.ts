import { NextRequest, NextResponse } from 'next/server';
import type { Meeting } from '@/types';

// Mock function to simulate Google Calendar API
// In production, use @googleapis/calendar
async function fetchRecentMeetings(userEmail: string): Promise<Meeting[]> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  // Mock meetings that just ended
  return [
    {
      id: 'meeting-1',
      google_event_id: 'google-event-1',
      title: 'Product Sync',
      start_time: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
      end_time: oneHourAgo.toISOString(),
      duration_minutes: 30,
      attendee_count: 5,
      is_recurring: true,
      recurrence_id: 'product-sync-weekly',
      organizer_email: 'pm@company.com',
      team_id: 'team-product',
      department_id: 'dept-product',
      created_at: oneHourAgo.toISOString(),
    },
    {
      id: 'meeting-2',
      google_event_id: 'google-event-2',
      title: 'Engineering Standup',
      start_time: new Date(now.getTime() - 75 * 60 * 1000).toISOString(),
      end_time: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      duration_minutes: 15,
      attendee_count: 12,
      is_recurring: true,
      recurrence_id: 'eng-standup-daily',
      organizer_email: 'eng-lead@company.com',
      team_id: 'team-eng',
      department_id: 'dept-eng',
      created_at: oneHourAgo.toISOString(),
    },
  ];
}

// Get meetings that recently ended and need feedback
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userEmail = searchParams.get('email');
  
  if (!userEmail) {
    return NextResponse.json(
      { error: 'Email parameter required' },
      { status: 400 }
    );
  }

  try {
    const meetings = await fetchRecentMeetings(userEmail);
    
    // Filter meetings that ended within the last 2 hours
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    
    const pendingMeetings = meetings.filter(meeting => {
      const endTime = new Date(meeting.end_time);
      return endTime >= twoHoursAgo && endTime <= now;
    });

    return NextResponse.json({
      meetings: pendingMeetings,
      count: pendingMeetings.length,
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meetings' },
      { status: 500 }
    );
  }
}

// Webhook endpoint for Google Calendar push notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In production: Verify webhook signature and process calendar changes
    console.log('Calendar webhook received:', body);
    
    // Check if meeting just ended
    if (body.eventType === 'meeting.ended') {
      // Trigger feedback collection for attendees
      const meeting: Meeting = {
        id: body.eventId,
        google_event_id: body.googleEventId,
        title: body.summary,
        start_time: body.start,
        end_time: body.end,
        duration_minutes: Math.round((new Date(body.end).getTime() - new Date(body.start).getTime()) / 60000),
        attendee_count: body.attendees?.length || 0,
        is_recurring: body.recurringEventId ? true : false,
        recurrence_id: body.recurringEventId,
        organizer_email: body.organizer?.email,
        team_id: body.extendedProperties?.teamId,
        department_id: body.extendedProperties?.departmentId,
        created_at: new Date().toISOString(),
      };
      
      // In production: Queue feedback notifications for all attendees
      console.log('Queueing feedback for meeting:', meeting);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing calendar webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
