import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '@/components/Footer';
import { useWorkoutContext, WorkoutSession } from '@/context/WorkoutContext';

export default function HistorialScreen() {
  const { history } = useWorkoutContext();
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);

  const renderItem = ({ item }: { item: WorkoutSession }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedSession(item)}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.statInfo}>
          <MaterialIcons name="timer" size={16} color="#687076" />
          <Text style={styles.statText}>{item.duration}</Text>
        </View>
        <View style={styles.statInfo}>
          <MaterialIcons name="fitness-center" size={16} color="#687076" />
          <Text style={styles.statText}>{item.volume}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Historial</Text>
            {history.length === 0 && (
              <Text style={styles.emptyText}>Aún no tienes entrenamientos registrados.</Text>
            )}
          </View>
        }
        ListFooterComponent={<Footer />}
      />

      <Modal
        visible={!!selectedSession}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedSession(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {selectedSession && (
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedSession(null)}>
                  <MaterialIcons name="close" size={28} color="#11181C" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedSession.title}</Text>
                <View style={{ width: 28 }} />
              </View>

              <View style={styles.modalStats}>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatLabel}>Fecha</Text>
                  <Text style={styles.modalStatValue}>{selectedSession.date}</Text>
                </View>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatLabel}>Duración</Text>
                  <Text style={styles.modalStatValue}>{selectedSession.duration}</Text>
                </View>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatLabel}>Volumen</Text>
                  <Text style={styles.modalStatValue}>{selectedSession.volume}</Text>
                </View>
              </View>

              <Text style={styles.exercisesTitle}>Ejercicios</Text>
              
              {selectedSession.exercises.length === 0 && (
                <Text style={styles.emptyText}>No se registraron ejercicios.</Text>
              )}

              {selectedSession.exercises.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.tableHeader}>
                    <Text style={styles.headerCell}>Serie</Text>
                    <Text style={styles.headerCell}>kg</Text>
                    <Text style={styles.headerCell}>Reps</Text>
                  </View>
                  {exercise.sets.map((set, index) => (
                    <View key={set.id} style={styles.row}>
                      <Text style={styles.cellText}>{index + 1}</Text>
                      <Text style={styles.cellText}>{set.kg || '-'}</Text>
                      <Text style={styles.cellText}>{set.reps || '-'}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContent: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#687076',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  cardDate: {
    fontSize: 14,
    color: '#687076',
  },
  cardBody: {
    flexDirection: 'row',
  },
  statInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    marginLeft: 5,
    fontSize: 15,
    color: '#333333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#11181C',
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  modalStatItem: {
    alignItems: 'center',
  },
  modalStatLabel: {
    fontSize: 12,
    color: '#687076',
    marginBottom: 4,
  },
  modalStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  exercisesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 15,
  },
  exerciseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eeeeee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 5,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    color: '#687076',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  cellText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#11181C',
  },
});
