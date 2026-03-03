import { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import { normalizeSerie, verificarSerie } from './utils/verify';
import './styles.css';

function App() {

  const [step, setStep] = useState(1);
  const [corte, setCorte] = useState(null);
  const [serie, setSerie] = useState('');
  const [data, setData] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}series.json`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    document.body.className = dark ? "dark" : "light";
    localStorage.setItem("darkMode", dark);
  }, [dark]);

  async function handleImage(file) {
    if (!file) return;

    setLoading(true);

    const { data: { text } } = await Tesseract.recognize(
      file,
      'eng'
    );

    const numeros = text.replace(/\D/g, '');
    setSerie(numeros);
    setLoading(false);
  }

  function handleVerify() {
    if (!data || !corte) {
      alert("Datos aún no cargados");
      return;
    }

    const normal = normalizeSerie(serie);
    const valido = verificarSerie(corte, normal, data);

    setResultado(valido);
    setStep(3);
  }

  return (
    <div className="container">
      <button onClick={() => setDark(!dark)}>
        {dark ? "☀ Modo Claro" : "🌙 Modo Oscuro"}
      </button>
      
      <h1>Verificador de Número de Serie</h1>
      <p style={{fontSize: "14px", marginBottom: "10px"}}>
        Última actualización: {new Date().toLocaleDateString('es-BO')}
      </p>
      {step === 1 && (
        <>
          <h2>Seleccione Corte</h2>
          <button onClick={() => {setCorte("10"); setStep(2)}}>10 Bs</button>
          <button onClick={() => {setCorte("20"); setStep(2)}}>20 Bs</button>
          <button onClick={() => {setCorte("50"); setStep(2)}}>50 Bs</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Ingrese la serie"
            value={serie}
            onChange={(e) => setSerie(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleImage(e.target.files[0])}
          />

          {loading && <p>Escaneando...</p>}

          <button onClick={handleVerify}>Verificar</button>
        </>
      )}

      {step === 3 && (
        <>
          {resultado ? (
            <div className="ok">✔ Serie no observada</div>
          ) : (
            <div className="error">❌ Billete observado</div>
          )}
          <button onClick={() => {
            setSerie('');
            setResultado(null);
            setStep(1);
          }}>
            Verificar otro
          </button>
        </>
      )}
      <hr style={{marginTop: "30px"}} />

      <p style={{
        fontSize: "12px",
        color: "#444",
        marginTop: "10px"
      }}>
        Este sitio NO pertenece al Banco Central de Bolivia. 
        Es una herramienta independiente que facilita la verificación 
        utilizando datos públicos sobre rangos reportados de billetes siniestrados.
      </p>
      <a
        href="https://www.bcb.gob.bo/?q=content/verificador-de-n%C3%BAmero-de-serie"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          marginTop: "15px",
          fontSize: "14px",
          color: "#1976d2",
          textDecoration: "none",
          fontWeight: "bold"
        }}
      >
        Ver fuente oficial del Banco Central de Bolivia
      </a>
    </div>
  );
}

export default App;