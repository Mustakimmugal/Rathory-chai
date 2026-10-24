import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Brewing something special...</p>
    </div>
  );
}
