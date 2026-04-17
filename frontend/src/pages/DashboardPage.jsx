import { useEffect, useMemo, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { logsApi, moodApi } from "../api";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

export default function DashboardPage() {
  const [form, setForm] = useState({
    screen_time: 4,
    steps: 6000,
    sleep: 7,
    streak: 3,
  });

  const [today, setToday] = useState(null);
  const [trend, setTrend] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [todayRes, trendRes] = await Promise.all([
        moodApi.today(),
        moodApi.mood7(),
      ]);
      setToday(todayRes.data);
      setTrend(trendRes.data.data || []);
    } catch {
      setMessage("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const logToday = async (e) => {
    e.preventDefault();
    setMessage("Saving...");
    try {
      const { data } = await logsApi.create(form);
      setMessage(`Saved successfully. Mood: ${data.mood}`);
      await load();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to save daily log");
    }
  };

  const pieData = useMemo(() => {
    if (!today?.top_emotions) return [];
    return today.top_emotions.map((row) => ({
      name: row.emotion,
      value: row.percentage,
    }));
  }, [today]);

  const trendData = useMemo(
    () =>
      (trend || []).map((d) => ({
        date: d.date,
        happy: d.emotion_percentages?.Joy ?? 0,
        sad: d.emotion_percentages?.Sadness ?? 0,
        anxious: d.emotion_percentages?.Fear ?? 0,
        angry: d.emotion_percentages?.Anger ?? 0,
      })),
    [trend]
  );

  if (loading) {
    return <div className="content">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <section className="card dashboard-card">
        <div className="card-header">
          <h2>Daily Input</h2>
          <p className="hint">Track your daily activity</p>
        </div>

        <form onSubmit={logToday} className="form-grid">
          <label>
            Screen Time (hrs)
            <input
              type="number"
              min="0"
              max="24"
              step="0.1"
              value={form.screen_time}
              onChange={(e) =>
                setForm({ ...form, screen_time: Number(e.target.value) })
              }
            />
          </label>

          <label>
            Steps
            <input
              type="number"
              min="0"
              value={form.steps}
              onChange={(e) =>
                setForm({ ...form, steps: Number(e.target.value) })
              }
            />
          </label>

          <label>
            Sleep (hrs)
            <input
              type="number"
              min="0"
              max="24"
              step="0.1"
              value={form.sleep}
              onChange={(e) =>
                setForm({ ...form, sleep: Number(e.target.value) })
              }
            />
          </label>

          <label>
            Streak (days)
            <input
              type="number"
              min="0"
              value={form.streak}
              onChange={(e) =>
                setForm({ ...form, streak: Number(e.target.value) })
              }
            />
          </label>

          <button className="btn">Save Daily Log</button>
        </form>

        {message && <div className="hint">{message}</div>}
      </section>

      <section className="card dashboard-card">
        <div className="card-header">
          <h2>7-Day Mood Trend</h2>
          <p className="hint">Emotion trends over time</p>
        </div>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={trendData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis domain={[0, 100]} stroke="#94a3b8" />
              <Tooltip />
              <Legend />

              <Line type="monotone" dataKey="happy" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="sad" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="anxious" stroke="#f97316" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="angry" stroke="#ef4444" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card dashboard-card">
        <div className="card-header">
          <h2>Top Emotions Today</h2>
          <p className="hint">Emotion distribution</p>
        </div>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
              >
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}