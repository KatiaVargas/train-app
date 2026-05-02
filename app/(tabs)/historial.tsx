import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '@/components/Footer';

const dummyHistory = [
  { id: '1', date: '29 Abr 2026', title: 'Día de Pierna', duration: '1h 15m', volume: '4500 kg' },
  { id: '2', date: '27 Abr 2026', title: 'Espalda y Bíceps', duration: '1h 05m', volume: '3200 kg' },
  { id: '3', date: '25 Abr 2026', title: 'Pecho y Tríceps', duration: '55m', volume: '3800 kg' },
  { id: '4', date: '23 Abr 2026', title: 'Día de Pierna', duration: '1h 20m', volume: '4650 kg' },
];

export default function HistorialScreen() {
  const renderItem = ({ item }: { item: typeof dummyHistory[0] }) => (
    <TouchableOpacity style={styles.card}>
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
        data={dummyHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Historial</Text>
          </View>
        }
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
  listContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
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
});
