'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Calendar, TrendingUp, TrendingDown, Clock, Users, AlertCircle } from 'lucide-react';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import type { TeamInsights, MeetingStats } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardProps {
  teamId: string;
  teamName: string;
}

// Mock data generator for demo
const generateMockData = (): { stats: MeetingStats; insights: TeamInsights } => {
  return {
    stats: {
      total_meetings: 47,
      total_feedback: 38,
      worth_it_percentage: 42,
      async_percentage: 31,
      waste_percentage: 27,
      avg_meeting_duration: 45,
      recurring_meeting_percentage: 68,
    },
    insights: {
      team_id: 'team-1',
      team_name: 'Engineering',
      week_of: format(startOfWeek(new Date()), 'yyyy-MM-dd'),
      total_meetings: 47,
      total_meeting_hours: 35.25,
      feedback_rate: 81,
      worth_it_rate: 42,
      async_suggestion_rate: 31,
      top_waste_reasons: [
        { reason: 'could_be_email', count: 8, percentage: 35 },
        { reason: 'no_agenda', count: 6, percentage: 26 },
        { reason: 'too_long', count: 5, percentage: 22 },
        { reason: 'wrong_people', count: 4, percentage: 17 },
      ],
      worst_day: 'Tuesday',
      best_day: 'Thursday',
      recurring_meeting_insights: [
        { meeting_title: 'Weekly Standup', async_votes: 12, total_votes: 15, suggestion: 'cancel' },
        { meeting_title: 'Sprint Planning', async_votes: 2, total_votes: 14, suggestion: 'keep' },
        { meeting_title: 'All Hands', async_votes: 8, total_votes: 12, suggestion: 'review' },
        { meeting_title: '1:1 Check-ins', async_votes: 1, total_votes: 10, suggestion: 'keep' },
      ],
    },
  };
};

export default function TeamDashboard({ teamId, teamName }: DashboardProps) {
  const [data, setData] = useState<{ stats: MeetingStats; insights: TeamInsights } | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setData(generateMockData());
    }, 500);
  }, [teamId, timeRange]);

  if (!data) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-xl p-6 h-32 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  const { stats, insights } = data;

  const sentimentData = {
    labels: ['Worth it', "Could've been async", 'Waste of time'],
    datasets: [
      {
        data: [stats.worth_it_percentage, stats.async_percentage, stats.waste_percentage],
        backgroundColor: ['#00D46A', '#FFB800', '#FF3B30'],
        borderWidth: 0,
      },
    ],
  };

  const weeklyTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Meeting Hours',
        data: [8, 12, 6, 4, 5],
        borderColor: '#00D46A',
        backgroundColor: 'rgba(0, 212, 106, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Worth It %',
        data: [45, 38, 52, 62, 58],
        borderColor: '#FFB800',
        backgroundColor: 'rgba(255, 184, 0, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'percentage',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(10, 14, 27, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#9BA3B0',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#9BA3B0',
        },
      },
      percentage: {
        type: 'linear' as const,
        position: 'right' as const,
        grid: {
          display: false,
        },
        ticks: {
          color: '#9BA3B0',
          callback: (value: any) => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">{teamName} Meeting Pulse</h1>
        <p className="text-pulse-gray-400">
          Week of {format(new Date(insights.week_of), 'MMM d, yyyy')}
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-pulse-gray-400 text-sm">Total Meetings</span>
            <Calendar size={20} className="text-pulse-gray-500" />
          </div>
          <div className="text-3xl font-display font-bold">{stats.total_meetings}</div>
          <div className="text-sm text-pulse-gray-400 mt-1">
            {stats.total_meeting_hours.toFixed(1)} hours
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-pulse-gray-400 text-sm">Feedback Rate</span>
            <Users size={20} className="text-pulse-gray-500" />
          </div>
          <div className="text-3xl font-display font-bold">{insights.feedback_rate}%</div>
          <div className="text-sm text-pulse-gray-400 mt-1">
            {stats.total_feedback} responses
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-pulse-gray-400 text-sm">Worth It Rate</span>
            <TrendingUp size={20} className="text-pulse-green" />
          </div>
          <div className="text-3xl font-display font-bold text-pulse-green">
            {stats.worth_it_percentage}%
          </div>
          <div className="text-sm text-pulse-gray-400 mt-1">
            {insights.best_day} is best day
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-pulse-gray-400 text-sm">Could Be Async</span>
            <TrendingDown size={20} className="text-pulse-yellow" />
          </div>
          <div className="text-3xl font-display font-bold text-pulse-yellow">
            {stats.async_percentage}%
          </div>
          <div className="text-sm text-pulse-gray-400 mt-1">
            {insights.worst_day} worst day
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-lg font-display font-semibold mb-4">Meeting Sentiment</h3>
          <div className="h-64">
            <Doughnut
              data={sentimentData}
              options={{
                ...chartOptions,
                cutout: '70%',
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: 'bottom' as const,
                    labels: {
                      color: '#9BA3B0',
                      padding: 20,
                    },
                  },
                },
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 glass-card rounded-xl p-6"
        >
          <h3 className="text-lg font-display font-semibold mb-4">Weekly Trend</h3>
          <div className="h-64">
            <Line data={weeklyTrendData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Recurring Meetings Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-xl p-6 mb-8"
      >
        <h3 className="text-lg font-display font-semibold mb-4">Recurring Meeting Health</h3>
        <div className="space-y-3">
          {insights.recurring_meeting_insights.map((meeting, index) => {
            const asyncRate = Math.round((meeting.async_votes / meeting.total_votes) * 100);
            const suggestionColors = {
              keep: 'text-pulse-green border-pulse-green/30',
              review: 'text-pulse-yellow border-pulse-yellow/30',
              cancel: 'text-pulse-red border-pulse-red/30',
            };
            
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 glass-card rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-pulse-gray-100">{meeting.meeting_title}</p>
                  <p className="text-sm text-pulse-gray-400">
                    {asyncRate}% say could be async ({meeting.async_votes}/{meeting.total_votes})
                  </p>
                </div>
                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium border
                    ${suggestionColors[meeting.suggestion]}
                  `}
                >
                  {meeting.suggestion === 'keep' && 'Keep'}
                  {meeting.suggestion === 'review' && 'Review'}
                  {meeting.suggestion === 'cancel' && 'Consider canceling'}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Top Waste Reasons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="text-lg font-display font-semibold mb-4">Why Meetings Fail</h3>
        <div className="space-y-3">
          {insights.top_waste_reasons.map((reason, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="text-sm text-pulse-gray-400 w-32">
                {reason.reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <div className="flex-1 bg-pulse-gray-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${reason.percentage}%` }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-pulse-red/50 to-pulse-red"
                />
              </div>
              <span className="text-sm font-medium w-12 text-right">{reason.percentage}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
