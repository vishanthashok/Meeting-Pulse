# 📊 MeetingPulse - Make Meetings Matter

A lightweight post-meeting feedback tool that helps teams identify which meetings are worth keeping, which could be async, and which are wasting everyone's time.

## 🎯 The Problem

Employees spend 30-50% of their week in meetings, many of which are redundant or unproductive. MeetingPulse creates a feedback loop to fix this.

## ✨ Features

### MVP (Ready to Ship)
- **One-tap feedback** - Simple 3-option rating after meetings end
- **Anonymous team dashboard** - Aggregated insights without call-outs
- **Weekly insights** - Auto-generated reports on meeting health
- **Google Calendar integration** - Automatic meeting detection
- **Magic link auth** - Frictionless login via email
- **Mobile-first design** - Works great on the go

### Metrics Tracked
- Meeting sentiment distribution
- Feedback submission rate
- Recurring meeting health scores
- Time spent in meetings by team
- Top reasons meetings fail

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Cloud account (for Calendar API)
- Vercel account (for deployment)

### Local Development

1. **Clone and install**
```bash
git clone https://github.com/yourusername/meeting-pulse.git
cd meeting-pulse
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

3. **Run development server**
```bash
npm run dev
# Open http://localhost:3000
```

## 📱 Deploy to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy on Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Add environment variables from `.env.example`
- Deploy!

## 🔧 Configuration

### Google Calendar Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `https://yourapp.vercel.app/api/auth/google/callback`
6. Copy Client ID and Secret to environment variables

### Database Options

Choose one:

**Option A: Supabase (Recommended)**
```bash
# Quick setup at supabase.com
# Free tier includes:
# - Postgres database
# - Authentication
# - Real-time subscriptions
```

**Option B: Firebase**
```bash
# Setup at firebase.google.com
# Good for rapid prototyping
```

**Option C: Local Storage (Development only)**
```bash
# Already configured for MVP
# Data persists in browser
```

### Email Service (Magic Links)

**Resend (Recommended for MVP)**
```bash
# Sign up at resend.com
# Free tier: 100 emails/day
# Add API key to .env.local
```

## 🏗 Architecture

```
/app                    # Next.js 14 app directory
  /api                 # API routes
    /auth             # Magic link authentication
    /calendar         # Google Calendar integration
    /feedback         # Feedback submission
  layout.tsx          # Root layout
  page.tsx           # Main app page

/components           # React components
  FeedbackCard.tsx   # One-tap feedback UI
  TeamDashboard.tsx  # Analytics dashboard

/types               # TypeScript types
/styles             # Global styles
```

## 🎨 Key Design Decisions

1. **Mobile-first**: Post-meeting feedback happens on the go
2. **Anonymous aggregation**: Psychological safety > individual tracking
3. **One-tap primary action**: Reduce friction to increase response rate
4. **Optional details**: Get more context without forcing it
5. **Visual insights**: Charts > tables for quick understanding

## 📊 Metrics & Experiments

### North Star Metric
**% of meetings rated "Worth it"** - Target: >60%

### Supporting Metrics
- Feedback submission rate (Target: >70%)
- Recurring meeting downgrade rate
- Async conversion rate

### A/B Tests to Run
1. **Prompt timing**: Immediate vs 15 min delay
2. **Friction test**: One tap vs mandatory reason
3. **Manager visibility**: Anonymous vs attributed

## 🔄 Future Enhancements

### Phase 2 (Weeks 3-4)
- [ ] Slack/Teams integration
- [ ] Meeting cost calculator ($$/hour)
- [ ] AI-powered meeting insights
- [ ] Suggested alternatives for bad meetings

### Phase 3 (Month 2)
- [ ] Calendar blocking for focus time
- [ ] Meeting agenda enforcement
- [ ] Attendee optimization suggestions
- [ ] Cross-team benchmarking

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Animation**: Framer Motion
- **Backend**: Next.js API routes
- **Database**: Supabase/Firebase
- **Auth**: Magic links via Resend
- **Calendar**: Google Calendar API
- **Hosting**: Vercel

## 📝 PM Interview Talking Points

### Problem Validation
- Internal survey data: 47% of meetings deemed unnecessary
- $37B annual cost of unnecessary meetings (US alone)
- Post-COVID meeting inflation: +50% meeting time

### Solution Differentiation
- Unlike surveys: Real-time, contextual feedback
- Unlike calendar analytics: Qualitative + quantitative
- Unlike meeting recorders: Privacy-first, no surveillance

### Success Metrics
- Week 1: 50+ feedback submissions
- Month 1: 70% participation rate
- Quarter 1: 20% reduction in recurring meetings

### Go-to-Market
1. Start with one team (dogfood)
2. Expand to friendly teams
3. Department-wide rollout
4. Company-wide with exec sponsorship

## 📄 License

MIT

## 🤝 Contributing

PRs welcome! Check out our [contributing guidelines](CONTRIBUTING.md).

---

Built with ❤️ to make meetings better.
