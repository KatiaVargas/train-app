import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '@/components/Footer';

export default function DescansoScreen() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tiempo de Descanso</Text>

        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>01:30</Text>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.adjustButton}>
            <MaterialIcons name="remove" size={32} color="#11181C" />
            <Text style={styles.adjustText}>-30s</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.mainButton, isRunning ? styles.pauseButton : styles.startButton]}
            onPress={() => setIsRunning(!isRunning)}
          >
            <MaterialIcons name={isRunning ? "pause" : "play-arrow"} size={40} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.adjustButton}>
            <MaterialIcons name="add" size={32} color="#11181C" />
            <Text style={styles.adjustText}>+30s</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipText}>Omitir Descanso</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 40,
  },
  timerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 8,
    borderColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#11181C',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 40,
  },
  adjustButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  adjustText: {
    fontSize: 16,
    color: '#687076',
    marginTop: 5,
    fontWeight: '600',
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButton: {
    backgroundColor: '#6C63FF',
  },
  pauseButton: {
    backgroundColor: '#8A2BE2',
  },
  skipButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: '#F8F8F8',
  },
  skipText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
});
