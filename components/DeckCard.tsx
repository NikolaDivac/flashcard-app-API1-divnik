import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DeckCard = ({ route }) => {
  const { deckId } = route.params;
  const [deck, setDeck] = useState(null);
  const [newCard, setNewCard] = useState({ word: '', meaning: '' });

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const storedDecks = await AsyncStorage.getItem('decks');
        const decks = storedDecks ? JSON.parse(storedDecks) : [];
        const selectedDeck = decks.find((d) => d.id === deckId);
        setDeck(selectedDeck || null);
      } catch (error) {
        console.error('Error fetching deck:', error);
      }
    };

    fetchDeck();
  }, [deckId]);

  const addCard = async () => {
    if (!newCard.word || !newCard.meaning) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Felder aus.');
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
      setNewCard({ word: '', meaning: '' }); // Reset input fields
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const deleteCard = async (cardId) => {
    Alert.alert(
      'Karte löschen',
      'Möchten Sie diese Karte wirklich löschen?',
      [
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            const updatedDeck = {
              ...deck,
              cards: deck.cards.filter((card) => card.id !== cardId),
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
          },
        },
      ]
    );
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onLongPress={() => deleteCard(item.id)}
    >
      <Text style={styles.word}>{item.word}</Text>
      <Text style={styles.meaning}>{item.meaning}</Text>
    </TouchableOpacity>
  );

  if (!deck) {
    return <Text style={styles.loader}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{deck.title}</Text>
      <FlatList
        data={deck.cards || []}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardList}
      />
      <View style={styles.newCardForm}>
        <TextInput
          style={styles.input}
          placeholder="Wort"
          value={newCard.word}
          onChangeText={(text) => setNewCard({ ...newCard, word: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Bedeutung"
          value={newCard.meaning}
          onChangeText={(text) => setNewCard({ ...newCard, meaning: text })}
        />
        <TouchableOpacity style={styles.addButton} onPress={addCard}>
          <Text style={styles.addButtonText}>Erstellen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeckCard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  cardList: { padding: 10 },
  card: { padding: 20, backgroundColor: '#f9f9f9', borderRadius: 10, marginBottom: 10 },
  word: { fontSize: 18, fontWeight: 'bold' },
  meaning: { fontSize: 16, color: '#555' },
  newCardForm: { marginTop: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
  addButton: { backgroundColor: '#6200ee', padding: 15, borderRadius: 5, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});