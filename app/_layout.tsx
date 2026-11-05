import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0A0A0A' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: '#0A0A0A' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Tapis Decoland' }} />
        <Stack.Screen name="ar" options={{ title: 'Visualisation AR', headerShown: false }} />
      </Stack>
    </>
  );
}
