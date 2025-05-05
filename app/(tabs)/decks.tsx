import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';
import * as Haptics from 'expo-haptics';

interface Deck {
  id: string;
  title: string;
  color: string;
}

const DecksScreen = () => {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      const storedDecks = await AsyncStorage.getItem('decks');
      if (storedDecks) {
        const parsedDecks = JSON.parse(storedDecks);
        setDecks(parsedDecks);
      }
    } catch (error) {
      console.error('Error loading decks:', error);
    }
  };

  const handleDeckPress = (deckId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Navigate to the deck detail screen
  };

  const deleteDeck = async (deckId: string) => {
    Alert.alert(
      'Delete Deck',
      'Are you sure you want to delete this deck?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedDecks = decks.filter(deck => deck.id !== deckId);
              await AsyncStorage.setItem('decks', JSON.stringify(updatedDecks));
              setDecks(updatedDecks);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Alert.alert('Success', 'Deck deleted successfully');
            } catch (error) {
              console.error('Error deleting deck:', error);
              Alert.alert('Error', 'Could not delete the deck');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Decks:</Text>
      <FlatList
        data={decks}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleDeckPress(item.id)} style={styles.button}>
            <Text style={styles.buttonText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No decks available.</Text>}
      />
    </View>
  );
};

export default DecksScreen;
