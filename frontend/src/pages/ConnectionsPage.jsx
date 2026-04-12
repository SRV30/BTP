import { useEffect, useState } from 'react';
import { connectionApi } from '../api';

export default function ConnectionsPage() {
  const [email, setEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [connections, setConnections] = useState([]);
  const [message, setMessage] = useState('');

  const refresh = () => connectionApi.list().then(({ data }) => setConnections(data.connections || []));
  useEffect(() => { refresh().catch(() => setMessage('Failed to load connections')); }, []);

  const search = async () => {
    try {
      const { data } = await connectionApi.search(email);
      setSearchResult(data);
    } catch {
      setMessage('Search failed');
    }
  };

  const sendRequest = async () => {
    try {
      const { data } = await connectionApi.request({ email });
      setMessage(data.message || 'Request sent');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Request failed');
    }
  };

  return (
    <section className="card">
      <h2>Connections</h2>
      <div className="row">
        <input placeholder="friend@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn" onClick={search}>Search</button>
        <button className="btn btn-ghost" onClick={sendRequest}>Send Request</button>
      </div>
      {searchResult && <pre className="json-box">{JSON.stringify(searchResult, null, 2)}</pre>}
      {message && <div className="hint">{message}</div>}
      <h3>Your accepted connections</h3>
      <div className="list-cards">
        {connections.map((c) => (
          <article className="mini-card" key={c.email}>
            <h4>{c.name || c.email}</h4>
            <p>{c.email}</p>
            <p>Current mood: {c.current_mood || 'N/A'}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
