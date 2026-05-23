import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StatCard from '../components/StatCard';
import ActivityFeedItem from '../components/ActivityFeedItem';
import SectionHeader from '../components/SectionHeader';
import { Colors, Typography, Spacing, Radius, Shadow, Gradients } from '../utils/theme';
import { MOCK_STATS, MOCK_ACTIVITY } from '../../mock';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning ☀️';
  if (hour < 17) return 'Good afternoon 👋';
  return 'Good evening 🌙';
};

export default function DashboardScreen({ navigation }) {
  const stats = MOCK_STATS;

  const quickActions = [
    {
      label: 'Escalations',
      icon: '🚨',
      count: stats.open_escalations,
      screen: 'Escalations',
      gradient: Gradients.escalation,
    },
    {
      label: 'Follow-ups',
      icon: '🔔',
      count: stats.followups_due,
      screen: 'FollowUps',
      gradient: Gradients.followUp,
    },
    {
      label: 'All Leads',
      icon: '📋',
      count: stats.total_leads_today,
      screen: 'Leads',
      gradient: Gradients.leads,
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Header ── */}
        <LinearGradient
          colors={['#4A55C8', '#7C4DFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Decorative circles */}
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />

          <View style={styles.heroContent}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroGreeting}>{getGreeting()}</Text>
                <Text style={styles.heroTitle}>Closira Dashboard</Text>
                <Text style={styles.heroSub}>Manage all your enquiries in one place</Text>
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>B</Text>
              </View>
            </View>

            {/* Response Rate inside hero */}
            <View style={styles.heroMetric}>
              <View style={styles.heroMetricLeft}>
                <Text style={styles.heroMetricLabel}>Response Rate</Text>
                <Text style={styles.heroMetricValue}>{stats.response_rate}%</Text>
              </View>
              <View style={styles.heroMetricRight}>
                <Text style={styles.heroMetricSub}>Avg. {stats.avg_response_time_minutes} min response</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${stats.response_rate}%` }]} />
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ── Stats Grid ── */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="📥"
            label="Leads Today"
            value={stats.total_leads_today}
            gradientColors={Gradients.leads}
          />
          <StatCard
            icon="❌"
            label="Missed"
            value={stats.missed_enquiries}
            gradientColors={Gradients.missed}
          />
          <StatCard
            icon="🚨"
            label="Escalations"
            value={stats.open_escalations}
            gradientColors={Gradients.escalation}
          />
          <StatCard
            icon="🔔"
            label="Follow-ups Due"
            value={stats.followups_due}
            gradientColors={Gradients.followUp}
          />
        </View>

        {/* ── Quick Actions ── */}
        <SectionHeader title="Quick Actions" />
        <View style={styles.quickActionsRow}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.screen}
              style={[styles.quickActionWrapper, Shadow.md]}
              onPress={() => navigation.navigate(action.screen)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={action.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickAction}
              >
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={styles.quickActionCount}>{action.count}</Text>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Activity Feed ── */}
        <SectionHeader
          title="Recent Activity"
          actionLabel="See all"
          onAction={() => navigation.navigate('Leads')}
        />
        <View style={[styles.feedCard, Shadow.sm]}>
          {MOCK_ACTIVITY.map((item, idx) => (
            <ActivityFeedItem
              key={item.id}
              item={item}
              isLast={idx === MOCK_ACTIVITY.length - 1}
              onPress={() =>
                navigation.navigate('ConversationDetail', { enquiryId: item.enquiry_id })
              }
            />
          ))}
        </View>

        {/* ── Resolved Today ── */}
        <LinearGradient
          colors={Gradients.resolved}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.resolvedBar}
        >
          <Text style={styles.resolvedIcon}>✅</Text>
          <Text style={styles.resolvedText}>
            {stats.resolved_today} enquiries resolved today
          </Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: 48 },

  // Hero
  hero: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  heroCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -60,
    right: -40,
  },
  heroCircle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -30,
    left: 20,
  },
  heroContent: { zIndex: 1 },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  heroGreeting: {
    fontSize: Typography.fontSizeSM,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 4,
    letterSpacing: Typography.letterSpacingWide,
  },
  heroTitle: {
    fontSize: Typography.fontSize2XL,
    fontWeight: Typography.fontWeightExtraBold,
    color: '#FFFFFF',
    letterSpacing: Typography.letterSpacingTight,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: Typography.fontSizeXS,
    color: 'rgba(255,255,255,0.65)',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    color: '#fff',
    fontWeight: Typography.fontWeightBold,
    fontSize: Typography.fontSizeLG,
  },

  // Hero metric
  heroMetric: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  heroMetricLeft: { alignItems: 'flex-start' },
  heroMetricLabel: {
    fontSize: Typography.fontSizeXS,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: Typography.letterSpacingWide,
    marginBottom: 2,
  },
  heroMetricValue: {
    fontSize: Typography.fontSize3XL,
    fontWeight: Typography.fontWeightExtraBold,
    color: '#fff',
    letterSpacing: Typography.letterSpacingTight,
  },
  heroMetricRight: { flex: 1, alignItems: 'flex-end', gap: Spacing.sm },
  heroMetricSub: {
    fontSize: Typography.fontSizeXS,
    color: 'rgba(255,255,255,0.65)',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    padding: Spacing.xl,
    paddingBottom: 0,
    marginTop: -Spacing.xl,
  },

  // Quick actions
  quickActionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  quickActionWrapper: {
    flex: 1,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  quickAction: {
    padding: Spacing.lg,
    alignItems: 'center',
    gap: 6,
    minHeight: 100,
    justifyContent: 'center',
  },
  quickActionIcon: { fontSize: 26 },
  quickActionCount: {
    fontSize: Typography.fontSize2XL,
    fontWeight: Typography.fontWeightExtraBold,
    color: '#fff',
    letterSpacing: Typography.letterSpacingTight,
  },
  quickActionLabel: {
    fontSize: 10,
    fontWeight: Typography.fontWeightSemiBold,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    letterSpacing: Typography.letterSpacingWide,
  },

  // Feed
  feedCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Resolved bar
  resolvedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  resolvedIcon: { fontSize: 16 },
  resolvedText: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightSemiBold,
    color: '#fff',
    letterSpacing: Typography.letterSpacingWide,
  },
});