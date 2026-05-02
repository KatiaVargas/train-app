import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '@/components/Footer';
import { useWorkoutContext } from '@/context/WorkoutContext';
import { exercisesData } from './ejercicios';

export default function InicioScreen() {
  const { history, timerTimeLeft, timerIsRunning } = useWorkoutContext();

  const lastWorkout = history.length > 0 ? history[0] : null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>¡Hola, Katia!</Text>
        <Text style={styles.headerSubtitle}>Lista para tu próximo entrenamiento</Text>

        <Link href="/entrenar" asChild>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="fitness-center" size={24} color="#6C63FF" />
              <Text style={styles.cardTitle}>Último Entrenamiento</Text>
            </View>
            {lastWorkout ? (
              <>
                <Text style={styles.cardContent}>{lastWorkout.title} - {lastWorkout.date}</Text>
                <Text style={styles.cardSubContent}>{lastWorkout.duration} • {lastWorkout.exercises.length} ejercicios</Text>
              </>
            ) : (
              <>
                <Text style={styles.cardContent}>No hay entrenamientos recientes</Text>
                <Text style={styles.cardSubContent}>Toca aquí para comenzar una nueva rutina hoy</Text>
              </>
            )}
          </TouchableOpacity>
        </Link>

        <Link href="/historial" asChild>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="history" size={24} color="#6C63FF" />
              <Text style={styles.cardTitle}>Tu Historial</Text>
            </View>
            <Text style={styles.cardContent}>{history.length} entrenamientos completados</Text>
            <Text style={styles.cardSubContent}>
              {history.length > 0 ? '¡Sigue así, vas por buen camino!' : 'Aún no tienes historial.'}
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/descanso" asChild>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="timer" size={24} color="#6C63FF" />
              <Text style={styles.cardTitle}>Descanso Actual</Text>
            </View>
            <Text style={styles.cardContent}>
              {timerTimeLeft > 0 ? formatTime(timerTimeLeft) : '00:00'}
              {timerIsRunning ? ' (En curso)' : ''}
            </Text>
            <Text style={styles.cardSubContent}>
              {timerTimeLeft > 0 ? 'Toca para gestionar tu descanso' : 'Listo para la siguiente serie'}
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/ejercicios" asChild>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="list-alt" size={24} color="#6C63FF" />
              <Text style={styles.cardTitle}>Biblioteca de Ejercicios</Text>
            </View>
            <Text style={styles.cardContent}>Explora {exercisesData.length} ejercicios</Text>
            <Text style={styles.cardSubContent}>Filtra por grupo muscular y aprende la técnica</Text>
          </TouchableOpacity>
        </Link>
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
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333333',
  },
  cardContent: {
    fontSize: 16,
    color: '#11181C',
    marginBottom: 5,
  },
  cardSubContent: {
    fontSize: 14,
    color: '#687076',
  },
});
