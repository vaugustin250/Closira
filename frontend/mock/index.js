import enquiries from './enquiries.json';
import stats from './stats.json';

export const MOCK_ENQUIRIES = enquiries.enquiries;
export const MOCK_STATS = stats.stats;
export const MOCK_ACTIVITY = stats.recent_activity;

// Derived views
export const MOCK_ESCALATIONS = MOCK_ENQUIRIES.filter(e => e.status === 'escalated');
export const MOCK_FOLLOWUPS = MOCK_ENQUIRIES.filter(e => e.status === 'follow_up');
export const MOCK_LEADS = MOCK_ENQUIRIES;
