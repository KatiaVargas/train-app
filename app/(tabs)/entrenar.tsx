import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Footer from '@/components/Footer';
import { useWorkoutContext, Exercise, ExerciseSet } from '@/context/WorkoutContext';

const templates = [
  {
    id: 't1',
    title: 'Día de Push (Empuje)',
    description: 'Enfoque en Pecho, Hombros y Tríceps.',
    exercises: [
      { name: 'Press de Banca', setsCount: 4 },
      { name: 'Press Militar', setsCount: 3 },
      { name: 'Aperturas con Mancuernas', setsCount: 3 },
      { name: 'Extensión de Tríceps en Polea', setsCount: 3 }
    ]
  },
  {
    id: 't2',
    title: 'Día de Pull (Tracción)',
    description: 'Enfoque en Espalda y Bíceps.',
    exercises: [
      { name: 'Dominadas', setsCount: 4 },
      { name: 'Remo con Barra', setsCount: 3 },
      { name: 'Jalón al Pecho', setsCount: 3 },
      { name: 'Curl de Bíceps', setsCount: 3 }
    ]
  },
  {
    id: 't3',
    title: 'Día de Piernas',
    description: 'Enfoque en Cuádriceps, Isquiosurales y Glúteos.',
    exercises: [
      { name: 'Sentadilla Libre', setsCount: 4 },
      { name: 'Prensa Inclinada', setsCount: 3 },
      { name: 'Peso Muerto Rumano', setsCount: 3 },
      { name: 'Elevación de Talones', setsCount: 4 }
    ]
  },
  {
    id: 't4',
    title: 'Full Body',
    description: 'Entrenamiento de cuerpo completo.',
    exercises: [
      { name: 'Sentadilla Libre', setsCount: 3 },
      { name: 'Press de Banca', setsCount: 3 },
      { name: 'Remo con Barra', setsCount: 3 },
      { name: 'Press Militar', setsCount: 3 }
    ]
  }
];

export default function EntrenarScreen() {
  const router = useRouter();
  const { addWorkout } = useWorkoutContext();
  
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [title, setTitle] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [startTime, setStartTime] = useState<number>(Date.now());

  const startCustomWorkout = () => {
    setTitle('Rutina Personalizada');
    setExercises([]);
    setStartTime(Date.now());
    setIsWorkoutActive(true);
  };

  const startTemplate = (template: typeof templates[0]) => {
    setTitle(template.title);
    
    const populatedExercises: Exercise[] = template.exercises.map((ex, exIndex) => {
      const sets: ExerciseSet[] = Array.from({ length: ex.setsCount }).map((_, setIndex) => ({
        id: `set-${exIndex}-${setIndex}`,
        kg: '',
        reps: '',
        completed: false
      }));
      return {
        id: `ex-${exIndex}`,
        name: ex.name,
        sets
      };
    });

    setExercises(populatedExercises);
    setStartTime(Date.now());
    setIsWorkoutActive(true);
  };

  const cancelWorkout = () => {
    Alert.alert(
      "Cancelar entrenamiento",
      "¿Estás seguro de que quieres cancelar? Perderás todo el progreso de esta sesión.",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Sí, cancelar", 
          style: "destructive",
          onPress: () => {
            setIsWorkoutActive(false);
            setExercises([]);
            setTitle('');
          }
        }
      ]
    );
  };

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

  const finishWorkout = () => {
    if (exercises.length === 0) {
      Alert.alert('Error', 'Añade al menos un ejercicio antes de finalizar.');
      return;
    }

    const durationMs = Date.now() - startTime;
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const dateStr = new Date().toLocaleDateString('es-ES', options);

    // Calculate total volume
    let totalKg = 0;
    exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.completed && set.kg && set.reps) {
          totalKg += (parseFloat(set.kg) * parseInt(set.reps, 10));
        }
      });
    });

    addWorkout({
      id: Date.now().toString(),
      title: title || 'Rutina personalizada',
      date: dateStr,
      duration: durationStr || '1m', 
      volume: `${totalKg} kg`,
      exercises: exercises,
    });

    Alert.alert("¡Éxito!", "Entrenamiento finalizado y guardado en tu historial.", [
      { text: "Ver Historial", onPress: () => {
        setIsWorkoutActive(false);
        setExercises([]);
        setTitle('');
        router.push('/historial');
      }}
    ]);
  };

  if (!isWorkoutActive) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.headerTitle}>Entrenar</Text>
          <Text style={styles.headerSubtitle}>Elige una plantilla o comienza desde cero</Text>

          <TouchableOpacity style={styles.startCustomBtn} onPress={startCustomWorkout}>
            <MaterialIcons name="add-circle-outline" size={28} color="#ffffff" />
            <Text style={styles.startCustomBtnText}>Rutina Personalizada</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Plantillas Populares</Text>
          
          {templates.map(template => (
            <TouchableOpacity key={template.id} style={styles.templateCard} onPress={() => startTemplate(template)}>
              <View style={styles.templateHeader}>
                <Text style={styles.templateTitle}>{template.title}</Text>
                <MaterialIcons name="chevron-right" size={24} color="#6C63FF" />
              </View>
              <Text style={styles.templateDescription}>{template.description}</Text>
              <Text style={styles.templateExercisesCount}>
                {template.exercises.map(e => e.name).join(', ')}
              </Text>
            </TouchableOpacity>
          ))}

        </View>
        <Footer />
      </ScrollView>
    );
  }

  // Active Workout View
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.activeHeader}>
          <TouchableOpacity style={styles.cancelBtn} onPress={cancelWorkout}>
            <MaterialIcons name="close" size={24} color="#FF3B30" />
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.activeTimer}>Entrenando...</Text>
        </View>

        <View style={styles.header}>
          <TextInput 
            style={styles.titleInput} 
            placeholder="Nombre de Rutina" 
            value={title}
            onChangeText={setTitle}
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

        <TouchableOpacity style={styles.finishButton} onPress={finishWorkout}>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#687076',
    marginBottom: 20,
  },
  startCustomBtn: {
    backgroundColor: '#11181C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    marginBottom: 30,
  },
  startCustomBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 15,
  },
  templateCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  templateDescription: {
    fontSize: 14,
    color: '#687076',
    marginBottom: 10,
  },
  templateExercisesCount: {
    fontSize: 13,
    color: '#6C63FF',
    fontStyle: 'italic',
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  cancelBtnText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  activeTimer: {
    color: '#28a745',
    fontWeight: 'bold',
    fontSize: 16,
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
