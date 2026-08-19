import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { X, Lock, Mail, User, AlertCircle, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AuthModal() {
  const {
    authModalOpen,
    authModalMode,
    setAuthModalMode,
    closeAuthModal,
    login,
    register,
  } = useAuth();
  const { showToast } = useCart();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!authModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email.trim(), password);
        showToast('Successfully signed in!', 'success');
      } else {
        if (!fullName.trim()) {
          throw new Error('Please enter your full name.');
        }
        await register(fullName.trim(), email.trim(), password);
        showToast('Account created successfully!', 'success');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('alex.morgan@example.com');
    setPassword('password123');
    if (!isLogin) {
      setFullName('Alex Morgan');
    }
    setError(null);
  };

  return (
    <div className="auth-modal-backdrop" onClick={closeAuthModal}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={closeAuthModal} className="auth-modal-close" aria-label="Close modal">
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-header-icon-box">
            <User size={24} />
          </div>
          <h2 className="auth-modal-title">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="auth-modal-subtitle">
            {isLogin
              ? 'Enter your credentials to access your account & orders'
              : 'Sign up to place orders and manage your shopping experience'}
          </p>
        </div>

        {/* Demo Account Quick Fill Button */}
        <div className="demo-account-box">
          <button type="button" onClick={handleFillDemo} className="fill-demo-btn">
            <Sparkles size={14} /> Quick-fill Demo Account (alex.morgan@example.com)
          </button>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-modal-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User size={16} className="field-icon" />
                <input
                  type="text"
                  required
                  placeholder="Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="field-icon" />
              <input
                type="email"
                required
                placeholder="alex.morgan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? (
              <LoadingSpinner message={isLogin ? 'Authenticating...' : 'Creating Account...'} />
            ) : (
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div className="auth-modal-footer">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setAuthModalMode('register');
                }}
                className="switch-mode-btn"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setAuthModalMode('login');
                }}
                className="switch-mode-btn"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
