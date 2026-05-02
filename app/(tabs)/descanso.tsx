import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '@/components/Footer';

export default function DescansoScreen() {
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds = 01:30
  const [initialTime, setInitialTime] = useState(90);
  const [isRunning, setIsRunning] = useState(false);
  
  // States for custom time modal
  const [modalVisible, setModalVisible] = useState(false);
  const [customMins, setCustomMins] = useState('');
  const [customSecs, setCustomSecs] = useState('');

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

  const applyCustomTime = () => {
    const m = parseInt(customMins || '0', 10);
    const s = parseInt(customSecs || '0', 10);
    const totalSeconds = (m * 60) + s;
    if (totalSeconds > 0) {
      setPreset(totalSeconds);
    }
    setModalVisible(false);
    setCustomMins('');
    setCustomSecs('');
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
          <TouchableOpacity 
            style={styles.presetChip}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.presetText}>Personalizar</Text>
          </TouchableOpacity>
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

      {/* Modal para tiempo personalizado */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tiempo Personalizado</Text>
            
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Minutos</Text>
                <TextInput
                  style={styles.timeInput}
                  keyboardType="numeric"
                  placeholder="0"
                  value={customMins}
                  onChangeText={setCustomMins}
                  maxLength={2}
                />
              </View>
              <Text style={styles.timeSeparator}>:</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Segundos</Text>
                <TextInput
                  style={styles.timeInput}
                  keyboardType="numeric"
                  placeholder="0"
                  value={customSecs}
                  onChangeText={setCustomSecs}
                  maxLength={2}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalApplyButton} onPress={applyCustomTime}>
                <Text style={styles.modalApplyText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    alignItems: 'center',
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#11181C',
    marginHorizontal: 15,
    marginTop: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#687076',
    marginBottom: 8,
  },
  timeInput: {
    width: 70,
    height: 60,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eeeeee',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#11181C',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#687076',
    fontWeight: 'bold',
  },
  modalApplyButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 12,
    backgroundColor: '#6C63FF',
  },
  modalApplyText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
