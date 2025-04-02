// src/App.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, ScrollView } from 'react-native';
import GraficoInteres from './components/GraficoInteres';
import { calcularInteres } from './utils/calculadora';
import { seleccionarPuntosUniformes } from './utils/puntosUniformes';

export default function App() {
  const [capital, setCapital] = useState('');
  const [tasa, setTasa] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [compuesto, setCompuesto] = useState(false);
  const [graficoMensual, setGraficoMensual] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [graficoData, setGraficoData] = useState([]);
  const [labelData, setLabelData] = useState([]);

  const esNumeroValido = (valor) => /^\d+(\.\d+)?$/.test(valor.trim());

  const [errores, setErrores] = useState({
    capital: false,
    tasa: false,
    tiempo: false,
  });
  
  const validarCampos = () => {
    const nuevoEstadoErrores = {
      capital: !esNumeroValido(capital),
      tasa: !esNumeroValido(tasa),
      tiempo: !esNumeroValido(tiempo),
    };
  
    setErrores(nuevoEstadoErrores);
  
    // Devuelve true si NO hay errores
    return !Object.values(nuevoEstadoErrores).some(e => e);
  };

  const calcular = () => {
    if (!validarCampos()) {
      setResultado('Por favor ingresa valores válidos.');
      setGraficoData([]);
      setLabelData([]);
      return;
    }

    const resultado = calcularInteres({ capital, tasa, tiempo, compuesto, graficoMensual });

    if (resultado.error) {
      setResultado(resultado.error);
      setGraficoData([]);
      setLabelData([]);
      return;
    }

    const indices = seleccionarPuntosUniformes(resultado.datos.length, 7);
    const datosVisibles = indices.map(i => resultado.datos[i]);
    const etiquetasVisibles = indices.map(i => resultado.etiquetas[i]);

    const interes = resultado.total - resultado.capital;
    const textoResultado = `Interés ${compuesto ? 'compuesto' : 'simple'}: $${interes.toLocaleString('es-CL')}
Total acumulado: $${resultado.total.toLocaleString('es-CL')}`;

    setResultado(textoResultado);
    setGraficoData(datosVisibles);
    setLabelData(etiquetasVisibles);
  };

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
          style={[styles.input, errores.capital && styles.errorInput]}
          placeholder="Capital (P)"
          keyboardType="numeric"
          value={capital}
          onChangeText={(text) => {
            setCapital(text);
            setErrores((prev) => ({ ...prev, capital: !esNumeroValido(text) }));
          }}
        />
        {errores.capital && <Text style={styles.errorText}>Valor inválido</Text>}

        <TextInput
          style={[styles.input, errores.tasa && styles.errorInput]}
          placeholder="Tasa de interés (%)"
          keyboardType="numeric"
          value={tasa}
          onChangeText={(text) => {
            setTasa(text);
            setErrores((prev) => ({ ...prev, tasa: !esNumeroValido(text) }));
          }}
        />
        {errores.tasa && <Text style={styles.errorText}>Valor inválido</Text>}

        <TextInput
          style={[styles.input, errores.tiempo && styles.errorInput]}
          placeholder="Periodo (años)"
          keyboardType="numeric"
          value={tiempo}
          onChangeText={(text) => {
            setTiempo(text);
            setErrores((prev) => ({ ...prev, tiempo: !esNumeroValido(text) }));
          }}
        />
        {errores.tiempo && <Text style={styles.errorText}>Valor inválido</Text>}


        <View style={styles.switchContainer}>
          <Text>Interés compuesto</Text>
          <Switch value={compuesto} onValueChange={setCompuesto} />
        </View>
        <View style={styles.switchContainer}>
          <Text>Mostrar gráfico mensual</Text>
          <Switch
            value={graficoMensual}
            onValueChange={setGraficoMensual}
          />
        </View>

        <Button
          title="CALCULAR"
          onPress={calcular}
          color="#2196F3"
        />

        {resultado && <Text style={styles.result}>{resultado}</Text>}

        {graficoData.length > 0 && (
          <GraficoInteres labelData={labelData} graficoData={graficoData} />
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
    padding: 29,
    paddingTop: 50,
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
    marginBottom: 4,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1.5,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 5,
    fontSize: 12,
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
});