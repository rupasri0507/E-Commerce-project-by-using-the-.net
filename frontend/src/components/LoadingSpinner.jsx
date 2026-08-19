import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...', fullScreen = false }) {
  return (
    <div className={`spinner-wrapper ${fullScreen ? 'spinner-fullscreen' : ''}`}>
      <Loader2 className="spinner-icon" size={36} />
      <p className="spinner-text">{message}</p>
    </div>
  );
}
