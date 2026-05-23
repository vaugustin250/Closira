import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChannelBadge from './ChannelBadge';
import { Colors, Typography, Spacing, Radius, Shadow } from '../utils/theme';
import { formatRelativeTime, getUrgencyConfig } from '../utils/helpers';

export default function EscalationCard({ enquiry, onPress, onResolve }) {
  const [resolved, setResolved] = useState(false);
  const urgency = getUrgencyConfig(enquiry.escalation_urgency);
  const isHigh = enquiry.escalation_urgency === 'high';

  const handleResolve = () => {
    Alert.alert(
      'Resolve Escalation',
      `Mark escalation for ${enquiry.customer_name} as resolved?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resolve',
          style: 'default',
          onPress: () => {
            setResolved(true);
            onResolve?.(enquiry.id);
          },
        },
      ],
    );
  };

  if (resolved) return null;

  const gradColors = isHigh
    ? ['#ff5f6d', '#ffc371']
    : ['#f7971e', '#ffd200'];

  return (
    <TouchableOpacity
      style={[styles.card, Shadow.md]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Gradient urgency header band */}
      <LinearGradient
        colors={gradColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerBand}
      >
        <View style={styles.bandLeft}>
          <Text style={styles.bandIcon}>{isHigh ? '🔴' : '🟡'}</Text>
          <Text style={styles.bandLabel}>
            {urgency.label} Priority Escalation
          </Text>
        </View>
        <Text style={styles.bandTime}>{formatRelativeTime(enquiry.received_at)}</Text>
      </LinearGradient>

      {/* Card body */}
      <View style={styles.body}>
        {/* Customer row */}
        <View style={styles.customerRow}>
          <View style={[styles.initials, { backgroundColor: isHigh ? '#FFCDD2' : '#FFE0B2' }]}>
            <Text style={[styles.initialsText, { color: urgency.color }]}>
              {enquiry.customer_name?.charAt(0) ?? '?'}
            </Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.name}>{enquiry.customer_name}</Text>
            <ChannelBadge channel={enquiry.channel} />
          </View>
        </View>

        {/* Reason */}
        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>REASON</Text>
          <Text style={styles.reasonText}>{enquiry.escalation_reason}</Text>
        </View>

        {/* AI Summary */}
        {enquiry.ai_summary ? (
          <View style={styles.summaryBox}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.summaryGradBar}
            />
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>🤖 AI Summary</Text>
              <Text style={styles.summaryText}>{enquiry.ai_summary}</Text>
            </View>
          </View>
        ) : null}

        {/* Resolve button */}
        <TouchableOpacity onPress={handleResolve} activeOpacity={0.8}>
          <LinearGradient
            colors={['#11998e', '#38ef7d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.resolveBtn}
          >
            <Text style={styles.resolveBtnText}>✓  Mark as Resolved</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerBand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  bandLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  bandIcon: { fontSize: 14 },
  bandLabel: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightBold,
    color: '#fff',
    letterSpacing: 0.3,
  },
  bandTime: {
    fontSize: Typography.fontSizeXS,
    color: 'rgba(255,255,255,0.85)',
  },
  body: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  initials: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightBold,
  },
  customerInfo: { gap: 4 },
  name: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  reasonBox: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 4,
  },
  reasonLabel: {
    fontSize: 10,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  reasonText: {
    fontSize: Typography.fontSizeSM,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  summaryBox: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  summaryGradBar: {
    width: 4,
  },
  summaryContent: {
    flex: 1,
    padding: Spacing.md,
    gap: 4,
  },
  summaryLabel: {
    fontSize: Typography.fontSizeXS,
    fontWeight: Typography.fontWeightBold,
    color: Colors.primary,
  },
  summaryText: {
    fontSize: Typography.fontSizeSM,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  resolveBtn: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resolveBtnText: {
    color: '#fff',
    fontWeight: Typography.fontWeightBold,
    fontSize: Typography.fontSizeMD,
    letterSpacing: 0.3,
  },
});
