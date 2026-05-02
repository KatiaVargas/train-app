import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '@/components/Footer';

type ExerciseDetail = {
  id: string;
  name: string;
  muscle: string;
  secondaryMuscles: string;
  equipment: string;
  level: string;
  description: string;
  benefits: string;
};

export const exercisesData: ExerciseDetail[] = [
  // Pecho
  { id: 'p1', name: 'Press de Banca', muscle: 'Pecho', secondaryMuscles: 'Tríceps, Hombro anterior', equipment: 'Barra', level: 'Intermedio', description: 'Acostado en un banco plano, baja la barra hasta el pecho y empuja hacia arriba de forma controlada.', benefits: 'Desarrollo de fuerza general en el torso y masa muscular en el pectoral.' },
  { id: 'p2', name: 'Flexiones (Push-ups)', muscle: 'Pecho', secondaryMuscles: 'Tríceps, Core', equipment: 'Peso Corporal', level: 'Principiante', description: 'En posición de plancha, baja el cuerpo flexionando los brazos hasta que el pecho roce el suelo y empuja.', benefits: 'Mejora el control corporal y la fuerza de empuje básica.' },
  { id: 'p3', name: 'Aperturas con Mancuernas', muscle: 'Pecho', secondaryMuscles: 'Hombro anterior', equipment: 'Mancuernas', level: 'Principiante', description: 'Acostado, con los brazos semi-flexionados, abre los brazos en forma de arco y ciérralos simulando un abrazo.', benefits: 'Aislamiento del pectoral y mejora de la flexibilidad del pecho.' },
  
  // Espalda
  { id: 'e1', name: 'Dominadas', muscle: 'Espalda', secondaryMuscles: 'Bíceps, Antebrazos', equipment: 'Barra de dominadas', level: 'Avanzado', description: 'Cuélgate de una barra y tira de tu cuerpo hacia arriba hasta que la barbilla pase la barra.', benefits: 'El mejor ejercicio para desarrollar la amplitud y fuerza de la espalda.' },
  { id: 'e2', name: 'Remo con Barra', muscle: 'Espalda', secondaryMuscles: 'Bíceps, Core, Lumbar', equipment: 'Barra', level: 'Intermedio', description: 'Inclinado hacia adelante con la espalda recta, tira de la barra hacia tu ombligo.', benefits: 'Construye grosor en la espalda y fortalece la cadena posterior.' },
  { id: 'e3', name: 'Jalón al Pecho', muscle: 'Espalda', secondaryMuscles: 'Bíceps', equipment: 'Máquina / Polea', level: 'Principiante', description: 'Sentado en la máquina, tira de la barra ancha hacia la parte superior de tu pecho.', benefits: 'Excelente alternativa a las dominadas para desarrollar los dorsales.' },

  // Piernas
  { id: 'l1', name: 'Sentadilla Libre', muscle: 'Piernas', secondaryMuscles: 'Glúteos, Core, Lumbar', equipment: 'Barra', level: 'Intermedio', description: 'Con la barra en la espalda alta, flexiona rodillas y caderas como si fueras a sentarte, manteniendo el torso recto.', benefits: 'Ejercicio fundamental para fuerza general y desarrollo del tren inferior.' },
  { id: 'l2', name: 'Prensa Inclinada', muscle: 'Piernas', secondaryMuscles: 'Glúteos', equipment: 'Máquina', level: 'Principiante', description: 'Sentado en la máquina, empuja la plataforma con los pies hasta casi extender las rodillas.', benefits: 'Permite mover mucho peso aislando las piernas de la fatiga de la espalda baja.' },
  { id: 'l3', name: 'Peso Muerto Rumano', muscle: 'Piernas', secondaryMuscles: 'Glúteos, Lumbar', equipment: 'Barra / Mancuernas', level: 'Intermedio', description: 'Con las piernas ligeramente flexionadas, baja el peso empujando la cadera hacia atrás hasta sentir estiramiento en los isquiosurales.', benefits: 'Fortalece toda la cadena posterior y previene lesiones.' },

  // Hombros
  { id: 'h1', name: 'Press Militar', muscle: 'Hombros', secondaryMuscles: 'Tríceps, Core', equipment: 'Barra / Mancuernas', level: 'Intermedio', description: 'De pie o sentado, empuja el peso desde los hombros hasta la extensión completa sobre la cabeza.', benefits: 'Desarrolla hombros grandes y fuertes, y mejora la fuerza de empuje vertical.' },
  { id: 'h2', name: 'Elevaciones Laterales', muscle: 'Hombros', secondaryMuscles: 'Trapecios', equipment: 'Mancuernas', level: 'Principiante', description: 'De pie, levanta los brazos hacia los lados hasta que queden paralelos al suelo, con una ligera flexión de codo.', benefits: 'Aísla la cabeza lateral del deltoides para dar aspecto de hombros más anchos.' },

  // Brazos
  { id: 'b1', name: 'Curl de Bíceps', muscle: 'Brazos', secondaryMuscles: 'Antebrazos', equipment: 'Mancuernas / Barra', level: 'Principiante', description: 'Con los codos pegados al cuerpo, flexiona los brazos llevando el peso hacia los hombros.', benefits: 'Aislamiento puro para hipertrofia del bíceps.' },
  { id: 'b2', name: 'Extensión de Tríceps en Polea', muscle: 'Brazos', secondaryMuscles: 'Hombro posterior', equipment: 'Polea', level: 'Principiante', description: 'De pie frente a la polea, extiende los brazos empujando el cable hacia abajo sin mover los codos.', benefits: 'Fortalece la parte posterior del brazo de manera segura y constante.' },

  // Core
  { id: 'c1', name: 'Plancha Abdominal', muscle: 'Core', secondaryMuscles: 'Hombros, Piernas', equipment: 'Peso Corporal', level: 'Principiante', description: 'Mantén el cuerpo recto apoyado en los antebrazos y las puntas de los pies, apretando el abdomen.', benefits: 'Mejora la estabilidad del núcleo y la postura.' },
  { id: 'c2', name: 'Crunch Abdominal', muscle: 'Core', secondaryMuscles: 'Ninguno', equipment: 'Peso Corporal', level: 'Principiante', description: 'Acostado boca arriba, flexiona ligeramente el tronco elevando los hombros del suelo.', benefits: 'Enfocado directamente en la contracción del recto abdominal.' },
];

