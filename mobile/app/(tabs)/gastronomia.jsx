import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet
} from 'react-native';
import { obtenerPuntos } from '../../src/data/puntosData';
import DetallePuntoModal from '../../src/components/DetallePuntoModal';
import DrawerMenuModal from '../../src/components/DrawerMenuModal';

const VERDE_N = '#075E54';
const VERDE_B = '#128C7E';
const BLANCO = '#FFFFFF';
const TINTA = '#1C1C1E';
const GRIS = '#64748B';
const CREMA = '#F8FAFC';

// Diccionario visual de platos amazónicos
const DICCIONARIO_PLATOS = [
  {
    id: 'juane',
    nombre: 'Juane Tradicional',
    icono: '🫔',
    queEs: 'El plato rey de la Amazonía. Masa de arroz sazonada con palillo, especias, huevo duro y presa de gallina, envuelta y cocida en hojas de bijao.',
    comoComer: 'Se desenvuelve la hoja con la mano y se acompaña con ají de cocona y plátano maduro frito.',
    audacia: 'Fácil (Apto para todos los paladares)',
    precioAprox: 'S/ 7.00 en mercado • S/ 25.00 en restaurante',
  },
  {
    id: 'tacacho',
    nombre: 'Tacacho con Cecina y Chorizo',
    icono: '🥓',
    queEs: 'Bolas de plátano bellaco verde asado o frito majado con manteca de chancho y chicharrón, servido con cecina (cerdo ahumado de monte) y chorizo artesanal loretano.',
    comoComer: 'Desmenuza la cecina y acompáñala con un bocado de tacacho humeante.',
    audacia: 'Fácil (Sabor ahumado irresistible)',
    precioAprox: 'S/ 12.00 a S/ 32.00',
  },
  {
    id: 'paiche',
    nombre: 'Paiche (Arapaima Gigas)',
    icono: '🐟',
    queEs: 'El pez de agua dulce con escamas más grande del mundo. Su carne es blanca, firme, sin espinas pequeñas y de sabor suave y refinado.',
    comoComer: 'A la parrilla, en chicharrón crocante o en cebiche amazónico con ají charapita.',
    audacia: 'Fácil (Experiencia gourmet recomendada)',
    precioAprox: 'S/ 35.00 a S/ 65.00',
  },
  {
    id: 'patarashca',
    nombre: 'Patarashca de Doncella',
    icono: '🌿',
    queEs: 'Pescado amazónico condimentado con sachaculantro (culantro de monte), cebolla y ají dulce, envuelto en hojas de bijao y asado lentamente sobre carbón.',
    comoComer: 'La hoja retiene todos los jugos naturales del pescado sin necesidad de grasa añadida.',
    audacia: 'Fácil y muy saludable',
    precioAprox: 'S/ 10.00 en mercado • S/ 30.00 en restaurante',
  },
  {
    id: 'chonta',
    nombre: 'Ensalada de Chonta (Palmito fresco)',
    icono: '🥗',
    queEs: 'Tiras finas extraídas del corazón de la palmera amazónica. Es fresca, crujiente y se sirve fría con limón, sal y aceite.',
    comoComer: 'La entrada perfecta para contrarrestar el calor húmedo de la selva.',
    audacia: 'Fácil (Ligera y refrescante)',
    precioAprox: 'S/ 15.00 a S/ 25.00',
  },
  {
    id: 'suri',
    nombre: 'Suri a la Brasa',
    icono: '🐛',
    queEs: 'Larva comestible del escarabajo que se cría dentro del tronco del aguaje caído. Es rica en aceites naturales y proteínas.',
    comoComer: 'Se asa en brochetas sobre carbón con un toque de sal. La textura exterior es crocante y por dentro suave, similar al chicharrón de pollo.',
    audacia: 'Extrema (Reto para aventureros)',
    precioAprox: 'S/ 5.00 a S/ 8.00 la brocheta',
  },
  {
    id: 'camucamu',
    nombre: 'Camu Camu & Aguaje',
    icono: '🥤',
    queEs: 'Frutas emblemáticas. El camu camu tiene 40 veces más vitamina C que la naranja; el aguaje es un fruto carnoso de palmera repleto de betacarotenos.',
    comoComer: 'En jugos helados, raspadillas o chupetes artesanales para hidratarse en las tardes.',
    audacia: 'Fácil (100% refrescante)',
    precioAprox: 'S/ 3.00 a S/ 6.00 el vaso helado',
  },
];

