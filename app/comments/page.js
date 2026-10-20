'use client';
import { useEffect, useState } from 'react';

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');

  async function load() {
    const res = await fetch('/api/comments');
    const data = await res.json();
    setComments(Array.isArray(data) ? data : []);
  }
  useEffect(() => { load(); }, []);

  async function onSubmit(e) {
    e.preventDefault();
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, body }),
    });
    setBody('');
    load();
  }

  return (
    <main>
      <h1>Livre d&apos;or</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 400 }}>
        <input placeholder="Nom" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <textarea placeholder="Message" value={body} onChange={(e) => setBody(e.target.value)} />
        <button type="submit">Publier</button>
      </form>
      <hr />
      {comments.map((c) => (
        <div key={c.id}>
          <strong>{c.author}</strong>
          {/* FIX: React échappe le texte, plus de dangerouslySetInnerHTML */}
          <p>{c.body}</p>
        </div>
      ))}
    </main>
  );
}
