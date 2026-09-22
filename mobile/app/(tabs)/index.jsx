import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  Alert
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { obtenerPuntos, suscribirPuntos } from '../../src/data/puntosData';
import DetallePuntoModal from '../../src/components/DetallePuntoModal';
import DrawerMenuModal from '../../src/components/DrawerMenuModal';

const VERDE_N = '#075E54';
const VERDE_B = '#128C7E';
const BLANCO = '#FFFFFF';
const TINTA = '#1C1C1E';
const GRIS = '#64748B';
const GRIS_CLARO = '#F1F5F9';

// Coordenadas Iquitos Centro
const IQUITOS = {
  latitude: -3.749,
  longitude: -73.244,
  latitudeDelta: 0.16,
  longitudeDelta: 0.16,
};

const CATEGORIAS = [
  { key: 'todas', label: 'Todos' },
  { key: 'turistico', label: 'Turístico' },
  { key: 'gastronomico', label: 'Gastronomía' },
  { key: 'deportivo', label: 'Deportivo/Extremo' },
  { key: 'recreativo', label: 'Recreativo/Familiar' },
];

// Función de normalización robusta: quita acentos, convierte a minúsculas y quita caracteres especiales
// Servidores OSRM públicos por modo de transporte
const OSRM = {
  auto: 'https://routing.openstreetmap.de/routed-car/route/v1/driving',
  pie: 'https://routing.openstreetmap.de/routed-foot/route/v1/foot',
};

