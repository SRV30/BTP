import { useEffect, useState } from 'react';
import { profileApi } from '../api';

const initial = {
  name: '', email: '', profile_photo: '', phone_number: '', address: '', age: '',
  gender: 'other', disability: false, menstruation_cycle: false, cycle_days: '',
};

export default function ProfilePage() {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState('');

  useEffect(() => {
    profileApi.get().then(({ data }) => {
      setForm({ ...initial, ...data, age: data.age ?? '', cycle_days: data.cycle_days ?? '' });
    }).catch(() => setMessage('Failed to load profile'));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      age: form.age === '' ? null : Number(form.age),
      cycle_days: form.cycle_days === '' ? null : Number(form.cycle_days),
    };
    try {
      await profileApi.update(payload);
      setMessage('Profile updated');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Update failed');
    }
  };

  return (
    <section className="card">
      <h2>Profile</h2>
      <form className="grid-form" onSubmit={save}>
        {Object.entries({ name:'Name', email:'Email', profile_photo:'Photo URL', phone_number:'Phone', address:'Address' }).map(([k,l]) => (
          <label key={k}>{l}<input value={form[k] ?? ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></label>
        ))}
        <label>Age<input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></label>
        <label>Gender<select value={form.gender || 'other'} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option value="male">male</option><option value="female">female</option><option value="other">other</option></select></label>
        <label><input type="checkbox" checked={!!form.disability} onChange={(e) => setForm({ ...form, disability: e.target.checked })} /> Disability</label>
        <label><input type="checkbox" checked={!!form.menstruation_cycle} onChange={(e) => setForm({ ...form, menstruation_cycle: e.target.checked })} /> Menstruation cycle</label>
        <label>Cycle Days<input type="number" value={form.cycle_days} onChange={(e) => setForm({ ...form, cycle_days: e.target.value })} /></label>
        <button className="btn">Save Profile</button>
      </form>
      {message && <div className="hint">{message}</div>}
    </section>
  );
}
