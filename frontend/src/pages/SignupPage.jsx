import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const { data } = await authApi.signup({ email, password });
      setMessage(data.message || 'Signup successful. Redirecting...');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
    }
  };

  return (
    <div className="auth-wrap">
      <form onSubmit={submit} className="card auth-card">
        <h1>Create account</h1>
        <p>Start tracking mood and wellness signals.</p>
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Password (min 8 chars)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
        <button className="btn">Sign up</button>
        <small>Have an account? <Link to="/login">Log in</Link></small>
      </form>
    </div>
  );
}
