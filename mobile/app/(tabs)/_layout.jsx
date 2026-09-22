import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';

const VERDE = '#075E54';
const GRIS = '#64748B';

function TabGlyph({ icono, color }) {
  return (
    <View style={{ width: 36, height: 24, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, color }}>{icono}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: VERDE,
        tabBarInactiveTintColor: GRIS,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color }) => <TabGlyph icono="🗺️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="gastronomia"
        options={{
          title: 'Gastronomía',
          tabBarIcon: ({ color }) => <TabGlyph icono="🍽️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="experiencias"
        options={{
          title: 'Rutas',
          tabBarIcon: ({ color }) => <TabGlyph icono="🌿" color={color} />,
        }}
      />
      <Tabs.Screen
        name="resenas"
        options={{
          title: 'Reseñas',
          tabBarIcon: ({ color }) => <TabGlyph icono="⭐" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mochila"
        options={{
          title: 'Mochila',
          tabBarIcon: ({ color }) => <TabGlyph icono="🎒" color={color} />,
        }}
      />
      {/* Rutas ocultas en la barra de pestañas pero accesibles vía Drawer y Router */}
      <Tabs.Screen
        name="emergencia"
        options={{
          href: null,
          title: 'Emergencia',
        }}
      />
    </Tabs>
  );
}
