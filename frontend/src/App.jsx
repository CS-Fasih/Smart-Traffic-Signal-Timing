import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Simulator from './pages/Simulator';
import Optimizer from './pages/Optimizer';
import Dashboard from './pages/Dashboard';
import Comparison from './pages/Comparison';
import Methodology from './pages/Methodology';
import Team from './pages/Team';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="bg-grid-pattern" />
        <div className="bg-radial-glow" />
        <div className="bg-radial-glow-2" />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/optimizer" element={<Optimizer />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/team" element={<Team />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
