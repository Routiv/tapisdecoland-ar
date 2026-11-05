# Tapis Decoland AR

Application premium de visualisation en réalité augmentée des tapis et moquettes Tapis Decoland.

Le client choisit un tapis (ou saisit une référence) et le place en AR dans son salon pour voir le rendu réel.

## Stack

- Expo SDK 54
- ViroReact (`@reactvision/react-viro`)
- Expo Router
- ARKit (iOS) + ARCore (Android)

## Prérequis

- Appareil physique (ARKit/ARCore ne fonctionne pas en simulateur)
- Development build (pas Expo Go)

## Installation & Build

```bash
git clone https://github.com/Routiv/tapisdecoland-ar.git
cd tapisdecoland-ar
npm install
npx expo prebuild --clean
npx expo run:ios   # ou run:android
```

Ou via EAS :

```bash
npx eas build --platform ios
npx eas build --platform android
```

## Fonctionnalités actuelles

- Catalogue premium (thème sombre)
- Sélection de tapis
- Placement AR sur plan horizontal détecté
- Texture réelle + taille approximative
- Déplacement du tapis

## À faire

- Catalogue dynamique depuis API
- Tailles réelles précises
- Saisie de référence
- Meilleur rendu (PBR, ombres)
- Sauvegarde favoris / partage

---

Fait pour Tapis Decoland — Waterloo
