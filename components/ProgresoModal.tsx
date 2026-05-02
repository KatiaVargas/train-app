import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert, Image, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LineChart } from 'react-native-chart-kit';
import { useWorkoutContext } from '@/context/WorkoutContext';

interface ProgresoModalProps {
  visible: boolean;
  onClose: () => void;
}

const screenWidth = Dimensions.get('window').width;

export default function ProgresoModal({ visible, onClose }: ProgresoModalProps) {
  const { progressLogs, addProgressLog } = useWorkoutContext();
  const [activeTab, setActiveTab] = useState<'registrar' | 'evolucion'>('registrar');

  // Form State
  const [weight, setWeight] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const pickImage = async () => {
    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permiso requerido", "Se necesita acceso a la galería para subir fotos de progreso.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!weight) {
      Alert.alert("Requerido", "Al menos debes introducir tu peso actual.");
      return;
    }

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const dateStr = new Date().toLocaleDateString('es-ES', options);

    addProgressLog({
      id: Date.now().toString(),
      date: dateStr,
      timestamp: Date.now(),
      weight,
      chest,
      waist,
      hips,
      photoUri: photoUri || undefined,
    });

    Alert.alert("Guardado", "Tu progreso ha sido registrado exitosamente.");
    
    // Reset form
    setWeight('');
    setChest('');
    setWaist('');
    setHips('');
    setPhotoUri(null);
    setActiveTab('evolucion');
  };

  // Prepare chart data (needs oldest to newest)
  const chartData = useMemo(() => {
    if (progressLogs.length === 0) return null;
    
    // Sort ascending by timestamp for chart
    const ascendingLogs = [...progressLogs].sort((a, b) => a.timestamp - b.timestamp);
    
    // Get last 6 entries max for cleaner chart
    const recentLogs = ascendingLogs.slice(-6);

    return {
      labels: recentLogs.map(log => log.date.split(' ')[0] + ' ' + log.date.split(' ')[1]), // e.g. "02 may"
      datasets: [
        {
          data: recentLogs.map(log => parseFloat(log.weight)),
          color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`, // Purple
          strokeWidth: 3
        }
      ],
    };
  }, [progressLogs]);

  // Gallery images
  const logsWithPhotos = progressLogs.filter(log => log.photoUri);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <MaterialIcons name="close" size={28} color="#11181C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tu Progreso</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'registrar' && styles.activeTab]}
            onPress={() => setActiveTab('registrar')}
          >
            <Text style={[styles.tabText, activeTab === 'registrar' && styles.activeTabText]}>Registrar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'evolucion' && styles.activeTab]}
            onPress={() => setActiveTab('evolucion')}
          >
            <Text style={[styles.tabText, activeTab === 'evolucion' && styles.activeTabText]}>Evolución</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* TAB: REGISTRAR */}
          {activeTab === 'registrar' && (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Datos Corporales</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Peso (kg) *</Text>
                <TextInput style={styles.input} keyboardType="numeric" placeholder="Ej. 65.5" value={weight} onChangeText={setWeight} />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Cintura (cm)</Text>
                  <TextInput style={styles.input} keyboardType="numeric" placeholder="Ej. 70" value={waist} onChangeText={setWaist} />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Pecho (cm)</Text>
                  <TextInput style={styles.input} keyboardType="numeric" placeholder="Ej. 90" value={chest} onChangeText={setChest} />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Cadera (cm)</Text>
                  <TextInput style={styles.input} keyboardType="numeric" placeholder="Ej. 95" value={hips} onChangeText={setHips} />
                </View>
              </View>

              <Text style={styles.sectionTitle}>Foto de Progreso</Text>
              <TouchableOpacity style={styles.photoUploadBtn} onPress={pickImage}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.previewImage} />
                ) : (
                  <View style={styles.photoUploadPlaceholder}>
                    <MaterialIcons name="add-a-photo" size={32} color="#6C63FF" />
                    <Text style={styles.photoUploadText}>Toca para añadir foto</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Guardar Progreso</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TAB: EVOLUCION */}
          {activeTab === 'evolucion' && (
            <View style={styles.evolutionContainer}>
              
              <Text style={styles.sectionTitle}>Evolución de Peso</Text>
              {chartData ? (
                <View style={styles.chartWrapper}>
                  <LineChart
                    data={chartData}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 1,
                      color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(104, 112, 118, ${opacity})`,
                      style: { borderRadius: 16 },
                      propsForDots: { r: "5", strokeWidth: "2", stroke: "#6C63FF" }
                    }}
                    bezier
                    style={styles.chart}
                  />
                </View>
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>Registra tu peso para ver la gráfica.</Text>
                </View>
              )}

              <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Historial de Registros</Text>
              {progressLogs.length > 0 ? (
                progressLogs.map(log => (
                  <View key={log.id} style={styles.historyCard}>
                    <View style={styles.historyCardHeader}>
                      <Text style={styles.historyDate}>{log.date}</Text>
                      <Text style={styles.historyWeight}>{log.weight} kg</Text>
                    </View>
                    <View style={styles.historyDetails}>
                      {log.waist ? <Text style={styles.historyMeasure}>Cin: {log.waist}cm</Text> : null}
                      {log.chest ? <Text style={styles.historyMeasure}>Pec: {log.chest}cm</Text> : null}
                      {log.hips ? <Text style={styles.historyMeasure}>Cad: {log.hips}cm</Text> : null}
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No hay registros guardados.</Text>
              )}

              <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Galería de Progreso</Text>
              {logsWithPhotos.length > 0 ? (
                <View style={styles.galleryContainer}>
                  {logsWithPhotos.map(log => (
                    <View key={log.id} style={styles.galleryItem}>
                      <Image source={{ uri: log.photoUri }} style={styles.galleryImage} />
                      <Text style={styles.galleryDate}>{log.date}</Text>
                      <Text style={styles.galleryWeight}>{log.weight} kg</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>Las fotos que añadas aparecerán aquí.</Text>
                </View>
              )}
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  closeBtn: { padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#11181C' },
  tabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eeeeee', marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#6C63FF' },
  tabText: { fontSize: 16, color: '#687076', fontWeight: '600' },
  activeTabText: { color: '#6C63FF' },
  content: { flex: 1, paddingHorizontal: 20 },
  formContainer: {},
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#11181C', marginBottom: 15 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: '#687076', marginBottom: 5 },
  input: { backgroundColor: '#F8F8F8', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#eeeeee', fontSize: 16 },
  row: { flexDirection: 'row' },
  photoUploadBtn: { backgroundColor: '#F8F8F8', borderRadius: 16, height: 200, borderWidth: 2, borderStyle: 'dashed', borderColor: '#eeeeee', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: 30 },
  photoUploadPlaceholder: { alignItems: 'center' },
  photoUploadText: { marginTop: 10, color: '#687076', fontSize: 14 },
  previewImage: { width: '100%', height: '100%' },
  saveBtn: { backgroundColor: '#6C63FF', padding: 15, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  evolutionContainer: {},
  chartWrapper: { backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#eeeeee', padding: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  chart: { marginVertical: 8, borderRadius: 16 },
  emptyCard: { backgroundColor: '#F8F8F8', borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#eeeeee' },
  emptyText: { color: '#687076', fontSize: 14, fontStyle: 'italic' },
  historyCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: '#eeeeee' },
  historyCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  historyDate: { fontSize: 16, color: '#11181C', fontWeight: 'bold' },
  historyWeight: { fontSize: 16, color: '#6C63FF', fontWeight: 'bold' },
  historyDetails: { flexDirection: 'row', gap: 10 },
  historyMeasure: { fontSize: 14, color: '#687076' },
  galleryContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  galleryItem: { width: '48%', backgroundColor: '#ffffff', borderRadius: 12, padding: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eeeeee', alignItems: 'center' },
  galleryImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 8 },
  galleryDate: { fontSize: 14, fontWeight: 'bold', color: '#11181C' },
  galleryWeight: { fontSize: 14, color: '#687076' },
});
