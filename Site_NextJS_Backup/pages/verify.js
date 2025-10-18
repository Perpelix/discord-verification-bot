import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Verify() {
  const router = useRouter();
  const { guild, user } = router.query;
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (guild && user) {
      handleVerification();
    }
  }, [guild, user]);

  const handleVerification = async () => {
    try {
      // Parse user data (should come from Discord OAuth)
      const userData = JSON.parse(decodeURIComponent(user));

      const response = await axios.post('/api/verify', {
        userId: userData.id,
        guildId: guild,
        username: userData.username,
        discriminator: userData.discriminator
      });

      if (response.data.success) {
        setStatus('success');
        setMessage('Verification successful! You can now close this page and return to Discord.');
      }
    } catch (error) {
      setStatus('error');
      if (error.response?.data?.error === 'Alt account detected') {
        setMessage('Alt account detected! This IP address is already associated with another account in this server.');
      } else {
        setMessage('Verification failed. Please try again or contact an administrator.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === 'loading' && (
          <>
            <div style={styles.spinner}></div>
            <h1 style={styles.title}>Verifying...</h1>
            <p style={styles.text}>Please wait while we verify your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={styles.successIcon}>✅</div>
            <h1 style={styles.title}>Verification Successful!</h1>
            <p style={styles.text}>{message}</p>
            <button style={styles.button} onClick={() => window.close()}>
              Close Window
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={styles.errorIcon}>❌</div>
            <h1 style={styles.title}>Verification Failed</h1>
            <p style={styles.text}>{message}</p>
            <button style={styles.button} onClick={() => window.close()}>
              Close Window
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '60px 40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '90%'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333'
  },
  text: {
    fontSize: '18px',
    color: '#666',
    lineHeight: '1.6'
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 30px'
  },
  successIcon: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  errorIcon: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  button: {
    marginTop: '30px',
    padding: '15px 40px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    background: '#667eea',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  }
};
