import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState(null);
  const [guilds, setGuilds] = useState([]);
  const [selectedGuild, setSelectedGuild] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchData(savedToken);
    }
  }, []);

  const fetchData = async (authToken) => {
    setLoading(true);
    try {
      const [statsRes, guildsRes] = await Promise.all([
        axios.get('/api/stats', {
          headers: { Authorization: `Bearer ${authToken}` }
        }),
        axios.get('/api/guilds/list', {
          headers: { Authorization: `Bearer ${authToken}` }
        })
      ]);

      setStats(statsRes.data.stats);
      setGuilds(guildsRes.data.guilds);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

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
        fetchData(response.data.token);
      }
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleLogout = () => {
    setToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    setStats(null);
    setGuilds([]);
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>Admin Dashboard Login</h1>
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
    <div style={styles.dashboardContainer}>
      <nav style={styles.navbar}>
        <h1 style={styles.navTitle}>Bot Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </nav>

      <div style={styles.content}>
        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>🏰</div>
                <div style={styles.statValue}>{stats?.total_guilds || 0}</div>
                <div style={styles.statLabel}>Total Guilds</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>✅</div>
                <div style={styles.statValue}>{stats?.total_verifications || 0}</div>
                <div style={styles.statLabel}>Verifications</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>🚫</div>
                <div style={styles.statValue}>{stats?.alt_accounts_detected || 0}</div>
                <div style={styles.statLabel}>Alt Accounts Detected</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>👥</div>
                <div style={styles.statValue}>{stats?.total_users || 0}</div>
                <div style={styles.statLabel}>Total Users</div>
              </div>
            </div>

            <div style={styles.guildsSection}>
              <h2 style={styles.sectionTitle}>Guilds</h2>
              <div style={styles.guildsGrid}>
                {guilds.map((guild) => (
                  <div key={guild.guild_id} style={styles.guildCard}>
                    <h3 style={styles.guildTitle}>Guild ID: {guild.guild_id}</h3>
                    <div style={styles.guildStats}>
                      <p>✅ Verifications: {guild.total_verifications}</p>
                      <p>🚫 Alt Accounts: {guild.alt_accounts_detected}</p>
                      <p>⚠️ Total Warns: {guild.total_warns}</p>
                      <p>
                        Status: {' '}
                        <span style={guild.verification_enabled ? styles.enabled : styles.disabled}>
                          {guild.verification_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loginCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '60px 40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    maxWidth: '400px',
    width: '100%'
  },
  dashboardContainer: {
    minHeight: '100vh',
    background: '#f5f7fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  navbar: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  navTitle: {
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold'
  },
  logoutButton: {
    padding: '10px 25px',
    background: 'rgba(255,255,255,0.2)',
    border: '2px solid white',
    borderRadius: '10px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px'
  },
  content: {
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  loading: {
    textAlign: 'center',
    fontSize: '24px',
    color: '#667eea',
    padding: '100px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '25px',
    marginBottom: '40px'
  },
  statCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s'
  },
  statIcon: {
    fontSize: '48px',
    marginBottom: '15px'
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: '10px'
  },
  statLabel: {
    fontSize: '16px',
    color: '#666',
    fontWeight: '500'
  },
  guildsSection: {
    marginTop: '40px'
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '25px'
  },
  guildsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  guildCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  guildTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
    wordBreak: 'break-all'
  },
  guildStats: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '2'
  },
  enabled: {
    color: '#00c853',
    fontWeight: 'bold'
  },
  disabled: {
    color: '#ff5252',
    fontWeight: 'bold'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
    textAlign: 'center'
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
  }
};
