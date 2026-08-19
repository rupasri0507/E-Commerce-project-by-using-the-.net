import React from 'react';
import { ShoppingBag, Server, Database, Code2, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-brand">
              <ShoppingBag size={20} className="footer-logo-icon" />
              <span className="footer-title">DevStore</span>
            </div>
            <p className="footer-tagline">
              A high-performance full-stack e-commerce web application engineered with ASP.NET Core Web API (.NET 8), Entity Framework Core, SQL Server, and modern React.
            </p>
            <div className="footer-tech-pills">
              <span className="tech-pill"><Server size={13} /> ASP.NET Core .NET 8</span>
              <span className="tech-pill"><Database size={13} /> EF Core & SQL Server</span>
              <span className="tech-pill"><Code2 size={13} /> React + Vite</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Architecture</h4>
            <ul className="footer-links">
              <li><span className="link-text">RESTful Web API Controllers</span></li>
              <li><span className="link-text">Code-First EF Core Migrations</span></li>
              <li><span className="link-text">BCrypt Password Security</span></li>
              <li><span className="link-text">Server-side Stock & Pricing Integrity</span></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-heading">API Endpoints</h4>
            <ul className="footer-links">
              <li><a href="http://localhost:5000/swagger" target="_blank" rel="noreferrer" className="footer-link">Swagger / OpenAPI UI</a></li>
              <li><a href="http://localhost:5000/api/products" target="_blank" rel="noreferrer" className="footer-link">GET /api/products</a></li>
              <li><a href="http://localhost:5000/api/health" target="_blank" rel="noreferrer" className="footer-link">GET /api/health</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            Built as a self-directed full-stack learning project to demonstrate clean architecture and production-ready .NET 8 & React development.
          </p>
          <div className="footer-credit">
            <span>Crafted with</span>
            <Heart size={14} className="heart-icon" />
            <span>in C# & React</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
