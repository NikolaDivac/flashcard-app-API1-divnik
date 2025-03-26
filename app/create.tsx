import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateDeckScreen() {
  const [deckTitle, setDeckTitle] = useState('');
  const [deckColor, setDeckColor] = useState('lightblue'); 

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#ceefff", padding: 20 }}>

      <Text style={styles.title}>Deck erstellen</Text>

      <TextInput
        style={[styles.input, { width: '100%' }]}

        placeholder="Deck Titel eingeben"
        value={deckTitle}
        onChangeText={setDeckTitle}
      />
      <Text style={styles.colorLabel}>Wählen Sie eine Farbe:</Text>
      <View style={styles.colorContainer}>
        <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'lightblue' }]} onPress={() => setDeckColor('lightblue')}>
          <Text style={styles.colorButtonText}>Light Blue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'lightcoral' }]} onPress={() => setDeckColor('lightcoral')}>
          <Text style={styles.colorButtonText}>Light Coral</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'lightpink' }]} onPress={() => setDeckColor('lightpink')}>
          <Text style={styles.colorButtonText}>Light Pink</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'lightgreen' }]} onPress={() => setDeckColor('lightgreen')}>
          <Text style={styles.colorButtonText}>Light Green</Text>
        </TouchableOpacity>
      </View>

        <TouchableOpacity style={[styles.createButton, { backgroundColor: deckColor, width: '100%' }]} onPress={async () => { 

        if (deckTitle.trim() === '') {
            alert('Bitte geben Sie einen Deck Titel ein.');
            return;
        }

        // SSpeichert die neue sachen in async
        const storedDecks = await AsyncStorage.getItem('decks');
        const decks = storedDecks ? JSON.parse(storedDecks) : [];
        const newDeck = { 
          id: decks.length + 1, 
          title: deckTitle, 
          color: deckColor,
          cards: deckTitle === 'Mathe' ? [
            { question: 'Was ist 1+1?', answer: '2' },
            { question: 'Was ist 1+2?', answer: '3' },
            { question: 'Was ist 1+3?', answer: '4' }
          ] : []

        }; // Save color and cards

        decks.push(newDeck);
        await AsyncStorage.setItem('decks', JSON.stringify(decks));
        // Navigate back to home screen or clear input
        setDeckTitle('');
      }}>
        <Text style={styles.createButtonText}>Deck erstellen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '80%',
    paddingHorizontal: 10,
  },
  colorLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'gray',
  },
  colorButtonText: {
    color: 'black', // Text color for visibility
    textAlign: 'center',
  },
    createButton: {
        padding: 15,

    borderRadius: 5,
    marginBottom: 20,
  },
    createButtonText: {
        color: 'white',
        fontSize: 20,

  },
});
