import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Modal, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

const VERDE_N = '#075E54';
const VERDE_B = '#128C7E';
const BLANCO = '#FFFFFF';
const TINTA = '#1C1C1E';
const GRIS = '#64748B';

export default function DrawerMenuModal({ visible, onClose, rutaActual }) {
  const router = useRouter();

  const items = [
    { label: '🗺️ Mapa de Exploración', sub: 'Puntos de interés y filtros GPS', ruta: '/(tabs)' },
    { label: '🎒 Mi Mochila / Modo Offline', sub: 'Descargas sin internet y SQLite', ruta: '/(tabs)/mochila' },
    { label: '🍽️ Guía Gastronómica', sub: 'Gourmet, Terrazas y Mercado vivencial', ruta: '/(tabs)/gastronomia' },
    { label: '🌿 Experiencias y Rutas', sub: 'Trochas en cuatrimotos y reservas', ruta: '/(tabs)/experiencias' },
    { label: '⭐ Reseñas de la Comunidad', sub: 'Consejos de viajeros y calificaciones', ruta: '/(tabs)/resenas' },
    { label: '🔒 Panel Admin (Nuevo Punto)', sub: 'Agregar lugares al mapa', ruta: '/admin/nuevo-punto' },
    { label: '🚨 Emergencia y Tarifario', sub: 'Policía de turismo, salud y mototaxis', ruta: '/(tabs)/emergencia' },
  ];

  const navegar = (ruta) => {
    onClose();
    router.push(ruta);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.drawerContainer}>
          {/* Cabecera del Drawer */}
          <View style={styles.drawerHeader}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={styles.appTitle}>🌿 Selva Guía</Text>
                <Text style={styles.appSub}>Iquitos • Amazonía Peruana</Text>
              </View>
              <Pressable onPress={onClose} style={styles.btnClose}>
                <Text style={styles.btnCloseText}>✕</Text>
              </Pressable>
            </View>
            <Text style={styles.statusOnline}>● Sistema Táctico Offline Activo</Text>
          </View>

          {/* Lista de Secciones Escroleable */}
          <ScrollView
            style={styles.menuScroll}
            contentContainerStyle={{ paddingVertical: 8, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {items.map((item, idx) => {
              const activo = rutaActual === item.ruta;
              return (
                <Pressable
                  key={idx}
                  onPress={() => navegar(item.ruta)}
                  style={[styles.menuItem, activo && styles.menuItemActivo]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.menuLabel, activo && styles.menuLabelActivo]}>
                      {item.label}
                    </Text>
                    <Text style={styles.menuSub}>{item.sub}</Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Footer del Drawer */}
          <View style={styles.drawerFooter}>
            <Text style={styles.footerVersion}>Selva Guía v1.0.0 • Loreto</Text>
            <Text style={styles.footerCoords}>GPS: -3.749° S, -73.244° W</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  drawerContainer: {
    width: '82%',
    maxWidth: 320,
    backgroundColor: BLANCO,
    height: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 30,
  },
  drawerHeader: {
    backgroundColor: VERDE_N,
    paddingTop: 54,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: BLANCO,
    letterSpacing: 0.5,
  },
  appSub: {
    fontSize: 13,
    color: '#A7F3D0',
    fontWeight: '600',
    marginTop: 2,
  },
  statusOnline: {
    fontSize: 11,
    color: '#34D399',
    fontWeight: '700',
    marginTop: 10,
  },
  btnClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCloseText: {
    color: BLANCO,
    fontSize: 16,
    fontWeight: '800',
  },
  menuScroll: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemActivo: {
    backgroundColor: '#ECFDF5',
    borderLeftWidth: 4,
    borderLeftColor: VERDE_B,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: TINTA,
  },
  menuLabelActivo: {
    color: VERDE_N,
  },
  menuSub: {
    fontSize: 11,
    color: GRIS,
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    color: '#94A3B8',
    marginLeft: 8,
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  footerVersion: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  footerCoords: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
});
