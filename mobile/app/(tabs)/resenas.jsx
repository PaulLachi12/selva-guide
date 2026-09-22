import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet
} from 'react-native';
import { obtenerPuntos, suscribirPuntos } from '../../src/data/puntosData';
import DetallePuntoModal from '../../src/components/DetallePuntoModal';
import DrawerMenuModal from '../../src/components/DrawerMenuModal';

const VERDE_N = '#075E54';
const VERDE_B = '#128C7E';
const BLANCO = '#FFFFFF';
const TINTA = '#1C1C1E';
const GRIS = '#64748B';
const CREMA = '#F8FAFC';

export default function ResenasScreen() {
  const [puntos, setPuntos] = useState(obtenerPuntos());
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    return suscribirPuntos((nuevos) => setPuntos(nuevos));
  }, []);

  // Extraer todas las reseñas con referencia al lugar
  const todasResenas = [];
  puntos.forEach((p) => {
    if (p.resenas && p.resenas.length > 0) {
      p.resenas.forEach((r) => {
        todasResenas.push({
          ...r,
          lugarId: p.id,
          lugarNombre: p.nombre,
          lugarCategoria: p.categoria,
          puntoCompleto: p,
        });
      });
    }
  });

  const abrirLugar = (punto) => {
    setPuntoSeleccionado(punto);
    setModalVisible(true);
  };

  return (
    <View style={styles.contenedor}>
      {/* Header con botón Drawer */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => setDrawerVisible(true)} style={styles.btnMenu}>
            <Text style={styles.btnMenuTexto}>☰</Text>
          </Pressable>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitulo}>⭐ Reseñas de la Comunidad</Text>
            <Text style={styles.headerSub}>
              Experiencias y valoraciones de turistas en Iquitos
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {todasResenas.map((resena, index) => (
          <View key={`${resena.id}-${index}`} style={styles.card}>
            <Pressable
              onPress={() => abrirLugar(resena.puntoCompleto)}
              style={styles.lugarBadge}
            >
              <Text style={styles.lugarNombre} numberOfLines={1}>
                📍 {resena.lugarNombre}
              </Text>
              <Text style={styles.lugarLink}>Ver lugar →</Text>
            </Pressable>

            <View style={styles.autorRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{resena.autor.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.autorNombre}>{resena.autor}</Text>
                <Text style={styles.fecha}>{resena.fecha || 'Reciente'}</Text>
              </View>
              <Text style={styles.ratingStars}>{'★'.repeat(resena.rating || 5)}</Text>
            </View>

            <Text style={styles.comentario}>"{resena.comentario}"</Text>
          </View>
        ))}
      </ScrollView>

      {/* Modal Detalle Lugar */}
      <DetallePuntoModal
        visible={modalVisible}
        punto={puntoSeleccionado}
        onClose={() => setModalVisible(false)}
      />

      {/* Drawer Menú Lateral */}
      <DrawerMenuModal
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        rutaActual="/(tabs)/resenas"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: CREMA,
  },
  header: {
    backgroundColor: VERDE_N,
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  btnMenu: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  btnMenuTexto: {
    fontSize: 20,
    color: BLANCO,
    fontWeight: '800',
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: BLANCO,
  },
  headerSub: {
    fontSize: 12,
    color: '#A7F3D0',
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  card: {
    backgroundColor: BLANCO,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lugarBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  lugarNombre: {
    fontSize: 12,
    fontWeight: '700',
    color: VERDE_N,
    flex: 1,
  },
  lugarLink: {
    fontSize: 11,
    fontWeight: '700',
    color: VERDE_B,
    marginLeft: 8,
  },
  autorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: VERDE_B,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: BLANCO,
    fontWeight: '700',
    fontSize: 14,
  },
  autorNombre: {
    fontSize: 14,
    fontWeight: '700',
    color: TINTA,
  },
  fecha: {
    fontSize: 11,
    color: GRIS,
  },
  ratingStars: {
    fontSize: 14,
    color: '#EAB308',
  },
  comentario: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    fontStyle: 'italic',
  },
});
