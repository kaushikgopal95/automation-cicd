// Usage: node scripts/wait-for-healthy.js <url> [timeoutSeconds]
// Example: node scripts/wait-for-healthy.js http://localhost:5173 120

const http = require('http');
const https = require('https');

const url = process.argv[2];
const timeoutSeconds = parseInt(process.argv[3], 10) || 120;
const interval = 3000; // ms
const deadline = Date.now() + timeoutSeconds * 1000;

function check() {
  const mod = url.startsWith('https') ? https : http;
  mod
    .get(url, res => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log('Health check passed:', url);
        process.exit(0);
      } else {
        retry();
      }
    })
    .on('error', retry);
}

function retry() {
  if (Date.now() > deadline) {
    console.error('Health check failed: Timeout waiting for', url);
    process.exit(1);
  }
  setTimeout(check, interval);
}

console.log('Waiting for healthy service at', url);
check();
