// src/components/GraficoInteres.js
import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { formatLargeNumber } from '../utils/formato';

export default function GraficoInteres({ labelData, graficoData }) {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 60;

  return (
    <View style={{
      width: '100%', marginVertical: 15, backgroundColor: 'white',
      borderRadius: 16, padding: 6,
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, overflow: 'hidden'
    }}>
      <Text style={{
        fontSize: 16, fontWeight: 'bold',
        textAlign: 'center', marginBottom: 10, color: '#333'
      }}>
        Proyección
      </Text>
      <View style={{ alignItems: 'center', justifyContent: 'center', overflow: 'hidden', width: '100%' }}>
        <LineChart
          data={{
            labels: labelData,
            datasets: [{
              data: graficoData,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              strokeWidth: 2
            }],
          }}
          width={chartWidth}
          height={220}
          fromZero={false}
          yAxisInterval={1}
          bezier={false}
          // ✅ Formato eje Y correcto
          formatYLabel={(value) => formatLargeNumber(value)}
          chartConfig={{
            backgroundColor: '#f8f9fa',
            backgroundGradientFrom: '#f8f9fa',
            backgroundGradientTo: '#f8f9fa',
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: '5', strokeWidth: '1', stroke: '#2196F3', fill: '#ffffff'
            },
            propsForBackgroundLines: {
              strokeDasharray: '', strokeWidth: 0.5, stroke: '#E0E0E0'
            },
            decimalPlaces: 0,
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
          withInnerLines
          withVerticalLines
          withHorizontalLines
          withVerticalLabels
          withHorizontalLabels
          segments={5}
          yAxisLabelWidth={50}
        />
      </View>
    </View>
  );
}
