import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';

export default function ModalScreen() {
  return (
    <Screen style={styles.container}>
      <BackButton />
      <ThemedText type="title">Quick Peek</ThemedText>
      <ThemedText type="bodyMuted">This modal is ready for short announcements.</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Return to Play</ThemedText>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  link: {
    paddingVertical: 15,
  },
});
