# Closira Frontend - React Native Mobile Dashboard

An Expo-based React Native mobile dashboard for the Closira customer enquiry management system.

## Features

- **5 Full Screens**:
  - Dashboard — overview with stats and activity feed
  - Leads — searchable list of all enquiries with filtering
  - Escalations — priority list of escalated enquiries
  - Follow-ups — manage scheduled follow-ups
  - Conversation Detail — full history of each enquiry

- **Bottom Tab Navigation** with badge counts
- **Modern Design System** — colors, typography, spacing, shadows
- **Reusable Components** for cards, badges, headers
- **Mock Data** included for development
- **Status & Channel Indicators** for quick visual identification

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
# or
yarn install
```

### 2. Start the Development Server

```bash
npm start
# or
yarn start
```

Follow the Expo CLI prompts to run on:
- iOS: Press `i`
- Android: Press `a`
- Web: Press `w`

## Directory Structure

```
frontend/
├── src/
│   ├── screens/           # 5 full-screen components
│   │   ├── DashboardScreen.js
│   │   ├── LeadsScreen.js
│   │   ├── EscalationsScreen.js
│   │   ├── FollowUpsScreen.js
│   │   └── ConversationDetailScreen.js
│   ├── components/        # Reusable UI components
│   │   ├── ActivityFeedItem.js
│   │   ├── ChannelBadge.js
│   │   ├── EscalationCard.js
│   │   ├── StatusBadge.js
│   │   ├── StatCard.js
│   │   ├── FollowUpCard.js
│   │   ├── LeadCard.js
│   │   ├── SectionHeader.js
│   │   └── EmptyState.js
│   ├── navigation/        # React Navigation setup
│   │   └── AppNavigator.js
│   ├── utils/             # Theme tokens and helpers
│   │   ├── theme.js
│   │   └── helpers.js
│   └── mock/              # Mock data for development
│       └── index.js
├── mock/                  # Mock JSON data
│   ├── enquiries.json
│   └── stats.json
├── App.js                 # Entry point
├── app.json               # Expo configuration
└── package.json
```

## Design System

### Colors

- **Primary**: Indigo (#6366F1)
- **Status Colors**: Blue (New), Green (Open), Red (Escalated), Amber (Follow-up)
- **Channel Colors**: WhatsApp Green, Email Blue, Call Amber

### Typography

- **Font Sizes**: XS (11) → 3XL (30)
- **Font Weights**: Regular (400) → Bold (700)
- **Line Heights**: Tight (1.2) → Relaxed (1.75)

### Spacing

- **Scale**: xs (4) → xxxl (32)
- **Radius**: sm (6) → full (9999)
- **Shadows**: sm, md styles for elevation

## Screens Overview

### Dashboard
- Welcome greeting with user initials avatar
- Stats grid (total leads, missed, escalations, follow-ups)
- Response rate banner with progress bar
- Activity feed showing recent events

### Leads
- Searchable lead list
- Filter by status (All, New, Open, Escalated, Follow-up)
- Tap to view conversation detail
- Empty state when no results

### Escalations
- High and medium priority grouping
- Escalation reason and customer details
- Quick resolve action
- Auto-dismiss after resolution
- Empty state message when none

### Follow-ups
- Overdue vs Upcoming grouping
- Due date and message template display
- Mark as done action
- Timeline visualization
- Empty state when all complete

### Conversation Detail
- Customer info with channel and status badges
- Customer's original message
- Suggested response (from SOP matching)
- Timeline of all events
- Action buttons (escalate, schedule follow-up, mark resolved)

## Mock Data

The app includes realistic mock data:

- **5 Sample Enquiries** with various statuses and channels
- **Stats** showing daily metrics
- **Activity Feed** with recent events

Modify `mock/enquiries.json` and `mock/stats.json` to test different scenarios.

## Connecting to Backend API

To connect to the real backend API (when running):

1. Update API base URL in components:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

2. Replace mock data fetching with real API calls:
```javascript
const response = await fetch(`${API_BASE_URL}/enquiry/${enquiry_id}/history`);
const data = await response.json();
```

## Dependencies

- **@react-navigation/native** - Navigation framework
- **@react-navigation/bottom-tabs** - Bottom tab navigation
- **@react-navigation/native-stack** - Stack navigation
- **react-native** - UI library
- **react-native-safe-area-context** - Safe area handling
- **react-native-screens** - Screen management
- **expo** - Development framework

## Development Tips

- Use the Expo Go app on your device for quick testing
- Hot reload enabled — changes update instantly
- Use React DevTools in Expo CLI for debugging
- Check console output for errors and warnings
- Adjust layout using the Theme tokens in `src/utils/theme.js`

## Building for Production

```bash
# For iOS
eas build --platform ios

# For Android
eas build --platform android

# For Web
npm run build
```
