import { Tabs } from 'expo-router';
import Icon from '../../src/components/Icon';
import { colors } from '../../src/theme';

const tab = (title, icon, iconActive) => ({
  title,
  tabBarIcon: ({ color, focused }) => (
    <Icon name={focused ? iconActive : icon} size={22} color={color} />
  ),
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={tab('Mapa', 'map-outline', 'map')} />
      <Tabs.Screen name="gastronomia" options={tab('Gastronomía', 'restaurant-outline', 'restaurant')} />
      <Tabs.Screen name="experiencias" options={tab('Rutas', 'compass-outline', 'compass')} />
      <Tabs.Screen name="resenas" options={tab('Reseñas', 'star-outline', 'star')} />
      <Tabs.Screen name="mochila" options={tab('Mochila', 'cloud-download-outline', 'cloud-download')} />
      <Tabs.Screen name="emergencia" options={{ href: null, title: 'Ayuda' }} />
    </Tabs>
  );
}
