import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getChannelConfig } from '../utils/helpers';
import { Typography, Radius, Spacing } from '../utils/theme';

/**
 * ChannelBadge — displays a pill badge for whatsapp / email / call.
 * Props:
 *   channel  — 'whatsapp' | 'email' | 'call'
 *   size     — 'sm' | 'md' (default 'sm')
 */
export default function ChannelBadge({ channel, size = 'sm' }) {
  const config = getChannelConfig(channel);
  const isMd = size === 'md';

  return (
    <View style={[
      styles.badge,
      { backgroundColor: config.bg, borderColor: config.color + '33' },
      isMd && styles.badgeMd,
    ]}>
      <Text style={[styles.icon, isMd && styles.iconMd]}>{config.icon}</Text>
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
    borderWidth: 1,
    gap: 4,
  },
  badgeMd: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  icon: {
    fontSize: 10,
  },
  iconMd: {
    fontSize: 13,
  },
  label: {
    fontSize: Typography.fontSizeXS,
    fontWeight: Typography.fontWeightSemiBold,
    letterSpacing: 0.3,
  },
  labelMd: {
    fontSize: Typography.fontSizeSM,
  },
});
