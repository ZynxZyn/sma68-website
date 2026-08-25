import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import logo from '../assets/logo.png';
import './Login.css';

const ROLE_HOME = {
  SUPER_ADMIN: '/admin',
  ADMIN: '/admin',
  GURU: '/admin',
  STAFF: '/admin',
  SISWA: '/dashboard',
};

const DEMO_ACCOUNTS = [
  { username: 'superadmin', label: 'Super Admin' },
  { username: 'admin', label: 'Admin' },
  { username: 'guru1', label: 'Guru' },
  { username: 'staff1', label: 'Staff' },
  { username: 'siswa1', label: 'Siswa' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const from = location.state?.from?.pathname;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors = {};
    if (!username.trim()) errors.username = 'Username / email wajib diisi';
    if (!password) errors.password = 'Password wajib diisi';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setBusy(true);
    try {
      const user = await login(username.trim(), password);
      const target = from && !from.startsWith('/login') ? from : ROLE_HOME[user.role] ?? '/dashboard';
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message ?? 'Gagal masuk. Periksa kembali kredensial Anda.');
    } finally {
      setBusy(false);
    }
  }

  function fillDemo(u) {
    setUsername(u);
    setPassword('Admin123!');
    setError('');
    setFieldErrors({});
  }

  return (
    <div className="login-simple-wrapper">
      <div className="login-simple-card">
        {/* Header with Logo */}
        <div className="login-simple-header">
          <Link to="/" className="login-simple-logo-link" title="Kembali ke Beranda">
            <img src={logo} alt="Logo SMA Negeri 68 Jakarta" className="login-simple-logo" />
          </Link>
          <h1 className="login-simple-title">Portal SMAN 68 Jakarta</h1>
          <p className="login-simple-subtitle">Masuk untuk mengakses sistem informasi sekolah</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-simple-alert" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-simple-form" noValidate>
          <div className="login-simple-field">
            <label htmlFor="login-username">Username / Email</label>
            <input
              id="login-username"
              type="text"
              autoComplete="username"
              placeholder="Masukkan username atau email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={fieldErrors.username ? 'is-invalid' : ''}
            />
            {fieldErrors.username && <span className="login-simple-err-msg">{fieldErrors.username}</span>}
          </div>

          <div className="login-simple-field">
            <div className="login-simple-label-row">
              <label htmlFor="login-password">Password</label>
              <a
                href="#lupa"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Silakan hubungi administrator IT sekolah untuk reset password.');
                }}
                className="login-simple-forgot"
              >
                Lupa password?
              </a>
            </div>
            <div className="login-simple-input-pwd-wrap">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldErrors.password ? 'is-invalid' : ''}
              />
              <button
                type="button"
                className="login-simple-eye-btn"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && <span className="login-simple-err-msg">{fieldErrors.password}</span>}
          </div>

          <div className="login-simple-remember-row">
            <label className="login-simple-checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Ingat saya di perangkat ini</span>
            </label>
          </div>

          <button type="submit" className="login-simple-btn" disabled={busy}>
            {busy ? 'Memverifikasi...' : 'Masuk ke Portal'}
          </button>
        </form>

        {/* Demo Fast Logins */}
        <div className="login-simple-demo-box">
          <span className="login-simple-demo-label">Akses Cepat Demo:</span>
          <div className="login-simple-demo-chips">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.username}
                type="button"
                className="login-simple-chip"
                onClick={() => fillDemo(acc.username)}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Link */}
        <div className="login-simple-footer">
          <Link to="/" className="login-simple-back-link">
            &larr; Kembali ke Website Utama
          </Link>
        </div>
      </div>
    </div>
  );
}