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
import Icon from '../../src/components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, categoryColors, space, radius, shadow } from '../../src/theme';

// Coordenadas Iquitos Centro
const IQUITOS = {
  latitude: -3.749,
  longitude: -73.244,
  latitudeDelta: 0.16,
  longitudeDelta: 0.16,
};

const CATEGORIAS = [
  { key: 'todas', label: 'Todos', icon: 'apps-outline' },
  { key: 'turistico', label: 'Turismo', icon: 'camera-outline' },
  { key: 'gastronomico', label: 'Gastronomía', icon: 'restaurant-outline' },
  { key: 'deportivo', label: 'Aventura', icon: 'bicycle-outline' },
  { key: 'recreativo', label: 'Familia', icon: 'people-outline' },
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
  const insets = useSafeAreaInsets();

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

  const getMarkerColor = (p) => categoryColors[p.categoria] || colors.primary;

  return (
    <View style={styles.contenedor}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={IQUITOS}
        showsUserLocation
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
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
            strokeColor={modoRuta === 'pie' ? categoryColors.recreativo : colors.primary}
            strokeWidth={4}
            lineDashPattern={modoRuta === 'pie' ? [6, 6] : undefined}
          />
        )}
      </MapView>

      <View style={[styles.floatingTop, { top: insets.top + space.sm }]}>
        <View style={styles.buscador}>
          <Pressable onPress={() => setDrawerVisible(true)} hitSlop={8} style={styles.btnIcono}>
            <Icon name="menu" size={22} color={colors.text} />
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
            placeholder="Buscar lugares o calles"
            placeholderTextColor={colors.textSubtle}
            style={styles.input}
          />

          {busqueda.length > 0 ? (
            <Pressable
              onPress={() => {
                setBusqueda('');
                setMostrarResultados(false);
              }}
              hitSlop={8}
              style={styles.btnIcono}
            >
              <Icon name="close-circle" size={20} color={colors.textSubtle} />
            </Pressable>
          ) : (
            <Pressable onPress={ejecutarBusqueda} hitSlop={8} style={styles.btnIcono}>
              <Icon name="search" size={20} color={colors.textMuted} />
            </Pressable>
          )}
        </View>

        {mostrarResultados && q.length > 0 && (
          <View style={styles.dropdownResultados}>
            <ScrollView style={{ maxHeight: 260 }} keyboardShouldPersistTaps="always">
              {puntosFiltrados.length === 0 ? (
                <View style={styles.filaSinResultados}>
                  <Text style={styles.sinResultadosTexto}>Sin resultados para “{busqueda}”</Text>
                </View>
              ) : (
                puntosFiltrados.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => enfocarPunto(item)}
                    style={({ pressed }) => [styles.filaResultado, pressed && { backgroundColor: colors.surfaceMuted }]}
                  >
                    <View style={styles.resultadoIcono}>
                      <Icon
                        name={item.categoria === 'gastronomico' ? 'restaurant-outline' : 'location-outline'}
                        size={16}
                        color={colors.textMuted}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: space.md }}>
                      <Text style={styles.resultadoNombre} numberOfLines={1}>{item.nombre}</Text>
                      <Text style={styles.resultadoDireccion} numberOfLines={1}>
                        {item.direccion || item.calle || item.descripcionCorta}
                      </Text>
                    </View>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsContainer}
          contentContainerStyle={{ alignItems: 'center', paddingRight: space.lg }}
        >
          {CATEGORIAS.map((c) => {
            const activo = categoria === c.key;
            return (
              <Pressable
                key={c.key}
                onPress={() => setCategoria(c.key)}
                style={[styles.chip, activo && styles.chipActivo]}
              >
                <Icon name={c.icon} size={15} color={activo ? colors.onPrimary : colors.textMuted} />
                <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>{c.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.bottomArea} pointerEvents="box-none">
        <View style={styles.fabColumn} pointerEvents="box-none">
          <Pressable
            style={styles.fab}
            onPress={() => mapRef.current?.animateToRegion(IQUITOS, 800)}
            accessibilityLabel="Centrar mapa"
          >
            <Icon name="locate" size={20} color={colors.text} />
          </Pressable>
        </View>

        {destino && !modalDetalleVisible && (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.rutaTitulo} numberOfLines={1}>Cómo llegar a {destino.nombre}</Text>
              <Pressable onPress={cerrarRuta} hitSlop={10}>
                <Icon name="close" size={20} color={colors.textMuted} />
              </Pressable>
            </View>
            <View style={styles.modosRow}>
              {[
                { k: 'pie', l: 'A pie', i: 'walk-outline' },
                { k: 'auto', l: 'En auto', i: 'car-outline' },
              ].map((m) => {
                const activo = modoRuta === m.k;
                return (
                  <Pressable
                    key={m.k}
                    onPress={() => setModoRuta(m.k)}
                    style={[styles.segmento, activo && styles.segmentoActivo]}
                  >
                    <Icon name={m.i} size={16} color={activo ? colors.primary : colors.textMuted} />
                    <Text style={[styles.segmentoTexto, activo && { color: colors.primary }]}>{m.l}</Text>
                  </Pressable>
                );
              })}
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                {cargandoRuta ? (
                  <ActivityIndicator color={colors.primary} />
                ) : ruta ? (
                  <Text style={styles.rutaInfo}>
                    {formatearDuracion(ruta.duracion)}
                    <Text style={styles.rutaDist}>  ·  {formatearDistancia(ruta.distancia)}</Text>
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        )}

        {puntoSeleccionado && !modalDetalleVisible && (
          <Pressable style={[styles.card, styles.cardPreview]} onPress={() => setModalDetalleVisible(true)}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.previewCategoria, { color: getMarkerColor(puntoSeleccionado) }]}>
                  {puntoSeleccionado.subcategoria || puntoSeleccionado.categoria}
                </Text>
                <Icon name="star" size={12} color={colors.star} style={{ marginLeft: space.sm }} />
                <Text style={styles.previewRating}>{puntoSeleccionado.rating || 4.8}</Text>
              </View>
              <Text style={styles.previewTitulo} numberOfLines={1}>{puntoSeleccionado.nombre}</Text>
              <Text style={styles.previewDesc} numberOfLines={1}>
                {puntoSeleccionado.direccion || puntoSeleccionado.calle || puntoSeleccionado.descripcionCorta}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textSubtle} />
          </Pressable>
        )}
      </View>

      <DetallePuntoModal
        visible={modalDetalleVisible}
        punto={puntoSeleccionado}
        onClose={() => setModalDetalleVisible(false)}
      />

      <DrawerMenuModal
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        rutaActual="/(tabs)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.bg },
  floatingTop: { position: 'absolute', left: space.lg, right: space.lg },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: space.sm,
    height: 50,
    ...shadow.md,
  },
  btnIcono: { padding: space.sm },
  input: { flex: 1, height: 48, fontSize: 16, color: colors.text, paddingHorizontal: space.xs },
  dropdownResultados: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginTop: space.sm,
    overflow: 'hidden',
    ...shadow.md,
  },
  filaResultado: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  resultadoIcono: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultadoNombre: { fontSize: 15, fontWeight: '600', color: colors.text },
  resultadoDireccion: { fontSize: 13, color: colors.textMuted, marginTop: 1 },
  filaSinResultados: { padding: space.lg, alignItems: 'center' },
  sinResultadosTexto: { fontSize: 14, color: colors.textMuted },
  chipsContainer: { marginTop: space.sm, flexGrow: 0 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: space.md,
    height: 34,
    borderRadius: radius.pill,
    marginRight: space.sm,
    ...shadow.sm,
  },
  chipActivo: { backgroundColor: colors.primary },
  chipTexto: { color: colors.text, fontSize: 13, fontWeight: '500' },
  chipTextoActivo: { color: colors.onPrimary, fontWeight: '600' },
  bottomArea: { position: 'absolute', left: space.lg, right: space.lg, bottom: space.lg, gap: space.sm },
  fabColumn: { alignItems: 'flex-end' },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.md,
  },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.lg, ...shadow.md },
  cardPreview: { flexDirection: 'row', alignItems: 'center' },
  previewCategoria: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  previewRating: { fontSize: 12, fontWeight: '600', color: colors.text, marginLeft: 3 },
  previewTitulo: { fontSize: 17, fontWeight: '600', color: colors.text, marginTop: 3 },
  previewDesc: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  rutaTitulo: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text, marginRight: space.sm },
  modosRow: { flexDirection: 'row', alignItems: 'center', marginTop: space.md, gap: space.sm },
  segmento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space.md,
    height: 32,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segmentoActivo: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  segmentoTexto: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
  rutaInfo: { fontSize: 15, fontWeight: '700', color: colors.text },
  rutaDist: { fontSize: 13, fontWeight: '400', color: colors.textMuted },
});
