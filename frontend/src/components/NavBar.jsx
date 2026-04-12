import { NavLink, useNavigate } from 'react-router-dom';

const links = [
  ['/', 'Dashboard'],
  ['/prediction', 'Prediction'],
  ['/insights', 'AI Insights'],
  ['/depression', 'Depression'],
  ['/doctors', 'Nearby Doctors'],
  ['/connections', 'Connections'],
  ['/profile', 'Profile'],
];

export default function NavBar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('moodsense_token');
    navigate('/login');
  };

  return (
    <header className="nav-shell">
      <div className="brand">MoodSense AI</div>
      <nav className="nav-links">
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
            {label}
          </NavLink>
        ))}
      </nav>
      <button onClick={logout} className="btn btn-ghost">Logout</button>
    </header>
  );
}
