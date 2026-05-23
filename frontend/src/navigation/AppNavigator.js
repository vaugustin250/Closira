import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import DashboardScreen from '../screens/DashboardScreen';
import LeadsScreen from '../screens/LeadsScreen';
import EscalationsScreen from '../screens/EscalationsScreen';
import FollowUpsScreen from '../screens/FollowUpsScreen';
import ConversationDetailScreen from '../screens/ConversationDetailScreen';

import { Colors, Typography, Spacing, Radius } from '../utils/theme';
import { MOCK_STATS } from '../../mock';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TABS = [
  {
    name: 'Home',
    icon: '🏠',
    label: 'Dashboard',
    component: DashboardScreen,
    headerTitle: 'Closira',
  },
  {
    name: 'Leads',
    icon: '📋',
    label: 'Leads',
    component: LeadsScreen,
  },
  {
    name: 'Escalations',
    icon: '🚨',
    label: 'Escalations',
    component: EscalationsScreen,
    badgeKey: 'open_escalations',
  },
  {
    name: 'FollowUps',
    icon: '🔔',
    label: 'Follow-ups',
    component: FollowUpsScreen,
    badgeKey: 'followups_due',
  },
];

function TabIcon({ icon, label, focused, badgeCount }) {
  return (
    <View style={styles.tabIconWrapper}>
      {focused ? (
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tabPill}
        >
          <Text style={styles.tabIconActive}>{icon}</Text>
          <Text style={styles.tabLabelActive}>{label}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.tabInactive}>
          <Text style={styles.tabIcon}>{icon}</Text>
        </View>
      )}
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount > 9 ? '9+' : badgeCount}</Text>
        </View>
      )}
    </View>
  );
}

function BottomTabs() {
  const stats = MOCK_STATS;

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTitleStyle: {
          fontSize: Typography.fontSizeLG,
          fontWeight: Typography.fontWeightBold,
          color: Colors.textPrimary,
          letterSpacing: -0.3,
        },
        headerShadowVisible: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
      }}
    >
      {TABS.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            title: tab.label,
            headerTitle: tab.headerTitle || tab.label,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={tab.icon}
                label={tab.label}
                focused={focused}
                badgeCount={tab.badgeKey ? stats[tab.badgeKey] : 0}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ConversationDetail"
          component={ConversationDetailScreen}
          options={{
            title: 'Conversation',
            headerStyle: { backgroundColor: Colors.surface },
            headerTitleStyle: {
              fontSize: Typography.fontSizeLG,
              fontWeight: Typography.fontWeightBold,
              color: Colors.textPrimary,
            },
            headerTintColor: Colors.primary,
            headerShadowVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 72,
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: Spacing.sm,
  },

  tabIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },

  // Active: pill with gradient
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  tabIconActive: {
    fontSize: 18,
  },
  tabLabelActive: {
    fontSize: 12,
    fontWeight: Typography.fontWeightBold,
    color: '#fff',
  },

  // Inactive
  tabInactive: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },

  // Badge
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: Colors.statusEscalated,
    borderRadius: Radius.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: Typography.fontWeightBold,
  },
});
