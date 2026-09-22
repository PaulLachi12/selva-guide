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

const VERDE_N = '#075E54';
const VERDE_B = '#128C7E';
const BLANCO = '#FFFFFF';
const TINTA = '#1C1C1E';
const GRIS = '#64748B';
const ROJO = '#DC2626';

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
      titulo: 'Policía de Turismo • Iquitos',
      sub: 'Atención especializada al turista en la ciudad y puerto',
      tel: '(065) 234-222',
      numeroLlamar: '065234222',
      icono: '👮',
      urgente: true,
    },
    {
      titulo: 'Brigada Fluvial y Capitanía de Puerto',
      sub: 'Emergencias en los ríos Amazonas, Itaya y Nanay',
      tel: '+51 962 111 444',
      numeroLlamar: '+51962111444',
      icono: '🚤',
      urgente: true,
    },
    {
      titulo: 'Hospital Regional de Loreto (Urgencias)',
      sub: 'Av. 28 de Julio s/n - Punchana',
      tel: '(065) 251-930',
      numeroLlamar: '065251930',
      icono: '🏥',
      urgente: true,
    },
    {
      titulo: 'Compañía de Bomberos Salvadora Iquitos N° 22',
      sub: 'Emergencias por fuego y rescate urbano',
      tel: '116 / (065) 233-333',
      numeroLlamar: '116',
      icono: '🚒',
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
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => setDrawerVisible(true)} style={styles.btnMenu}>
            <Text style={styles.btnMenuTexto}>☰</Text>
          </Pressable>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitulo}>🚨 Tarifario & Calculadora Táctica</Text>
            <Text style={styles.headerSub}>
              Precios justos de mototaxis y socorro inmediato
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* HERRAMIENTA 1: CALCULADORA INTERACTIVA DE TARIFA */}
        <View style={styles.calcBox}>
          <Text style={styles.calcHeaderTitulo}>🛺 Calculadora de Mototaxi Justo</Text>
          <Text style={styles.calcHeaderSub}>
            Selecciona tu destino para saber exactamente cuánto pagar antes de subirte:
          </Text>

          {/* Rutas frecuentes selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
            {RUTAS_CALCULADORA.map((r) => {
              const act = rutaSeleccionada.id === r.id;
              return (
                <Pressable
                  key={r.id}
                  onPress={() => setRutaSeleccionada(r)}
                  style={[styles.rutaChip, act && styles.rutaChipActivo]}
                >
                  <Text style={[styles.rutaChipTexto, act && styles.rutaChipTextoActivo]}>
                    {r.destino}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Tarjeta de Resultado */}
          <View style={styles.resultadoCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.resRuta}>
                {rutaSeleccionada.origen} → <Text style={{ color: VERDE_N, fontWeight: '800' }}>{rutaSeleccionada.destino}</Text>
              </Text>
              <Text style={styles.resVehiculo}>
                Vehículo: {rutaSeleccionada.vehiculo} • Tiempo estimado: {rutaSeleccionada.tiempo}
              </Text>
            </View>
            <View style={styles.precioBox}>
              <Text style={styles.precioMonto}>S/ {precioFinal.toFixed(2)}</Text>
              <Text style={styles.precioLabel}>Tarifa justa</Text>
            </View>
          </View>

          {/* Modificadores: Lluvia y Noche */}
          <View style={styles.switchesRow}>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>🌧️ ¿Está lloviendo torrencial?</Text>
              <Switch
                value={lluviaFuerte}
                onValueChange={setLluviaFuerte}
                trackColor={{ false: '#CBD5E1', true: VERDE_B }}
              />
            </View>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>🌙 ¿Es de noche (pasadas 10 PM)?</Text>
              <Switch
                value={horarioNoche}
                onValueChange={setHorarioNoche}
                trackColor={{ false: '#CBD5E1', true: VERDE_B }}
              />
            </View>
          </View>
        </View>

        {/* HERRAMIENTA 2: CONTACTOS DE EMERGENCIA */}
        <Text style={[styles.seccionTitulo, { marginTop: 22 }]}>
          🚨 Teléfonos de Auxilio Inmediato
        </Text>
        <Text style={styles.seccionNota}>
          Presiona cualquier contacto para llamar de inmediato:
        </Text>

        {telefonosEmergencia.map((item, idx) => (
          <Pressable
            key={idx}
            onPress={() => llamar(item.numeroLlamar)}
            style={[styles.cardEmergencia, item.urgente && styles.cardUrgente]}
          >
            <Text style={styles.iconoEmergencia}>{item.icono}</Text>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.tituloEmergencia}>{item.titulo}</Text>
              <Text style={styles.subEmergencia}>{item.sub}</Text>
              <Text style={styles.telEmergencia}>📞 {item.tel}</Text>
            </View>
            <View style={styles.btnLlamar}>
              <Text style={styles.btnLlamarTexto}>Llamar</Text>
            </View>
          </Pressable>
        ))}

        {/* Tips de Seguridad */}
        <View style={styles.tipBox}>
          <Text style={styles.tipTitulo}>💡 Reglas de Oro en Iquitos:</Text>
          <Text style={styles.tipTexto}>
            • Acuerda el precio <Text style={{ fontWeight: '700' }}>antes de subirte</Text> al mototaxi; en Iquitos no existe taxímetro.
            {'\n'}• Para cruzar el Nanay o Itaya en peke-peke, exige siempre chaleco salvavidas.
            {'\n'}• Si un mototaxi te dice que un lugar "está cerrado" para llevarte a otro, desconfía: casi siempre cobran comisión en el segundo lugar.
          </Text>
        </View>
      </ScrollView>

      {/* Drawer Menú Lateral */}
      <DrawerMenuModal
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        rutaActual="/(tabs)/emergencia"
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
    backgroundColor: '#991B1B', // Rojo táctico de emergencia
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  btnMenu: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  btnMenuTexto: {
    fontSize: 20,
    color: BLANCO,
    fontWeight: '800',
  },
  headerTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: BLANCO,
  },
  headerSub: {
    fontSize: 12,
    color: '#FECACA',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  // Estilos de la Calculadora
  calcBox: {
    backgroundColor: BLANCO,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  calcHeaderTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: TINTA,
  },
  calcHeaderSub: {
    fontSize: 12,
    color: GRIS,
    marginTop: 2,
  },
  rutaChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
  },
  rutaChipActivo: {
    backgroundColor: VERDE_N,
  },
  rutaChipTexto: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  rutaChipTextoActivo: {
    color: BLANCO,
  },
  resultadoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },
  resRuta: {
    fontSize: 13,
    color: TINTA,
  },
  resVehiculo: {
    fontSize: 11,
    color: '#166534',
    marginTop: 3,
  },
  precioBox: {
    alignItems: 'center',
    backgroundColor: BLANCO,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#86EFAC',
    marginLeft: 8,
  },
  precioMonto: {
    fontSize: 18,
    fontWeight: '900',
    color: VERDE_N,
  },
  precioLabel: {
    fontSize: 10,
    color: GRIS,
    fontWeight: '600',
  },
  switchesRow: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  switchLabel: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },

  // Contactos Emergencia
  seccionTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: TINTA,
    marginBottom: 4,
  },
  seccionNota: {
    fontSize: 12,
    color: GRIS,
    marginBottom: 10,
  },
  cardEmergencia: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BLANCO,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  cardUrgente: {
    borderLeftWidth: 5,
    borderLeftColor: ROJO,
  },
  iconoEmergencia: {
    fontSize: 26,
  },
  tituloEmergencia: {
    fontSize: 14,
    fontWeight: '700',
    color: TINTA,
  },
  subEmergencia: {
    fontSize: 11,
    color: GRIS,
    marginTop: 2,
  },
  telEmergencia: {
    fontSize: 12,
    fontWeight: '700',
    color: ROJO,
    marginTop: 3,
  },
  btnLlamar: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnLlamarTexto: {
    color: ROJO,
    fontWeight: '800',
    fontSize: 12,
  },
  tipBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    marginTop: 12,
  },
  tipTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  tipTexto: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
});