export default function GastronomiaScreen() {
  const puntos = obtenerPuntos();
  const gastronomicos = puntos.filter((p) => p.categoria === 'gastronomico');

  const [vistaActual, setVistaActual] = useState('lugares'); // 'lugares' o 'diccionario'
  const [nivelSeleccionado, setNivelSeleccionado] = useState('todos');
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const niveles = [
    { key: 'todos', label: 'Todos los Niveles', icon: '🍲' },
    { key: 'alta', label: 'Alta Gama / Gourmet', icon: '✨' },
    { key: 'intermedio', label: 'Terrazas & Río', icon: '🍹' },
    { key: 'popular', label: 'Popular Vivencial', icon: '🔥' },
  ];

  const filtrados = gastronomicos.filter((p) => {
    if (nivelSeleccionado === 'todos') return true;
    if (nivelSeleccionado === 'alta') return p.subcategoria.includes('Alta Gama');
    if (nivelSeleccionado === 'intermedio') return p.subcategoria.includes('Intermedio');
    if (nivelSeleccionado === 'popular') return p.subcategoria.includes('Popular');
    return true;
  });

  const abrirDetalle = (punto) => {
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
            <Text style={styles.headerTitulo}>🍽️ Guía Gastronómica</Text>
            <Text style={styles.headerSub}>
              Sabores amazónicos por niveles y presupuesto
            </Text>
          </View>
        </View>

        {/* Selector de Pestaña Principal: Lugares vs Diccionario */}
        <View style={styles.tabSelector}>
          <Pressable
            onPress={() => setVistaActual('lugares')}
            style={[styles.tabBtn, vistaActual === 'lugares' && styles.tabBtnActivo]}
          >
            <Text style={[styles.tabBtnTexto, vistaActual === 'lugares' && styles.tabBtnTextoActivo]}>
              🏪 Restaurantes y Puestos
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setVistaActual('diccionario')}
            style={[styles.tabBtn, vistaActual === 'diccionario' && styles.tabBtnActivo]}
          >
            <Text style={[styles.tabBtnTexto, vistaActual === 'diccionario' && styles.tabBtnTextoActivo]}>
              📖 ¿Qué es esto? (Platos)
            </Text>
          </Pressable>
        </View>
      </View>

      {vistaActual === 'lugares' ? (
        <>
          {/* Selector de Niveles con Altura Compacta Natural */}
          <View style={styles.nivelesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}
            >
              {niveles.map((n) => {
                const act = nivelSeleccionado === n.key;
                return (
                  <Pressable
                    key={n.key}
                    onPress={() => setNivelSeleccionado(n.key)}
                    style={[styles.nivelChip, act && styles.nivelChipActivo]}
                  >
                    <Text style={styles.nivelIcon}>{n.icon}</Text>
                    <Text style={[styles.nivelTexto, act && styles.nivelTextoActivo]}>
                      {n.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Lista de Restaurantes Escroleable */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
            showsVerticalScrollIndicator={true}
          >
            {filtrados.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => abrirDetalle(item)}
                style={styles.card}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.badgeNivel}>
                    <Text style={styles.badgeNivelTexto}>{item.subcategoria}</Text>
                  </View>
                  <Text style={styles.ratingText}>★ {item.rating || 4.8}</Text>
                </View>

                <Text style={styles.cardTitulo}>{item.nombre}</Text>
                <Text style={styles.cardDesc}>{item.descripcionCorta}</Text>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                  <Text style={styles.cardCosto}>💵 {item.costo}</Text>
                  <Text style={styles.btnVer}>Ver platos y audio →</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : (
        /* Diccionario Visual de Comida Amazónica Escroleable */
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.introDiccionario}>
            <Text style={styles.introTitulo}>Atrévete a probar la Amazonía</Text>
            <Text style={styles.introSub}>
              Guía táctica para saber qué ordenar en el mercado o restaurante sin sorpresas.
            </Text>
          </View>

          {DICCIONARIO_PLATOS.map((plato) => (
            <View key={plato.id} style={styles.cardPlato}>
              <View style={styles.platoTop}>
                <Text style={styles.platoIcono}>{plato.icono}</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.platoTitulo}>{plato.nombre}</Text>
                  <Text style={styles.platoAudacia}>Audacia: {plato.audacia}</Text>
                </View>
              </View>

              <Text style={styles.platoQueEs}>{plato.queEs}</Text>

              <View style={styles.tipPlato}>
                <Text style={styles.tipPlatoLabel}>💡 Cómo se disfruta:</Text>
                <Text style={styles.tipPlatoTexto}>{plato.comoComer}</Text>
              </View>

              <Text style={styles.platoPrecio}>💰 Precio aprox: {plato.precioAprox}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal de Detalle */}
      <DetallePuntoModal
        visible={modalVisible}
        punto={puntoSeleccionado}
        onClose={() => setModalVisible(false)}
      />

      {/* Drawer Menú Lateral */}
      <DrawerMenuModal
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        rutaActual="/(tabs)/gastronomia"
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
    paddingBottom: 12,
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
    marginTop: 2,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 4,
    marginTop: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActivo: {
    backgroundColor: BLANCO,
  },
  tabBtnTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D1FAE5',
  },
  tabBtnTextoActivo: {
    color: VERDE_N,
    fontWeight: '700',
  },
  nivelesContainer: {
    height: 52,
    backgroundColor: BLANCO,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    justifyContent: 'center',
  },
  nivelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    height: 36,
  },
  nivelChipActivo: {
    backgroundColor: VERDE_B,
  },
  nivelIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  nivelTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  nivelTextoActivo: {
    color: BLANCO,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeNivel: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeNivelTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D97706',
  },
  cardTitulo: {
    fontSize: 17,
    fontWeight: '800',
    color: TINTA,
    marginTop: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: GRIS,
    marginTop: 4,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCosto: {
    fontSize: 12,
    fontWeight: '700',
    color: VERDE_N,
  },
  btnVer: {
    fontSize: 12,
    fontWeight: '700',
    color: VERDE_B,
  },

  // Estilos del Diccionario
  introDiccionario: {
    backgroundColor: '#ECFDF5',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: VERDE_B,
  },
  introTitulo: {
    fontSize: 14,
    fontWeight: '800',
    color: VERDE_N,
  },
  introSub: {
    fontSize: 12,
    color: '#065F46',
    marginTop: 2,
  },
  cardPlato: {
    backgroundColor: BLANCO,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  platoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  platoIcono: {
    fontSize: 32,
  },
  platoTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: TINTA,
  },
  platoAudacia: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '700',
    marginTop: 2,
  },
  platoQueEs: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    marginBottom: 8,
  },
  tipPlato: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tipPlatoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 2,
  },
  tipPlatoTexto: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  platoPrecio: {
    fontSize: 12,
    fontWeight: '700',
    color: VERDE_N,
  },
});
