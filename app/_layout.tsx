import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

// Polyfill for findNodeHandle on web
if (Platform.OS === 'web') {
  const RN = require('react-native');
  Object.defineProperty(RN, 'findNodeHandle', {
    value: (ref: any) => {
      if (ref && ref.current) {
        return ref.current;
      }
      return ref;
    },
    writable: true,
  });
}

export default function RootLayout() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Stack>
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      </Stack>
    </ApplicationProvider>
  );
}
