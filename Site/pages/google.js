import { useState } from 'react';
import axios from 'axios';

export default function GoogleSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post('/api/auth/login', { username, password });
      if (response.data.success) {
        setToken(response.data.token);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.data.token);
      }
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/google',
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setResults(response.data.results);
      }
    } catch (error) {
      alert('Search failed: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>Admin Login</h1>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              style={styles.input}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.searchContainer}>
        <h1 style={styles.title}>🔍 Alt Account Search</h1>
        <p style={styles.subtitle}>Search for users and their alt accounts</p>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter username or email..."
            style={styles.searchInput}
            disabled={loading}
          />
          <button type="submit" style={styles.searchButton} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div style={styles.results}>
          {results.length === 0 && !loading && (
            <p style={styles.noResults}>No results yet. Enter a username or email to search.</p>
          )}

          {results.map((result, index) => (
            <div key={index} style={styles.resultCard}>
              <div style={styles.mainAccount}>
                <h3 style={styles.accountTitle}>Main Account</h3>
                <div style={styles.accountInfo}>
                  <p><strong>Username:</strong> {result.main_account.username}#{result.main_account.discriminator}</p>
                  <p><strong>User ID:</strong> {result.main_account.user_id}</p>
                  <p><strong>IPs Used:</strong> {result.main_account.ips.join(', ')}</p>
                  <p><strong>Servers:</strong> {result.main_account.servers.length}</p>
                </div>
              </div>

              {result.alt_accounts.length > 0 && (
                <div style={styles.altAccounts}>
                  <h3 style={styles.accountTitle}>
                    Alt Accounts Found ({result.total_alts})
                  </h3>
                  {result.alt_accounts.map((alt, altIndex) => (
                    <div key={altIndex} style={styles.altCard}>
                      <p><strong>Username:</strong> {alt.username}#{alt.discriminator}</p>
                      <p><strong>User ID:</strong> {alt.user_id}</p>
                      <p><strong>Shared IPs:</strong> {alt.shared_ips.join(', ')}</p>
                      <p><strong>Common Servers:</strong> {alt.servers_in_common.length}</p>
                    </div>
                  ))}
                </div>
              )}

              {result.alt_accounts.length === 0 && (
                <p style={styles.noAlts}>No alt accounts detected for this user.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loginCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '60px 40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    maxWidth: '400px',
    margin: '100px auto'
  },
  searchContainer: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  title: {
    fontSize: '42px',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: '10px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
  },
  subtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: '40px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  input: {
    padding: '15px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none'
  },
  searchForm: {
    display: 'flex',
    gap: '15px',
    marginBottom: '40px',
    background: 'white',
    padding: '15px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  searchInput: {
    flex: 1,
    padding: '15px 20px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none'
  },
  searchButton: {
    padding: '15px 40px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    background: '#667eea',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  button: {
    padding: '15px 40px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    background: '#667eea',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  noResults: {
    textAlign: 'center',
    color: 'white',
    fontSize: '18px',
    padding: '40px'
  },
  resultCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  mainAccount: {
    marginBottom: '30px',
    paddingBottom: '30px',
    borderBottom: '2px solid #e0e0e0'
  },
  accountTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#667eea'
  },
  accountInfo: {
    fontSize: '16px',
    color: '#333',
    lineHeight: '1.8'
  },
  altAccounts: {
    marginTop: '20px'
  },
  altCard: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '15px',
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.8'
  },
  noAlts: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '20px'
  }
};
