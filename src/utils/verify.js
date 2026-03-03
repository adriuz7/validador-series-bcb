export function normalizeSerie(input) {
  let clean = input.replace(/\D/g, '');
  return clean.padStart(9, '0');
}

export function verificarSerie(corte, serie, data) {
  const numero = parseInt(serie);

  for (let rango of data[corte]) {
    if (numero >= rango.desde && numero <= rango.hasta) {
      return false; // observado
    }
  }
  return true; // no observado
}