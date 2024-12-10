const crypto = require('crypto');

// Generate a 64-byte random secret key in base64 format
const secretKey = crypto.randomBytes(64).toString('base64');

console.log('JWT Secret Key:', secretKey);
