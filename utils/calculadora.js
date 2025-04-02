// src/utils/calculadora.js
export function calcularInteres({ capital, tasa, tiempo, compuesto, graficoMensual }) {
    const regexNumeroValido = /^\d+(\.\d+)?$/;
  
    if (
        !regexNumeroValido.test(capital.trim()) ||
        !regexNumeroValido.test(tasa.trim()) ||
        !regexNumeroValido.test(tiempo.trim())
      ) {
        return { error: 'Por favor ingresa valores válidos.' };
      }

    const P = parseFloat(capital);
    const r = parseFloat(tasa) / 100;
    const t = parseFloat(tiempo);
 
    const todosLosDatos = [];
    const todasLasEtiquetas = [];
    const tipo = graficoMensual ? 'mensual' : 'anual';
    const cantidad = graficoMensual ? Math.round(t * 12) : Math.round(t);
  
    for (let i = 1; i <= cantidad; i++) {
      let acumulado;
  
      if (compuesto) {
        acumulado = graficoMensual
          ? P * Math.pow(1 + r / 12, i)
          : P * Math.pow(1 + r, i);
      } else {
        acumulado = graficoMensual
          ? P + (P * r * (i / 12))
          : P + (P * r * i);
      }
  
      // ✅ Precisión corregida, evita distorsión visual
      todosLosDatos.push(parseFloat(acumulado.toFixed(2)));
      todasLasEtiquetas.push(`${tipo === 'mensual' ? 'M' : 'A'}${i}`);
    }
  
    return {
      datos: todosLosDatos,
      etiquetas: todasLasEtiquetas,
      total: todosLosDatos[todosLosDatos.length - 1],
      capital: P
    };
  }
  