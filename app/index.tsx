import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { LinearGradient } from 'expo-linear-gradient';

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
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedDecks = decks.filter(deck => deck.id !== deckId);
              await AsyncStorage.setItem('decks', JSON.stringify(updatedDecks));
              setDecks(updatedDecks);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
      <View style={styles.headerContainer}>
        <Text style={styles.text}>Willkommen zur Flashcard-App</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <TouchableOpacity style={styles.button} onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          router.push('/create');
        }}>
          <Text style={styles.buttonText}>Neues Deck erstellen</Text>
        </TouchableOpacity>

        {decks.length > 0 && (
          <View style={styles.dynamicDecksContainer}>
            <Text style={styles.dynamicDecksTitle}>Deine Decks:</Text>
            <View style={styles.dynamicDeckGrid}>
              {decks.map((deck) => (
                <View key={deck.id} style={styles.dynamicDeckWrapper}>
                  <TouchableOpacity
                    onPress={() => handleDeckPress(deck.id)}
                    onLongPress={() => Alert.alert("Optionen", "Hier könnten weitere Optionen stehen.", [{ text: "OK" }])}
                  >
                    <LinearGradient
                      colors={[deck.color, '#fff']}
                      start={{ x: 0.95, y: 0.3 }}
                      end={{ x: 0.99, y: 1.2 }}
                      style={styles.dynamicDeckCard}
                    >
                      <Text style={styles.buttonText}>{deck.title}</Text>
                      <Text style={styles.cardCounter}>0 Karten</Text> {/* Platzhalter für Kartenzahl */}
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.deleteButton} onPress={() => deleteDeck(deck.id)}>
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
