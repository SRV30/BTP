import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem('moodsense_token', data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form onSubmit={submit} className="card auth-card">
        <h1>Welcome back</h1>
        <p>Log in to MoodSense AI.</p>
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        {error && <div className="error">{error}</div>}
        <button className="btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        <small>New user? <Link to="/signup">Create account</Link></small>
      </form>
    </div>
  );
}
