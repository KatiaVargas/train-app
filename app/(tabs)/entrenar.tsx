import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '@/components/Footer';

type ExerciseSet = {
  id: string;
  kg: string;
  reps: string;
  completed: boolean;
};

type Exercise = {
  id: string;
  name: string;
  sets: ExerciseSet[];
};

export default function EntrenarScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExerciseName, setNewExerciseName] = useState('');

  const addExercise = () => {
    if (newExerciseName.trim() === '') return;
    
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: newExerciseName,
      sets: [{ id: Date.now().toString() + '-1', kg: '', reps: '', completed: false }],
    };
    
    setExercises([...exercises, newExercise]);
    setNewExerciseName('');
  };

  const addSet = (exerciseId: string) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: [...exercise.sets, { id: Date.now().toString(), kg: '', reps: '', completed: false }],
        };
      }
      return exercise;
    }));
  };

  const updateSet = (exerciseId: string, setId: string, field: 'kg' | 'reps', value: string) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map(set => 
            set.id === setId ? { ...set, [field]: value } : set
          ),
        };
      }
      return exercise;
    }));
  };

  const toggleSetCompleted = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map(set => 
            set.id === setId ? { ...set, completed: !set.completed } : set
          ),
        };
      }
      return exercise;
    }));
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TextInput 
            style={styles.titleInput} 
            placeholder="Nombre de Rutina" 
            defaultValue="Rutina Torso" 
          />
          <TextInput 
            style={styles.subtitleInput} 
            placeholder="Añadir nota..." 
          />
        </View>

        {exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseTitle}>{exercise.name}</Text>
              <TouchableOpacity onPress={() => removeExercise(exercise.id)}>
                <MaterialIcons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Serie</Text>
              <Text style={styles.headerCell}>kg</Text>
              <Text style={styles.headerCell}>Reps</Text>
              <Text style={styles.headerCellIcon}></Text>
            </View>

            {exercise.sets.map((set, index) => (
              <View key={set.id} style={[styles.row, set.completed && styles.rowCompleted]}>
                <Text style={styles.cellText}>{index + 1}</Text>
                <TextInput 
                  style={[styles.input, set.completed && styles.inputCompleted]} 
                  placeholder="0" 
                  keyboardType="numeric"
                  value={set.kg}
                  onChangeText={(val) => updateSet(exercise.id, set.id, 'kg', val)}
                  editable={!set.completed}
                />
                <TextInput 
                  style={[styles.input, set.completed && styles.inputCompleted]} 
                  placeholder="0" 
                  keyboardType="numeric"
                  value={set.reps}
                  onChangeText={(val) => updateSet(exercise.id, set.id, 'reps', val)}
                  editable={!set.completed}
                />
                <TouchableOpacity 
                  style={[styles.checkButton, set.completed && styles.checkButtonActive]}
                  onPress={() => toggleSetCompleted(exercise.id, set.id)}
                >
                  <MaterialIcons name="check" size={20} color={set.completed ? "#ffffff" : "#687076"} />
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity style={styles.addSetButton} onPress={() => addSet(exercise.id)}>
              <Text style={styles.addSetText}>+ Añadir Serie</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.addExerciseContainer}>
          <TextInput
            style={styles.addExerciseInput}
            placeholder="Ej. Press de Banca"
            value={newExerciseName}
            onChangeText={setNewExerciseName}
          />
          <TouchableOpacity style={styles.addExerciseButton} onPress={addExercise}>
            <Text style={styles.addExerciseButtonText}>Añadir Ejercicio</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.finishButton}
          onPress={() => {
            // Aquí iría la lógica para guardar el entrenamiento en una BD
            alert("¡Entrenamiento finalizado!");
            setExercises([]);
          }}
        >
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
  titleInput: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#11181C',
    padding: 0,
  },
  subtitleInput: {
    fontSize: 16,
    color: '#687076',
    marginTop: 5,
    padding: 0,
  },
  exerciseCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
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
  rowCompleted: {
    opacity: 0.8,
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
  inputCompleted: {
    backgroundColor: '#f0f0f0',
    color: '#999999',
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
  checkButtonActive: {
    backgroundColor: '#28a745',
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
  addExerciseContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  addExerciseInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#eeeeee',
    marginRight: 10,
    fontSize: 16,
  },
  addExerciseButton: {
    backgroundColor: '#11181C',
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 12,
  },
  addExerciseButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
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
