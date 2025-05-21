import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DeckOptionsModal from '../components/DeckOptionsModal';
import FAB from '../components/FAB';

const HomeScreen = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const router = useRouter();

  // Load decks from AsyncStorage
  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const storedDecks = await AsyncStorage.getItem('decks');
        setDecks(storedDecks ? JSON.parse(storedDecks) : []);
      } catch {
        setDecks([]);
      }
      setLoading(false);
    };

    // Load decks whenever the page is focused
    const unsubscribe = router.events?.on('focus', fetchDecks);
    fetchDecks();

    return () => unsubscribe?.();
  }, [router.events]);

  // Save changes to a deck (e.g., renaming or changing color)
  const handleSave = async (updatedDeck) => {
    const updatedDecks = decks.map((deck) =>
      deck.id === updatedDeck.id ? updatedDeck : deck
    );
    setDecks(updatedDecks);
    await AsyncStorage.setItem('decks', JSON.stringify(updatedDecks));
  };

  // Delete a deck
  const handleDelete = async (deckId) => {
    const updatedDecks = decks.filter((deck) => deck.id !== deckId);
    setDecks(updatedDecks);
    await AsyncStorage.setItem('decks', JSON.stringify(updatedDecks));
    setSelectedDeck(null);
  };

  // Render a deck tile
  const renderDeck = ({ item }) => (
    <TouchableOpacity
      style={styles.deckCard}
      onPress={() => router.push(`/deck/${item.id}`)} // Navigate to detail view
      onLongPress={() => setSelectedDeck(item)} // Open modal on long press
    >
      <LinearGradient
        colors={[item.color || '#87CEFA', item.color || '#87CEFA']} // Solid color
        style={styles.gradient}
      >
        <Text style={styles.deckTitle}>{item.title || 'Untitled Deck'}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        renderItem={renderDeck}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.deckList}
        ListEmptyComponent={<Text style={styles.emptyText}>Kein Deck erstellt. Kreiere eins!</Text>}
      />
      {/* Floating Action Button */}
      <FAB onPress={() => router.push('/create')} />
      
      {/* Modal for long-press options */}
      {selectedDeck && (
        <DeckOptionsModal
          visible={!!selectedDeck}
          deck={selectedDeck}
          onClose={() => setSelectedDeck(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  deckList: { padding: 10 },
  deckCard: { flex: 1, margin: 10, height: 150, borderRadius: 10, overflow: 'hidden' },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  deckTitle: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#999' },
});