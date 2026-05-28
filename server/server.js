/**
 * SnapFeed Global Technology Corporation — Authentication Management Subsystem Engine
 * Run-Time Target: Node.js (Express Framework Platform Environment architecture)
 */

const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const path = require('path');

const serverApp = express();

// Set Deployment Parameters
const NET_PORT = process.env.PORT || 5000;
const TOKEN_SIGNING_SECRET = process.env.JWT_SECRET || 'SYS_ENGINE_HIGH_VALUE_FALLBACK_SIGNING_KEY_CLUSTER_9921A';

// Mock Storage Array (Emulates persistent database models safely)
const userPersistenceDatabase = [
  {
    uid: "812b-49fc-9213-fa519808",
    handle: "creator_test",
    email: "alex@example.com",
    passwordHash: "$2a$12$R9h/cIPz0gi.UR3A3rJJ7OQxsmIJKVv7RzYgX.wJ39.B8QWftF/p2", // Plaintext check: "Testing123!"
    name: "Sarobar Adhikari"
  }
];

// Apply System Architecture Hardening Rules via Global Middleware Components
serverApp.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"]
    }
  }
}));

// Restrict parsing metrics to prevent large buffer ingestion attacks
serverApp.use(express.json({ limit: '20kb' }));
serverApp.use(express.urlencoded({ extended: true, limit: '20kb' }));

// Brute-Force Password Cracking Mitigation Rules Configuration
const accessControlLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes observation cycles
  max: 5, // Freeze specific socket connections automatically after 5 continuous failures
  message: { status: "fail", message: "Security lockout: Too many sequential credential verification failures from this node." }
});

// Primary RESTful API Pipeline Endpoints
serverApp.post('/api/v1/auth/login', accessControlLimiter, async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ status: "fail", message: "Required authorization fields missing from payload package." });
    }

    const cleanId = identifier.trim().toLowerCase();
    
    // Look up target account record matching identity attributes
    const recordMatch = userPersistenceDatabase.find(user => 
      user.email.toLowerCase() === cleanId || user.handle.toLowerCase() === cleanId
    );

    if (!recordMatch) {
      // Obfuscated output prevents account discovery profiling
      return res.status(401).json({ status: "unauthorized", message: "Invalid identity credentials configuration provided." });
    }

    // Evaluate matching password hashes securely via bcrypt algorithm
    const credentialsMatch = await bcrypt.compare(password, recordMatch.passwordHash);
    if (!credentialsMatch) {
      return res.status(401).json({ status: "unauthorized", message: "Invalid identity credentials configuration provided." });
    }

    // Generate authenticated signed access token structures
    const webAuthSessionToken = jwt.sign(
      { sub: recordMatch.uid, usr: recordMatch.handle },
      TOKEN_SIGNING_SECRET,
      { algorithm: 'HS256', expiresIn: '1h' }
    );

    // Bind session authorization data within strict transport security headers
    res.setHeader('Set-Cookie', `__Secure-SnapFeedAuth=${webAuthSessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`);
    
    return res.status(200).json({
      status: "success",
      user: { name: recordMatch.name, handle: recordMatch.handle }
    });

  } catch (internalSystemFault) {
    console.error("System Failure Logged in Core Processing Module:", internalSystemFault);
    return res.status(500).json({ status: "error", message: "Server degradation event caught inside routing channel." });
  }
});

// Health check
serverApp.get('/api/v1/health', (req, res) => {
  res.json({ status: "ok", service: "SnapFeed Security Engine", timestamp: new Date().toISOString() });
});

// Start listening for inbound requests on the designated network address port
serverApp.listen(NET_PORT, () => {
  console.log(`[SnapFeed Security Engine Active] Gateway listening natively on system port interface address ${NET_PORT}`);
});

module.exports = serverApp;
