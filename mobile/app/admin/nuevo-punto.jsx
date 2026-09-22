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

const VERDE_N = '#075E54';
const VERDE_B = '#128C7E';
const BLANCO = '#FFFFFF';
const TINTA = '#1C1C1E';
const GRIS = '#64748B';
const LINEA = '#CBD5E1';

export default function NuevoPuntoScreen() {
  const router = useRouter();

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

  const categorias = [
    { key: 'turistico', label: 'Turístico' },
    { key: 'gastronomico', label: 'Gastronómico' },
    { key: 'deportivo', label: 'Deportivo/Extremo' },
    { key: 'recreativo', label: 'Recreativo/Familiar' },
  ];

  const guardarDestino = () => {
    if (!nombre.trim()) {
      Alert.alert('Faltan Datos', 'El nombre del lugar es obligatorio.');
      return;
    }
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum)) {
      Alert.alert('Coordenadas Inválidas', 'Ingresa valores numéricos para Latitud y Longitud.');
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
      '¡Destino Publicado!',
      `"${nombre}" ha sido añadido al mapa y a las guías de la aplicación.`,
      [
        {
          text: 'Ir al Mapa',
          onPress: () => router.push('/(tabs)'),
        },
        {
          text: 'Agregar Otro',
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
    Alert.alert('Foto simulada', `Se adjuntó "selva_foto_${num}.jpg" desde la galería.`);
  };

  return (
    <View style={styles.contenedor}>
      {/* Header con botón Drawer y Volver */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => setDrawerVisible(true)} style={styles.btnMenu}>
            <Text style={styles.btnMenuTexto}>☰</Text>
          </Pressable>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitulo}>🔒 Panel Admin (Nuevo Punto)</Text>
            <Text style={styles.headerSub}>
              Añade puntos turísticos o gastronómicos al mapa
            </Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)')} style={styles.btnVolver}>
            <Text style={styles.btnVolverTexto}>Mapa 🗺️</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Formulario de Registro</Text>

          {/* Nombre */}
          <Text style={styles.label}>Nombre del Lugar *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Mirador de Bellavista Nanay"
            placeholderTextColor="#94A3B8"
            value={nombre}
            onChangeText={setNombre}
          />

          {/* Categoría Selector */}
          <Text style={styles.label}>Categoría Principal *</Text>
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
          <Text style={styles.label}>Subcategoría / Nivel de Precio</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Alta Gama / Intermedio / Popular Vivencial"
            placeholderTextColor="#94A3B8"
            value={subcategoria}
            onChangeText={setSubcategoria}
          />

          {/* Coordenadas */}
          <Text style={styles.label}>Coordenadas GPS (Latitud / Longitud) *</Text>
          <View style={styles.coordsRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <TextInput
                style={styles.input}
                placeholder="Lat: -3.749"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={lat}
                onChangeText={setLat}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.input}
                placeholder="Lng: -73.244"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={lng}
                onChangeText={setLng}
              />
            </View>
          </View>

          {/* Tarifa y Dificultad */}
          <View style={styles.coordsRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Costo / Tarifa</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: S/ 15 entrada"
                placeholderTextColor="#94A3B8"
                value={costo}
                onChangeText={setCosto}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Dificultad</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Fácil / Media"
                placeholderTextColor="#94A3B8"
                value={dificultad}
                onChangeText={setDificultad}
              />
            </View>
          </View>

          {/* Cómo llegar y Distancia */}
          <Text style={styles.label}>Cómo llegar (Medio de transporte)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Mototaxi S/ 5 o peke-peke desde el puerto"
            placeholderTextColor="#94A3B8"
            value={acceso}
            onChangeText={setAcceso}
          />

          <Text style={styles.label}>Distancia referencial</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 14 km Carretera Iquitos-Nauta"
            placeholderTextColor="#94A3B8"
            value={distancia}
            onChangeText={setDistancia}
          />

          {/* Descripción Corta */}
          <Text style={styles.label}>Descripción Corta (Para vista rápida) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Resumen atractivo de 1 o 2 líneas..."
            placeholderTextColor="#94A3B8"
            value={descripcionCorta}
            onChangeText={setDescripcionCorta}
          />

          {/* Descripción Detallada */}
          <Text style={styles.label}>Descripción Detallada / Historia</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Historia completa, biodiversidad, platos recomendados..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={descripcionLarga}
            onChangeText={setDescripcionLarga}
          />

          {/* Recomendaciones de Visita */}
          <Text style={styles.label}>Recomendaciones de Visita / Equipamiento</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ej: Llevar botas impermeables, repelente, efectivo..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            value={recomendaciones}
            onChangeText={setRecomendaciones}
          />

          {/* Teléfono / WhatsApp */}
          <Text style={styles.label}>Teléfono / WhatsApp de Contacto</Text>
          <TextInput
            style={styles.input}
            placeholder="+51 965 842 100"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
          />

          {/* Galería de Fotos Simulada */}
          <Text style={styles.label}>Galería de Fotos del Destino</Text>
          <View style={styles.galeriaBox}>
            {fotosSimuladas.map((f, i) => (
              <View key={i} style={styles.fotoChip}>
                <Text style={styles.fotoChipTexto}>📷 {f}</Text>
              </View>
            ))}
            <Pressable onPress={agregarFotoSimulada} style={styles.btnAgregarFoto}>
              <Text style={styles.btnAgregarFotoTexto}>+ Subir Foto</Text>
            </Pressable>
          </View>

          {/* Botón de Guardado */}
          <Pressable onPress={guardarDestino} style={styles.btnGuardar}>
            <Text style={styles.btnGuardarTexto}>💾 Guardar y Publicar en el Mapa</Text>
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

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1E293B',
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
  btnVolver: {
    backgroundColor: VERDE_B,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnVolverTexto: {
    color: BLANCO,
    fontSize: 12,
    fontWeight: '700',
  },
  headerTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: BLANCO,
  },
  headerSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  card: {
    backgroundColor: BLANCO,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitulo: {
    fontSize: 17,
    fontWeight: '800',
    color: TINTA,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: LINEA,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 14,
    color: TINTA,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  catRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  btnCat: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  btnCatActivo: {
    backgroundColor: VERDE_B,
    borderColor: VERDE_B,
  },
  btnCatTexto: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  btnCatTextoActivo: {
    color: BLANCO,
    fontWeight: '700',
  },
  coordsRow: {
    flexDirection: 'row',
  },
  galeriaBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fotoChip: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  fotoChipTexto: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  btnAgregarFoto: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnAgregarFotoTexto: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '700',
  },
  btnGuardar: {
    backgroundColor: VERDE_N,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: VERDE_N,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnGuardarTexto: {
    color: BLANCO,
    fontSize: 15,
    fontWeight: '800',
  },
});