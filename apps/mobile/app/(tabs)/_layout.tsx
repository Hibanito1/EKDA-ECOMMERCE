import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

function TabIcon({
  icon,
  focused,
  label,
}: {
  icon: string;
  focused: boolean;
  label: string;
}) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" focused={focused} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="export"
        options={{
          title: "Exports",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🌿" focused={focused} label="Exports" />
          ),
        }}
      />
      <Tabs.Screen
        name="import"
        options={{
          title: "Imports",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🌍" focused={focused} label="Imports" />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🛒" focused={focused} label="Cart" />
          ),
        }}
      />
      <Tabs.Screen
        name="ai-chat"
        options={{
          title: "AI",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🤖" focused={focused} label="AI Chat" />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" focused={focused} label="Account" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopColor: "#f1f5f9",
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 4,
    height: 68,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  tabItem: {
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 52,
  },
  tabItemActive: {
    backgroundColor: "rgba(22, 163, 74, 0.08)",
  },
  tabIcon: { fontSize: 22 },
  tabIconActive: {},
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#9ca3af",
  },
  tabLabelActive: {
    color: "#16a34a",
    fontWeight: "700",
  },
});
