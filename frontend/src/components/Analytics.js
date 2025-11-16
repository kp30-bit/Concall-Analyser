import React, { useState, useEffect, useRef } from 'react';
import { getAnalytics } from '../services/api';
import './Analytics.css';

// Module-level cache to ensure analytics is only loaded once across all component instances
let analyticsCache = {
  data: null,
  loading: false,
  error: null,
  promise: null,
  subscribers: new Set()
};

// Function to notify all subscribers when data is loaded
function notifySubscribers(data, error) {
  analyticsCache.subscribers.forEach((setState) => {
    if (error) {
      setState({ type: 'error', error });
    } else {
      setState({ type: 'data', data });
    }
  });
}

function Analytics() {
  const [analytics, setAnalytics] = useState(analyticsCache.data);
  const [loading, setLoading] = useState(!analyticsCache.data && !analyticsCache.error);
  const [error, setError] = useState(analyticsCache.error);
  const mountedRef = useRef(true);

  useEffect(() => {
    // If we already have cached data, use it immediately
    if (analyticsCache.data) {
      setAnalytics(analyticsCache.data);
      setLoading(false);
      return;
    }

    // If there's an error, use it
    if (analyticsCache.error) {
      setError(analyticsCache.error);
      setLoading(false);
      return;
    }

    // Create a state setter function for this component instance
    const setState = (update) => {
      if (!mountedRef.current) return;
      if (update.type === 'data') {
        setAnalytics(update.data);
        setLoading(false);
      } else if (update.type === 'error') {
        setError(update.error);
        setLoading(false);
      }
    };

    // If already loading, subscribe to the existing promise
    if (analyticsCache.promise) {
      analyticsCache.subscribers.add(setState);
      analyticsCache.promise
        .then((data) => {
          if (mountedRef.current) {
            setState({ type: 'data', data });
          }
        })
        .catch((err) => {
          if (mountedRef.current) {
            setState({ type: 'error', error: err });
          }
        });
      return () => {
        analyticsCache.subscribers.delete(setState);
      };
    }

    // Start loading analytics only once - this should only happen once ever
    if (analyticsCache.loading) {
      // This shouldn't happen, but just in case
      analyticsCache.subscribers.add(setState);
      return () => {
        analyticsCache.subscribers.delete(setState);
      };
    }

    // Mark as loading and create the promise
    analyticsCache.loading = true;
    analyticsCache.subscribers.add(setState);
    
    analyticsCache.promise = (async () => {
      try {
        const data = await getAnalytics();
        analyticsCache.data = data;
        analyticsCache.error = null;
        analyticsCache.loading = false;
        notifySubscribers(data, null);
        return data;
      } catch (err) {
        const errorMsg = err.message || 'Failed to load analytics';
        analyticsCache.error = errorMsg;
        analyticsCache.loading = false;
        notifySubscribers(null, errorMsg);
        throw err;
      }
    })();

    // Cleanup: remove this component's subscriber when unmounting
    return () => {
      mountedRef.current = false;
      analyticsCache.subscribers.delete(setState);
    };
  }, []);

  // Show loading state only on initial load
  if (loading && !analytics) {
    return (
      <div className="analytics-container">
        <div className="analytics-loading">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Show error state only if we don't have any data
  if (error && !analytics) {
    return (
      <div className="analytics-container">
        <div className="analytics-error">⚠️ {error}</div>
      </div>
    );
  }

  // Always render the dashboard, even if analytics is null (will show 0s)
  const analyticsData = analytics || {
    total_visits: 0,
    unique_users: 0,
    api_hits: 0,
    endpoint_stats: {}
  };

  return (
    <div className="analytics-container">
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-card-icon">👥</div>
            <div className="analytics-card-label">Unique Users</div>
          </div>
          <div className="analytics-card-value">
            {analyticsData.unique_users?.toLocaleString() || 0}
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-card-icon">🌐</div>
            <div className="analytics-card-label">Total Visits</div>
          </div>
          <div className="analytics-card-value">
            {analyticsData.total_visits?.toLocaleString() || 0}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;

