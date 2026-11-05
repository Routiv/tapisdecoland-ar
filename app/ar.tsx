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

  const ARScene = () => {
    const [placed, setPlaced] = useState(false);

    return (
      <ViroARScene>
        <ViroAmbientLight color="#ffffff" intensity={200} />
        <ViroSpotLight
          innerAngle={5}
          outerAngle={45}
          direction={[0, -1, -0.2]}
          position={[0, 3, 0]}
          color="#ffffff"
          castsShadow
        />

        <ViroARPlaneSelector
          minHeight={0.5}
          minWidth={0.5}
          alignment="HorizontalUpward"
          onPlaneSelected={() => setPlaced(true)}
        >
          {placed && (
            <ViroBox
              position={[0, 0.005, 0]}
              scale={[2, 0.01, 3]}
              materials={["carpetMaterial"]}
              dragType="FixedToPlane"
              dragPlane={{
                planePoint: [0, 0, 0],
                planeNormal: [0, 1, 0],
                maxDistance: 5,
              }}
            />
          )}
        </ViroARPlaneSelector>

        {!placed && (
          <ViroText
            text="Pointez le sol et touchez pour placer le tapis"
            position={[0, 0, -1.5]}
            style={{ fontSize: 20, color: '#FFFFFF' }}
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
        <Text style={styles.badgeSub}>{selectedCarpet.size}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  badgeText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  badgeSub: { color: '#CCC', fontSize: 13, marginTop: 4 },
});
