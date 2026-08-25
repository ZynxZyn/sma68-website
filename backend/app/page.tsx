export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>SMA Negeri 68 Jakarta — Backend API</h1>
      <p>Server berjalan. Gunakan <code>/api/*</code> untuk endpoint.</p>
      <ul>
        <li><code>POST /api/auth/login</code></li>
        <li><code>POST /api/auth/refresh</code></li>
        <li><code>POST /api/auth/logout</code></li>
        <li><code>GET /api/auth/me</code></li>
        <li><code>GET/POST /api/news</code></li>
        <li><code>GET/POST /api/announcements</code></li>
        <li><code>GET/POST /api/agenda</code></li>
        <li><code>GET/POST /api/achievements</code></li>
        <li><code>GET/POST /api/gallery</code></li>
        <li><code>GET/POST /api/users</code></li>
      </ul>
    </main>
  );
}
