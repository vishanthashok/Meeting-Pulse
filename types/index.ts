export type FeedbackValue = 'worth_it' | 'async' | 'waste';

export type FeedbackReason = 
  | 'too_long'
  | 'no_agenda'
  | 'wrong_people'
  | 'could_be_email'
  | 'productive'
  | 'great_discussion'
  | 'decision_made'
  | 'other';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Department {
  id: string;
  org_id: string;
  name: string;
  slug: string;
}

export interface Team {
  id: string;
  department_id: string;
  name: string;
  slug: string;
  parent_team_id?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  team_id: string;
  department_id: string;
  org_id: string;
  created_at: string;
  last_login?: string;
}

export interface Meeting {
  id: string;
  google_event_id: string;
  title: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  attendee_count: number;
  is_recurring: boolean;
  recurrence_id?: string;
  organizer_email: string;
  team_id?: string;
  department_id?: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  meeting_id: string;
  user_id: string;
  value: FeedbackValue;
  reason?: FeedbackReason;
  comment?: string;
  submitted_at: string;
}

export interface MeetingStats {
  total_meetings: number;
  total_feedback: number;
  worth_it_percentage: number;
  async_percentage: number;
  waste_percentage: number;
  avg_meeting_duration: number;
  recurring_meeting_percentage: number;
}

export interface TeamInsights {
  team_id: string;
  team_name: string;
  week_of: string;
  total_meetings: number;
  total_meeting_hours: number;
  feedback_rate: number;
  worth_it_rate: number;
  async_suggestion_rate: number;
  top_waste_reasons: Array<{
    reason: FeedbackReason;
    count: number;
    percentage: number;
  }>;
  worst_day: string;
  best_day: string;
  recurring_meeting_insights: Array<{
    meeting_title: string;
    async_votes: number;
    total_votes: number;
    suggestion: 'keep' | 'review' | 'cancel';
  }>;
}

export interface PendingFeedback {
  meeting: Meeting;
  expires_at: string;
}
