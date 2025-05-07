import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Card {
  question: string;
  answer: string;
}

interface Deck {
  id: string;
  title: string;
  color?: string;
  cards: Card[];
}

function FlipCard({ question, answer }: Readonly<Card>) {
  const [flipped, setFlipped] = useState(false);

  return (
    <TouchableOpacity onPress={() => setFlipped(!flipped)} style={styles.card}>
      <Text style={styles.cardContent}>
        {flipped ? answer : question}
      </Text>
      <Text style={styles.flipHint}>
        {flipped ? 'Tippe für Frage' : 'Tippe für Antwort'}
      </Text>
    </TouchableOpacity>
  );
}

export default function DeckDetailScreen() {
  const { deckId } = useLocalSearchParams();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeck = async () => {
      try {
        const storedDecks = await AsyncStorage.getItem('decks');
        if (storedDecks) {
          const decks: Deck[] = JSON.parse(storedDecks);
          const selectedDeck = decks.find((d) => d.id === deckId);
          setDeck(selectedDeck || null);
        }
      } catch (error) {
        console.error('Fehler beim Laden:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDeck();
  }, [deckId]);

  const deleteCard = async (cardIndex: number) => {
    if (!deck) return;
    const updatedCards = deck.cards.filter((_, index) => index !== cardIndex);
    const updatedDeck = { ...deck, cards: updatedCards };
    setDeck(updatedDeck);

    try {
      const storedDecks = await AsyncStorage.getItem('decks');
      if (storedDecks) {
        let decks: Deck[] = JSON.parse(storedDecks);
        decks = decks.map((d) => (d.id === deckId ? updatedDeck : d));
        await AsyncStorage.setItem('decks', JSON.stringify(decks));
      }
    } catch (error) {
      console.error('Fehler beim Löschen der Karte:', error);
    }
  };

  const deleteDeck = async () => {
    Alert.alert(
      'Deck löschen',
      'Möchtest du dieses Deck wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              const storedDecks = await AsyncStorage.getItem('decks');
              if (storedDecks) {
                let decks: Deck[] = JSON.parse(storedDecks);
                decks = decks.filter((d) => d.id !== deckId);
                await AsyncStorage.setItem('decks', JSON.stringify(decks));
                router.push('/');
              }
            } catch (error) {
              console.error('Fehler beim Löschen des Decks:', error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Lädt...</Text>
      </View>
    );
  }

  if (!deck) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Deck nicht gefunden.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
          <Text style={styles.backButtonText}>Zurück zur Startseite</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/')}
      >
        <Text style={styles.backButtonText}>Zurück</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteDeckButton}
        onPress={deleteDeck}
      >
        <Text style={styles.deleteDeckButtonText}>Deck löschen</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{deck.title}</Text>

      <FlatList
        data={deck?.cards || []} // Use an empty array if deck.cards is undefined
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View>
            <FlipCard question={item.question} answer={item.answer} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteCard(index)}
            >
              <Text style={styles.deleteButtonText}>Karte löschen</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
    marginTop: 120,
    marginBottom: -100,
    top: -140,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
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
  deleteDeckButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#d63031',
    borderRadius: 8,
  },
  deleteDeckButtonText: {
    color: '#fff',
    fontFamily: 'Verdana',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 160,
  },
  cardContent: {
    fontSize: 16,
    fontFamily: 'Georgia',
    textAlign: 'center',
  },
  flipHint: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: 'Verdana',
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    alignSelf: 'center',
    width: '50%',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontFamily: 'Verdana',
    fontWeight: 'bold',
  },
});