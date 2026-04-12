import { useEffect, useState } from 'react';
import { moodApi } from '../api';

export default function InsightsPage() {
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    moodApi.insights()
      .then(({ data }) => setInsights(data))
      .catch((err) => setError(err.response?.data?.detail || 'Failed to load AI insights'));
  }, []);

  return (
    <section className="card">
      <h2>AI Insights</h2>
      {error && <div className="error">{error}</div>}
      {insights && (
        <>
          <p>{insights.emotional_assessment}</p>
          <h3>Recommendations</h3>
          <ul className="list">
            {(insights.recommendations || []).map((rec) => <li key={rec}>{rec}</li>)}
          </ul>
        </>
      )}
    </section>
  );
}
