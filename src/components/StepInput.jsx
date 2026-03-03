import Tesseract from 'tesseract.js';

async function handleImage(file) {
  if (!file) return;

  setLoading(true);

  const { data: { text } } = await Tesseract.recognize(
    file,
    'eng',
    {
      tessedit_char_whitelist: '0123456789'
    }
  );

  let numeros = text.replace(/\D/g, '');

  // Si detecta más de 9 dígitos, tomamos los últimos 9
  if (numeros.length > 9) {
    numeros = numeros.slice(-9);
  }

  // Si tiene menos, agregamos 0 adelante
  numeros = numeros.padStart(9, '0');

  setSerie(numeros);
  setLoading(false);
}
<input
  type="file"
  accept="image/*"
  capture="environment"
  onChange={(e) => handleImage(e.target.files[0])}
/>