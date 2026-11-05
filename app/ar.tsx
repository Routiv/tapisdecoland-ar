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
  const [lockSize, setLockSize] = useState(true);

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
          shininess: 0.05,
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

  const parseSize = (sizeStr: string) => {
    const match = sizeStr.match(/([\d.]+)\s*x\s*([\d.]+)/i);
    if (match) {
      return { width: parseFloat(match[1]), length: parseFloat(match[2]) };
    }
    return { width: 2, length: 3 };
  };

  const baseSize = parseSize(selectedCarpet.size);

  const ARScene = () => {
    const [placed, setPlaced] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [scaleFactor, setScaleFactor] = useState(1);

    const currentScale = lockSize ? 1 : scaleFactor;

    return (
      <ViroARScene>
        <ViroAmbientLight color="#ffffff" intensity={350} />
        <ViroSpotLight
          innerAngle={20}
          outerAngle={70}
          direction={[0, -1, -0.05]}
          position={[0, 4.5, 0]}
          color="#ffffff"
          castsShadow
          shadowMapSize={2048}
        />

        <ViroARPlaneSelector
          minHeight={0.25}
          minWidth={0.25}
          alignment="HorizontalUpward"
          onPlaneSelected={() => setPlaced(true)}
        >
          {placed && (
            <ViroBox
              position={[0, 0.003, 0]}
              scale={[
                baseSize.width * currentScale,
                0.004,
                baseSize.length * currentScale,
              ]}
              rotation={[0, rotation, 0]}
              materials={["carpetMaterial"]}
              dragType="FixedToPlane"
              dragPlane={{
                planePoint: [0, 0, 0],
                planeNormal: [0, 1, 0],
                maxDistance: 10,
              }}
              onRotate={(rotateState, rotationFactor) => {
                if (rotateState === 2) setRotation((prev) => prev + rotationFactor);
              }}
              onPinch={(pinchState, scaleFactor) => {
                if (!lockSize && pinchState === 2) {
                  setScaleFactor((prev) => Math.max(0.5, Math.min(3, prev * scaleFactor)));
                }
              }}
            />
          )}
        </ViroARPlaneSelector>

        {!placed && (
          <ViroText
            text="Scannez le sol puis touchez pour placer"
            position={[0, 0.6, -1.3]}
            style={{ fontSize: 16, color: '#FFFFFF', textAlign: 'center' }}
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

      <TouchableOpacity style={styles.lockBtn} onPress={() => setLockSize(!lockSize)}>
        <Text style={styles.lockText}>{lockSize ? 'Taille réelle' : 'Taille libre'}</Text>
      </TouchableOpacity>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{selectedCarpet.name}</Text>
        <Text style={styles.badgeSub}>{selectedCarpet.size} · Réf. {selectedCarpet.ref}</Text>
        <Text style={styles.hint}>
          {placed
            ? 'Déplacez · Tournez à 2 doigts' + (lockSize ? '' : ' · Pincez pour redimensionner')
            : 'Pointez le sol et touchez pour placer'}
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
  lockBtn: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  lockText: { color: '#FFF', fontWeight: '600', fontSize: 13 },
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
