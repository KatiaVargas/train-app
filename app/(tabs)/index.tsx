import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '@/components/Footer';

export default function InicioScreen() {
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
            <Text style={styles.cardContent}>Día de Pierna - Hace 2 días</Text>
            <Text style={styles.cardSubContent}>1h 15m • 6 ejercicios</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/historial" asChild>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="history" size={24} color="#6C63FF" />
              <Text style={styles.cardTitle}>Esta Semana</Text>
            </View>
            <Text style={styles.cardContent}>3 entrenamientos completados</Text>
            <Text style={styles.cardSubContent}>¡Vas por buen camino!</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/descanso" asChild>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="timer" size={24} color="#6C63FF" />
              <Text style={styles.cardTitle}>Descanso Actual</Text>
            </View>
            <Text style={styles.cardContent}>00:00</Text>
            <Text style={styles.cardSubContent}>Listo para la siguiente serie</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/ejercicios" asChild>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="list-alt" size={24} color="#6C63FF" />
              <Text style={styles.cardTitle}>Ejercicios Recientes</Text>
            </View>
            <Text style={styles.cardContent}>Sentadilla, Peso Muerto, Zancadas</Text>
            <Text style={styles.cardSubContent}>Toca para ver la biblioteca</Text>
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
