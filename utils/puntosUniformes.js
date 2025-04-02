export function seleccionarPuntosUniformes(longitud, numPuntos = 6) {
  if (longitud <= numPuntos) return Array.from({ length: longitud }, (_, i) => i);

  const step = Math.floor(longitud / (numPuntos - 1));
  const indices = [];

  for (let i = 0; i < numPuntos - 1; i++) {
    indices.push(i * step);
  }

  indices.push(longitud - 1); // asegúrate de agregar el último

  return indices;
}
