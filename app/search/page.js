'use client';
import { useState } from 'react';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/search?q=' + encodeURIComponent(q));
    const data = await res.json();
    if (data.error) { setError(data.error); setRows([]); }
    else { setError(''); setRows(data.results); }
  }

  return (
    <main>
      <h1>Recherche de produits</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="Nom du produit" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="submit">Chercher</button>
      </form>
      {error && <pre style={{ color: 'crimson' }}>{error}</pre>}
      <ul>
        {rows.map((r, i) => (
          <li key={i}>{r.name}: {r.price}</li>
        ))}
      </ul>
    </main>
  );
}
