import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { fetchSongs } from '../api/spotify';

const SongsScreen = ({ route }) => {
  const { birthYear, location, childhoodStart, childhoodEnd } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const getSongs = async () => {
      try {
        setLoading(true);
        // For testing without backend
        // Uncomment the following to test with mock data
        /*
        setTimeout(() => {
          setSongs([
            {
              id: '1',
              name: 'Bohemian Rhapsody',
              artist: 'Queen',
              album: 'A Night at the Opera',
              releaseDate: '1975-10-31',
              imageUrl: 'https://via.placeholder.com/300',
              spotifyUrl: 'https://open.spotify.com'
            },
            {
              id: '2',
              name: 'Hotel California',
              artist: 'Eagles',
              album: 'Hotel California',
              releaseDate: '1977-02-22',
              imageUrl: 'https://via.placeholder.com/300',
              spotifyUrl: 'https://open.spotify.com'
            }
          ]);
          setLoading(false);
        }, 2000);
        */
        
        // Comment out the below when testing with mock data
        const data = await fetchSongs(birthYear, location, childhoodStart, childhoodEnd);
        setSongs(data.songs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setError('Failed to load songs. Please try again.');
        setLoading(false);
      }
    };
    
    getSongs();
  }, [birthYear, location, childhoodStart, childhoodEnd]);
  
  const renderSongItem = ({ item }) => (
    <Card style={styles.songCard}>
      {item.imageUrl && (
        <Card.Cover source={{ uri: item.imageUrl }} style={styles.albumCover} />
      )}
      
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.artist}</Paragraph>
        <Paragraph>{item.releaseDate?.substring(0, 4) || 'Unknown year'}</Paragraph>
      </Card.Content>
      
      <Card.Actions>
        <Button 
          icon="spotify" 
          mode="contained" 
          onPress={() => Linking.openURL(item.spotifyUrl)}
          style={styles.spotifyButton}
        >
          Open in Spotify
        </Button>
      </Card.Actions>
    </Card>
  );
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Loading songs...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Songs from {birthYear + childhoodStart} to {birthYear + childhoodEnd}
        </Text>
      </View>
      
      {songs.length > 0 ? (
        <FlatList
          data={songs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.centered}>
          <Text>No songs found for this time period and location.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },
  songCard: {
    marginBottom: 15,
  },
  albumCover: {
    height: 180,
  },
  loadingText: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  spotifyButton: {
    backgroundColor: '#1DB954',
  },
});

export default SongsScreen;