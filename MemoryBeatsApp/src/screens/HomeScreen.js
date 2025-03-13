import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Title, Paragraph } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  const [birthYear, setBirthYear] = useState('');
  const [location, setLocation] = useState('');
  const [childhoodStart, setChildhoodStart] = useState('5');
  const [childhoodEnd, setChildhoodEnd] = useState('15');

  const handleSubmit = () => {
    if (!birthYear || !location) {
      alert('Please fill in all required fields');
      return;
    }
    
    navigation.navigate('Songs', {
      birthYear: parseInt(birthYear, 10),
      location,
      childhoodStart: parseInt(childhoodStart, 10),
      childhoodEnd: parseInt(childhoodEnd, 10)
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Find Childhood Music</Title>
      <Paragraph style={styles.paragraph}>
        Enter birth year and location to discover songs from childhood.
      </Paragraph>
      
      <TextInput
        label="Birth Year *"
        value={birthYear}
        onChangeText={setBirthYear}
        keyboardType="number-pad"
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Location (Country) *"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
        mode="outlined"
      />
      
      <View style={styles.row}>
        <TextInput
          label="Childhood Start Age"
          value={childhoodStart}
          onChangeText={setChildhoodStart}
          keyboardType="number-pad"
          style={[styles.input, styles.halfInput]}
          mode="outlined"
        />
        
        <TextInput
          label="Childhood End Age"
          value={childhoodEnd}
          onChangeText={setChildhoodEnd}
          keyboardType="number-pad"
          style={[styles.input, styles.halfInput]}
          mode="outlined"
        />
      </View>
      
      <Button 
        mode="contained" 
        onPress={handleSubmit}
        style={styles.button}
      >
        Generate Playlist
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
    color: '#1DB954',
  },
  paragraph: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: '#1DB954',
  },
});

export default HomeScreen;