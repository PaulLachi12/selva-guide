import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Icon from '../../src/components/Icon';
import { useTheme } from '../../src/context/ThemeContext';

const tab = (title, icon, iconActive) => ({
  title,
  tabBarIcon: ({ color, focused }) => (
    <Icon name={focused ? iconActive : icon} size={22} color={color} />
  ),
});

export default function TabLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSubtle,
        // Sin position:'absolute': la tab bar reserva su propio espacio en el layout,
        // así el MapView (capa nativa) nunca se dibuja por encima de ella ni la distorsiona.
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          elevation: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={tab(t('tabs.mapa'), 'map-outline', 'map')} />
      <Tabs.Screen name="gastronomia" options={tab(t('tabs.gastronomia'), 'restaurant-outline', 'restaurant')} />
      <Tabs.Screen name="experiencias" options={tab(t('tabs.rutas'), 'compass-outline', 'compass')} />
      <Tabs.Screen name="resenas" options={tab(t('tabs.resenas'), 'star-outline', 'star')} />
      <Tabs.Screen name="mochila" options={tab(t('tabs.mochila'), 'cloud-download-outline', 'cloud-download')} />
      <Tabs.Screen name="emergencia" options={{ href: null, title: t('tabs.ayuda') }} />
    </Tabs>
  );
}
