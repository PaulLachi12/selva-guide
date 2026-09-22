import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  StyleSheet,
  Switch,
  Alert
} from 'react-native';
import DrawerMenuModal from '../../src/components/DrawerMenuModal';
import ScreenHeader from '../../src/components/ScreenHeader';
import Icon from '../../src/components/Icon';
import { colors, space, radius, shadow } from '../../src/theme';

const RUTAS_CALCULADORA = [
  { id: '1', origen: 'Plaza de Armas / Centro', destino: 'Malecón Tarapacá', precioBase: 2.5, tiempo: '3 min', vehiculo: 'Mototaxi' },
  { id: '2', origen: 'Plaza de Armas / Centro', destino: 'Mercado de Belén', precioBase: 2.5, tiempo: '6 min', vehiculo: 'Mototaxi' },
  { id: '3', origen: 'Plaza de Armas / Centro', destino: 'Embarcadero Bellavista Nanay', precioBase: 5.0, tiempo: '12 min', vehiculo: 'Mototaxi' },
  { id: '4', origen: 'Plaza de Armas / Centro', destino: 'Aeropuerto Coronel FAP Secada', precioBase: 13.0, tiempo: '20 min', vehiculo: 'Mototaxi' },
  { id: '5', origen: 'Plaza de Armas / Centro', destino: 'Aeropuerto (Taxi Auto climatizado)', precioBase: 28.0, tiempo: '18 min', vehiculo: 'Taxi Auto' },
  { id: '6', origen: 'Plaza de Armas / Centro', destino: 'Zoológico Quistococha (Carretera)', precioBase: 22.0, tiempo: '35 min', vehiculo: 'Mototaxi' },
  { id: '7', origen: 'Plaza de Armas / Centro', destino: 'Centro CREA (Manatíes)', precioBase: 22.0, tiempo: '30 min', vehiculo: 'Mototaxi' },
  { id: '8', origen: 'Bellavista Nanay', destino: 'Padre Cocha / Serpentario', precioBase: 15.0, tiempo: '15 min río', vehiculo: 'Bote Peke-peke' },
  { id: '9', origen: 'Puerto Belén', destino: 'Paseo Fluvial Venecia Amazónica (x Hora)', precioBase: 25.0, tiempo: '1 hora río', vehiculo: 'Bote Peke-peke' },
];

