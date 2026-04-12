import { useEffect, useMemo, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import { logsApi, moodApi } from '../api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

export default function DashboardPage() {
  const [form, setForm] = useState({ screen_time: 4, steps: 6000, sleep: 7, streak: 3 });
  const [today, setToday] = useState(null);
  const [trend, setTrend] = useState([]);
  const [message, setMessage] = useState('');

  const load = async () => {
    const [todayRes, trendRes] = await Promise.all([moodApi.today(), moodApi.mood7()]);
    setToday(todayRes.data);
    setTrend(trendRes.data.data || []);
  };

  useEffect(() => {
    load().catch(() => setMessage('Unable to load dashboard data'));
  }, []);

  const logToday = async (e) => {
    e.preventDefault();
    try {
      const { data } = await logsApi.create(form);
      setMessage(`Saved. Mood: ${data.mood}`);
      await load();
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Failed to save daily log');
    }
  };

  const pieData = useMemo(() => {
    if (!today?.top_emotions) return [];
    return today.top_emotions.map((row) => ({ name: row.emotion, value: row.percentage }));
  }, [today]);

  const trendData = useMemo(() => (trend || []).map((d) => ({
    date: d.date,
    sadness: d.emotion_percentages?.Sadness ?? 0,
  })), [trend]);

  return (
    <div className="grid">
      <section className="card">
        <h2>Daily Input</h2>
        <form onSubmit={logToday} className="grid-form">
          <label>Screen Time (hrs)<input type="number" min="0" max="24" step="0.1" value={form.screen_time} onChange={(e) => setForm({ ...form, screen_time: Number(e.target.value) })} /></label>
          <label>Steps<input type="number" min="0" value={form.steps} onChange={(e) => setForm({ ...form, steps: Number(e.target.value) })} /></label>
          <label>Sleep (hrs)<input type="number" min="0" max="24" step="0.1" value={form.sleep} onChange={(e) => setForm({ ...form, sleep: Number(e.target.value) })} /></label>
          <label>Streak (days)<input type="number" min="0" value={form.streak} onChange={(e) => setForm({ ...form, streak: Number(e.target.value) })} /></label>
          <button className="btn">Save Daily Log</button>
        </form>
        {message && <div className="hint">{message}</div>}
      </section>

      <section className="card">
        <h2>7-Day Mood Trend</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="sadness" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card">
        <h2>Today’s Top Emotions</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
                {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
