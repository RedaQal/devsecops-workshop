export default function Home() {
  return (
    <main>
      <h1>DevSecOps Workshop</h1>
      <p>⚠️ Application volontairement vulnérable. Ne jamais déployer en production.</p>
      <ul>
        <li><a href="/login">/login</a>: authentification</li>
        <li><a href="/search">/search</a>: recherche de produits</li>
        <li><a href="/comments">/comments</a>: livre d&apos;or</li>
        <li><a href="/api/ping?host=127.0.0.1">/api/ping</a>: test de connectivité</li>
        <li><a href="/api/file?name=welcome.txt">/api/file</a>: lecture de fichiers</li>
      </ul>
    </main>
  );
}
