export const metadata = { title: 'DevSecOps Workshop', description: 'App volontairement vulnérable' };

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: 'sans-serif', maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
        <nav style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <a href="/">Accueil</a>
          <a href="/login">Login</a>
          <a href="/search">Recherche</a>
          <a href="/comments">Commentaires</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
