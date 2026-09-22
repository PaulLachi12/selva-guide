import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
  TextInput,
  Alert
} from 'react-native';
import * as Speech from 'expo-speech';
import { agregarResenaAPunto } from '../data/puntosData';
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

export default function DetallePuntoModal({ visible, punto, onClose }) {
  const [hablando, setHablando] = useState(false);
  const [modalResena, setModalResena] = useState(false);
  const [nombreAutor, setNombreAutor] = useState('');
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(5);

  if (!punto) return null;

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

  const cerrarTodo = () => {
    Speech.stop();
    setHablando(false);
    onClose();
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
    <Modal visible={visible} animationType="slide" transparent onRequestClose={cerrarTodo}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header Bar */}
          <View style={styles.handleBarContainer}>
            <View style={styles.handleBar} />
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Header Información */}
            <View style={styles.headerInfo}>
              <View style={styles.badgeCategoria}>
                <Text style={styles.badgeTexto}>
                  {punto.subcategoria || punto.categoria.toUpperCase()}
                </Text>
              </View>
              <Pressable onPress={cerrarTodo} style={styles.btnCerrar}>
                <Text style={styles.btnCerrarTexto}>×</Text>
              </Pressable>
            </View>

            <Text style={styles.titulo}>{punto.nombre}</Text>

            {/* Calificación y Dificultad */}
            <View style={styles.metaRow}>
              <Text style={styles.starText}>{punto.rating || 4.8}</Text>
              <Text style={styles.metaDivider}>•</Text>
              <Text style={styles.metaItem}>Dificultad: {punto.dificultad || 'Moderada'}</Text>
              <Text style={styles.metaDivider}>•</Text>
              <Text style={styles.metaItem}>{punto.costo || 'Consultar tarifa'}</Text>
            </View>

            {/* Tarjeta de Audio-Guía */}
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

            {/* Descripción Detallada */}
            <View style={styles.seccion}>
              <Text style={styles.seccionTitulo}>Historia y Descripción</Text>
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
        </View>
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: BLANCO,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    minHeight: '55%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 20,
  },
  handleBarContainer: {
    alignItems: 'center',
    paddingVertical: 10,
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
