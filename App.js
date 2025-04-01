import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function App() {
  const [capital, setCapital] = useState('');
  const [tasa, setTasa] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [compuesto, setCompuesto] = useState(false);
  const [graficoMensual, setGraficoMensual] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [graficoData, setGraficoData] = useState([]);
  const [labelData, setLabelData] = useState([]);

  // Función para formatear números grandes
  const formatLargeNumber = (value) => {
    const numValue = parseInt(value);
    
    if (numValue >= 1000000) {
      return `$${(numValue / 1000000).toFixed(2)}M`;
    } else if (numValue >= 1000) {
      return `$${(numValue / 1000).toFixed(2)}k`;
    } else {
      return `$${numValue}`;
    }
  };

  const calcular = () => {
    const P = parseFloat(capital);
    const r = parseFloat(tasa) / 100;
    const t = parseFloat(tiempo);
  
    if (isNaN(P) || isNaN(r) || isNaN(t)) {
      setResultado('Por favor ingresa valores válidos.');
      setGraficoData([]);
      setLabelData([]);
      return;
    }
  
    let resultadoTexto = '';
    const datos = [];
    const labels = [];
  
    const MAX_LABELS_X = 6; // 💡 cantidad máxima visible
  
    if (graficoMensual) {
      const meses = t * 12;
      const saltoEtiqueta = Math.ceil(meses / MAX_LABELS_X);
  
      for (let i = 1; i <= meses; i++) {
        let acumulado;
        if (compuesto) {
          acumulado = P * Math.pow(1 + r / 12, i);
        } else {
          acumulado = P + (P * r * (i / 12));
        }
        datos.push(Math.floor(acumulado));
  
        // ✅ Etiquetas espaciadas
        if (i % saltoEtiqueta === 0 || i === 1 || i === meses) {
          labels.push(`M${i}`);
        } else {
          labels.push('');
        }
      }
    } else {
      const saltoEtiqueta = Math.ceil(t / MAX_LABELS_X);
  
      for (let i = 1; i <= t; i++) {
        let acumulado;
        if (compuesto) {
          acumulado = P * Math.pow(1 + r, i);
        } else {
          acumulado = P + (P * r * i);
        }
        datos.push(Math.floor(acumulado));
  
        // ✅ Etiquetas espaciadas también en anual
        if (i % saltoEtiqueta === 0 || i === 1 || i === t) {
          labels.push(`A${i}`);
        } else {
          labels.push('');
        }
      }
    }
  
    const A = datos[datos.length - 1];
    const interes = A - P;
  
    resultadoTexto = `Interés ${compuesto ? 'compuesto' : 'simple'}: $${interes.toLocaleString('es-CL')}\nTotal acumulado: $${A.toLocaleString('es-CL')}`;
  
    setResultado(resultadoTexto);
    setGraficoData(datos);
    setLabelData(labels);
  };
  

  // Recalcular el gráfico cuando cambie entre mensual y anual
  useEffect(() => {
    if (capital && tasa && tiempo) {
      calcular();
    }
  }, [graficoMensual, compuesto]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Calculadora de Interés</Text>

        <TextInput
          style={styles.input}
          placeholder="Capital (P)"
          keyboardType="numeric"
          value={capital}
          onChangeText={setCapital}
        />
        <TextInput
          style={styles.input}
          placeholder="Tasa de interés (%)"
          keyboardType="numeric"
          value={tasa}
          onChangeText={setTasa}
        />
        <TextInput
          style={styles.input}
          placeholder="Periodo (años)"
          keyboardType="numeric"
          value={tiempo}
          onChangeText={setTiempo}
        />

        <View style={styles.switchContainer}>
          <Text>Interés compuesto</Text>
          <Switch value={compuesto} onValueChange={setCompuesto} />
        </View>
        <View style={styles.switchContainer}>
          <Text>Mostrar gráfico mensual</Text>
          <Switch 
            value={graficoMensual} 
            onValueChange={(newValue) => {
              setGraficoMensual(newValue);
            }} 
          />
        </View>

        <Button title="Calcular" onPress={calcular} />

        {resultado && <Text style={styles.result}>{resultado}</Text>}
        
        {graficoData.length > 0 && (
          <View style={styles.graphContainer}>
            <Text style={styles.graphTitle}>
              Proyección {graficoMensual ? 'Mensual' : 'Anual'}
            </Text>
            <LineChart
              data={{
                labels: labelData,
                datasets: [{ data: graficoData }],
              }}
              width={Dimensions.get('window').width - 40}
              height={220}
              fromZero={false}
              yAxisSuffix=""
              yAxisInterval={1}
              bezier
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#f0f4f7',
                backgroundGradientTo: '#f0f4f7',
                color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '3',  // Reducido para gráficos mensuales con muchos puntos
                  strokeWidth: '2',
                  stroke: '#007AFF',
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  strokeWidth: 0.4,
                },
                formatYLabel: (value) => formatLargeNumber(value),
                decimalPlaces: 0,
              }}
              style={{
                marginTop: 10,
                borderRadius: 16,
              }}
              withInnerLines={true}
              withVerticalLines={false}
              withHorizontalLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              formatYLabel={(value) => formatLargeNumber(value)}
              hidePointsAtIndex={graficoMensual ? Array.from({ length: labelData.length }).map((_, i) => i % 3 !== 0 ? i : null).filter(i => i !== null) : []}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  graphContainer: {
    width: '100%',
    marginVertical: 15,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  }
});