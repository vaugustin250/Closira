import { Colors } from './theme';

/**
 * Returns color config for a given channel string.
 */
export function getChannelConfig(channel) {
  switch (channel?.toLowerCase()) {
    case 'whatsapp':
      return { label: 'WhatsApp', color: Colors.channelWhatsApp, bg: Colors.channelWhatsAppBg, icon: '💬' };
    case 'email':
      return { label: 'Email', color: Colors.channelEmail, bg: Colors.channelEmailBg, icon: '✉️' };
    case 'call':
      return { label: 'Call', color: Colors.channelCall, bg: Colors.channelCallBg, icon: '📞' };
    default:
      return { label: channel ?? 'Unknown', color: Colors.textMuted, bg: Colors.surfaceElevated, icon: '❓' };
  }
}

/**
 * Returns color config for a given status string.
 */
export function getStatusConfig(status) {
  switch (status?.toLowerCase()) {
    case 'new':
    case 'pending':
      return { label: 'New', color: Colors.statusNew, bg: Colors.statusNewBg };
    case 'open':
    case 'qualified':
      return { label: 'Open', color: Colors.statusQualified, bg: Colors.statusQualifiedBg };
    case 'escalated':
      return { label: 'Escalated', color: Colors.statusEscalated, bg: Colors.statusEscalatedBg };
    case 'follow_up':
      return { label: 'Follow-up', color: Colors.statusFollowUp, bg: Colors.statusFollowUpBg };
    case 'resolved':
      return { label: 'Resolved', color: Colors.statusQualified, bg: Colors.statusQualifiedBg };
    case 'processing':
      return { label: 'Processing', color: Colors.info, bg: Colors.statusNewBg };
    default:
      return { label: status ?? 'Unknown', color: Colors.textMuted, bg: Colors.surfaceElevated };
  }
}

/**
 * Formats an ISO date string to a human-readable relative time.
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/**
 * Formats an ISO date string to a time string (HH:MM AM/PM).
 */
export function formatTime(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Returns urgency config.
 */
export function getUrgencyConfig(urgency) {
  switch (urgency?.toLowerCase()) {
    case 'high':
      return { label: 'High', color: Colors.urgencyHigh, bg: Colors.urgencyHighBg };
    case 'medium':
      return { label: 'Medium', color: Colors.urgencyMedium, bg: Colors.urgencyMediumBg };
    default:
      return { label: 'Low', color: Colors.success, bg: Colors.statusQualifiedBg };
  }
}
