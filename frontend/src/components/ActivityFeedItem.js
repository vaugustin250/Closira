import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChannelBadge from './ChannelBadge';
import { Colors, Typography, Spacing, Radius } from '../utils/theme';
import { formatRelativeTime } from '../utils/helpers';

const eventConfig = {
  'Escalated':           { gradient: ['#ff5f6d', '#ffc371'], label: '🚨 Escalated' },
  'Follow-up Scheduled': { gradient: ['#f7971e', '#ffd200'], label: '🔔 Follow-up' },
  'SOP Matched':         { gradient: ['#11998e', '#38ef7d'], label: '⚙️ SOP Match' },
  'New Lead':            { gradient: ['#667eea', '#764ba2'], label: '📥 New Lead' },
};

function getEventConfig(event) {
  return eventConfig[event] || { gradient: ['#667eea', '#764ba2'], label: event };
}

export default function ActivityFeedItem({ item, onPress, isLast }) {
  const config = getEventConfig(item.event);
  return (
    <TouchableOpacity
      style={[styles.container, !isLast && styles.withBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left: avatar initial */}
      <LinearGradient
        colors={config.gradient}
        style={styles.avatar}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.avatarText}>
          {item.customer_name?.charAt(0) ?? '?'}
        </Text>
      </LinearGradient>

      {/* Middle: info */}
      <View style={styles.mid}>
        <Text style={styles.customer} numberOfLines={1}>{item.customer_name}</Text>
        <Text style={styles.description} numberOfLines={1}>{item.description}</Text>
        <View style={styles.metaRow}>
          <ChannelBadge channel={item.channel} />
          <Text style={styles.time}>{formatRelativeTime(item.time)}</Text>
        </View>
      </View>

      {/* Right: event pill */}
      <LinearGradient
        colors={config.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.pill}
      >
        <Text style={styles.pillText}>{config.label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: '#fff',
    fontWeight: Typography.fontWeightBold,
    fontSize: Typography.fontSizeLG,
  },
  mid: {
    flex: 1,
    gap: 3,
  },
  customer: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: Typography.fontSizeXS,
    color: Colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 2,
  },
  time: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  pill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    flexShrink: 0,
  },
  pillText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: Typography.fontWeightBold,
  },
});
