import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/cucei-logo.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}><Text style={styles.label}>Alumna:</Text> Katia Paola Vargas Flores</Text>
        <Text style={styles.text}><Text style={styles.label}>Profesor:</Text> Zeus Emanuel Gutierrez Cobian</Text>
        <Text style={styles.text}><Text style={styles.label}>Materia:</Text> Desarrollo de aplicaciones web en la nube y móviles</Text>
        <Text style={styles.text}><Text style={styles.label}>Ciclo escolar:</Text> 2026A    Mayo - 2026</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 20,
  },
  logo: {
    width: 250,
    height: 80,
    marginBottom: 15,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 4,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#000000',
  },
});
