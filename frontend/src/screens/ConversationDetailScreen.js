import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import ChannelBadge from '../components/ChannelBadge';
import StatusBadge from '../components/StatusBadge';
import { Colors, Typography, Spacing, Radius, Shadow } from '../utils/theme';
import { formatRelativeTime, formatTime } from '../utils/helpers';
import { MOCK_ENQUIRIES } from '../../mock';

export default function ConversationDetailScreen({ route }) {
  const { enquiryId } = route.params;
  const enquiry = MOCK_ENQUIRIES.find((e) => e.id === enquiryId);

  if (!enquiry) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Conversation not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header card */}
        <View style={[styles.headerCard, Shadow.sm]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.customerName}>{enquiry.customer_name}</Text>
              <Text style={styles.receivedTime}>{formatRelativeTime(enquiry.received_at)}</Text>
            </View>
            <View style={styles.headerBadges}>
              <ChannelBadge channel={enquiry.channel} size="md" />
              <StatusBadge status={enquiry.status} size="md" />
            </View>
          </View>
        </View>

        {/* Message thread */}
        <Text style={styles.sectionLabel}>Message Thread</Text>
        <View style={[styles.threadCard, Shadow.sm]}>
          {/* Customer message bubble */}
          <View style={styles.messageBubbleCustomer}>
            <Text style={styles.bubbleSender}>{enquiry.customer_name}</Text>
            <Text style={styles.bubbleText}>{enquiry.message}</Text>
            <Text style={styles.bubbleTime}>{formatTime(enquiry.received_at)}</Text>
          </View>

          {/* AI suggested response */}
          {enquiry.suggested_response && (
            <View style={styles.messageBubbleAI}>
              <Text style={styles.bubbleSenderAI}>🤖 Closira AI (Draft)</Text>
              <Text style={styles.bubbleTextAI}>{enquiry.suggested_response}</Text>
            </View>
          )}
        </View>

        {/* SOP Match */}
        {enquiry.matched_sop && (
          <>
            <Text style={styles.sectionLabel}>SOP Match</Text>
            <View style={[styles.sopCard, Shadow.sm]}>
              <View style={styles.sopIcon}><Text style={styles.sopIconText}>⚙️</Text></View>
              <View style={styles.sopInfo}>
                <Text style={styles.sopName}>{enquiry.matched_sop}</Text>
                <Text style={styles.sopDesc}>Keyword-matched standard operating procedure</Text>
              </View>
              <View style={styles.sopBadge}>
                <Text style={styles.sopBadgeText}>Matched</Text>
              </View>
            </View>
          </>
        )}

        {/* AI Summary */}
        {enquiry.ai_summary && (
          <>
            <Text style={styles.sectionLabel}>AI Summary</Text>
            <View style={[styles.summaryCard, Shadow.sm]}>
              <Text style={styles.summaryText}>{enquiry.ai_summary}</Text>
            </View>
          </>
        )}

        {/* Escalation Info */}
        {enquiry.escalation_reason && (
          <>
            <Text style={styles.sectionLabel}>Escalation Details</Text>
            <View style={[styles.escalationCard, Shadow.sm]}>
              <Text style={styles.escalationLabel}>Reason</Text>
              <Text style={styles.escalationReason}>{enquiry.escalation_reason}</Text>
              {enquiry.escalation_urgency && (
                <View style={[
                  styles.urgencyPill,
                  { backgroundColor: enquiry.escalation_urgency === 'high' ? Colors.statusEscalatedBg : Colors.statusFollowUpBg }
                ]}>
                  <Text style={[
                    styles.urgencyPillText,
                    { color: enquiry.escalation_urgency === 'high' ? Colors.statusEscalated : Colors.statusFollowUp }
                  ]}>
                    {enquiry.escalation_urgency === 'high' ? '🔴' : '🟡'} {enquiry.escalation_urgency.charAt(0).toUpperCase() + enquiry.escalation_urgency.slice(1)} Priority
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Status Timeline */}
        <Text style={styles.sectionLabel}>Status Timeline</Text>
        <View style={[styles.timelineCard, Shadow.sm]}>
          {enquiry.timeline.map((event, idx) => (
            <View key={idx} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineDot, idx === 0 && styles.timelineDotFirst]} />
                {idx < enquiry.timeline.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineEvent}>{formatEventType(event.event_type)}</Text>
                <Text style={styles.timelineDesc}>{event.description}</Text>
                <Text style={styles.timelineTime}>{formatRelativeTime(event.created_at)}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function formatEventType(type) {
  const map = {
    enquiry_created: '📥 Enquiry Created',
    sop_matched: '⚙️ SOP Matched',
    escalated: '🚨 Escalated',
    auto_escalated: '🚨 Auto-Escalated',
    followup_scheduled: '🔔 Follow-up Scheduled',
    resolved: '✅ Resolved',
  };
  return map[type] || type;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: 40, gap: Spacing.sm },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: Typography.fontSizeLG, color: Colors.textSecondary },

  headerCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerName: {
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  receivedTime: { fontSize: Typography.fontSizeSM, color: Colors.textMuted },
  headerBadges: { gap: Spacing.sm, alignItems: 'flex-end' },

  sectionLabel: {
    fontSize: Typography.fontSizeXS,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },

  threadCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  messageBubbleCustomer: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    borderTopLeftRadius: 2,
    padding: Spacing.md,
    gap: 6,
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  messageBubbleAI: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    borderTopRightRadius: 2,
    padding: Spacing.md,
    gap: 6,
    alignSelf: 'flex-end',
    maxWidth: '90%',
  },
  bubbleSender: { fontSize: Typography.fontSizeXS, fontWeight: Typography.fontWeightSemiBold, color: Colors.textMuted },
  bubbleSenderAI: { fontSize: Typography.fontSizeXS, fontWeight: Typography.fontWeightSemiBold, color: Colors.primary },
  bubbleText: { fontSize: Typography.fontSizeSM, color: Colors.textPrimary, lineHeight: 20 },
  bubbleTextAI: { fontSize: Typography.fontSizeSM, color: Colors.primaryDark, lineHeight: 20 },
  bubbleTime: { fontSize: 10, color: Colors.textMuted, alignSelf: 'flex-end' },

  sopCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  sopIcon: {
    width: 40, height: 40, borderRadius: Radius.md,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  sopIconText: { fontSize: 20 },
  sopInfo: { flex: 1 },
  sopName: { fontSize: Typography.fontSizeMD, fontWeight: Typography.fontWeightSemiBold, color: Colors.textPrimary },
  sopDesc: { fontSize: Typography.fontSizeXS, color: Colors.textMuted, marginTop: 2 },
  sopBadge: { backgroundColor: Colors.statusQualifiedBg, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  sopBadgeText: { fontSize: Typography.fontSizeXS, fontWeight: Typography.fontWeightSemiBold, color: Colors.statusQualified },

  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  summaryText: { fontSize: Typography.fontSizeSM, color: Colors.textSecondary, lineHeight: 22 },

  escalationCard: {
    backgroundColor: Colors.statusEscalatedBg,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  escalationLabel: { fontSize: Typography.fontSizeXS, fontWeight: Typography.fontWeightBold, color: Colors.statusEscalated, textTransform: 'uppercase', letterSpacing: 0.5 },
  escalationReason: { fontSize: Typography.fontSizeSM, color: Colors.textPrimary, lineHeight: 20 },
  urgencyPill: { paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Radius.full, alignSelf: 'flex-start' },
  urgencyPillText: { fontSize: Typography.fontSizeXS, fontWeight: Typography.fontWeightSemiBold },

  timelineCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: Spacing.md,
    minHeight: 56,
  },
  timelineLeft: { width: 16, alignItems: 'center' },
  timelineDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  timelineDotFirst: { backgroundColor: Colors.primary },
  timelineLine: {
    width: 2, flex: 1,
    backgroundColor: Colors.border,
    marginTop: 2, marginBottom: -4,
  },
  timelineContent: { flex: 1, paddingBottom: Spacing.lg },
  timelineEvent: { fontSize: Typography.fontSizeSM, fontWeight: Typography.fontWeightSemiBold, color: Colors.textPrimary },
  timelineDesc: { fontSize: Typography.fontSizeXS, color: Colors.textSecondary, lineHeight: 18, marginTop: 2 },
  timelineTime: { fontSize: Typography.fontSizeXS, color: Colors.textMuted, marginTop: 4 },
});