const filters = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];

export default function EjerciciosScreen() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDetail | null>(null);

  const filteredExercises = useMemo(() => {
    return exercisesData.filter(ex => {
      const matchesFilter = activeFilter === 'Todos' || ex.muscle === activeFilter;
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const renderItem = ({ item }: { item: ExerciseDetail }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedExercise(item)}>
      <View style={styles.imagePlaceholder}>
        <MaterialIcons name="fitness-center" size={32} color="#6C63FF" />
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
        <Text style={styles.headerTitle}>Biblioteca</Text>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color="#687076" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Buscar ejercicio..." 
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={20} color="#687076" />
            </TouchableOpacity>
          )}
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
              style={[styles.filterChip, activeFilter === item && styles.activeFilterChip]}
              onPress={() => setActiveFilter(item)}
            >
              <Text style={[styles.filterText, activeFilter === item && styles.activeFilterText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={<Footer />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron ejercicios con esta búsqueda.</Text>
        }
      />

      <Modal
        visible={!!selectedExercise}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedExercise(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {selectedExercise && (
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedExercise(null)}>
                  <MaterialIcons name="close" size={28} color="#11181C" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalImageContainer}>
                <MaterialIcons name="fitness-center" size={80} color="#6C63FF" />
              </View>

              <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
              
              <View style={styles.tagsRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{selectedExercise.muscle}</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{selectedExercise.level}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Músculos Secundarios</Text>
                <Text style={styles.sectionContent}>{selectedExercise.secondaryMuscles}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Material</Text>
                <Text style={styles.sectionContent}>{selectedExercise.equipment}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ejecución</Text>
                <Text style={styles.sectionContent}>{selectedExercise.description}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Beneficios</Text>
                <Text style={styles.sectionContent}>{selectedExercise.benefits}</Text>
              </View>
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
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#687076',
    fontSize: 16,
    marginTop: 20,
    fontStyle: 'italic',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  modalImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 15,
  },
  tagsRow: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  tag: {
    backgroundColor: '#6C63FF20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  tagText: {
    color: '#6C63FF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 4,
  },
  sectionContent: {
    fontSize: 16,
    color: '#687076',
    lineHeight: 24,
  },
});
