import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DeckDetail = () => {
  const route = useRoute();
  const { deckId } = route.params;

  const [deck, setDeck] = useState(null);
  const [newCard, setNewCard] = useState({ word: '', meaning: '' });
  const [flippedCards, setFlippedCards] = useState({}); // Track flipped state of cards

  useEffect(() => {
    if (!deckId) {
      Alert.alert('Error', 'Deck ID is missing.');
      return;
    }

    const fetchDeck = async () => {
      try {
        const storedDecks = await AsyncStorage.getItem('decks');
        const decks = storedDecks ? JSON.parse(storedDecks) : [];
        const selectedDeck = decks.find((d) => d.id === deckId);
        if (selectedDeck) {
          setDeck(selectedDeck);
        } else {
          Alert.alert('Error', 'Deck not found.');
        }
      } catch (error) {
        console.error('Error loading deck:', error);
      }
    };

    fetchDeck();
  }, [deckId]);

  const addCard = async () => {
    if (!newCard.word || !newCard.meaning) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    const updatedDeck = {
      ...deck,
      cards: [...(deck.cards || []), { id: Date.now().toString(), ...newCard }],
    };

    setDeck(updatedDeck);

    try {
      const storedDecks = await AsyncStorage.getItem('decks');
      const decks = storedDecks ? JSON.parse(storedDecks) : [];
      const updatedDecks = decks.map((d) => (d.id === deckId ? updatedDeck : d));
      await AsyncStorage.setItem('decks', JSON.stringify(updatedDecks));
      setNewCard({ word: '', meaning: '' });
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const deleteCard = async (cardId) => {
    const updatedDeck = {
      ...deck,
      cards: deck.cards.filter((c) => c.id !== cardId),
    };

    setDeck(updatedDeck);

    try {
      const storedDecks = await AsyncStorage.getItem('decks');
      const decks = storedDecks ? JSON.parse(storedDecks) : [];
      const updatedDecks = decks.map((d) => (d.id === deckId ? updatedDeck : d));
      await AsyncStorage.setItem('decks', JSON.stringify(updatedDecks));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const toggleFlip = (cardId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  if (!deck) {
    return <Text style={styles.loader}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{deck.title}</Text>
      <FlatList
        data={deck.cards ?? []}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => toggleFlip(item.id)} // Flip the card
            >
              {flippedCards[item.id] ? (
                <Text style={styles.cardMeaning}>{item.meaning}</Text>
              ) : (
                <Text style={styles.cardText}>{item.word}</Text>
              )}
            </TouchableOpacity>
            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteCard(item.id)}
            >
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardList}
      />
      {/* New Card Form */}
      <View style={styles.newCardForm}>
        <TextInput
          style={styles.input}
          placeholder="Word"
          value={newCard.word}
          onChangeText={(text) => setNewCard({ ...newCard, word: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Meaning"
          value={newCard.meaning}
          onChangeText={(text) => setNewCard({ ...newCard, meaning: text })}
        />
        <TouchableOpacity style={styles.addButton} onPress={addCard}>
          <Text style={styles.addButtonText}>Add New Card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeckDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  cardList: { padding: 10 },
  cardContainer: { position: 'relative', marginBottom: 10 },
  card: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: { fontSize: 18, fontWeight: 'bold' },
  cardMeaning: { fontSize: 16, color: '#555' },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
  addButton: { backgroundColor: '#6200ee', padding: 15, borderRadius: 5, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  newCardForm: { marginTop: 20 },
});