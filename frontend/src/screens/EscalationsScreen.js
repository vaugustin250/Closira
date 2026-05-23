import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import EscalationCard from '../components/EscalationCard';
import EmptyState from '../components/EmptyState';
import { Colors, Typography, Spacing } from '../utils/theme';
import { MOCK_ESCALATIONS } from '../../mock';

export default function EscalationsScreen({ navigation }) {
  const [escalations, setEscalations] = useState(MOCK_ESCALATIONS);

  const handleResolve = (id) => {
    // In a real app this would call the API
    setEscalations((prev) => prev.filter((e) => e.id !== id));
  };

  const highPriority = escalations.filter((e) => e.escalation_urgency === 'high');
  const mediumPriority = escalations.filter((e) => e.escalation_urgency !== 'high');

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={[]}
        ListHeaderComponent={
          <>
            {/* Banner */}
            {escalations.length > 0 && (
              <View style={styles.banner}>
                <Text style={styles.bannerIcon}>⚠️</Text>
                <Text style={styles.bannerText}>
                  {escalations.length} active escalation{escalations.length > 1 ? 's' : ''} require your attention
                </Text>
              </View>
            )}

            {highPriority.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>High Priority</Text>
                {highPriority.map((item) => (
                  <EscalationCard
                    key={item.id}
                    enquiry={item}
                    onPress={() => navigation.navigate('ConversationDetail', { enquiryId: item.id })}
                    onResolve={handleResolve}
                  />
                ))}
              </>
            )}

            {mediumPriority.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Medium Priority</Text>
                {mediumPriority.map((item) => (
                  <EscalationCard
                    key={item.id}
                    enquiry={item}
                    onPress={() => navigation.navigate('ConversationDetail', { enquiryId: item.id })}
                    onResolve={handleResolve}
                  />
                ))}
              </>
            )}

            {escalations.length === 0 && (
              <EmptyState
                icon="✅"
                title="All clear!"
                subtitle="No active escalations. Great job keeping up with your customers."
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

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.statusEscalatedBg,
    borderRadius: 10,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  bannerIcon: { fontSize: 20 },
  bannerText: {
    flex: 1,
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.statusEscalated,
  },

  sectionTitle: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
});