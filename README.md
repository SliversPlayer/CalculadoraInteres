# CalculadoraInteres
calculadora interes compuesto

# 📈 Calculadora de Interés Financiero (React Native)

Una aplicación móvil que permite calcular y visualizar el crecimiento del capital a través de interés simple o compuesto, con opción de proyección mensual o anual.

## 🧠 Características principales

- Cálculo de interés simple y compuesto
- Proyección mensual o anual
- Gráficos interactivos de crecimiento del capital
- Validación visual reactiva de inputs
- Formato monetario con notación amigable (`$1M`, `$500k`, etc.)
- Interfaz moderna y responsive

## 📱 Tecnologías utilizadas

| Herramienta | Descripción |
|-------------|-------------|
| **React Native** | Framework para desarrollo móvil multiplataforma |
| **JavaScript (ES6)** | Lenguaje principal |
| **react-native-chart-kit** | Gráficos de línea para representar datos financieros |
| **React Hooks** | `useState`, `useEffect` para manejo de estado |
| **Intl.NumberFormat** | Formateo local de valores monetarios |
| **Validación personalizada** | Regex + estilos dinámicos para entradas numéricas |

## 📂 Estructura del proyecto
/src
├── App.js # Componente principal
├── components/
│ └── GraficoInteres.js # Componente de gráfico
└── utils/
├── calculadora.js # Lógica de cálculo de interés
├── puntosUniformes.js # Algoritmo para seleccionar puntos en eje X
└── formato.js # Formato de números grandes (opcional)


## 🚀 Próximas mejoras

- Exportar gráficos como imagen o PDF
- Guardar simulaciones anteriores
- Comparar distintos escenarios en el mismo gráfico
- Soporte multimoneda (CLP, USD, EUR...)
- Incluir en Google Play
