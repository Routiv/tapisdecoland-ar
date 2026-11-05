import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
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
  },
  {
    id: '2',
    name: 'Tapis Berbère Rouge',
    ref: 'TAP-BER-RED',
    size: '1.60 x 2.30 m',
    texture: 'https://images.pexels.com/photos/28389848/pexels-photo-28389848.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#8B0000',
  },
  {
    id: '3',
    name: 'Moquette Bleue Synthétique',
    ref: 'MOQ-BLU-042',
    size: '4.00 x 4.00 m',
    texture: 'https://images.unsplash.com/photo-1642077912812-6ff69ac639da?w=800',
    color: '#1E3A5F',
  },
  {
    id: '4',
    name: 'Tapis Moderne Graphique',
    ref: 'TAP-MOD-2024',
    size: '2.50 x 3.50 m',
    texture: 'https://images.unsplash.com/photo-1699245111017-658557db0abb?w=800',
    color: '#2C2C2C',
  },
];

export default function Catalog() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Tapis Decoland</Text>
      <Text style={styles.subtitle}>Visualisez votre tapis chez vous en réalité augmentée</Text>

      <FlatList
        data={CARPETS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/ar', params: { carpet: JSON.stringify(item) } })}
            activeOpacity={0.85}
          >
            <Image source={{ uri: item.texture }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.ref}>Réf. {item.ref}</Text>
              <Text style={styles.size}>{item.size}</Text>
              <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  title: { fontSize: 32, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', marginTop: 20 },
  subtitle: { fontSize: 15, color: '#AAAAAA', textAlign: 'center', marginBottom: 24, paddingHorizontal: 20 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  image: { width: 120, height: 120 },
  info: { flex: 1, padding: 16, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginBottom: 4 },
  ref: { fontSize: 13, color: '#888', marginBottom: 2 },
  size: { fontSize: 14, color: '#CCC' },
  colorDot: { width: 16, height: 16, borderRadius: 8, marginTop: 8 },
});
