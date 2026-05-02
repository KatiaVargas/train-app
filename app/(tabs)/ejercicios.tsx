import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '@/components/Footer';

const dummyExercises = [
  { id: '1', name: 'Press de Banca', muscle: 'Pecho', equipment: 'Barra' },
  { id: '2', name: 'Sentadilla', muscle: 'Pierna', equipment: 'Barra' },
  { id: '3', name: 'Dominadas', muscle: 'Espalda', equipment: 'Peso Corporal' },
  { id: '4', name: 'Curl de Bíceps', muscle: 'Brazos', equipment: 'Mancuernas' },
  { id: '5', name: 'Prensa', muscle: 'Pierna', equipment: 'Máquina' },
  { id: '6', name: 'Vuelos Laterales', muscle: 'Hombro', equipment: 'Mancuernas' },
];

const filters = ['Todos', 'Pecho', 'Espalda', 'Pierna', 'Brazos', 'Hombro'];

export default function EjerciciosScreen() {
  const [activeFilter, setActiveFilter] = useState('Todos');

  const renderItem = ({ item }: { item: typeof dummyExercises[0] }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <MaterialIcons name="image" size={40} color="#e0e0e0" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.muscle} • {item.equipment}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#687076" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ejercicios</Text>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color="#687076" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Buscar ejercicio..." 
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.filterChip, 
                activeFilter === item && styles.activeFilterChip
              ]}
              onPress={() => setActiveFilter(item)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === item && styles.activeFilterText
              ]}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </View>

      <FlatList
        data={dummyExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={<Footer />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#11181C',
  },
  filtersContainer: {
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  activeFilterChip: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  filterText: {
    fontSize: 14,
    color: '#687076',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  listContent: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eeeeee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#687076',
  },
});
