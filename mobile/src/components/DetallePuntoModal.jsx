import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
  TextInput,
  Alert,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import GlassView from './GlassView';
import AdminEditModal from './AdminEditModal';
import { agregarResenaAPunto, tarifaMototaxi, esHorarioNocturno } from '../data/puntosData';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import { colors, space, radius, shadow } from '../theme';

const VERDE_N = colors.primary;
const VERDE_B = colors.primary;
const VERDE_A = colors.primary;
const BLANCO = colors.surface;
const TINTA = colors.text;
const GRIS = colors.textMuted;
const GRIS_CLARO = colors.surfaceMuted;
const LINEA = colors.border;

function formatearDuracionModal(seg) {
  const min = Math.round(seg / 60);
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)} h ${min % 60} min`;
}

function formatearDistanciaModal(m) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

const ALTO_PANTALLA = Dimensions.get('window').height;

// Sheet de 3 estados (detents estilo iOS): 90% / 50% / 15% de la pantalla visible.
const SHEET_ALTO = ALTO_PANTALLA * 0.92;
const SNAP_FULL = Math.max(0, SHEET_ALTO - ALTO_PANTALLA * 0.90);
const SNAP_MEDIO = Math.max(0, SHEET_ALTO - ALTO_PANTALLA * 0.50);
const SNAP_MINI = Math.max(0, SHEET_ALTO - ALTO_PANTALLA * 0.15);
const SNAP_CERRADO = SHEET_ALTO;

export default function DetallePuntoModal({ visible, punto, ruta, cargandoRuta, onComoLlegar, onClose }) {
  const [hablando, setHablando] = useState(false);
  const [modalResena, setModalResena] = useState(false);
  const [nombreAutor, setNombreAutor] = useState('');
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(5);
  const [ticketVisible, setTicketVisible] = useState(false);
  const [adminEditVisible, setAdminEditVisible] = useState(false);
  const { esAdmin } = useAuth();

  // Animación de deslizamiento con 3 posiciones (Minimizado / Medio / Desplegado)
  const translateY = useRef(new Animated.Value(SNAP_MEDIO)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(SNAP_CERRADO);
      Animated.spring(translateY, { toValue: SNAP_MEDIO, useNativeDriver: true, bounciness: 2 }).start();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  }, [visible, punto]);

  // Definida aquí (no depende de `punto`) para que el PanResponder de abajo, que solo se crea
  // una vez vía useRef, cierre siempre sobre una función ya inicializada.
  const cerrarTodo = () => {
    Speech.stop();
    setHablando(false);
    onClose?.();
  };

  const irASnap = (valor, cerrar = false) => {
    Animated.spring(translateY, { toValue: valor, useNativeDriver: true, bounciness: cerrar ? 0 : 3 }).start(
      ({ finished }) => {
        if (finished && cerrar && typeof cerrarTodo === 'function') {
          cerrarTodo();
        }
      }
    );
  };

  const cerrarConSlide = () => irASnap(SNAP_CERRADO, true);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dy) > 6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderGrant: () => {
        translateY.stopAnimation();
        translateY.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dy: translateY }], { useNativeDriver: false }),
      onPanResponderRelease: (_e, g) => {
        translateY.flattenOffset();
        const actual = translateY.__getValue ? translateY.__getValue() : 0;
        if (g.dy > 140 || g.vy > 0.9) {
          irASnap(SNAP_CERRADO, true);
          return;
        }
        // Snap al punto más cercano entre FULL / MEDIO / MINI
        const candidatos = [SNAP_FULL, SNAP_MEDIO, SNAP_MINI];
        const destino = candidatos.reduce((mejor, c) =>
          Math.abs(c - actual) < Math.abs(mejor - actual) ? c : mejor
        );
        irASnap(destino);
      },
    })
  ).current;

  if (!punto) return null;

  const tarifaActual = ruta ? tarifaMototaxi(ruta.distancia) : null;

  const alternarAudio = () => {
    if (hablando) {
      Speech.stop();
      setHablando(false);
    } else {
      setHablando(true);
      const texto = punto.audio || `${punto.nombre}. ${punto.descripcionLarga || punto.descripcionCorta}`;
      Speech.speak(texto, {
        language: 'es-PE',
        pitch: 1.0,
        rate: 0.95,
        onDone: () => setHablando(false),
        onStopped: () => setHablando(false),
        onError: () => setHablando(false),
      });
    }
  };


  const llamarSOS = () => {
    Linking.openURL('tel:+51065231152').catch(() => {
      Alert.alert('Emergencia', 'Policía de Turismo de Iquitos (POLTUR): (065) 231152');
    });
  };

  const contactarWhatsApp = () => {
    const telefono = punto.telefono ? punto.telefono.replace(/[^0-9]/g, '') : '51965842100';
    const mensaje = encodeURIComponent(
      `¡Hola! Me comunico desde la app Selva Guía • Iquitos. Quisiera coordinar una visita / reserva para "${punto.nombre}".`
    );
    Linking.openURL(`https://wa.me/${telefono}?text=${mensaje}`).catch(() => {
      Alert.alert('Error', 'No se pudo abrir WhatsApp en este dispositivo.');
    });
  };

  const enviarResena = () => {
    if (!nombreAutor.trim() || !comentario.trim()) {
      Alert.alert('Atención', 'Por favor escribe tu nombre y tu comentario.');
      return;
    }
    agregarResenaAPunto(punto.id, {
      id: Date.now(),
      autor: nombreAutor.trim(),
      rating: estrellas,
      comentario: comentario.trim(),
      fecha: 'Reciente',
    });
    setNombreAutor('');
    setComentario('');
    setEstrellas(5);
    setModalResena(false);
    Alert.alert('¡Gracias!', 'Tu reseña ha sido publicada con éxito.');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={cerrarConSlide}>
      <View style={styles.overlay}>
        <GlassView tint="dark" style={StyleSheet.absoluteFill} pointerEvents="none" />
        <Pressable style={StyleSheet.absoluteFill} onPress={cerrarConSlide} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          {/* Header Bar (arrastrable: swipe down para cerrar, o snap a Mini/Medio/Full) */}
          <GlassView tint="light" style={styles.handleBarContainer} {...panResponder.panHandlers}>
            <View style={styles.handleBar} />
          </GlassView>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Header Información */}
            <View style={styles.headerInfo}>
              <View style={styles.badgeCategoria}>
                <Text style={styles.badgeTexto}>
                  {punto.subcategoria || (punto.categoria ? punto.categoria.toUpperCase() : 'LUGAR')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {esAdmin && (
                  <Pressable onPress={() => setAdminEditVisible(true)} style={styles.fabAdmin}>
                    <Text style={styles.fabAdminTexto}>✏️ Modo Admin</Text>
                  </Pressable>
                )}
                <Pressable onPress={cerrarConSlide} style={styles.btnCerrar} hitSlop={10}>
                  <Text style={styles.btnCerrarTexto}>×</Text>
                </Pressable>
              </View>
            </View>

            <Text style={styles.titulo}>{punto.nombre}</Text>

            {/* Quick Facts: la info clave de un vistazo, sin texto florido */}
            <View style={styles.quickFactsRow}>
              <View style={styles.quickFactChip}>
                <Text style={styles.quickFactTexto}>
                  {ruta ? `⏱️ ${formatearDuracionModal(ruta.duracion)}` : `⏱️ ${punto.distancia || 'Iquitos'}`}
                </Text>
              </View>
              <View style={styles.quickFactChip}>
                <Text style={styles.quickFactTexto}>
                  {tarifaActual ? `💵 ${tarifaActual.etiqueta}` : `💵 ${punto.costo || 'Consultar'}`}
                </Text>
              </View>
              <View style={styles.quickFactChip}>
                <Text style={styles.quickFactTexto}>⭐ {punto.rating || 4.8}</Text>
              </View>
            </View>

            {/* Tarjeta de Audio-Guía: solo sitios turísticos/históricos (Iglesia Matriz, Casa de Fierro,
                Quistococha, Plaza de Armas...), nunca en gastronomía, cafés, terrazas u hoteles */}
            {(punto.categoria === 'turistico' || punto.tieneAudioGuia === true) && (
              <View style={styles.audioCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.audioTitulo}>Audio-guía</Text>
                  <Text style={styles.audioSub}>Narración guiada en voz alta con acento loretano</Text>
                </View>
                <Pressable
                  onPress={alternarAudio}
                  style={[styles.btnAudio, hablando && styles.btnAudioActivo]}
                >
                  <Text style={styles.btnAudioTexto}>
                    {hablando ? '⏸ Detener' : '▶ Escuchar'}
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Cómo llegar y Ubicación */}
            <View style={styles.seccion}>
              <Text style={styles.seccionTitulo}>Cómo llegar & Acceso</Text>
              <Text style={styles.seccionTexto}>
                <Text style={{ fontWeight: '700' }}>Ruta: </Text>
                {punto.acceso || 'Mototaxi o peke-peke'}
              </Text>
              <Text style={styles.seccionTexto}>
                <Text style={{ fontWeight: '700' }}>Distancia / Ubicación: </Text>
                {punto.distancia || 'Iquitos, Loreto'}
              </Text>
            </View>

            {/* Botón "Cómo llegar": dispara cálculo de ruta y tarifa en mototaxi */}
            <Pressable
              onPress={() => onComoLlegar && onComoLlegar(punto)}
              style={styles.btnComoLlegar}
            >
              <Text style={styles.btnComoLlegarTexto}>🛺 Cómo llegar - Ver ruta y tarifa</Text>
            </Pressable>

            <View style={styles.boxMototaxiSeguro}>
              <Text style={styles.mototaxiSeguroTitulo}>Mototaxi Seguro</Text>
              <Text style={styles.mototaxiSeguroTexto}>
                Verifica que la moto tenga placa y calcomanía de empadronamiento visibles, y acuerda la tarifa antes de subir.
              </Text>
              <Pressable onPress={llamarSOS} style={styles.btnSOSModal}>
                <Text style={styles.btnSOSModalTexto}>🆘 SOS / Policía de Turismo de Iquitos</Text>
              </Pressable>
            </View>

            {cargandoRuta && !ruta && (
              <View style={[styles.seccion, styles.boxEstimado]}>
                <Text style={styles.estimadoTitulo}>Calculando ruta y tarifa en Mototaxi…</Text>
              </View>
            )}

            {/* Estimado de viaje en mototaxi */}
            {ruta && (
              <View style={[styles.seccion, styles.boxEstimado]}>
                <Text style={styles.estimadoTitulo}>Tarifa estimada en Mototaxi</Text>
                <Text style={styles.estimadoDato}>
                  {formatearDistanciaModal(ruta.distancia)} · {formatearDuracionModal(ruta.duracion)}
                </Text>
                <Text style={styles.estimadoTarifa}>
                  Tarifa estimada en Mototaxi: {tarifaMototaxi(ruta.distancia).etiquetaCompleta}
                </Text>
                <Text style={styles.estimadoIndicacion}>
                  Ruta recomendada: {punto.acceso || 'consultar con el mototaxista la vía más directa'}.
                </Text>
                <Text style={styles.zonaBadgeModal}>
                  {esHorarioNocturno() ? '⚠️ Precaución de noche: prefiere mototaxis con placa visible.' : '✅ Zona Turística Sugerida'}
                </Text>
                <Pressable
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
                    setTicketVisible(true);
                  }}
                  style={styles.btnTicket}
                >
                  <Text style={styles.btnTicketTexto}>📱 Mostrar tarifa al chofer</Text>
                </Pressable>
              </View>
            )}

            {/* Descripción: texto directo, sin encabezado redundante */}
            <View style={styles.seccion}>
              <Text style={styles.descripcionTexto}>
                {punto.descripcionLarga || punto.descripcionCorta}
              </Text>
            </View>

            {/* Recomendaciones de Campo */}
            {punto.recomendaciones && (
              <View style={[styles.seccion, styles.boxRecomendacion]}>
                <Text style={styles.recomTitulo}>Recomendaciones</Text>
                <Text style={styles.recomTexto}>{punto.recomendaciones}</Text>
              </View>
            )}

            {/* Botón WhatsApp de Acción Directa */}
            <Pressable onPress={contactarWhatsApp} style={styles.btnWhatsApp}>
              <Text style={styles.btnWhatsAppTexto}>
                Consultar por WhatsApp
              </Text>
            </Pressable>

            {/* Sección de Reseñas */}
            <View style={styles.seccionResenas}>
              <View style={styles.resenasHeader}>
                <Text style={styles.seccionTitulo}>⭐ Reseñas de Viajeros</Text>
                <Pressable
                  onPress={() => setModalResena(true)}
                  style={styles.btnEscribirResena}
                >
                  <Text style={styles.btnEscribirTexto}>+ Dejar Reseña</Text>
                </Pressable>
              </View>

              {(!punto.resenas || punto.resenas.length === 0) ? (
                <Text style={styles.sinResenas}>Aún no hay reseñas. ¡Sé el primero en calificar!</Text>
              ) : (
                punto.resenas.map((r) => (
                  <View key={r.id} style={styles.resenaCard}>
                    <View style={styles.resenaTop}>
                      <Text style={styles.resenaAutor}>{r.autor}</Text>
                      <Text style={styles.resenaEstrellas}>{''.repeat(r.rating || 5)}</Text>
                    </View>
                    <Text style={styles.resenaComentario}>{r.comentario}</Text>
                    <Text style={styles.resenaFecha}>{r.fecha || 'Reciente'}</Text>
                  </View>
                ))
              )}
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </Animated.View>
      </View>

      {/* Modal Escribir Reseña */}
      <Modal visible={modalResena} animationType="fade" transparent onRequestClose={() => setModalResena(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Escribir Reseña</Text>
            <Text style={styles.modalSub}>{punto.nombre}</Text>

            <Text style={styles.inputLabel}>Tu Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Marco Polo"
              value={nombreAutor}
              onChangeText={setNombreAutor}
            />

            <Text style={styles.inputLabel}>Calificación</Text>
            <View style={styles.starsSelector}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Pressable key={s} onPress={() => setEstrellas(s)}>
                  <Text style={[styles.starBtn, estrellas >= s && styles.starBtnActive]}></Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLabel}>Comentario / Experiencia</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Cuéntanos qué tal la comida, el acceso, el guía o el precio..."
              multiline
              numberOfLines={4}
              value={comentario}
              onChangeText={setComentario}
            />

            <View style={styles.modalActions}>
              <Pressable onPress={() => setModalResena(false)} style={styles.btnCancelarModal}>
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={enviarResena} style={styles.btnPublicarModal}>
                <Text style={styles.btnPublicarTexto}>Publicar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Boleto digital: tarjeta gigante para mostrar al mototaxista, sin discusiones de tarifa */}
      <Modal visible={ticketVisible} animationType="fade" transparent onRequestClose={() => setTicketVisible(false)}>
        <Pressable style={styles.ticketOverlay} onPress={() => setTicketVisible(false)}>
          <View style={styles.ticketCard}>
            <Text style={styles.ticketRuta}>RUTA A {(punto.nombre || '').toUpperCase()}</Text>
            <Text style={styles.ticketMonto}>
              {tarifaActual ? `S/ ${tarifaActual.min}.00 - S/ ${tarifaActual.max}.00` : 'Consultar tarifa'}
            </Text>
            {tarifaActual && <Text style={styles.ticketUsd}>{tarifaActual.etiquetaUsd}</Text>}
            {tarifaActual?.nocturno && <Text style={styles.ticketNocturno}>Incluye recargo nocturno</Text>}
            <Text style={styles.ticketPie}>Tarifa referencial en Mototaxi · Selva Guía Iquitos</Text>
            <Text style={styles.ticketCerrar}>Toca para cerrar</Text>
          </View>
        </Pressable>
      </Modal>

      <AdminEditModal
        visible={adminEditVisible}
        punto={punto}
        onClose={() => setAdminEditVisible(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: BLANCO,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: SHEET_ALTO,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 20,
  },
  handleBarContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  handleBar: {
    width: 45,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  scroll: {
    paddingHorizontal: 20,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  badgeCategoria: {
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTexto: {
    color: VERDE_N,
    fontSize: 12,
    fontWeight: '700',
  },
  btnCerrar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GRIS_CLARO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCerrarTexto: {
    fontSize: 16,
    color: TINTA,
    fontWeight: '700',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: TINTA,
    marginTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  starText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.star,
  },
  metaDivider: {
    marginHorizontal: 8,
    color: colors.textSubtle,
  },
  metaItem: {
    fontSize: 13,
    color: GRIS,
  },
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderColor: '#C6E7D9',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  audioTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: VERDE_N,
  },
  audioSub: {
    fontSize: 11,
    color: GRIS,
    marginTop: 2,
  },
  btnAudio: {
    backgroundColor: VERDE_B,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  btnAudioActivo: {
    backgroundColor: '#DC2626',
  },
  btnAudioTexto: {
    color: BLANCO,
    fontWeight: '700',
    fontSize: 13,
  },
  seccion: {
    marginBottom: 14,
  },
  seccionTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: TINTA,
    marginBottom: 4,
  },
  seccionTexto: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  descripcionTexto: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  btnComoLlegar: {
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  btnComoLlegarTexto: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  zonaBadgeModal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 8,
  },
  boxMototaxiSeguro: {
    backgroundColor: colors.dangerSoft,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  mototaxiSeguroTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.danger,
    marginBottom: 4,
  },
  mototaxiSeguroTexto: {
    fontSize: 12,
    color: '#7A271A',
    lineHeight: 16,
  },
  btnSOSModal: {
    marginTop: 8,
    backgroundColor: colors.danger,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnSOSModalTexto: {
    color: BLANCO,
    fontWeight: '700',
    fontSize: 12,
  },
  quickFactsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  quickFactChip: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  quickFactTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  btnTicket: {
    marginTop: 10,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnTicketTexto: {
    color: BLANCO,
    fontWeight: '700',
    fontSize: 13,
  },
  ticketOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  ticketCard: {
    backgroundColor: BLANCO,
    borderRadius: 24,
    padding: 28,
    width: '100%',
    alignItems: 'center',
  },
  ticketRuta: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 10,
  },
  ticketMonto: {
    fontSize: 56,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  ticketUsd: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 4,
  },
  ticketNocturno: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.warning,
    marginTop: 8,
  },
  ticketPie: {
    fontSize: 12,
    color: colors.textSubtle,
    marginTop: 20,
    textAlign: 'center',
  },
  ticketCerrar: {
    fontSize: 12,
    color: colors.textSubtle,
    marginTop: 6,
    fontStyle: 'italic',
  },
  fabAdmin: {
    backgroundColor: colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  fabAdminTexto: { fontSize: 11, fontWeight: '700', color: BLANCO },
  boxEstimado: {
    backgroundColor: '#F3EEFA',
    padding: 12,
    borderRadius: 10,
  },
  estimadoTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B4A9E',
    marginBottom: 6,
  },
  estimadoFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimadoDato: {
    fontSize: 13,
    color: '#334155',
  },
  estimadoTarifa: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  estimadoIndicacion: {
    fontSize: 12,
    color: '#475569',
    marginTop: 6,
    lineHeight: 16,
  },
  boxRecomendacion: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 10,
  },
  recomTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 2,
  },
  recomTexto: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
  btnWhatsApp: {
    backgroundColor: VERDE_A,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 12,
    shadowColor: VERDE_A,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  btnWhatsAppTexto: {
    color: BLANCO,
    fontSize: 15,
    fontWeight: '700',
  },
  seccionResenas: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: LINEA,
    paddingTop: 14,
  },
  resenasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  btnEscribirResena: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  btnEscribirTexto: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: '700',
  },
  sinResenas: {
    color: GRIS,
    fontStyle: 'italic',
    fontSize: 13,
    marginVertical: 6,
  },
  resenaCard: {
    backgroundColor: colors.bg,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resenaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resenaAutor: {
    fontSize: 13,
    fontWeight: '700',
    color: TINTA,
  },
  resenaEstrellas: {
    fontSize: 13,
    color: '#EAB308',
  },
  resenaComentario: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
    lineHeight: 18,
  },
  resenaFecha: {
    fontSize: 11,
    color: colors.textSubtle,
    marginTop: 4,
  },

  // Estilos Modal Reseña
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: BLANCO,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 380,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: VERDE_N,
  },
  modalSub: {
    fontSize: 13,
    color: GRIS,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TINTA,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: LINEA,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  starsSelector: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  starBtn: {
    fontSize: 28,
    color: '#CBD5E1',
    marginRight: 8,
  },
  starBtnActive: {
    color: colors.star,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
  },
  btnCancelarModal: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  btnCancelarTexto: {
    color: GRIS,
    fontWeight: '600',
  },
  btnPublicarModal: {
    backgroundColor: VERDE_B,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnPublicarTexto: {
    color: BLANCO,
    fontWeight: '700',
  },
});
