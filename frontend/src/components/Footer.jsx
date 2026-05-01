import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">🧬</span>
            <div>
              <h3 className="gradient-text">TrafficGA Optimizer</h3>
              <p>Evolutionary Optimization of Urban Traffic Signal Timing</p>
            </div>
          </div>
          <div className="footer-info">
            <p className="footer-course">
              <span className="footer-label">Course:</span> Evolutionary Computing
            </p>
            <p className="footer-university">
              <span className="footer-label">University:</span> Dawood University of Engineering & Technology
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 TrafficGA Optimizer — Built with Python, React, and Genetic Algorithms</p>
        </div>
      </div>
    </footer>
  );
}
