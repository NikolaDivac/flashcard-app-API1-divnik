// app/index.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface Deck {
  id: string;
  title: string;
  color?: string;
  cards: { question: string; answer: string }[];
}

export default function HomeScreen() {
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadDecks = async () => {
        try {
          const storedDecks = await AsyncStorage.getItem('decks');
          if (storedDecks !== null) {
            const decks = JSON.parse(storedDecks);
            setDecks(decks);
            console.log(':mag: Gespeicherte Decks:', JSON.stringify(storedDecks, null, 2));
          } else {
            setDecks([]);
            console.log('Keine Decks gespeichert.');
          }
        } catch (error) {
          console.error('Fehler beim Laden der Decks:', error);
        }
      };
  
      loadDecks();
    }, [])
  );

return (
  <View style={styles.container}>
    <Text style={styles.title}>Willkommen zur Flashcard-App</Text>

    <TouchableOpacity
      style={styles.customButton}
      onPress={() => router.push('/create')}
    >
      <Text style={styles.buttonText}>Deck erstellen</Text>
    </TouchableOpacity>


  <FlatList
  data={decks}
  keyExtractor={(item) => item.id}
  numColumns={2}
  contentContainerStyle={styles.deckContainer}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={[styles.deckCard, { backgroundColor: item.color ?? '#d3f9d8' }]} 
      onPress={() => router.push(`/deck/${item.id}`)}
    >
      <Text style={styles.deckTitle}>{item.title}</Text>
      <Text>{item.cards.length} Karten</Text>
    </TouchableOpacity>
  )}
/>
  </View>
);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#eee9dc',
    
  },

  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Verdana'
  },

  customButton: {
    backgroundColor: '#ccc', 
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    
  },

  button: {
    marginVertical: 10,
    width: '80%',
    fontSize: 16,
    color:'000',
    fontWeight: '500',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    fontFamily: 'Georgia'
  },

  deckContainer: {
    marginTop: 30,
    width: '100%',
  },
  deckCard: {
    width: 160,         
    height: 100,         
    padding: 12,
    borderRadius: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
    color: '#333',
  }
  
});
