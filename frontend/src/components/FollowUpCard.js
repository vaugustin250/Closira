import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChannelBadge from './ChannelBadge';
import { Colors, Typography, Spacing, Radius, Shadow } from '../utils/theme';
import { formatTime, formatRelativeTime } from '../utils/helpers';

export default function FollowUpCard({ enquiry, onPress, onMarkDone }) {
  const [done, setDone] = useState(false);

  const handleMarkDone = () => {
    Alert.alert(
      'Mark as Done',
      `Mark follow-up for ${enquiry.customer_name} as completed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Done',
          style: 'default',
          onPress: () => {
            setDone(true);
            onMarkDone?.(enquiry.id);
          },
        },
      ],
    );
  };

  if (done) return null;

  const isOverdue = enquiry.followup_due_at && new Date(enquiry.followup_due_at) < new Date();
  const gradColors = isOverdue ? ['#ff5f6d', '#ffc371'] : ['#f7971e', '#ffd200'];

  return (
    <TouchableOpacity
      style={[styles.card, Shadow.md]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Top gradient band with due time */}
      <LinearGradient
        colors={gradColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topBand}
      >
        <Text style={styles.bandIcon}>{isOverdue ? '⚠️' : '⏰'}</Text>
        <View>
          <Text style={styles.bandLabel}>{isOverdue ? 'OVERDUE' : 'DUE AT'}</Text>
          <Text style={styles.bandTime}>
            {enquiry.followup_due_at
              ? formatTime(enquiry.followup_due_at)
              : 'TBD'}
          </Text>
        </View>
        <View style={styles.bandSpacer} />
        <Text style={styles.bandAgo}>{formatRelativeTime(enquiry.received_at)}</Text>
      </LinearGradient>

      {/* Card body */}
      <View style={styles.body}>
        {/* Customer info */}
        <View style={styles.customerRow}>
          <View style={[styles.initials, { backgroundColor: isOverdue ? '#FFCDD2' : '#FFF9C4' }]}>
            <Text style={[styles.initialsText, { color: isOverdue ? '#C62828' : '#E65100' }]}>
              {enquiry.customer_name?.charAt(0) ?? '?'}
            </Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.name}>{enquiry.customer_name}</Text>
            <ChannelBadge channel={enquiry.channel} />
          </View>
        </View>

        {/* Message template */}
        {enquiry.followup_message_template ? (
          <View style={styles.templateBox}>
            <Text style={styles.templateLabel}>📝 MESSAGE PREVIEW</Text>
            <Text style={styles.templateText} numberOfLines={2}>
              {enquiry.followup_message_template}
            </Text>
          </View>
        ) : null}

        {/* Footer row */}
        <View style={styles.footer}>
          <Text style={styles.footerMeta}>
            Enquiry {formatRelativeTime(enquiry.received_at)}
          </Text>
          <TouchableOpacity onPress={handleMarkDone} activeOpacity={0.8}>
            <LinearGradient
              colors={['#11998e', '#38ef7d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.doneBtn}
            >
              <Text style={styles.doneBtnText}>✓ Mark Done</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  topBand: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  bandIcon: { fontSize: 16 },
  bandLabel: {
    fontSize: 9,
    fontWeight: Typography.fontWeightBold,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
  },
  bandTime: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightExtraBold,
    color: '#fff',
    letterSpacing: -0.5,
  },
  bandSpacer: { flex: 1 },
  bandAgo: {
    fontSize: Typography.fontSizeXS,
    color: 'rgba(255,255,255,0.8)',
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
  templateBox: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 4,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  templateLabel: {
    fontSize: 9,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  templateText: {
    fontSize: Typography.fontSizeSM,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerMeta: {
    fontSize: Typography.fontSizeXS,
    color: Colors.textMuted,
  },
  doneBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  doneBtnText: {
    color: '#fff',
    fontWeight: Typography.fontWeightBold,
    fontSize: Typography.fontSizeSM,
  },
});
