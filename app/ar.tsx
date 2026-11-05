import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroARPlaneSelector,
  ViroBox,
  ViroMaterials,
  ViroAmbientLight,
  ViroSpotLight,
  ViroText,
} from '@reactvision/react-viro';

export default function ARScreen() {
  const { carpet } = useLocalSearchParams();
  const router = useRouter();
  const [selectedCarpet, setSelectedCarpet] = useState<any>(null);

  useEffect(() => {
    if (carpet && typeof carpet === 'string') {
      try {
        setSelectedCarpet(JSON.parse(carpet));
      } catch (e) {
        console.warn('Invalid carpet param');
      }
    }
  }, [carpet]);

  useEffect(() => {
    if (selectedCarpet) {
      ViroMaterials.createMaterials({
        carpetMaterial: {
          diffuseTexture: { uri: selectedCarpet.texture },
          lightingModel: 'Lambert',
          shininess: 0.1,
        },
      });
    }
  }, [selectedCarpet]);

  if (!selectedCarpet) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Chargement...</Text>
      </View>
    );
  }

  // Parse size string like "2.00 x 3.00 m"
  const parseSize = (sizeStr: string) => {
    const match = sizeStr.match(/([\d.]+)\s*x\s*([\d.]+)/i);
    if (match) {
      return { width: parseFloat(match[1]), length: parseFloat(match[2]) };
    }
    return { width: 2, length: 3 };
  };

  const size = parseSize(selectedCarpet.size);

  const ARScene = () => {
    const [placed, setPlaced] = useState(false);

    return (
      <ViroARScene>
        <ViroAmbientLight color="#ffffff" intensity={300} />
        <ViroSpotLight
          innerAngle={15}
          outerAngle={60}
          direction={[0, -1, -0.1]}
          position={[0, 4, 0]}
          color="#ffffff"
          castsShadow
          shadowMapSize={2048}
        />

        <ViroARPlaneSelector
          minHeight={0.3}
          minWidth={0.3}
          alignment="HorizontalUpward"
          onPlaneSelected={() => setPlaced(true)}
        >
          {placed && (
            <ViroBox
              position={[0, 0.002, 0]}
              scale={[size.width, 0.005, size.length]}
              materials={["carpetMaterial"]}
              dragType="FixedToPlane"
              dragPlane={{
                planePoint: [0, 0, 0],
                planeNormal: [0, 1, 0],
                maxDistance: 8,
              }}
            />
          )}
        </ViroARPlaneSelector>

        {!placed && (
          <ViroText
            text="Scannez le sol puis touchez pour placer"
            position={[0, 0.5, -1.2]}
            style={{ fontSize: 18, color: '#FFFFFF', textAlign: 'center' }}
          />
        )}
      </ViroARScene>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator
        initialScene={{ scene: ARScene }}
        style={{ flex: 1 }}
      />
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{selectedCarpet.name}</Text>
        <Text style={styles.badgeSub}>{selectedCarpet.size} · Réf. {selectedCarpet.ref}</Text>
        <Text style={styles.hint}>
          {placed ? 'Déplacez le tapis avec le doigt' : 'Pointez le sol et touchez pour placer'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  loading: { color: '#FFF', fontSize: 18 },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backText: { color: '#FFF', fontWeight: '600' },
  badge: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  badgeText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  badgeSub: { color: '#CCC', fontSize: 13, marginTop: 4 },
  hint: { color: '#AAA', fontSize: 12, marginTop: 8, textAlign: 'center' },
});
