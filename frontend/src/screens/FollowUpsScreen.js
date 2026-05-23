import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import FollowUpCard from '../components/FollowUpCard';
import EmptyState from '../components/EmptyState';
import { Colors, Typography, Spacing } from '../utils/theme';
import { MOCK_FOLLOWUPS } from '../../mock';

export default function FollowUpsScreen({ navigation }) {
  const [followups, setFollowups] = useState(MOCK_FOLLOWUPS);

  const handleMarkDone = (id) => {
    setFollowups((prev) => prev.filter((e) => e.id !== id));
  };

  const overdue = followups.filter(
    (e) => e.followup_due_at && new Date(e.followup_due_at) < new Date(),
  );
  const upcoming = followups.filter(
    (e) => !e.followup_due_at || new Date(e.followup_due_at) >= new Date(),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={[]}
        ListHeaderComponent={
          <>
            {overdue.length > 0 && (
              <>
                <View style={styles.overdueHeader}>
                  <Text style={styles.overdueIcon}>⚠️</Text>
                  <Text style={styles.overdueText}>{overdue.length} overdue follow-up{overdue.length > 1 ? 's' : ''}</Text>
                </View>
                <Text style={styles.sectionTitle}>Overdue</Text>
                {overdue.map((item) => (
                  <FollowUpCard
                    key={item.id}
                    enquiry={item}
                    onPress={() => navigation.navigate('ConversationDetail', { enquiryId: item.id })}
                    onMarkDone={handleMarkDone}
                  />
                ))}
              </>
            )}

            {upcoming.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Upcoming</Text>
                {upcoming.map((item) => (
                  <FollowUpCard
                    key={item.id}
                    enquiry={item}
                    onPress={() => navigation.navigate('ConversationDetail', { enquiryId: item.id })}
                    onMarkDone={handleMarkDone}
                  />
                ))}
              </>
            )}

            {followups.length === 0 && (
              <EmptyState
                icon="🎉"
                title="All caught up!"
                subtitle="No follow-ups scheduled. You're on top of everything."
              />
            )}
          </>
        }
        keyExtractor={() => 'header'}
        renderItem={() => null}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, paddingBottom: 40 },

  overdueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.statusFollowUpBg,
    borderRadius: 10,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  overdueIcon: { fontSize: 20 },
  overdueText: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.statusFollowUp,
  },

  sectionTitle: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
});