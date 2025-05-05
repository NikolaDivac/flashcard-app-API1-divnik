import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

const DeckDetailScreen = () => {
  const { deckId } = useLocalSearchParams();
  const router = useRouter();
  const [deck, setDeck] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(true);

  // 📌 Deck und Karten laden
  useEffect(() => {
    const loadDeck = async () => {
      try {
        setLoading(true);
        const storedDecks = await AsyncStorage.getItem('decks');
        const decks = storedDecks ? JSON.parse(storedDecks) : [];
        const foundDeck = decks.find((d: { id: string }) => d.id.toString() === deckId);

        if (foundDeck) {
          setDeck(foundDeck);
          setCards(foundDeck.cards || []);
        }
      } catch (error) {
        console.error('Fehler beim Laden des Decks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDeck();
  }, [deckId]);

  // 📌 Karte hinzufügen und speichern
  const addCard = async () => {
    if (!question || !answer) return;

    const newCard = { question, answer };
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    setQuestion('');
    setAnswer('');

    try {
      const storedDecks = await AsyncStorage.getItem('decks');
      const decks = storedDecks ? JSON.parse(storedDecks) : [];

      const updatedDecks = decks.map((d: any) =>
        d.id.toString() === deckId ? { ...d, cards: updatedCards } : d
      );

      await AsyncStorage.setItem('decks', JSON.stringify(updatedDecks));
    } catch (error) {
      console.error('Fehler beim Speichern der Karte:', error);
    }
  };

  // 📌 Karte umdrehen (Frage → Antwort)
  const toggleCardFlip = (index: number) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // 📌 Zurück zur vorherigen Seite
  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* 🔙 Zurück-Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>⬅ Zurück</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{deck?.title}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={cards}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => toggleCardFlip(index)} style={styles.card}>
              <Text style={styles.cardQuestion}>{flippedCards[index] ? item.answer : item.question}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      )}

      {/* 📝 Neue Karte erstellen */}
      <TextInput
        style={styles.input}
        placeholder="Frage eingeben"
        value={question}
        onChangeText={setQuestion}
      />
      <TextInput
        style={styles.input}
        placeholder="Antwort eingeben"
        value={answer}
        onChangeText={setAnswer}
      />
      <TouchableOpacity style={styles.button} onPress={addCard}>
        <Text style={styles.buttonText}>Frage hinzufügen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#cbd5e1" },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  card: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  cardQuestion: { fontSize: 18, fontWeight: 'bold' },
  backButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  backButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default DeckDetailScreen;