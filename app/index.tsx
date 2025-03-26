import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface Deck {
  id: string;
  title: string;
  color: string;
}
export default function HomeScreen() {
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
      console.error('Fehler beim Laden der Decks:', error);
    }
  };
  const handleDeckPress = (deckId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push(`/deck/${deckId}`);
  };
  const deleteDeck = async (deckId: string) => {
    Alert.alert(
      'Deck löschen',
      'Möchtest du dieses Deck wirklich löschen?',
      [
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove the deck from the list
              const updatedDecks = decks.filter(deck => deck.id !== deckId);
              // Save the updated decks back to AsyncStorage
              await AsyncStorage.setItem('decks', JSON.stringify(updatedDecks));
              // Update local state
              setDecks(updatedDecks);
              // Haptic feedback
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              // Optional: Show a confirmation
              Alert.alert('Erfolg', 'Deck wurde gelöscht');
            } catch (error) {
              console.error('Fehler beim Löschen des Decks:', error);
              Alert.alert('Fehler', 'Das Deck konnte nicht gelöscht werden');
            }
          },
        },
      ]
    );
  };
  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.text}>Willkommen zur Flashcard-App</Text>
      </View>
      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <TouchableOpacity style={styles.button} onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          router.push('/create');
        }}>
          <Text style={styles.buttonText}>Neues Deck erstellen</Text>
        </TouchableOpacity>
        {/* Dynamic Decks from AsyncStorage */}
        {decks.length > 0 && (
          <View style={styles.dynamicDecksContainer}>
            <Text style={styles.dynamicDecksTitle}>                       Deine Decks:</Text>
            <View style={styles.dynamicDeckGrid}>
              {decks.map((deck) => (
                <View
                  key={deck.id}
                  style={[styles.dynamicDeckWrapper]}
                >
                  <TouchableOpacity
                    style={[styles.dynamicDeckCard, { backgroundColor: deck.color }]}
                    onPress={() => handleDeckPress(deck.id)}
                  >
                    <Text style={styles.buttonText}>{deck.title}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteDeck(deck.id)}
                  >
                    <Text style={styles.deleteButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2fe',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#ddf5fd',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 50,
    alignItems: 'center',
  },
  button: {
    height: 50,
    marginTop: 4,
    marginBottom: 16,
    backgroundColor: '#0f47b4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    width: 350,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#FDFBF7',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    fontSize: 24,
    marginBottom: 16,
    color: '#fffffff',
    fontWeight: 'bold'
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 16,
    borderRadius: 15,
  },
  dynamicDecksContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  dynamicDecksTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fffffff',
    marginBottom: 30
  },
  dynamicDeckGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dynamicDeckWrapper: {
    width: '48%',
    marginBottom: 16,
    position: 'relative',
  },
  dynamicDeckCard: {
    height: 100,
    backgroundColor: '#33385c',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'rgba(255,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
});