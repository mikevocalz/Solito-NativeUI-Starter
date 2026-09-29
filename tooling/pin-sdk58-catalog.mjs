import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../pnpm-workspace.yaml', import.meta.url);

const sdk58 = {
  react: '19.3.0',
  'react-dom': '19.3.0',
  'react-native': '0.88.0-rc.2',
  'react-native-web': '0.21.2',
  expo: '58.0.0-preview.8',
  '@expo/metro-runtime': '58.0.7',
  'expo-asset': '58.0.8',
  'expo-font': '58.0.3',
  'expo-haptics': '58.0.2',
  'expo-image': '58.0.7',
  'expo-document-picker': '58.0.2',
  'expo-image-picker': '58.0.8',
  'expo-glass-effect': '58.0.2',
  'expo-symbols': '58.0.2',
  '@expo/material-symbols': '0.1.1',
  'expo-linking': '58.0.8',
  'expo-router': '58.0.9',
  'expo-splash-screen': '58.0.1',
  'expo-status-bar': '58.0.1',
  'expo-system-ui': '58.0.3',
  '@expo/html-elements': '58.0.2',
  '@expo/ui': '58.0.8',
  'react-native-gesture-handler': '~3.2.1',
  'react-native-reanimated': '4.7.0',
  'react-native-safe-area-context': '~5.9.1',
  'react-native-screens': '~4.28.0',
  'react-native-worklets': '0.13.0',
  typescript: '~6.0.3',
  '@types/react': '~19.3.0',
  'eslint-config-expo': '~58.0.3',
};

const input = await readFile(file, 'utf8');
const output = input
  .split('\n')
  .map((line) => {
    const match = line.match(/^(\s+)(?:"([^"]+)"|([^:\s]+)):\s+(.+)$/);
    if (!match) return line;
    const key = match[2] ?? match[3];
    const pinned = sdk58[key];
    if (!pinned) return line;
    const quoted = match[2] ? `"${key}"` : key;
    return `${match[1]}${quoted}: ${pinned}`;
  })
  .join('\n');

await writeFile(file, output);
