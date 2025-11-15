import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, onClear, isSearchMode, searchQuery }) {
  const [inputValue, setInputValue] = useState(searchQuery || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleClear = () => {
    setInputValue('');
    onClear();
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by company name..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {isSearchMode && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
      {isSearchMode && (
        <div className="search-status">
          <span>🔎 Showing results for: <strong>{searchQuery}</strong></span>
        </div>
      )}
    </div>
  );
}

export default SearchBar;

