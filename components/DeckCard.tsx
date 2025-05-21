import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

const DeckDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const deckId = route?.params?.deckId || null;

  const [deck, setDeck] = useState(null);
  const [newCard, setNewCard] = useState({ word: '', meaning: '' });
  const [flippedCards, setFlippedCards] = useState({}); // Track flipped state of cards

  useEffect(() => {
    if (!deckId) {
      Alert.alert('Fehler', 'Deck-ID ist nicht vorhanden.');
      if (navigation?.goBack) {
        navigation.goBack(); // Fallback
      }
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
          Alert.alert('Fehler', 'Deck nicht gefunden.');
          if (navigation?.goBack) {
            navigation.goBack(); // Fallback
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden des Decks:', error);
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
      console.error('Fehler beim Hinzufügen der Karte:', error);
    }
  };

  const toggleFlip = (cardId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const deleteDeck = async () => {
    Alert.alert(
      'Deck löschen',
      'Möchten Sie dieses Deck wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              const storedDecks = await AsyncStorage.getItem('decks');
              const decks = storedDecks ? JSON.parse(storedDecks) : [];
              const updatedDecks = decks.filter((d) => d.id !== deckId);
              await AsyncStorage.setItem('decks', JSON.stringify(updatedDecks));
              if (navigation?.goBack) {
                navigation.goBack(); // Zurück zur Startseite
              }
            } catch (error) {
              console.error('Fehler beim Löschen des Decks:', error);
            }
          },
        },
      ]
    );
  };

  if (!deck) {
    return <Text style={styles.loader}>Laden...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{deck.title}</Text>
      <FlatList
        data={deck.cards ?? []}
        renderItem={({ item }) => (
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
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardList}
      />
      {/* New Card Form */}
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
          <Text style={styles.addButtonText}>Neue Karte erstellen</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={deleteDeck}>
        <Text style={styles.deleteButtonText}>Deck löschen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeckDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  cardList: { padding: 10 },
  card: { padding: 20, backgroundColor: '#f9f9f9', borderRadius: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' },
  cardText: { fontSize: 18, fontWeight: 'bold' },
  cardMeaning: { fontSize: 16, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
  addButton: { backgroundColor: '#6200ee', padding: 15, borderRadius: 5, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  deleteButton: { backgroundColor: 'red', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  deleteButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  newCardForm: { marginTop: 20 },
});