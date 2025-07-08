import React, { useState } from "react";

function parseToInsert(text) {
  const rows = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const values = rows.map((row) => {
    // split by tab or more than one space
    const cols = row.split(/\t| +/);
    if (cols.length < 5) return null;
    // [id, fecha, valor, producto_id, scrapeado]
    // omit id (cols[0])
    // escape valor si es string, pero acá es numérico
    // fecha va entre comillas
    const fecha = cols[1];
    const valor = cols[2];
    const producto_id = cols[3];
    const scrapeado = cols[4];
    return `('${fecha}', ${valor}, ${producto_id}, ${scrapeado})`;
  }).filter(Boolean);

  if (values.length === 0) return "";

  return `INSERT INTO precio (fecha, valor, producto_id, scrapeado)\nVALUES\n${values.join(",\n")};`;
}

export default function App() {
  const [input, setInput] = useState("");
  const [sql, setSql] = useState("");
  const [copied, setCopied] = useState(false);

  function handleConvert() {
    setSql(parseToInsert(input));
    setCopied(false);
  }

  function handleCopy() {
    if (sql) {
      navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <div className="container">
      <h1>Generador SQL INSERT para tabla precio</h1>
      <label htmlFor="input">Pegá tus filas aquí (id, fecha, valor, producto_id, scrapeado):</label>
      <textarea
        id="input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ejemplo:&#10;4801	2025-07-07	1600	195	1"
      />
      <button onClick={handleConvert}>Generar SQL</button>
      {sql && (
        <div className="result">
          <button onClick={handleCopy}>Copiar resultado</button>
          {copied && <span className="copied">¡Copiado!</span>}
          <pre className="sql-out">{sql}</pre>
        </div>
      )}
    </div>
  );
}