export default function EmergenciaScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(RUTAS_CALCULADORA[3]); // Por defecto aeropuerto
  const [lluviaFuerte, setLluviaFuerte] = useState(false);
  const [horarioNoche, setHorarioNoche] = useState(false);

  const telefonosEmergencia = [
    {
      titulo: 'Policía de Turismo',
      sub: 'Atención especializada al turista en la ciudad y puerto',
      tel: '(065) 234-222',
      numeroLlamar: '065234222',
      icono: 'shield-checkmark-outline',
      urgente: true,
    },
    {
      titulo: 'Capitanía de Puerto',
      sub: 'Emergencias en los ríos Amazonas, Itaya y Nanay',
      tel: '+51 962 111 444',
      numeroLlamar: '+51962111444',
      icono: 'boat-outline',
      urgente: true,
    },
    {
      titulo: 'Hospital Regional de Loreto',
      sub: 'Av. 28 de Julio s/n - Punchana',
      tel: '(065) 251-930',
      numeroLlamar: '065251930',
      icono: 'medkit-outline',
      urgente: true,
    },
    {
      titulo: 'Bomberos Iquitos N° 22',
      sub: 'Emergencias por fuego y rescate urbano',
      tel: '116 / (065) 233-333',
      numeroLlamar: '116',
      icono: 'flame-outline',
      urgente: false,
    },
  ];

  const llamar = (numero) => {
    Linking.openURL(`tel:${numero}`).catch(() => {
      Alert.alert('Error', `No se pudo marcar al número ${numero}`);
    });
  };

  // Cálculo del precio estimado justo
  let precioFinal = rutaSeleccionada.precioBase;
  if (lluviaFuerte) precioFinal += (rutaSeleccionada.precioBase > 10 ? 2.0 : 1.0);
  if (horarioNoche) precioFinal += 1.0;

  return (
    <View style={styles.contenedor}>
      <ScreenHeader
        title="Ayuda y tarifas"
        subtitle="Precios de referencia y contactos de emergencia"
        onMenu={() => setDrawerVisible(true)}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: space.lg, paddingTop: space.sm, paddingBottom: space.xxl }}>
        <Text style={styles.seccionTitulo}>Tarifa de referencia</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Destino desde {rutaSeleccionada.origen}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: space.sm, marginHorizontal: -space.lg }} contentContainerStyle={{ paddingHorizontal: space.lg }}>
            {RUTAS_CALCULADORA.map((r) => {
              const act = rutaSeleccionada.id === r.id;
              return (
                <Pressable key={r.id} onPress={() => setRutaSeleccionada(r)} style={[styles.chip, act && styles.chipActivo]}>
                  <Text style={[styles.chipTexto, act && styles.chipTextoActivo]}>{r.destino}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.resultado}>
            <View style={{ flex: 1, paddingRight: space.md }}>
              <Text style={styles.resDestino}>{rutaSeleccionada.destino}</Text>
              <View style={styles.metaRow}>
                <Icon name={rutaSeleccionada.vehiculo.includes('Bote') ? 'boat-outline' : 'car-outline'} size={14} color={colors.textMuted} />
                <Text style={styles.meta}>{rutaSeleccionada.vehiculo}</Text>
                <Icon name="time-outline" size={14} color={colors.textMuted} style={{ marginLeft: space.md }} />
                <Text style={styles.meta}>{rutaSeleccionada.tiempo}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.precio}>S/ {precioFinal.toFixed(2)}</Text>
              <Text style={styles.precioLabel}>precio sugerido</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>Lluvia fuerte</Text>
            <Switch value={lluviaFuerte} onValueChange={setLluviaFuerte} trackColor={{ false: colors.border, true: colors.primary }} />
          </View>
          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>Después de las 10 p. m.</Text>
            <Switch value={horarioNoche} onValueChange={setHorarioNoche} trackColor={{ false: colors.border, true: colors.primary }} />
          </View>
        </View>

        <Text style={[styles.seccionTitulo, { marginTop: space.xl }]}>Emergencias</Text>
        <View style={styles.card0}>
          {telefonosEmergencia.map((item, idx) => (
            <Pressable
              key={idx}
              onPress={() => llamar(item.numeroLlamar)}
              style={({ pressed }) => [styles.fila, idx > 0 && styles.filaBorde, pressed && { backgroundColor: colors.surfaceMuted }]}
            >
              <View style={[styles.iconoCirculo, item.urgente && { backgroundColor: colors.dangerSoft }]}>
                <Icon name={item.icono} size={20} color={item.urgente ? colors.danger : colors.textMuted} />
              </View>
              <View style={{ flex: 1, marginLeft: space.md }}>
                <Text style={styles.filaTitulo}>{item.titulo}</Text>
                <Text style={styles.filaSub} numberOfLines={1}>{item.sub}</Text>
                <Text style={styles.filaTel}>{item.tel}</Text>
              </View>
              <View style={styles.btnLlamar}>
                <Icon name="call" size={18} color={colors.onPrimary} />
              </View>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.seccionTitulo, { marginTop: space.xl }]}>Consejos</Text>
        <View style={styles.card}>
          {[
            'Acuerda el precio antes de subir al mototaxi; no usan taxímetro.',
            'En bote peke-peke, pide siempre chaleco salvavidas.',
            'Si te dicen que un lugar “está cerrado” para llevarte a otro, desconfía: suele haber comisión.',
          ].map((t, i) => (
            <View key={i} style={[styles.tip, i > 0 && { marginTop: space.md }]}>
              <Icon name="information-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.tipTexto}>{t}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <DrawerMenuModal
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        rutaActual="/(tabs)/emergencia"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  seccionTitulo: { fontSize: 13, fontWeight: '600', color: colors.textMuted, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: space.sm, marginLeft: space.xs },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.lg, ...shadow.sm },
  card0: { backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden', ...shadow.sm },
  label: { fontSize: 13, color: colors.textMuted },
  chip: { paddingHorizontal: space.md, height: 34, justifyContent: 'center', borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, marginRight: space.sm },
  chipActivo: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTexto: { fontSize: 13, color: colors.text, fontWeight: '500' },
  chipTextoActivo: { color: colors.onPrimary, fontWeight: '600' },
  resultado: { flexDirection: 'row', alignItems: 'center', marginTop: space.lg },
  resDestino: { fontSize: 17, fontWeight: '600', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  meta: { fontSize: 13, color: colors.textMuted, marginLeft: 4 },
  precio: { fontSize: 26, fontWeight: '700', color: colors.primary, letterSpacing: -0.5 },
  precioLabel: { fontSize: 12, color: colors.textMuted },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: space.md },
  switchItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.xs },
  switchLabel: { fontSize: 15, color: colors.text },
  fila: { flexDirection: 'row', alignItems: 'center', padding: space.lg },
  filaBorde: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  iconoCirculo: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  filaTitulo: { fontSize: 15, fontWeight: '600', color: colors.text },
  filaSub: { fontSize: 13, color: colors.textMuted, marginTop: 1 },
  filaTel: { fontSize: 13, fontWeight: '500', color: colors.text, marginTop: 3 },
  btnLlamar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginLeft: space.sm },
  tip: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  tipTexto: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },
});
