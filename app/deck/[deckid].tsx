import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function DeckDetailScreen() {
  const { deckId } = useLocalSearchParams();
  const [deck, setDeck] = useState<{ id: number; title: string; color: string; cards: { question: string; answer: string; }[] } | null>(null);


  useEffect(() => {
    const loadDeck = async () => {
      const storedDecks = await AsyncStorage.getItem('decks');
      const decks = storedDecks ? JSON.parse(storedDecks) : [];
  const foundDeck = decks.find((d: { id: number; title: string; color: string; cards: { question: string; answer: string; }[]; }) => d.id === parseInt(deckId as string));




      setDeck(foundDeck);
    };

    loadDeck();
  }, [deckId]);


  return (
    <View style={{ backgroundColor: "#ceefff", flex: 1, padding: 20 }}>
      {deck && deck.cards ? (



        <>
          <Text style={{ fontSize: 24, textAlign: 'center' }}>Deck Detail: {deck.title}</Text> 

          <FlatList
            data={deck.cards}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ marginVertical: 10 }}>
                <Text style={{ fontSize: 18 }}>Frage: {item.question}</Text>
                <Text style={{ fontSize: 16, color: 'gray' }}>Antwort: {item.answer}</Text>
              </View>
            )}
          />
        </>
      ) : (
        <Text style={{ fontSize: 24, textAlign: 'center' }}>Deck nicht gefunden</Text>
      )}


    </View>
  );
}
