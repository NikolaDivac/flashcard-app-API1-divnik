import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cbd5e1',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#cbd5e1',
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
    alignItems: 'center',
  },
  buttonText: {
    color: '#FDFBF7',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 16,
    color: '#fffffff',
    fontWeight: 'bold',
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
    marginBottom: 30,
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
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden', 
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
  cardCounter: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default styles;