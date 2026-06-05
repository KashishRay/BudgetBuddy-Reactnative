import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen({ navigation }) {
  const [viewMode, setViewMode] = useState('Expense'); // 'Income' or 'Expense'
  const [chartData, setChartData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  // --- Colors for the Chart ---
  const colors = ['#8B80F9', '#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#FF9F1C'];

  const loadData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('transactions');
      if (!storedData) {
        setChartData([]);
        setTotalValue(0);
        return;
      }

      const transactions = JSON.parse(storedData);
      const filtered = transactions.filter(t => t.type === viewMode);
      
      const grouped = {};
      filtered.forEach(item => {
        const amount = parseFloat(item.amount);
        if (grouped[item.category]) {
          grouped[item.category] += amount;
        } else {
          grouped[item.category] = amount;
        }
      });

      let total = 0;
      const formattedData = Object.keys(grouped).map((key, index) => {
        total += grouped[key];
        return {
          name: key,
          population: grouped[key],
          color: colors[index % colors.length],
          legendFontColor: '#7F7F7F',
          legendFontSize: 15,
        };
      });

      setTotalValue(total);
      setChartData(formattedData);

    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [viewMode])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statistics</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- Toggle Switch --- */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'Income' && styles.activeToggle]}
            onPress={() => setViewMode('Income')}
          >
            <Text style={[styles.toggleText, viewMode === 'Income' && styles.activeText]}>Income</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'Expense' && styles.activeToggle]}
            onPress={() => setViewMode('Expense')}
          >
            <Text style={[styles.toggleText, viewMode === 'Expense' && styles.activeText]}>Expenses</Text>
          </TouchableOpacity>
        </View>

        {/* --- Pie Chart --- */}
        <View style={styles.chartContainer}>
          {chartData.length > 0 ? (
            <PieChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No transactions found.</Text>
            </View>
          )}
        </View>

        {/* --- Total Summary --- */}
        <View style={styles.summaryContainer}>
            <Text style={styles.summaryLabel}>Total {viewMode}</Text>
            <Text style={styles.summaryAmount}>₹ {totalValue.toFixed(2)}</Text>
        </View>

        {/* --- Legend List --- */}
        <View style={styles.listContainer}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.row}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.categoryName}>{item.name}</Text>
              </View>
              <Text style={styles.categoryAmount}>₹ {item.population}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  scrollContent: { paddingBottom: 40 },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#F5F5F5', marginHorizontal: 20, borderRadius: 12, padding: 4, marginBottom: 20 },
  toggleButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeToggle: { backgroundColor: '#8B80F9' },
  toggleText: { fontSize: 16, color: '#666', fontWeight: '500' },
  activeText: { color: '#fff', fontWeight: '600' },
  chartContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  noDataContainer: { height: 220, justifyContent: 'center', alignItems: 'center' },
  noDataText: { color: '#999', fontSize: 16 },
  summaryContainer: { alignItems: 'center', marginBottom: 20 },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryAmount: { fontSize: 28, fontWeight: 'bold', color: '#000', marginTop: 5 },
  listContainer: { paddingHorizontal: 20 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  row: { flexDirection: 'row', alignItems: 'center' },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  categoryName: { fontSize: 16, color: '#333', fontWeight: '500' },
  categoryAmount: { fontSize: 16, fontWeight: 'bold', color: '#000' },
});