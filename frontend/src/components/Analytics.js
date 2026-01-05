import React, { useState, useEffect, useRef } from 'react';
import { getAnalytics } from '../services/api';
import './Analytics.css';

let analyticsCache = {
  data: null,
  loading: false,
  error: null,
  promise: null,
  subscribers: new Set(),
  wsConnection: null,
  wsReconnectAttempts: 0,
  maxReconnectAttempts: 5,
  reconnectDelay: 3000
};

function notifySubscribers(data, error) {
  analyticsCache.subscribers.forEach((setState) => {
    if (error) {
      setState({ type: 'error', error });
    } else {
      setState({ type: 'data', data });
    }
  });
}

function getWebSocketURL() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  
  let host;
  if (window.location.hostname === 'localhost' && window.location.port === '3000') {
    host = 'localhost:8080';
  } else {
    host = window.location.host;
  }
  
  const url = `${protocol}//${host}/ws/analytics`;
  console.log('WebSocket URL:', url);
  return url;
}

function connectWebSocket() {
  if (analyticsCache.wsConnection && analyticsCache.wsConnection.readyState === WebSocket.OPEN) {
    return;
  }

  try {
    const ws = new WebSocket(getWebSocketURL());
    
    ws.onopen = () => {
      console.log('WebSocket connected for analytics');
      analyticsCache.wsReconnectAttempts = 0;
    };

    ws.onmessage = (event) => {
      try {
        console.log('WebSocket message received:', event.data);
        const update = JSON.parse(event.data);
        console.log('Parsed update:', update);
        if (update.type === 'analytics_update' && update.total_visits !== undefined) {
          console.log('Updating analytics with total_visits:', update.total_visits);
          analyticsCache.data = { total_visits: update.total_visits };
          notifySubscribers(analyticsCache.data, null);
        } else {
          console.warn('Unexpected message format:', update);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err, event.data);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      console.error('WebSocket URL:', getWebSocketURL());
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      analyticsCache.wsConnection = null;
      
      if (analyticsCache.wsReconnectAttempts < analyticsCache.maxReconnectAttempts) {
        analyticsCache.wsReconnectAttempts++;
        const delay = analyticsCache.reconnectDelay * analyticsCache.wsReconnectAttempts;
        console.log(`Attempting to reconnect WebSocket in ${delay}ms (attempt ${analyticsCache.wsReconnectAttempts})`);
        setTimeout(() => {
          connectWebSocket();
        }, delay);
      } else {
        console.log('Max WebSocket reconnect attempts reached');
      }
    };

    analyticsCache.wsConnection = ws;
  } catch (err) {
    console.error('Failed to create WebSocket connection:', err);
  }
}

function Analytics() {
  const [analytics, setAnalytics] = useState(analyticsCache.data);
  const [loading, setLoading] = useState(!analyticsCache.data && !analyticsCache.error);
  const [error, setError] = useState(analyticsCache.error);
  const mountedRef = useRef(true);

  useEffect(() => {
    const setState = (update) => {
      if (!mountedRef.current) return;
      if (update.type === 'data') {
        setAnalytics(update.data);
        setLoading(false);
        setError(null);
      } else if (update.type === 'error') {
        setError(update.error);
        setLoading(false);
      }
    };

    analyticsCache.subscribers.add(setState);

    if (analyticsCache.data) {
      setAnalytics(analyticsCache.data);
      setLoading(false);
    }

    if (analyticsCache.error) {
      setError(analyticsCache.error);
      setLoading(false);
    }

    if (analyticsCache.promise) {
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
    } else if (!analyticsCache.data && !analyticsCache.loading) {
      analyticsCache.loading = true;
      
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
    }

    connectWebSocket();

    return () => {
      mountedRef.current = false;
      analyticsCache.subscribers.delete(setState);
    };
  }, []);

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

  if (error && !analytics) {
    return (
      <div className="analytics-container">
        <div className="analytics-error">⚠️ {error}</div>
      </div>
    );
  }

  const analyticsData = analytics || {
    total_visits: 0
  };

  return (
    <div className="analytics-container">
      <div className="analytics-grid">
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

