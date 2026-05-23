import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow } from '../utils/theme';

/**
 * StatCard — Material Design 3 gradient metric tile for the Dashboard.
 */
export default function StatCard({ icon, label, value, gradientColors, textColor = '#fff' }) {
  const colors = gradientColors || [Colors.primary, Colors.primaryDark];
  return (
    <View style={[styles.cardWrapper, Shadow.md]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
        </View>
        <Text style={[styles.value, { color: textColor }]}>{value}</Text>
        <Text style={[styles.label, { color: textColor + 'CC' }]}>{label}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    minWidth: '45%',
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  card: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  value: {
    fontSize: Typography.fontSize3XL,
    fontWeight: Typography.fontWeightExtraBold,
    letterSpacing: Typography.letterSpacingTight,
    marginBottom: 2,
  },
  label: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightSemiBold,
    letterSpacing: Typography.letterSpacingWide,
  },
});
