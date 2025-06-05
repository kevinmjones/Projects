import { BrowserRouter as Router, NavLink, Routes, Route } from 'react-router-dom';
import Style from './pages/Style';
import Wardrobe from './pages/Wardrobe';
import Find from './pages/Find';
import Profile from './pages/Profile';
import './index.css';

export default function App() {
  return (
    <Router>
      <header className="bg-gray-800 text-white p-4 flex gap-4 justify-center">
        <NavLink to="/" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Style</NavLink>
        <NavLink to="/wardrobe" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Wardrobe</NavLink>
        <NavLink to="/find" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Find</NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Profile</NavLink>
      </header>
      <Routes>
        <Route path="/" element={<Style />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="/find" element={<Find />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
