import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function App() {
  const [capital, setCapital] = useState('');
  const [tasa, setTasa] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [compuesto, setCompuesto] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [graficoData, setGraficoData] = useState([]);
  const [graficoMensual, setGraficoMensual] = useState(false);



  const calcular = () => {
    const P = parseFloat(capital);
    const r = parseFloat(tasa) / 100;
    const t = parseFloat(tiempo);
  
    if (isNaN(P) || isNaN(r) || isNaN(t)) {
      setResultado('Por favor ingresa valores válidos.');
      setGraficoData([]); // Limpiar gráfico si hay error
      return;
    }
  
    let resultadoTexto = '';
    const datos = [];

    if (graficoMensual) {
      const meses = t * 12;
      for (let i = 1; i <= meses; i++) {
        let acumulado;
        if (compuesto) {
          acumulado = P * Math.pow(1 + r / 12, i);
        } else {
          acumulado = P + (P * r * (i / 12));
        }
        datos.push(parseFloat(acumulado.toFixed(2)));
      }
    } else {
      for (let i = 1; i <= t; i++) {
        let acumulado;
        if (compuesto) {
          acumulado = P * Math.pow(1 + r, i);
        } else {
          acumulado = P + (P * r * i);
        }
        datos.push(parseFloat(acumulado.toFixed(2)));
      }
    }
  
    if (compuesto) {
      const A = datos[t - 1];
      resultadoTexto = `Interés compuesto: $${(A - P).toFixed(2)}\nTotal acumulado: $${A.toFixed(2)}`;
    } else {
      const A = datos[t - 1];
      resultadoTexto = `Interés simple: $${(A - P).toFixed(2)}\nTotal acumulado: $${A.toFixed(2)}`;
    }
  
    setResultado(resultadoTexto);
    setGraficoData(datos);
  };
  

  return (
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
        <Switch value={graficoMensual} onValueChange={setGraficoMensual} />
      </View>

      <Button title="Calcular" onPress={calcular} />

      {resultado && <Text style={styles.result}>{resultado}</Text>}
      {graficoData.length > 0 && (
  <LineChart
    data={{
      labels: graficoData.map((_, i) =>
        graficoMensual ? `M${i + 1}` : `Año ${i + 1}`
      ),
      datasets: [{ data: graficoData.map(v => parseFloat(v)) }],
    }}
    width={Dimensions.get('window').width - 40}
    height={220}
    yAxisSuffix="$"
    chartConfig={{
      backgroundColor: '#fff',
      backgroundGradientFrom: '#f0f4f7',
      backgroundGradientTo: '#f0f4f7',
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: '4',
        strokeWidth: '2',
        stroke: '#007AFF',
      },
    }}
    style={{
      marginTop: 20,
      borderRadius: 16,
    }}
  />
)}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
  },
});
