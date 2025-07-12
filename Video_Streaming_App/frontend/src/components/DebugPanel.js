import React, { useState } from 'react';
import axios from 'axios';

const DebugPanel = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://stream-zone-7vz7rkonw-abhishek-kumars-projects-1de91d80.vercel.app/api'
    : 'http://localhost:5000/api';

  const testDatabaseConnection = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/auth/test`);
      setTestResult(response.data);
    } catch (error) {
      setTestResult({
        error: true,
        message: error.response?.data?.message || error.message,
        details: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    setLoading(true);
    try {
      const timestamp = Date.now().toString().slice(-6); // Get last 6 digits
      const testUser = {
        username: `test${timestamp}`,
        email: `test${timestamp}@example.com`,
        password: 'testpass123'
      };
      
      const response = await axios.post(`${API_URL}/auth/register`, testUser);
      setTestResult({
        success: true,
        message: 'Test registration successful',
        data: response.data
      });
    } catch (error) {
      setTestResult({
        error: true,
        message: 'Test registration failed',
        details: error.response?.data || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) {
    return (
      <div
        className="debug-panel"
        style={{
          padding: '8px 12px',
          width: 'auto',
          minWidth: '60px',
          textAlign: 'center',
          cursor: 'pointer',
          fontSize: '12px',
          zIndex: 1000
        }}
        onClick={() => setIsVisible(true)}
      >
        Debug
      </div>
    );
  }

  return (
    <div className="debug-panel">
      <button
        className="debug-panel-close"
        onClick={() => setIsVisible(false)}
        aria-label="Close debug panel"
        title="Close"
      >
        ×
      </button>
      <h4 style={{ margin: '0 0 10px 0' }}>Debug Panel</h4>
      <div style={{ marginBottom: '10px' }}>
        <button 
          className="debug-panel-btn"
          onClick={testDatabaseConnection}
          disabled={loading}
        >
          Test DB
        </button>
        <button 
          className="debug-panel-btn"
          onClick={testRegistration}
          disabled={loading}
        >
          Test Reg
        </button>
        <button 
          className="debug-panel-btn"
          onClick={() => setTestResult(null)}
        >
          Clear
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {testResult && (
        <div style={{
          background: testResult.error ? '#ffe6e6' : '#e6ffe6',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '11px',
          maxHeight: '200px',
          overflow: 'auto',
          color: testResult.error ? '#b30000' : '#006600',
          marginTop: '8px'
        }}>
          <strong>{testResult.error ? 'Error:' : 'Success:'}</strong> {testResult.message}
          {testResult.details && (
            <pre style={{ fontSize: '10px', marginTop: '5px' }}>
              {JSON.stringify(testResult.details, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default DebugPanel; 