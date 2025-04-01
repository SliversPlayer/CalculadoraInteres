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
  const [todosLosPuntos, setTodosLosPuntos] = useState([]);
  const [indicesVisibles, setIndicesVisibles] = useState([]);

  // Función para formatear números grandes
  const formatLargeNumber = (value) => {
    const numValue = parseInt(value);
    
    if (numValue >= 1000000) {
      return `$${(numValue / 1000000).toFixed(1)}M`;
    } else if (numValue >= 1000) {
      return `$${(numValue / 1000).toFixed(1)}k`;
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
    const todosLosDatos = [];
    const todasLasEtiquetas = [];
    const indicesAMostrar = [];
  
    if (graficoMensual) {
      const meses = t * 12;
      
      // Determinamos cuántos puntos mostrar (máximo 6-8)
      const numPuntosAMostrar = Math.min(6, meses);
      
      // Calculamos el "paso" entre los meses que mostraremos
      const paso = Math.max(1, Math.floor(meses / (numPuntosAMostrar - 1)));
      
      for (let i = 0; i < meses; i++) {
        const mes = i + 1;
        let acumulado = compuesto
          ? P * Math.pow(1 + r / 12, mes)
          : P + (P * r * (mes / 12));
  
        todosLosDatos.push(Math.floor(acumulado));
        todasLasEtiquetas.push(`M${mes}`);
        
        // Seleccionamos puntos estratégicos:
        // - Siempre mostramos el primer mes
        // - Siempre mostramos el último mes
        // - Mostramos meses intermedios según el paso calculado
        if (mes === 1 || mes === meses || (mes % paso === 0 && mes !== 1 && mes !== meses)) {
          indicesAMostrar.push(i);
        }
      }
    } else {
      const años = parseInt(t);
      
      // Similar a lo anterior pero para años
      const numPuntosAMostrar = Math.min(8, años);
      const paso = Math.max(1, Math.floor(años / (numPuntosAMostrar - 1)));
      
      for (let i = 0; i < años; i++) {
        const año = i + 1;
        let acumulado = compuesto
          ? P * Math.pow(1 + r, año)
          : P + (P * r * año);
  
        todosLosDatos.push(Math.floor(acumulado));
        todasLasEtiquetas.push(`A${año}`);
        
        if (año === 1 || año === años || (año % paso === 0 && año !== 1 && año !== años)) {
          indicesAMostrar.push(i);
        }
      }
    }
  
    // Filtramos para mostrar solo los puntos seleccionados
    const datosVisibles = indicesAMostrar.map(index => todosLosDatos[index]);
    const etiquetasVisibles = indicesAMostrar.map(index => todasLasEtiquetas[index]);
  
    const A = todosLosDatos[todosLosDatos.length - 1];
    const interes = A - P;
  
    resultadoTexto = `Interés ${compuesto ? 'compuesto' : 'simple'}: $${interes.toLocaleString('es-CL')}\nTotal acumulado: $${A.toLocaleString('es-CL')}`;
  
    setResultado(resultadoTexto);
    setGraficoData(datosVisibles);
    setLabelData(etiquetasVisibles);
    setTodosLosPuntos(todosLosDatos);
    setIndicesVisibles(indicesAMostrar);
  };
  
  // Recalcular el gráfico cuando cambie entre mensual y anual
  useEffect(() => {
    if (capital && tasa && tiempo) {
      calcular();
    }
  }, [graficoMensual, compuesto]);

  // Calculamos el ancho disponible para el gráfico (con margen de seguridad)
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 60; // Reducimos el ancho para asegurar que no sobresalga

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

        <Button 
          title="CALCULAR" 
          onPress={calcular}
          color="#2196F3"
        />

        {resultado && <Text style={styles.result}>{resultado}</Text>}
        
        {graficoData.length > 0 && (
          <View style={styles.graphContainer}>
            <Text style={styles.graphTitle}>
              Proyección {graficoMensual ? 'Mensual' : 'Anual'}
            </Text>
            <View style={styles.chartWrapper}>
              <LineChart
                data={{
                  labels: labelData,
                  datasets: [{ 
                    data: graficoData,
                    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // Color azul más vibrante
                    strokeWidth: 2
                  }],
                }}
                width={chartWidth}
                height={220}
                fromZero={false}
                yAxisSuffix=""
                yAxisInterval={1}
                bezier={false}
                chartConfig={{
                  backgroundColor: '#f8f9fa',
                  backgroundGradientFrom: '#f8f9fa',
                  backgroundGradientTo: '#f8f9fa',
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '5',
                    strokeWidth: '1',
                    stroke: '#2196F3',
                    fill: '#ffffff'
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    strokeWidth: 0.5,
                    stroke: '#E0E0E0'
                  },
                  formatYLabel: (value) => formatLargeNumber(value),
                  decimalPlaces: 0,
                  // Aumentamos el padding a la izquierda para evitar cortar el eje Y
                  paddingLeft: 15,
                  // Ajustamos el padding derecho para evitar que el gráfico sobresalga
                  paddingRight: 25,
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                  // Quitamos el paddingRight que teníamos antes para evitar duplicar ajustes
                }}
                withInnerLines={true}
                withVerticalLines={true}
                withHorizontalLines={true}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                formatYLabel={(value) => formatLargeNumber(value)}
                segments={5}
                // Ajustamos el ancho de la etiqueta Y para evitar cortes
                yAxisLabelWidth={50}
              />
            </View>
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
    fontWeight: '500',
  },
  graphContainer: {
    width: '100%',
    marginVertical: 15,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    // Aseguramos overflow hidden para que nada sobresalga del contenedor
    overflow: 'hidden',
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  // Nuevo contenedor para el gráfico para asegurar que nada sobresalga
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  }
});