import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStatusConfig } from '../utils/helpers';
import { Typography, Radius, Spacing } from '../utils/theme';

/**
 * StatusBadge — New (blue), Open/Qualified (green), Escalated (red), Follow-up (amber)
 */
export default function StatusBadge({ status, size = 'sm' }) {
  const config = getStatusConfig(status);
  const isMd = size === 'md';

  return (
    <View style={[
      styles.badge,
      { backgroundColor: config.bg },
      isMd && styles.badgeMd,
    ]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }, isMd && styles.labelMd]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
  },
  badgeMd: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: Typography.fontSizeXS,
    fontWeight: Typography.fontWeightSemiBold,
  },
  labelMd: {
    fontSize: Typography.fontSizeSM,
  },
});
