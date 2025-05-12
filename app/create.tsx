import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CreateDeck = () => {
  const [title, setTitle] = useState('');
  const router = useRouter();

  const saveDeck = async () => {
    if (!title.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie einen Titel für das Deck ein.');
      return;
    }

    const newDeck = {
      id: Date.now().toString(),
      title,
      color: '#87CEFA', // Standardfarbe: Hellblau
      cards: [],
    };

    try {
      const storedDecks = await AsyncStorage.getItem('decks');
      const decks = storedDecks ? JSON.parse(storedDecks) : [];
      decks.push(newDeck);
      await AsyncStorage.setItem('decks', JSON.stringify(decks));
      router.push('/'); // Zurück zur Startseite
    } catch (error) {
      Alert.alert('Fehler', 'Das Deck konnte nicht gespeichert werden. Versuchen Sie es erneut.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Neues Deck erstellen</Text>
      <TextInput
        style={styles.input}
        placeholder="Deck-Titel"
        value={title}
        onChangeText={setTitle}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveDeck}>
        <Text style={styles.saveButtonText}>Deck speichern</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateDeck;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});