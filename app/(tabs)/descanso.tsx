import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '@/components/Footer';

export default function DescansoScreen() {
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds = 01:30
  const [initialTime, setInitialTime] = useState(90);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const adjustTime = (amount: number) => {
    setTimeLeft((prev) => Math.max(0, prev + amount));
  };

  const setPreset = (seconds: number) => {
    setTimeLeft(seconds);
    setInitialTime(seconds);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
  };

  const skipRest = () => {
    setTimeLeft(0);
    setIsRunning(false);
  };

  const presets = [
    { label: '30s', value: 30 },
    { label: '1m', value: 60 },
    { label: '1m 30s', value: 90 },
    { label: '2m', value: 120 },
    { label: '3m', value: 180 },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tiempo de Descanso</Text>

        <View style={styles.presetsContainer}>
          {presets.map((preset, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.presetChip, initialTime === preset.value && styles.presetChipActive]}
              onPress={() => setPreset(preset.value)}
            >
              <Text style={[styles.presetText, initialTime === preset.value && styles.presetTextActive]}>
                {preset.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.adjustButton} onPress={resetTimer}>
            <MaterialIcons name="refresh" size={32} color="#11181C" />
            <Text style={styles.adjustText}>Reiniciar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.mainButton, isRunning ? styles.pauseButton : styles.startButton]}
            onPress={() => setIsRunning(!isRunning)}
            disabled={timeLeft === 0}
          >
            <MaterialIcons name={isRunning ? "pause" : "play-arrow"} size={40} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.adjustButton} onPress={() => adjustTime(30)}>
            <MaterialIcons name="add" size={32} color="#11181C" />
            <Text style={styles.adjustText}>+30s</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={skipRest}>
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
    marginBottom: 20,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
  },
  presetChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    margin: 5,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  presetChipActive: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  presetText: {
    fontSize: 14,
    color: '#687076',
    fontWeight: '600',
  },
  presetTextActive: {
    color: '#ffffff',
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
    width: 80,
  },
  adjustText: {
    fontSize: 14,
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
    marginHorizontal: 20,
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
