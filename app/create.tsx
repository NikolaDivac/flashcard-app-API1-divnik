import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const colors = ['#d3f9d8', '#fff9c4', '#d0ebff', '#ffc9c9', '#e599f7'];

export default function CreateDeckScreen() {
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0] || '#ffffff');

  const exampleCards = [
    { question: 'Was ist React Native?', answer: 'Ein Framework zur App-Entwicklung mit JavaScript.' },
    { question: 'Was macht useState?', answer: 'Es speichert lokale Zustände in einer Komponente.' },
    { question: 'Wofür ist AsyncStorage?', answer: 'Zum Speichern von Daten lokal auf dem Gerät.' },
  ];

  const saveDeck = async () => {
    if (title.trim() === '') {
      Alert.alert('Fehler', 'Bitte gib einen Titel ein.');
      return;
    }

    if (title.trim().length < 3) {
      Alert.alert('Fehler', 'Der Titel muss mindestens 3 Zeichen lang sein.');
      return;
    }

    const newDeck = {
      id: Date.now().toString(),
      title,
      color: selectedColor,
      cards: exampleCards,
    };

    try {
      const storedDecks = await AsyncStorage.getItem('decks');
      const decks = storedDecks ? JSON.parse(storedDecks) : [];
      decks.push(newDeck);
      await AsyncStorage.setItem('decks', JSON.stringify(decks));
      try {
        router.push('/');
      } catch (error) {
        console.error('Navigation error:', error);
        Alert.alert('Fehler', 'Navigation fehlgeschlagen.');
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      Alert.alert('Fehler', 'Deck konnte nicht gespeichert werden.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
        <Text style={styles.backButtonText}>Zurück</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Deck erstellen</Text>

      <TextInput
        style={styles.input}
        placeholder="Deck-Name"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.subtitle}>Wähle eine Karten-Farbe aus:</Text>

      <View style={styles.colorContainer}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColor,
            ]}
            onPress={() => setSelectedColor(color)}
            accessibilityLabel={`Farbe auswählen: ${color}`}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveDeck}
        accessibilityLabel="Speichern"
      >
        <Text style={styles.saveButtonText}>Speichern</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#eee9dc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
    color: '#000',
    textAlign: 'center',
    marginTop: 100,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Georgia',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'Verdana',
    color: '#000',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginVertical: 10,
    fontFamily: 'Verdana',
  },
  saveButton: {
    backgroundColor: '#8bc34a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000',
  },
});