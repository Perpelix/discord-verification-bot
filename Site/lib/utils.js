import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export function getClientInfo(req) {
  // Get IP address
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;

  // Get user agent
  const userAgent = req.headers['user-agent'] || 'Unknown';

  // Get browser info
  const browser = parseBrowser(userAgent);

  return {
    ip,
    userAgent,
    browser,
    timestamp: new Date().toISOString()
  };
}

export function parseBrowser(userAgent) {
  const UAParser = require('ua-parser-js');
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    browser: result.browser.name || 'Unknown',
    version: result.browser.version || 'Unknown',
    os: result.os.name || 'Unknown',
    device: result.device.type || 'desktop'
  };
}

export function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export function authenticateRequest(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  return verifyToken(token);
}