function formatearDuracion(seg) {
  const min = Math.round(seg / 60);
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)} h ${min % 60} min`;
}

function formatearDistancia(m) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

function normalizar(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes (á->a, é->e, etc.)
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function MapaExploracionScreen() {
  const router = useRouter();
  const mapRef = useRef(null);

  const [puntos, setPuntos] = useState(obtenerPuntos());
  const [categoria, setCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [destino, setDestino] = useState(null);
  const [modoRuta, setModoRuta] = useState('pie');
  const [ruta, setRuta] = useState(null); // { coords, distancia, duracion }
  const [cargandoRuta, setCargandoRuta] = useState(false);

  useEffect(() => {
    if (!destino) return;
    let cancelado = false;
    (async () => {
      setCargandoRuta(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Ubicación', 'Necesitamos tu ubicación para trazar la ruta.');
          return;
        }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const { latitude, longitude } = pos.coords;
        const url = `${OSRM[modoRuta]}/${longitude},${latitude};${destino.lng},${destino.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (cancelado) return;
        if (!data.routes || data.routes.length === 0) {
          Alert.alert('Ruta', 'No se encontró una ruta hacia este lugar.');
          setRuta(null);
          return;
        }
        const r = data.routes[0];
        const coords = r.geometry.coordinates.map(([lng, lat]) => ({ latitude: lat, longitude: lng }));
        setRuta({ coords, distancia: r.distance, duracion: r.duration });
        mapRef.current?.fitToCoordinates(coords, {
          edgePadding: { top: 220, right: 50, bottom: 220, left: 50 },
          animated: true,
        });
      } catch (e) {
        if (!cancelado) Alert.alert('Ruta', 'No se pudo calcular la ruta. Revisa tu conexión.');
      } finally {
        if (!cancelado) setCargandoRuta(false);
      }
    })();
    return () => { cancelado = true; };
  }, [destino, modoRuta]);

  const cerrarRuta = () => {
    setDestino(null);
    setRuta(null);
  };

  useEffect(() => {
    const desuscribir = suscribirPuntos((nuevosPuntos) => {
      setPuntos(nuevosPuntos);
    });
    return desuscribir;
  }, []);

  const q = normalizar(busqueda);

  // Filtrado de puntos y calles
  const puntosFiltrados = puntos.filter((p) => {
    const okCat = categoria === 'todas' || p.categoria === categoria;
    if (!q) return okCat;

    const textoNombre = normalizar(p.nombre);
    const textoCalle = normalizar(p.calle || '');
    const textoDireccion = normalizar(p.direccion || '');
    const textoSub = normalizar(p.subcategoria || '');
    const textoDesc = normalizar(p.descripcionCorta || '');

    const coincide =
      textoNombre.includes(q) ||
      textoCalle.includes(q) ||
      textoDireccion.includes(q) ||
      textoSub.includes(q) ||
      textoDesc.includes(q);

    return okCat && coincide;
  });

  // Función para mover la cámara del mapa al punto o calle seleccionado estilo Google Maps
  const enfocarPunto = (punto) => {
    Keyboard.dismiss();
    setMostrarResultados(false);
    setPuntoSeleccionado(punto);
    setDestino(punto);

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: punto.lat,
          longitude: punto.lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        },
        1000
      );
    }
  };

  const ejecutarBusqueda = () => {
    Keyboard.dismiss();
    if (puntosFiltrados.length > 0) {
      // Llevar automáticamente al primer resultado coincidente
      enfocarPunto(puntosFiltrados[0]);
    }
  };

  const abrirDetalle = (punto) => {
    setPuntoSeleccionado(punto);
    setModalDetalleVisible(true);
  };

  const getMarkerColor = (p) => {
    switch (p.categoria) {
      case 'gastronomico':
        return '#EA580C'; // Naranja
      case 'deportivo':
        return '#E11D48'; // Rojo carmín
      case 'recreativo':
        return '#2563EB'; // Azul
      default:
        return VERDE_B; // Verde selva
    }
  };

  return (
    <View style={styles.contenedor}>
      {/* Mapa en Pantalla Completa con referencia de cámara */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={IQUITOS}
        showsUserLocation
        showsMyLocationButton
        onPress={() => setMostrarResultados(false)}
      >
        {puntosFiltrados.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            title={p.nombre}
            description={p.direccion || p.descripcionCorta}
            pinColor={getMarkerColor(p)}
            onPress={() => abrirDetalle(p)}
          />
        ))}
        {ruta && (
          <Polyline
            coordinates={ruta.coords}
            strokeColor={modoRuta === 'pie' ? '#2563EB' : VERDE_N}
            strokeWidth={5}
            lineDashPattern={modoRuta === 'pie' ? [8, 6] : undefined}
          />
        )}
      </MapView>

      {/* Barra Flotante Superior: Buscador Inteligente tipo Google Maps */}
      <View style={styles.floatingTop}>
        <View style={styles.buscador}>
          {/* Botón Abrir Menú Lateral Drawer */}
          <Pressable onPress={() => setDrawerVisible(true)} style={styles.btnMenuDrawer}>
            <Text style={styles.btnMenuDrawerIcono}>☰</Text>
          </Pressable>

          <TextInput
            value={busqueda}
            onChangeText={(txt) => {
              setBusqueda(txt);
              setMostrarResultados(txt.trim().length > 0);
            }}
            onFocus={() => {
              if (busqueda.trim().length > 0) setMostrarResultados(true);
            }}
            onSubmitEditing={ejecutarBusqueda}
            returnKeyType="search"
            placeholder="Buscar calle (ej: prospero, napo, nauta)..."
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />

          {busqueda.length > 0 && (
            <Pressable
              onPress={() => {
                setBusqueda('');
                setMostrarResultados(false);
              }}
              style={styles.btnClear}
            >
              <Text style={styles.btnClearText}>✕</Text>
            </Pressable>
          )}

          {/* Botón de Buscar para llevar a la dirección */}
          <Pressable onPress={ejecutarBusqueda} style={styles.btnBuscar}>
            <Text style={styles.btnBuscarTexto}>Ir 🔍</Text>
          </Pressable>
        </View>

        {/* Desplegable de Resultados Instantáneos tipo Google Maps */}
        {mostrarResultados && q.length > 0 && (
          <View style={styles.dropdownResultados}>
            <ScrollView
              style={{ maxHeight: 220 }}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={true}
            >
              {puntosFiltrados.length === 0 ? (
                <View style={styles.filaSinResultados}>
                  <Text style={styles.sinResultadosTexto}>
                    No se encontró "{busqueda}". Intenta con otra calle o nombre.
                  </Text>
                </View>
              ) : (
                puntosFiltrados.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => enfocarPunto(item)}
                    style={styles.filaResultado}
                  >
                    <Text style={styles.resultadoIcono}>
                      {item.categoria === 'gastronomico' ? '🍴' : '📍'}
                    </Text>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.resultadoNombre} numberOfLines={1}>
                        {item.nombre}
                      </Text>
                      <Text style={styles.resultadoDireccion} numberOfLines={1}>
                        {item.direccion || item.calle || item.descripcionCorta}
                      </Text>
                    </View>
                    <Text style={styles.resultadoLlevar}>Ir →</Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        )}

        {/* Chips de Categorías con Altura Fija sin Estiramiento */}
        <View style={styles.chipsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20, alignItems: 'center' }}
          >
            {CATEGORIAS.map((c) => {
              const activo = categoria === c.key;
              return (
                <Pressable
                  key={c.key}
                  onPress={() => setCategoria(c.key)}
                  style={[styles.chip, activo && styles.chipActivo]}
                >
                  <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Panel de ruta: modo caminando / auto */}
      {destino && !modalDetalleVisible && (
        <View style={styles.panelRuta}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.rutaTitulo} numberOfLines={1}>Ruta a {destino.nombre}</Text>
            <Pressable onPress={cerrarRuta} style={styles.btnClear}>
              <Text style={styles.btnClearText}>✕</Text>
            </Pressable>
          </View>
          <View style={styles.modosRow}>
            {[{ k: 'pie', l: '🚶 Caminando' }, { k: 'auto', l: '🚗 Auto' }].map((m) => (
              <Pressable
                key={m.k}
                onPress={() => setModoRuta(m.k)}
                style={[styles.chip, modoRuta === m.k && styles.chipActivo]}
              >
                <Text style={[styles.chipTexto, modoRuta === m.k && styles.chipTextoActivo]}>{m.l}</Text>
              </Pressable>
            ))}
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              {cargandoRuta ? (
                <ActivityIndicator color={VERDE_N} />
              ) : ruta ? (
                <Text style={styles.rutaInfo}>
                  {formatearDuracion(ruta.duracion)} · {formatearDistancia(ruta.distancia)}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      )}

      {/* Vista previa rápida al pie si hay selección rápida */}
      {puntoSeleccionado && !modalDetalleVisible && (
        <Pressable
          style={styles.cardPreview}
          onPress={() => setModalDetalleVisible(true)}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.previewCategoria}>
                {puntoSeleccionado.subcategoria || puntoSeleccionado.categoria}
              </Text>
              <Text style={styles.previewRating}>★ {puntoSeleccionado.rating || 4.8}</Text>
            </View>
            <Text style={styles.previewTitulo} numberOfLines={1}>
              {puntoSeleccionado.nombre}
            </Text>
            <Text style={styles.previewDesc} numberOfLines={1}>
              📍 {puntoSeleccionado.direccion || puntoSeleccionado.calle || puntoSeleccionado.descripcionCorta}
            </Text>
          </View>
          <View style={styles.btnVerDetalle}>
            <Text style={styles.btnVerDetalleTexto}>Ver detalle →</Text>
          </View>
        </Pressable>
      )}

      {/* Botón Flotante para recentrar en Iquitos */}
      <View style={styles.floatingCenterBtn}>
        <Pressable
          style={styles.fabBtnCenter}
          onPress={() => {
            if (mapRef.current) {
              mapRef.current.animateToRegion(IQUITOS, 800);
            }
          }}
        >
          <Text style={styles.fabCenterText}>🎯</Text>
        </Pressable>
      </View>

      {/* Botón Flotante Mochila */}
      <View style={styles.floatingBottomRight}>
        <Pressable
          style={styles.fabBtn}
          onPress={() => router.push('/(tabs)/mochila')}
        >
          <Text style={styles.fabIcon}>🎒</Text>
        </Pressable>
      </View>

      {/* Bottom Sheet Modal Completo */}
      <DetallePuntoModal
        visible={modalDetalleVisible}
        punto={puntoSeleccionado}
        onClose={() => setModalDetalleVisible(false)}
      />

      {/* Drawer Menú Lateral Modal */}
      <DrawerMenuModal
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        rutaActual="/(tabs)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#E2E8F0',
  },
  floatingTop: {
    position: 'absolute',
    top: 50,
    left: 14,
    right: 14,
  },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BLANCO,
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 52,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 8,
  },
  btnMenuDrawer: {
    padding: 8,
    marginRight: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  btnMenuDrawerIcono: {
    fontSize: 18,
    color: VERDE_N,
    fontWeight: '800',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: TINTA,
    paddingHorizontal: 6,
  },
  btnClear: {
    padding: 6,
  },
  btnClearText: {
    fontSize: 14,
    color: GRIS,
    fontWeight: '700',
  },
  btnBuscar: {
    backgroundColor: VERDE_N,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 4,
  },
  btnBuscarTexto: {
    color: BLANCO,
    fontSize: 12,
    fontWeight: '800',
  },
  // Desplegable de Resultados
  dropdownResultados: {
    backgroundColor: BLANCO,
    borderRadius: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
  filaResultado: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  resultadoIcono: {
    fontSize: 18,
  },
  resultadoNombre: {
    fontSize: 13,
    fontWeight: '700',
    color: TINTA,
  },
  resultadoDireccion: {
    fontSize: 11,
    color: GRIS,
    marginTop: 1,
  },
  resultadoLlevar: {
    fontSize: 12,
    fontWeight: '700',
    color: VERDE_B,
    marginLeft: 8,
  },
  filaSinResultados: {
    padding: 16,
    alignItems: 'center',
  },
  sinResultadosTexto: {
    fontSize: 12,
    color: GRIS,
    textAlign: 'center',
  },
  // Chips
  chipsContainer: {
    height: 46,
    marginTop: 8,
    justifyContent: 'center',
  },
  chip: {
    backgroundColor: BLANCO,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    height: 34,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  chipActivo: {
    backgroundColor: VERDE_N,
  },
  chipTexto: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextoActivo: {
    color: BLANCO,
  },
  cardPreview: {
    position: 'absolute',
    bottom: 25,
    left: 14,
    right: 75,
    backgroundColor: BLANCO,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  previewCategoria: {
    fontSize: 11,
    fontWeight: '700',
    color: VERDE_B,
    textTransform: 'uppercase',
  },
  previewRating: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
    marginLeft: 8,
  },
  previewTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: TINTA,
    marginTop: 2,
  },
  previewDesc: {
    fontSize: 12,
    color: GRIS,
    marginTop: 2,
  },
  btnVerDetalle: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  btnVerDetalleTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: VERDE_N,
  },
  panelRuta: {
    position: 'absolute',
    bottom: 110,
    left: 14,
    right: 75,
    backgroundColor: BLANCO,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  rutaTitulo: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: TINTA,
  },
  modosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rutaInfo: {
    fontSize: 13,
    fontWeight: '800',
    color: VERDE_N,
  },
  floatingCenterBtn: {
    position: 'absolute',
    bottom: 85,
    right: 14,
  },
  fabBtnCenter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BLANCO,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fabCenterText: {
    fontSize: 20,
  },
  floatingBottomRight: {
    position: 'absolute',
    bottom: 25,
    right: 14,
  },
  fabBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: VERDE_N,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
  },
});