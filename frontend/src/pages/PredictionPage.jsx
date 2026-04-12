import { useState } from 'react';
import { moodApi } from '../api';

export default function PredictionPage() {
  const [predictions, setPredictions] = useState([]);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState('');

  const runPrediction = async () => {
    setError('');
    try {
      const { data } = await moodApi.predict();
      setPredictions(data.predictions || []);
      setMeta(data.personalization_applied || null);
      if (data.message) setError(data.message);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed');
    }
  };

  return (
    <section className="card">
      <h2>Next-Day Emotion Prediction</h2>
      <p>Uses recent mood profile and personalization context from your account.</p>
      <button className="btn" onClick={runPrediction}>Run prediction</button>
      {error && <div className="error">{error}</div>}
      <ul className="list">
        {predictions.map((item) => (
          <li key={item.emotion}><strong>{item.emotion}</strong> — {item.probability}%</li>
        ))}
      </ul>
      {meta && (
        <div className="hint">
          Personalization: cycle adjustment = {String(meta.cycle_stress_adjustment)}, history days = {meta.history_baseline_days}
        </div>
      )}
    </section>
  );
}
