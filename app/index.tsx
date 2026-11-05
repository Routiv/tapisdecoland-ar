import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CARPETS = [
  {
    id: '1',
    name: 'Moquette Luxe Grise',
    ref: 'MOQ-GRIS-001',
    size: '2.00 x 3.00 m',
    texture: 'https://images.unsplash.com/photo-1606978805281-840af52adc1c?w=800',
    color: '#4A4A4A',
    type: 'Moquette',
    material: 'Polypropylène',
    price: '45 €/m²',
    available: true,
  },
  {
    id: '2',
    name: 'Tapis Berbère Rouge',
    ref: 'TAP-BER-RED',
    size: '1.60 x 2.30 m',
    texture: 'https://images.pexels.com/photos/28389848/pexels-photo-28389848.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#8B0000',
    type: 'Tapis',
    material: 'Laine',
    price: '189 €',
    available: true,
  },
  {
    id: '3',
    name: 'Moquette Bleue Synthétique',
    ref: 'MOQ-BLU-042',
    size: '4.00 x 4.00 m',
    texture: 'https://images.unsplash.com/photo-1642077912812-6ff69ac639da?w=800',
    color: '#1E3A5F',
    type: 'Moquette',
    material: 'Nylon',
    price: '38 €/m²',
    available: false,
  },
  {
    id: '4',
    name: 'Tapis Moderne Graphique',
    ref: 'TAP-MOD-2024',
    size: '2.50 x 3.50 m',
    texture: 'https://images.unsplash.com/photo-1699245111017-658557db0abb?w=800',
    color: '#2C2C2C',
    type: 'Tapis',
    material: 'Polyester',
    price: '249 €',
    available: true,
  },
];

export default function Catalog() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'Tous' | 'Moquette' | 'Tapis'>('Tous');
  const [selected, setSelected] = useState<any>(null);

  const filtered = CARPETS.filter((c) => {
    const matchQuery = c.name.toLowerCase().includes(query.toLowerCase()) || c.ref.toLowerCase().includes(query.toLowerCase());
    const matchFilter = filter === 'Tous' || c.type === filter;
    return matchQuery && matchFilter;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Tapis Decoland</Text>
      <Text style={styles.subtitle}>Visualisez votre tapis chez vous</Text>

      <TextInput
        style={styles.search}
        placeholder="Nom ou référence magasin"
        placeholderTextColor="#666"
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.filters}>
        {(['Tous', 'Moquette', 'Tapis'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelected(item)}
            activeOpacity={0.85}
          >
            <Image source={{ uri: item.texture }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.ref}>Réf. {item.ref}</Text>
              <Text style={styles.size}>{item.size}</Text>
              <View style={styles.row}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.type}>{item.type}</Text>
                {!item.available && <Text style={styles.unavailable}> · Indisponible</Text>}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!selected} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            {selected && (
              <>
                <Image source={{ uri: selected.texture }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selected.name}</Text>
                <Text style={styles.modalDetail}>Réf. {selected.ref}</Text>
                <Text style={styles.modalDetail}>{selected.size}</Text>
                <Text style={styles.modalDetail}>Matière : {selected.material}</Text>
                <Text style={styles.modalDetail}>Prix : {selected.price}</Text>
                <Text style={styles.modalDetail}>{selected.available ? 'Disponible' : 'Indisponible'}</Text>

                <TouchableOpacity
                  style={styles.arBtn}
                  onPress={() => {
                    setSelected(null);
                    router.push({ pathname: '/ar', params: { carpet: JSON.stringify(selected) } });
                  }}
                >
                  <Text style={styles.arBtnText}>Voir en réalité augmentée</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
                  <Text style={styles.closeText}>Fermer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  title: { fontSize: 32, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', marginTop: 12 },
  subtitle: { fontSize: 15, color: '#AAAAAA', textAlign: 'center', marginBottom: 16, paddingHorizontal: 20 },
  search: {
    backgroundColor: '#1A1A1A',
    color: '#FFF',
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  filters: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1A1A1A' },
  filterBtnActive: { backgroundColor: '#FFFFFF' },
  filterText: { color: '#AAA', fontSize: 13 },
  filterTextActive: { color: '#000', fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  image: { width: 120, height: 120 },
  info: { flex: 1, padding: 16, justifyContent: 'center' },
  name: { fontSize: 17, fontWeight: '600', color: '#FFFFFF', marginBottom: 4 },
  ref: { fontSize: 13, color: '#888', marginBottom: 2 },
  size: { fontSize: 14, color: '#CCC' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  colorDot: { width: 14, height: 14, borderRadius: 7, marginRight: 8 },
  type: { color: '#AAA', fontSize: 12 },
  unavailable: { color: '#FF6B6B', fontSize: 12 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#1A1A1A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#FFF', marginBottom: 8 },
  modalDetail: { fontSize: 15, color: '#CCC', marginBottom: 6 },
  arBtn: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginTop: 16, alignItems: 'center' },
  arBtnText: { color: '#000', fontWeight: '700', fontSize: 16 },
  closeBtn: { marginTop: 12, alignItems: 'center', padding: 12 },
  closeText: { color: '#AAA' },
});
