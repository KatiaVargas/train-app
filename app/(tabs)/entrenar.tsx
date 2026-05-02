import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '@/components/Footer';

export default function EntrenarScreen() {
  const dummyExercises = [
    { id: '1', name: 'Press de Banca', sets: 3 },
    { id: '2', name: 'Dominadas', sets: 3 },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Rutina Torso</Text>
          <Text style={styles.subtitle}>Añadir nota...</Text>
        </View>

        {dummyExercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <Text style={styles.exerciseTitle}>{exercise.name}</Text>
            
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Serie</Text>
              <Text style={styles.headerCell}>kg</Text>
              <Text style={styles.headerCell}>Reps</Text>
              <Text style={styles.headerCellIcon}></Text>
            </View>

            {Array.from({ length: exercise.sets }).map((_, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.cellText}>{index + 1}</Text>
                <TextInput style={styles.input} placeholder="0" keyboardType="numeric" />
                <TextInput style={styles.input} placeholder="0" keyboardType="numeric" />
                <TouchableOpacity style={styles.checkButton}>
                  <MaterialIcons name="check" size={20} color="#687076" />
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity style={styles.addSetButton}>
              <Text style={styles.addSetText}>+ Añadir Serie</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.finishButton}>
          <Text style={styles.finishButtonText}>Finalizar Entrenamiento</Text>
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
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#11181C',
  },
  subtitle: {
    fontSize: 16,
    color: '#687076',
    marginTop: 5,
  },
  exerciseCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    color: '#687076',
  },
  headerCellIcon: {
    width: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cellText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginHorizontal: 5,
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  checkButton: {
    width: 40,
    height: 40,
    backgroundColor: '#eeeeee',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  addSetButton: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  addSetText: {
    color: '#6C63FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  finishButton: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  finishButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
