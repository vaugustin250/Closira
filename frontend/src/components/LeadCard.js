import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChannelBadge from './ChannelBadge';
import StatusBadge from './StatusBadge';
import { Colors, Typography, Spacing, Radius, Shadow } from '../utils/theme';
import { formatRelativeTime } from '../utils/helpers';

export default function LeadCard({ enquiry, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, Shadow.sm]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Left accent strip */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.accentStrip}
      />

      <View style={styles.body}>
        {/* Header row */}
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <View style={styles.initials}>
              <Text style={styles.initialsText}>
                {enquiry.customer_name?.charAt(0) ?? '?'}
              </Text>
            </View>
            <View>
              <Text style={styles.name}>{enquiry.customer_name}</Text>
              <Text style={styles.time}>{formatRelativeTime(enquiry.received_at)}</Text>
            </View>
          </View>
          <StatusBadge status={enquiry.status} />
        </View>

        {/* Message preview */}
        <Text style={styles.message} numberOfLines={2}>
          {enquiry.message}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <ChannelBadge channel={enquiry.channel} />
          {enquiry.matched_sop && (
            <View style={styles.sopTag}>
              <Text style={styles.sopText}>⚙️ {enquiry.matched_sop}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accentStrip: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  initials: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightBold,
    color: Colors.primary,
  },
  name: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  time: {
    fontSize: Typography.fontSizeXS,
    color: Colors.textMuted,
    marginTop: 1,
  },
  message: {
    fontSize: Typography.fontSizeSM,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  sopTag: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  sopText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: Typography.fontWeightMedium,
  },
});
