'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import type { Meeting, FeedbackValue, FeedbackReason, PendingFeedback } from '@/types';

// Dynamic imports to avoid SSR issues
const FeedbackCard = dynamic(() => import('@/components/FeedbackCard'), { ssr: false });
const TeamDashboard = dynamic(() => import('@/components/TeamDashboard'), { ssr: false });

// Mock function to simulate getting meetings from Google Calendar
const getMockPendingFeedback = (): PendingFeedback[] => {
  const now = new Date();
  const meeting: Meeting = {
    id: 'mock-meeting-1',
    google_event_id: 'google-123',
    title: 'Sprint Planning',
    start_time: new Date(now.getTime() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    end_time: now.toISOString(),
    duration_minutes: 60,
    attendee_count: 8,
    is_recurring: true,
    recurrence_id: 'sprint-planning-weekly',
    organizer_email: 'lead@company.com',
    team_id: 'team-1',
    department_id: 'dept-1',
    created_at: now.toISOString(),
  };

  return [
    {
      meeting,
      expires_at: new Date(now.getTime() + 30 * 60 * 1000).toISOString(), // Expires in 30 min
    },
  ];
};

export default function Home() {
  const [pendingFeedback, setPendingFeedback] = useState<PendingFeedback[]>([]);
  const [showDashboard, setShowDashboard] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate authentication check
    const authCheck = setTimeout(() => {
      setIsAuthenticated(true);
    }, 500);

    return () => clearTimeout(authCheck);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Check for pending feedback on mount
    const feedback = getMockPendingFeedback();
    setPendingFeedback(feedback);

    // Simulate polling for new meetings
    const interval = setInterval(() => {
      // In production, this would check Google Calendar API
      console.log('Checking for new meetings...');
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleFeedbackSubmit = async (
    meetingId: string,
    value: FeedbackValue,
    reason?: FeedbackReason
  ) => {
    // In production, this would send to your API
    console.log('Submitting feedback:', { meetingId, value, reason });
    
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
  };

  const handleDismiss = (meetingId: string) => {
    setPendingFeedback((prev) => prev.filter((p) => p.meeting.id !== meetingId));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <div className="pulse-dot w-3 h-3 bg-pulse-green rounded-full" />
          </div>
          <h2 className="text-2xl font-display font-semibold mb-2">MeetingPulse</h2>
          <p className="text-pulse-gray-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-pulse-green/20 to-pulse-green/10">
              <span className="text-xl">📊</span>
            </div>
            <h1 className="font-display font-bold text-xl">MeetingPulse</h1>
          </div>
          
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setShowDashboard(true)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm tap-feedback
                ${showDashboard ? 'bg-white/10 text-white' : 'text-pulse-gray-400 hover:text-white'}
              `}
            >
              Dashboard
            </button>
            <button
              onClick={() => setShowDashboard(false)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm tap-feedback
                ${!showDashboard ? 'bg-white/10 text-white' : 'text-pulse-gray-400 hover:text-white'}
              `}
            >
              Settings
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      {showDashboard ? (
        <TeamDashboard teamId="team-1" teamName="Engineering" />
      ) : (
        <div className="p-4 md:p-8 max-w-3xl mx-auto">
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-2xl font-display font-bold mb-4">Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Calendar Integration</h3>
                <button className="px-4 py-2 rounded-lg bg-pulse-green/20 text-pulse-green border border-pulse-green/30 tap-feedback">
                  Connect Google Calendar
                </button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-pulse-gray-300">Send feedback prompts after meetings</span>
                </label>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Team Settings</h3>
                <p className="text-pulse-gray-400 text-sm">
                  You're part of the Engineering team in the Product department.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Cards */}
      <AnimatePresence>
        {pendingFeedback.map((feedback) => (
          <FeedbackCard
            key={feedback.meeting.id}
            meeting={feedback.meeting}
            onSubmit={(value, reason) =>
              handleFeedbackSubmit(feedback.meeting.id, value, reason)
            }
            onDismiss={() => handleDismiss(feedback.meeting.id)}
          />
        ))}
      </AnimatePresence>
    </main>
  );
}
