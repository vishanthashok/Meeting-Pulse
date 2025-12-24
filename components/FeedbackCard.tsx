'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, ChevronDown, X } from 'lucide-react';
import { format } from 'date-fns';
import type { Meeting, FeedbackValue, FeedbackReason } from '@/types';
import toast from 'react-hot-toast';

interface FeedbackCardProps {
  meeting: Meeting;
  onSubmit: (value: FeedbackValue, reason?: FeedbackReason) => Promise<void>;
  onDismiss: () => void;
}

const feedbackEmojis = {
  worth_it: { emoji: '👍', label: 'Worth it', color: 'bg-pulse-green' },
  async: { emoji: '😐', label: "Could've been async", color: 'bg-pulse-yellow' },
  waste: { emoji: '👎', label: 'Waste of time', color: 'bg-pulse-red' },
};

const reasons = {
  async: [
    { value: 'could_be_email', label: 'Could be an email' },
    { value: 'no_agenda', label: 'No clear agenda' },
    { value: 'wrong_people', label: 'Wrong attendees' },
    { value: 'too_long', label: 'Too long' },
  ],
  waste: [
    { value: 'no_agenda', label: 'No agenda' },
    { value: 'wrong_people', label: 'Wrong people' },
    { value: 'too_long', label: 'Way too long' },
    { value: 'other', label: 'Other reason' },
  ],
};

export default function FeedbackCard({ meeting, onSubmit, onDismiss }: FeedbackCardProps) {
  const [selectedValue, setSelectedValue] = useState<FeedbackValue | null>(null);
  const [selectedReason, setSelectedReason] = useState<FeedbackReason | null>(null);
  const [showReasons, setShowReasons] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (value: FeedbackValue) => {
    setSelectedValue(value);
    
    // For positive feedback, submit immediately
    if (value === 'worth_it') {
      setIsSubmitting(true);
      try {
        await onSubmit(value);
        toast.success('Thanks for your feedback!');
        setTimeout(onDismiss, 1500);
      } catch (error) {
        toast.error('Failed to submit feedback');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // For negative feedback, show reason options
      setShowReasons(true);
    }
  };

  const handleReasonSubmit = async () => {
    if (!selectedValue) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(selectedValue, selectedReason || undefined);
      toast.success('Thanks for the detailed feedback!');
      setTimeout(onDismiss, 1500);
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const meetingDuration = Math.round(
    (new Date(meeting.end_time).getTime() - new Date(meeting.start_time).getTime()) / 60000
  );

  return (
    <motion.div
      initial={{ y: 100, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 100, opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-8 md:max-w-md"
    >
      <div className="glass-card rounded-2xl p-6 meeting-card-enter">
        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-pulse-gray-400 hover:text-pulse-gray-100 tap-feedback"
        >
          <X size={20} />
        </button>

        {/* Meeting info */}
        <div className="mb-6">
          <h3 className="text-xl font-display font-semibold mb-3 pr-8">
            {meeting.title}
          </h3>
          
          <div className="flex flex-wrap gap-3 text-sm text-pulse-gray-300">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{meetingDuration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{meeting.attendee_count} people</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{format(new Date(meeting.start_time), 'h:mm a')}</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showReasons ? (
            <motion.div
              key="feedback-options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-pulse-gray-200 mb-4 font-medium">
                Was this meeting worth it?
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(feedbackEmojis).map(([value, { emoji, label, color }]) => (
                  <button
                    key={value}
                    onClick={() => handleFeedback(value as FeedbackValue)}
                    disabled={isSubmitting}
                    className={`
                      tap-feedback glass-card-hover rounded-xl p-4 flex flex-col items-center gap-2
                      ${selectedValue === value ? 'ring-2 ring-white/30' : ''}
                      ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <span className="text-4xl emoji-shadow">{emoji}</span>
                    <span className="text-xs text-pulse-gray-300">{label}</span>
                    {selectedValue === value && (
                      <motion.div
                        layoutId="selection-indicator"
                        className={`absolute inset-0 ${color} opacity-10 rounded-xl`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reason-selection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-pulse-gray-200 mb-4 font-medium">
                Quick detail? (optional)
              </p>
              
              <div className="space-y-2 mb-4">
                {reasons[selectedValue as keyof typeof reasons]?.map((reason) => (
                  <button
                    key={reason.value}
                    onClick={() => setSelectedReason(reason.value as FeedbackReason)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg glass-card-hover tap-feedback
                      ${selectedReason === reason.value ? 'ring-2 ring-white/30 bg-white/10' : ''}
                    `}
                  >
                    <span className="text-sm text-pulse-gray-200">{reason.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReasons(false);
                    setSelectedReason(null);
                  }}
                  className="flex-1 px-4 py-2 text-sm text-pulse-gray-400 tap-feedback"
                >
                  Back
                </button>
                <button
                  onClick={handleReasonSubmit}
                  disabled={isSubmitting}
                  className={`
                    flex-1 px-4 py-3 rounded-lg font-medium tap-feedback
                    bg-gradient-to-r from-pulse-green/20 to-pulse-green/10 
                    border border-pulse-green/30 text-pulse-green
                    hover:from-pulse-green/30 hover:to-pulse-green/20
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auto-dismiss timer */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-pulse-gray-600/30 rounded-b-2xl"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 30, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}
