/**
 * SnapFeed Engine Core Infrastructure Integration Gateway Subsystem Layer
 * Operating Target Environment: Node.js Engine (Express Module Runtime Architecture Core)
 */

const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const applicationServerInstance = express();
const INFRASTRUCTURE_SERVER_PORT = process.env.PORT || 5000;
const CORE_SIGNING_PASSPHRASE_KEY = process.env.JWT_SECRET || 'PERSISTENT_ENGINE_FALLBACK_CLUSTER_KEY_992128A';

// Production Isolated In-Memory Data Storage Ledger Matrix
const centralizedActiveIdentityLedgerStore = [];

// Apply Strict HTTP Pipeline Configuration Security Controls
applicationServerInstance.use(helmet({
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

// Strictly bound memory allocations parameters to mitigate payload overflow corruption risks
applicationServerInstance.use(express.json({ limit: '25kb' }));
applicationServerInstance.use(express.urlencoded({ extended: true, limit: '25kb' }));

// Anti Brute-Force Rate Limiting Strategy Settings Configuration Block
const submissionNetworkRequestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: { status: "error", message: "Security Warning: Excessive authentication requests dropped." }
});

// RESTful Active Pipeline Routes Ingestion Controllers
applicationServerInstance.post('/api/v1/auth/register', submissionNetworkRequestRateLimiter, async (requestObject, responseObject) => {
  try {
    const { firstname, surname, gender, contact, password } = requestObject.body;

    if (!firstname || !surname || !contact || !password) {
      return responseObject.status(400).json({ status: "fail", message: "Incomplete details. All required parameters must be provided." });
    }

    const normalizedUniqueContactIdentityString = contact.trim().toLowerCase();

    const doesIdentityRecordPreexist = centralizedActiveIdentityLedgerStore.some(activeUserRecordNode =>
      activeUserRecordNode.registeredUserContactMetadata === normalizedUniqueContactIdentityString
    );

    if (doesIdentityRecordPreexist) {
      return responseObject.status(409).json({ status: "conflict", message: "An account with this email or phone number already exists." });
    }

    const cryptographicallyGeneratedPasswordHash = await bcrypt.hash(password, 12);

    const instantiatedRegistrationRecordPayload = {
      userUniqueSystemUuid: `sf-user-identity-node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userFullLegalName: `${firstname} ${surname}`,
      registeredUserGenderMetadata: gender || 'unspecified',
      registeredUserContactMetadata: normalizedUniqueContactIdentityString,
      secureEncryptedCredentialHash: cryptographicallyGeneratedPasswordHash,
      systemIngestionRecordTimestamp: new Date().toISOString()
    };

    centralizedActiveIdentityLedgerStore.push(instantiatedRegistrationRecordPayload);

    console.log("========================================================================");
    console.log("--> New User Registry Event Committed Securely to In-Memory Data Ledger Array Store:");
    console.log(JSON.stringify(instantiatedRegistrationRecordPayload, null, 2));
    console.log("========================================================================");

    return responseObject.status(201).json({
      status: "success",
      message: "Account created successfully. Identity details committed safely to network storage node memory."
    });

  } catch (criticalCorePipelineProcessingException) {
    console.error("Critical Runtime Boundary Ingestion Processing Exception Encountered: ", criticalCorePipelineProcessingException);
    return responseObject.status(500).json({ status: "error", message: "An internal server error occurred during asset mapping processes." });
  }
});

// Fallback Route Interface Handlers Configuration Block Area
applicationServerInstance.all('*', (requestObject, responseObject) => {
  responseObject.status(404).json({ status: "fail", message: "Resource mapping address index location could not be located inside system bounds." });
});

// Start the core process framework engine listener loop
applicationServerInstance.listen(INFRASTRUCTURE_SERVER_PORT, () => {
  console.log(`[SnapFeed Security Server Engine] System Routing Pipeline Online at Interface Port Parameter Socket: ${INFRASTRUCTURE_SERVER_PORT}`);
});
