import { useState } from 'react';
import { locationApi } from '../api';

export default function DoctorsPage() {
  const [params, setParams] = useState({ latitude: 37.7749, longitude: -122.4194, radius_km: 50, provider_type: 'all' });
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const search = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await locationApi.search(params);
      setResults(data.results || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Search failed');
    }
  };

  return (
    <section className="card">
      <h2>Nearby Doctors</h2>
      <form className="grid-form" onSubmit={search}>
        <label>Latitude<input type="number" step="0.0001" value={params.latitude} onChange={(e) => setParams({ ...params, latitude: Number(e.target.value) })} /></label>
        <label>Longitude<input type="number" step="0.0001" value={params.longitude} onChange={(e) => setParams({ ...params, longitude: Number(e.target.value) })} /></label>
        <label>Radius km<input type="number" min="50" max="100" value={params.radius_km} onChange={(e) => setParams({ ...params, radius_km: Number(e.target.value) })} /></label>
        <label>Provider<select value={params.provider_type} onChange={(e) => setParams({ ...params, provider_type: e.target.value })}><option value="all">all</option><option value="psychiatrist">psychiatrist</option><option value="psychologist">psychologist</option></select></label>
        <button className="btn">Search</button>
      </form>
      {error && <div className="error">{error}</div>}
      <div className="list-cards">
        {results.map((r) => (
          <article className="mini-card" key={`${r.name}-${r.type}`}>
            <h4>{r.name}</h4>
            <p>{r.type}</p>
            <p>{r.address}</p>
            <p>{r.distance_km} km</p>
          </article>
        ))}
      </div>
    </section>
  );
}
