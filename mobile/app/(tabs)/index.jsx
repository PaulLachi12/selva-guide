import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { pedirUbicacion, ubicacionConcedida } from '../../src/services/permisos';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { obtenerPuntos, suscribirPuntos, tarifaMototaxi } from '../../src/data/puntosData';
import DetallePuntoModal, { textoTarifa } from '../../src/components/DetallePuntoModal';
import DrawerMenuModal from '../../src/components/DrawerMenuModal';
import Icon from '../../src/components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import GlassView from '../../src/components/GlassView';
import { categoryColors, space, radius, shadow } from '../../src/theme';
import { useTranslation } from 'react-i18next';
import { useTheme, useThemedStyles } from '../../src/context/ThemeContext';
import { usePuntoTexto } from '../../src/i18n/contenido';

// Estilo oscuro para Google Maps (Android). En iOS se usa userInterfaceStyle.
const MAPA_OSCURO = [
  { elementType: 'geometry', stylers: [{ color: '#0B141A' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8696A0' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0B141A' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#222D34' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#111B21' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0E2A24' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#202C33' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#111B21' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2A3942' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#AEBAC1' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#182229' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#06232B' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#53BDEB' }] },
];

// Coordenadas Iquitos Centro
const IQUITOS = {
  latitude: -3.749,
  longitude: -73.244,
  latitudeDelta: 0.16,
  longitudeDelta: 0.16,
};

// labelKey: clave i18n existente (categoria_*), se traduce al renderizar
const CATEGORIAS = [
  { key: 'todas', labelKey: 'categoria_todas', icon: 'apps-outline' },
  { key: 'turistico', labelKey: 'categoria_turistico', icon: 'camera-outline' },
  { key: 'gastronomico', labelKey: 'categoria_gastronomico', icon: 'restaurant-outline' },
  { key: 'deportivo', labelKey: 'categoria_deportivo', icon: 'bicycle-outline' },
  { key: 'recreativo', labelKey: 'categoria_recreativo', icon: 'people-outline' },
  { key: 'transporte', labelKey: 'categoria_transporte', icon: 'car-outline' },
];

// Función de normalización robusta: quita acentos, convierte a minúsculas y quita caracteres especiales
// Servidores OSRM públicos por modo de transporte
const OSRM = {
  auto: 'https://routing.openstreetmap.de/routed-car/route/v1/driving',
  pie: 'https://routing.openstreetmap.de/routed-foot/route/v1/foot',
};

// Rutas ya calculadas en esta sesión: clave = origen (~50 m) + destino + modo.
const cacheRutas = new Map();
const claveRuta = (o, d, modo) =>
  [o.latitude, o.longitude, d.lat, d.lng].map((n) => n.toFixed(3)).join(',') + ':' + modo;

// Origen de respaldo si el usuario no comparte su ubicación.
const PLAZA_DE_ARMAS = { latitude: -3.7492, longitude: -73.2439 };

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
  const { t } = useTranslation();
  const tp = usePuntoTexto();
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(crearEstilos);

  const [puntos, setPuntos] = useState(obtenerPuntos());
  const [clima, setClima] = useState(null); // { temp, lluvia, sugerencia }
  const [categoria, setCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [destino, setDestino] = useState(null);
  const modoRuta = 'auto'; // Mototaxi es el único transporte soportado por la app
  const [ruta, setRuta] = useState(null); // { coords, distancia, duracion }
  const [cargandoRuta, setCargandoRuta] = useState(false);
  // La ubicación solo se muestra si el usuario ya la concedió: el mapa nunca la pide al abrir.
  const [ubicacionOk, setUbicacionOk] = useState(false);
  const [origenPlaza, setOrigenPlaza] = useState(false);

  useEffect(() => {
    ubicacionConcedida().then(setUbicacionOk);
  }, []);

  useEffect(() => {
    if (!destino) return;
    let cancelado = false;
    (async () => {
      setCargandoRuta(true);
      try {
        const permitido = await pedirUbicacion();
        if (cancelado) return;
        setUbicacionOk(permitido);
        let origen = PLAZA_DE_ARMAS;
        if (permitido) {
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          origen = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        }
        setOrigenPlaza(!permitido);

        const clave = claveRuta(origen, destino, modoRuta);
        let calculada = cacheRutas.get(clave);
        if (!calculada) {
          const url = `${OSRM[modoRuta]}/${origen.longitude},${origen.latitude};${destino.lng},${destino.lat}?overview=full&geometries=geojson`;
          const res = await fetch(url);
          const data = await res.json();
          if (cancelado) return;
          if (!data.routes || data.routes.length === 0) {
            Alert.alert(t('mapa.ruta'), t('mapa.ruta_no_encontrada'));
            setRuta(null);
            return;
          }
          const r = data.routes[0];
          calculada = {
            coords: r.geometry.coordinates.map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
            distancia: r.distance,
            duracion: r.duration,
          };
          cacheRutas.set(clave, calculada);
        }
        if (cancelado) return;
        const { coords } = calculada;
        setRuta(calculada);
        mapRef.current?.fitToCoordinates(coords, {
          edgePadding: { top: 220, right: 50, bottom: 220, left: 50 },
          animated: true,
        });
      } catch (e) {
        if (!cancelado) Alert.alert(t('mapa.ruta'), t('mapa.ruta_error'));
      } finally {
        if (!cancelado) setCargandoRuta(false);
      }
    })();
    return () => { cancelado = true; };
  }, [destino, modoRuta]);

  const llamarSOS = () => {
    Linking.openURL('tel:+51065231152').catch(() => {
      Alert.alert(t('comun.emergencia'), t('comun.poltur_telefono'));
    });
  };

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

  // Clima en tiempo real (Open-Meteo, sin API key) + sugerencia inteligente para el turista
  useEffect(() => {
    let cancelado = false;
    (async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${IQUITOS.latitude}&longitude=${IQUITOS.longitude}&current=temperature_2m,precipitation,weather_code`;
        const res = await fetch(url);
        const data = await res.json();
        if (cancelado || !data.current) return;
        const lluvia = data.current.precipitation > 0 || (data.current.weather_code >= 51 && data.current.weather_code <= 99);
        setClima({
          temp: Math.round(data.current.temperature_2m),
          lluvia,
        });
      } catch (e) {
        // Sin conexión: no bloquea el uso del mapa, solo se omite el pill de clima
      }
    })();
    return () => { cancelado = true; };
  }, []);

  const q = normalizar(busqueda);

  // Filtrado de puntos y calles
  // useMemo: solo recalcula el filtrado cuando cambian puntos/categoría/búsqueda (evita costo en cada render)
  const puntosFiltrados = useMemo(() => puntos.filter((p) => {
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
  }), [puntos, categoria, q]);

  // Cámara con física de resorte (animateCamera) + padding dinámico para no tapar el pin bajo el sheet
  const enfocarPunto = useCallback((punto) => {
    Keyboard.dismiss();
    setMostrarResultados(false);
    setPuntoSeleccionado(punto);
    setDestino(punto);

    mapRef.current?.animateCamera(
      {
        center: { latitude: punto.lat, longitude: punto.lng },
        zoom: 16,
      },
      { duration: 600 }
    );
  }, []);

  const ejecutarBusqueda = useCallback(() => {
    Keyboard.dismiss();
    if (puntosFiltrados.length > 0) {
      // Llevar automáticamente al primer resultado coincidente
      enfocarPunto(puntosFiltrados[0]);
    }
  }, [puntosFiltrados, enfocarPunto]);

  // "Cómo llegar" desde Rutas/Gastronomía/Reseñas llega como ?destino=<id>
  const { destino: destinoParam } = useLocalSearchParams();
  useEffect(() => {
    if (!destinoParam) return;
    const punto = puntos.find((p) => String(p.id) === String(destinoParam));
    if (punto) {
      enfocarPunto(punto);
      setModalDetalleVisible(true);
    }
    router.setParams({ destino: undefined });
  }, [destinoParam, puntos, enfocarPunto, router]);

  const abrirDetalle = useCallback((punto) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setModalDetalleVisible(false);
    setPuntoSeleccionado(punto);
  }, []);

  // Tap libre en cualquier punto del mapa: fija un destino dinámico y calcula ruta/tarifa en mototaxi
  const seleccionarPuntoMapa = useCallback((coordinate, esLongPress = false) => {
    if (esLongPress) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const puntoMapa = {
      id: `mapa-${coordinate.latitude.toFixed(5)}-${coordinate.longitude.toFixed(5)}`,
      nombre: t('mapa.punto_seleccionado'),
      categoria: 'turistico',
      subcategoria: t('mapa.destino_personalizado'),
      lat: coordinate.latitude,
      lng: coordinate.longitude,
      direccion: `Lat ${coordinate.latitude.toFixed(5)}, Lng ${coordinate.longitude.toFixed(5)}`,
      descripcionCorta: t('mapa.ubicacion_marcada'),
      acceso: t('mapa.acceso_desde_ubicacion'),
    };
    setModalDetalleVisible(false);
    setPuntoSeleccionado(puntoMapa);
    setDestino(puntoMapa);
  }, [t]);

  const getMarkerColor = useCallback((p) => categoryColors[p.categoria] || colors.primary, [colors]);

  return (
    <View style={styles.contenedor}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={IQUITOS}
        showsUserLocation={ubicacionOk}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        userInterfaceStyle={isDark ? 'dark' : 'light'}
        customMapStyle={isDark ? MAPA_OSCURO : []}
        onPress={(e) => {
          Keyboard.dismiss();
          setMostrarResultados(false);
          if (e.nativeEvent.action === 'marker-press') return;
          seleccionarPuntoMapa(e.nativeEvent.coordinate);
        }}
        onLongPress={(e) => seleccionarPuntoMapa(e.nativeEvent.coordinate, true)}
      >
        {puntosFiltrados.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            title={tp(p, 'nombre')}
            description={tp(p, 'direccion') || tp(p, 'descripcionCorta')}
            pinColor={getMarkerColor(p)}
            onPress={() => abrirDetalle(p)}
            tracksViewChanges={false}
          />
        ))}
        {destino && String(destino.id).startsWith('mapa-') && (
          <Marker
            coordinate={{ latitude: destino.lat, longitude: destino.lng }}
            pinColor={colors.accent}
            title={t('mapa.punto_marcado')}
            tracksViewChanges={false}
          />
        )}
        {ruta && (
          <Polyline
            coordinates={ruta.coords}
            strokeColor={colors.primary}
            strokeWidth={4}
          />
        )}
      </MapView>

      <View style={[styles.floatingTop, { top: insets.top + space.sm }]}>
        <View style={styles.filaTop}>
          <View style={styles.buscador}>
            <GlassView style={StyleSheet.absoluteFill} />
            <Pressable onPress={() => setDrawerVisible(true)} hitSlop={8} style={styles.btnIcono} accessibilityLabel={t('comun.abrir_menu')}>
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
              placeholder={t('buscar_placeholder')}
              placeholderTextColor={colors.textSubtle}
              style={styles.input}
            />

            {busqueda.length > 0 ? (
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  setBusqueda('');
                  setMostrarResultados(false);
                }}
                hitSlop={8}
                style={styles.btnIcono}
                accessibilityLabel={t('mapa.limpiar_busqueda')}
              >
                <Icon name="close-circle" size={20} color={colors.textSubtle} />
              </Pressable>
            ) : (
              <Pressable onPress={() => { Keyboard.dismiss(); ejecutarBusqueda(); }} hitSlop={8} style={styles.btnIcono} accessibilityLabel={t('mapa.buscar')}>
                <Icon name="search" size={20} color={colors.textMuted} />
              </Pressable>
            )}
          </View>

          <Pressable onPress={llamarSOS} style={styles.btnSOSFlotante} hitSlop={8} accessibilityLabel={t('mapa.sos_label')}>
            <Text style={styles.btnSOSFlotanteTexto}>🆘</Text>
          </Pressable>
        </View>

        {clima && (
          <View style={styles.climaPill}>
            <GlassView style={StyleSheet.absoluteFill} />
            <Text style={styles.climaTexto}>{clima.temp}°C · {clima.lluvia ? t('mapa.clima_lluvia') : t('mapa.clima_bueno')}</Text>
          </View>
        )}

        {mostrarResultados && q.length > 0 && (
          <View style={styles.dropdownResultados}>
            <ScrollView style={{ maxHeight: 260 }} keyboardShouldPersistTaps="handled">
              {puntosFiltrados.length === 0 ? (
                <View style={styles.filaSinResultados}>
                  <Text style={styles.sinResultadosTexto}>{t('mapa.sin_resultados', { busqueda })}</Text>
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
                      <Text style={styles.resultadoNombre} numberOfLines={1}>{tp(item, 'nombre')}</Text>
                      <Text style={styles.resultadoDireccion} numberOfLines={1}>
                        {tp(item, 'direccion') || item.calle || tp(item, 'descripcionCorta')}
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
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); setCategoria(c.key); }}
                style={[styles.chip, activo && styles.chipActivo]}
              >
                <Icon name={c.icon} size={15} color={activo ? colors.onPrimary : colors.textMuted} />
                <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>{t(c.labelKey)}</Text>
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
            accessibilityLabel={t('mapa.centrar_mapa')}
          >
            <Icon name="locate" size={20} color={colors.text} />
          </Pressable>
        </View>

        {destino && !modalDetalleVisible && (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.rutaTitulo} numberOfLines={1}>{t('mapa.como_llegar_a', { nombre: tp(destino, 'nombre') })}</Text>
              <Pressable onPress={cerrarRuta} hitSlop={10} accessibilityLabel={t('comun.cerrar')}>
                <Icon name="close" size={20} color={colors.textMuted} />
              </Pressable>
            </View>
            <View style={styles.modosRow}>
              <View style={[styles.segmento, styles.segmentoActivo]}>
                <Icon name="car-outline" size={16} color={colors.primary} />
                <Text style={[styles.segmentoTexto, { color: colors.primary }]}>{t('mapa.mototaxi')}</Text>
              </View>
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
            {ruta && (
              <Text style={styles.rutaTarifaLinea}>
                {t('comun.tarifa_estimada_linea', { tarifa: textoTarifa(t, tarifaMototaxi(ruta.distancia)) })}
              </Text>
            )}
            {ruta && origenPlaza && (
              <Text style={styles.rutaNota}>{t('mapa.ruta_desde_plaza')}</Text>
            )}
          </View>
        )}

        {puntoSeleccionado && !modalDetalleVisible && (
          <Pressable style={[styles.card, styles.cardPreview]} onPress={() => setModalDetalleVisible(true)}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.previewCategoria, { color: getMarkerColor(puntoSeleccionado) }]}>
                  {tp(puntoSeleccionado, 'subcategoria') || t(`categoria_${puntoSeleccionado.categoria}`, { defaultValue: puntoSeleccionado.categoria })}
                </Text>
                <Icon name="star" size={12} color={colors.star} style={{ marginLeft: space.sm }} />
                <Text style={styles.previewRating}>{puntoSeleccionado.rating || 4.8}</Text>
              </View>
              <Text style={styles.previewTitulo} numberOfLines={1}>{tp(puntoSeleccionado, 'nombre')}</Text>
              <Text style={styles.previewDesc} numberOfLines={1}>
                {tp(puntoSeleccionado, 'direccion') || puntoSeleccionado.calle || tp(puntoSeleccionado, 'descripcionCorta')}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textSubtle} />
          </Pressable>
        )}
      </View>

      <DetallePuntoModal
        visible={modalDetalleVisible}
        punto={puntoSeleccionado}
        ruta={destino && puntoSeleccionado && destino.id === puntoSeleccionado.id ? ruta : null}
        cargandoRuta={cargandoRuta}
        onComoLlegar={(punto) => setDestino(punto)}
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

const crearEstilos = (colors) => StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.bg },
  floatingTop: { position: 'absolute', left: space.lg, right: space.lg, zIndex: 20, elevation: 20 },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingHorizontal: space.sm,
    height: 50,
    overflow: 'hidden',
    flex: 1,
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
  bottomArea: { position: 'absolute', left: space.lg, right: space.lg, bottom: space.lg, gap: space.sm, zIndex: 10, elevation: 10 },
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
  rutaNota: { fontSize: 12, color: colors.textMuted, marginTop: space.xs },
  rutaTarifaLinea: { fontSize: 13, fontWeight: '700', color: colors.accent, marginTop: space.sm },
  zonaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.md, flexWrap: 'wrap', gap: space.sm },
  zonaBadge: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  filaTop: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginBottom: space.sm },
  btnSOSFlotante: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.md,
  },
  btnSOSFlotanteTexto: { fontSize: 22 },
  climaPill: {
    marginTop: 0,
    marginBottom: space.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
    ...shadow.sm,
  },
  climaTexto: { fontSize: 12, fontWeight: '600', color: colors.text },
});
