import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { agregarPunto } from '../../src/data/puntosData';
import DrawerMenuModal from '../../src/components/DrawerMenuModal';
import ScreenHeader from '../../src/components/ScreenHeader';
import Icon from '../../src/components/Icon';
import { useTranslation } from 'react-i18next';
import { useTheme, useThemedStyles } from '../../src/context/ThemeContext';

const CATEGORIAS = ['turistico', 'gastronomico', 'deportivo', 'recreativo'];

export default function NuevoPuntoScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(crearEstilos);

  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('turistico');
  const [subcategoria, setSubcategoria] = useState('');
  const [lat, setLat] = useState('-3.749');
  const [lng, setLng] = useState('-73.244');
  const [costo, setCosto] = useState('');
  const [dificultad, setDificultad] = useState('Moderada');
  const [acceso, setAcceso] = useState('');
  const [distancia, setDistancia] = useState('');
  const [descripcionCorta, setDescripcionCorta] = useState('');
  const [descripcionLarga, setDescripcionLarga] = useState('');
  const [recomendaciones, setRecomendaciones] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fotosSimuladas, setFotosSimuladas] = useState(['iquitos_foto_1.jpg', 'iquitos_foto_2.jpg']);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const categorias = CATEGORIAS.map((key) => ({ key, label: t(`admin.cat_${key}`) }));

  const guardarDestino = () => {
    if (!nombre.trim()) {
      Alert.alert(t('admin.faltan_datos'), t('admin.nombre_obligatorio'));
      return;
    }
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum)) {
      Alert.alert(t('admin.coords_invalidas'), t('admin.coords_invalidas_msg'));
      return;
    }

    const nuevo = {
      id: Date.now(),
      nombre: nombre.trim(),
      categoria,
      subcategoria: subcategoria.trim() || 'General',
      lat: latNum,
      lng: lngNum,
      costo: costo.trim() || 'Ingreso libre',
      dificultad,
      acceso: acceso.trim() || 'Mototaxi o peke-peke',
      distancia: distancia.trim() || 'Iquitos',
      descripcionCorta: descripcionCorta.trim() || nombre.trim(),
      descripcionLarga: descripcionLarga.trim() || descripcionCorta.trim() || nombre.trim(),
      recomendaciones: recomendaciones.trim() || 'Llevar repelente y protector solar.',
      telefono: telefono.trim() || '+51965842100',
      audio: `Bienvenidos a ${nombre.trim()}. ${descripcionLarga.trim() || descripcionCorta.trim()}`,
      rating: 5.0,
      resenas: [],
      fotos: fotosSimuladas,
    };

    agregarPunto(nuevo);

    Alert.alert(
      t('admin.publicado'),
      t('admin.publicado_msg', { nombre }),
      [
        {
          text: t('admin.ir_mapa'),
          onPress: () => router.push('/(tabs)'),
        },
        {
          text: t('admin.agregar_otro'),
          onPress: () => {
            setNombre('');
            setSubcategoria('');
            setDescripcionCorta('');
            setDescripcionLarga('');
            setRecomendaciones('');
            setCosto('');
            setAcceso('');
            setDistancia('');
            setTelefono('');
          },
        },
      ]
    );
  };

  const agregarFotoSimulada = () => {
    const num = fotosSimuladas.length + 1;
    setFotosSimuladas([...fotosSimuladas, `selva_foto_${num}.jpg`]);
    Alert.alert(t('admin.foto_simulada'), t('admin.foto_adjuntada', { archivo: `selva_foto_${num}.jpg` }));
  };

  return (
    <View style={styles.contenedor}>
      {/* Header con botón Drawer y Volver */}
      <View style={styles.header}>
        <ScreenHeader embedded title={t('admin.titulo')} subtitle={t('admin.subtitulo')} onMenu={() => setDrawerVisible(true)} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>{t('admin.formulario')}</Text>

          {/* Nombre */}
          <Text style={styles.label}>{t('admin.nombre')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('admin.ph_nombre')}
            placeholderTextColor={colors.textSubtle}
            value={nombre}
            onChangeText={setNombre}
          />

          {/* Categoría Selector */}
          <Text style={styles.label}>{t('admin.categoria')}</Text>
          <View style={styles.catRow}>
            {categorias.map((c) => {
              const act = categoria === c.key;
              return (
                <Pressable
                  key={c.key}
                  onPress={() => setCategoria(c.key)}
                  style={[styles.btnCat, act && styles.btnCatActivo]}
                >
                  <Text style={[styles.btnCatTexto, act && styles.btnCatTextoActivo]}>
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Subcategoría / Nivel de Precio */}
          <Text style={styles.label}>{t('admin.subcategoria')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('admin.ph_subcategoria')}
            placeholderTextColor={colors.textSubtle}
            value={subcategoria}
            onChangeText={setSubcategoria}
          />

          {/* Coordenadas */}
          <Text style={styles.label}>{t('admin.coordenadas')}</Text>
          <View style={styles.coordsRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <TextInput
                style={styles.input}
                placeholder={t('admin.ph_lat')}
                placeholderTextColor={colors.textSubtle}
                keyboardType="numeric"
                value={lat}
                onChangeText={setLat}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.input}
                placeholder={t('admin.ph_lng')}
                placeholderTextColor={colors.textSubtle}
                keyboardType="numeric"
                value={lng}
                onChangeText={setLng}
              />
            </View>
          </View>

          {/* Tarifa y Dificultad */}
          <View style={styles.coordsRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>{t('admin.costo')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('admin.ph_costo')}
                placeholderTextColor={colors.textSubtle}
                value={costo}
                onChangeText={setCosto}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{t('admin.dificultad')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('admin.ph_dificultad')}
                placeholderTextColor={colors.textSubtle}
                value={dificultad}
                onChangeText={setDificultad}
              />
            </View>
          </View>

          {/* Cómo llegar y Distancia */}
          <Text style={styles.label}>{t('admin.acceso')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('admin.ph_acceso')}
            placeholderTextColor={colors.textSubtle}
            value={acceso}
            onChangeText={setAcceso}
          />

          <Text style={styles.label}>{t('admin.distancia')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('admin.ph_distancia')}
            placeholderTextColor={colors.textSubtle}
            value={distancia}
            onChangeText={setDistancia}
          />

          {/* Descripción Corta */}
          <Text style={styles.label}>{t('admin.desc_corta')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('admin.ph_desc_corta')}
            placeholderTextColor={colors.textSubtle}
            value={descripcionCorta}
            onChangeText={setDescripcionCorta}
          />

          {/* Descripción Detallada */}
          <Text style={styles.label}>{t('admin.desc_larga')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('admin.ph_desc_larga')}
            placeholderTextColor={colors.textSubtle}
            multiline
            numberOfLines={4}
            value={descripcionLarga}
            onChangeText={setDescripcionLarga}
          />

          {/* Recomendaciones de Visita */}
          <Text style={styles.label}>{t('admin.recomendaciones')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('admin.ph_recomendaciones')}
            placeholderTextColor={colors.textSubtle}
            multiline
            numberOfLines={3}
            value={recomendaciones}
            onChangeText={setRecomendaciones}
          />

          {/* Teléfono / WhatsApp */}
          <Text style={styles.label}>{t('admin.telefono')}</Text>
          <TextInput
            style={styles.input}
            placeholder="+51 965 842 100"
            placeholderTextColor={colors.textSubtle}
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
          />

          {/* Galería de Fotos Simulada */}
          <Text style={styles.label}>{t('admin.galeria')}</Text>
          <View style={styles.galeriaBox}>
            {fotosSimuladas.map((f, i) => (
              <View key={i} style={styles.fotoChip}>
                <Text style={styles.fotoChipTexto}>{f}</Text>
              </View>
            ))}
            <Pressable onPress={agregarFotoSimulada} style={styles.btnAgregarFoto}>
              <Text style={styles.btnAgregarFotoTexto}>{t('admin.subir_foto')}</Text>
            </Pressable>
          </View>

          {/* Botón de Guardado */}
          <Pressable onPress={guardarDestino} style={styles.btnGuardar}>
            <Text style={styles.btnGuardarTexto}>{t('admin.guardar_publicar')}</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Drawer Menú Lateral */}
      <DrawerMenuModal
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        rutaActual="/admin/nuevo-punto"
      />
    </View>
  );
}

const crearEstilos = (colors) => StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.bg, paddingHorizontal: 16, paddingBottom: 8 },
  scroll: { flex: 1 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitulo: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  textArea: { height: 90, textAlignVertical: 'top', paddingTop: 10 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  btnCat: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnCatActivo: { backgroundColor: colors.primary, borderColor: colors.primary },
  btnCatTexto: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  btnCatTextoActivo: { color: colors.onPrimary, fontWeight: '700' },
  coordsRow: { flexDirection: 'row' },
  galeriaBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: colors.bg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fotoChip: { backgroundColor: colors.border, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  fotoChipTexto: { fontSize: 11, color: colors.text, fontWeight: '600' },
  btnAgregarFoto: { backgroundColor: colors.accentSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  btnAgregarFotoTexto: { fontSize: 11, color: colors.accent, fontWeight: '700' },
  btnGuardar: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  btnGuardarTexto: { color: colors.onPrimary, fontSize: 15, fontWeight: '700' },
});
