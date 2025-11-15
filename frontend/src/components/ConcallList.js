import React from 'react';
import './ConcallList.css';

function ConcallList({ concalls, loading, isSearchMode, searchQuery, total }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading concalls...</p>
      </div>
    );
  }

  if (concalls.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h3>No concalls found</h3>
        <p>
          {isSearchMode
            ? `No results found for "${searchQuery}"`
            : 'No concalls available at the moment'}
        </p>
      </div>
    );
  }

  return (
    <div className="concalls-container">
      {isSearchMode && (
        <div className="results-header">
          Found {total} result{total !== 1 ? 's' : ''} for "{searchQuery}"
        </div>
      )}
      <div className="concalls-grid">
        {concalls.map((concall, index) => (
          <div key={index} className="concall-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="card-header">
              <h3 className="company-name">{concall.name}</h3>
              <span className="date-badge">{concall.date}</span>
            </div>
            <div className="card-body">
              <div className="guidance-section">
                <span className="guidance-label">FY26 Guidance:</span>
                <p className={`guidance-text ${concall.guidance === 'NA' ? 'no-guidance' : ''}`}>
                  {concall.guidance === 'NA' ? (
                    <span className="na-text">No guidance provided</span>
                  ) : (
                    concall.guidance
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConcallList;

