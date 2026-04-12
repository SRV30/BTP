import { useEffect, useState } from 'react';
import { moodApi } from '../api';

export default function DepressionPage() {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    moodApi.depression().then(({ data }) => setAnalysis(data)).catch(() => setAnalysis({ percentage: 0, severity: 'low' }));
  }, []);

  const severityClass = analysis?.severity === 'high' ? 'danger' : analysis?.severity === 'moderate' ? 'warn' : 'ok';

  return (
    <section className="card">
      <h2>Depression Analysis</h2>
      {analysis ? (
        <div className="meter-wrap">
          <div className="meter"><div className={`meter-fill ${severityClass}`} style={{ width: `${analysis.percentage}%` }} /></div>
          <p><strong>{analysis.percentage}%</strong> — severity: <strong>{analysis.severity}</strong></p>
        </div>
      ) : <p>Loading...</p>}
    </section>
  );
}
