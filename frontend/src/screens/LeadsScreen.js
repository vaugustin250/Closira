import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LeadCard from '../components/LeadCard';
import EmptyState from '../components/EmptyState';
import { Colors, Typography, Spacing, Radius, Shadow } from '../utils/theme';
import { MOCK_LEADS } from '../../mock';

const FILTERS = ['All', 'New', 'Open', 'Escalated', 'Follow-up'];

export default function LeadsScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_LEADS.filter((e) => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'New' && (e.status === 'pending' || e.status === 'processing')) ||
      (activeFilter === 'Open' && e.status === 'open') ||
      (activeFilter === 'Escalated' && e.status === 'escalated') ||
      (activeFilter === 'Follow-up' && e.status === 'follow_up');
    const matchesSearch =
      !search ||
      e.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      e.message.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Gradient sub-header */}
      <LinearGradient
        colors={['#4A55C8', '#7C4DFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.subHeader}
      >
        <Text style={styles.subHeaderCount}>{filtered.length}</Text>
        <Text style={styles.subHeaderLabel}>
          {filtered.length === 1 ? 'lead' : 'leads'} found
        </Text>
      </LinearGradient>

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <View style={[styles.searchRow, Shadow.sm]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or message…"
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.filtersRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filtersContent}
          renderItem={({ item }) => {
            const active = item === activeFilter;
            return active ? (
              <TouchableOpacity onPress={() => setActiveFilter(item)} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.filterChipActive}
                >
                  <Text style={styles.filterLabelActive}>{item}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.filterChip}
                onPress={() => setActiveFilter(item)}
              >
                <Text style={styles.filterLabel}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeadCard
            enquiry={item}
            onPress={() =>
              navigation.navigate('ConversationDetail', { enquiryId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="📭"
            title="No leads found"
            subtitle="Try adjusting your filter or search query."
            gradientColors={['#667eea', '#764ba2']}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  subHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  subHeaderCount: {
    fontSize: Typography.fontSize2XL,
    fontWeight: Typography.fontWeightExtraBold,
    color: '#fff',
  },
  subHeaderLabel: {
    fontSize: Typography.fontSizeSM,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: Typography.fontWeightMedium,
  },

  searchWrapper: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 48,
  },
  searchIcon: { fontSize: 16, marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSizeMD,
    color: Colors.textPrimary,
    height: '100%',
  },
  clearIcon: {
    fontSize: 14,
    color: Colors.textMuted,
    paddingLeft: Spacing.sm,
  },

  filtersRow: { marginBottom: Spacing.sm },
  filtersContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  filterLabel: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textSecondary,
  },
  filterLabelActive: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightBold,
    color: '#fff',
  },

  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 48,
    paddingTop: Spacing.sm,
  },
});