import Link from 'next/link';

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.logo}>🤖</div>
        <h1 style={styles.title}>Verification Bot</h1>
        <p style={styles.subtitle}>
          Advanced Discord verification system with alt account detection
        </p>

        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🔐</div>
            <h3>Secure Verification</h3>
            <p>IP-based verification system to protect your server</p>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}>🚫</div>
            <h3>Alt Detection</h3>
            <p>Automatically detect and prevent alt accounts</p>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}>⚠️</div>
            <h3>Moderation Tools</h3>
            <p>Comprehensive warn system with auto-ban</p>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}>📊</div>
            <h3>Dashboard</h3>
            <p>Manage all your servers from one place</p>
          </div>
        </div>

        <div style={styles.buttons}>
          <Link href="/dashboard" style={styles.primaryButton}>
            Open Dashboard
          </Link>
          <Link href="/google" style={styles.secondaryButton}>
            Search Users
          </Link>
        </div>

        <div style={styles.footer}>
          <p>© 2024 Verification Bot. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  },
  content: {
    maxWidth: '1200px',
    width: '100%',
    textAlign: 'center'
  },
  logo: {
    fontSize: '100px',
    marginBottom: '20px',
    animation: 'float 3s ease-in-out infinite'
  },
  title: {
    fontSize: '64px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
  },
  subtitle: {
    fontSize: '24px',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '60px'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginBottom: '60px'
  },
  feature: {
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '40px 30px',
    color: 'white',
    transition: 'transform 0.3s'
  },
  featureIcon: {
    fontSize: '60px',
    marginBottom: '20px'
  },
  buttons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '60px'
  },
  primaryButton: {
    padding: '18px 50px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#667eea',
    background: 'white',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s'
  },
  secondaryButton: {
    padding: '18px 50px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    background: 'rgba(255,255,255,0.2)',
    border: '2px solid white',
    borderRadius: '15px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.2s'
  },
  footer: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px'
  }
};
