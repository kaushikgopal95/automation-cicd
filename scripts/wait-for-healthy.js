// Usage: node scripts/wait-for-healthy.js <url> [timeoutSeconds]
// Example: node scripts/wait-for-healthy.js http://localhost:5173 120

const http = require('http');
const https = require('https');

const url = process.argv[2];
const timeoutSeconds = parseInt(process.argv[3], 10) || 120;
const interval = 5000; // ms - increased to 5 seconds
const deadline = Date.now() + timeoutSeconds * 1000;

// Validate inputs
if (!url) {
  console.error('Error: URL is required');
  process.exit(1);
}

console.log('=== Health Check Started ===');
console.log('URL:', url);
console.log('Timeout:', timeoutSeconds, 'seconds');
console.log('Check interval:', interval, 'ms');
console.log('Deadline:', new Date(deadline).toISOString());
console.log('============================');

function check() {
  const mod = url.startsWith('https') ? https : http;
  const now = new Date().toISOString();
  console.log(`[${now}] Checking health at: ${url}`);
  
  const req = mod.get(url, res => {
    console.log(`[${now}] Response status: ${res.statusCode}`);
    console.log(`[${now}] Response headers:`, res.headers);
    
    if (res.statusCode >= 200 && res.statusCode < 400) {
      console.log(`[${now}] ✅ Health check PASSED: ${url}`);
      console.log('=== Health Check Completed Successfully ===');
      process.exit(0);
    } else {
      console.log(`[${now}] ❌ Health check FAILED with status: ${res.statusCode}`);
      retry();
    }
  });
  
  req.setTimeout(15000, () => {
    console.log(`[${now}] ⏰ Request timeout after 15 seconds`);
    req.destroy();
    retry();
  });
  
  req.on('error', (err) => {
    console.log(`[${now}] ❌ Request error: ${err.message}`);
    console.log(`[${now}] Error code: ${err.code}`);
    retry();
  });
}

function retry() {
  const now = new Date().toISOString();
  const remaining = Math.ceil((deadline - Date.now()) / 1000);
  
  if (Date.now() > deadline) {
    console.error(`[${now}] ❌ Health check FAILED: Timeout waiting for ${url}`);
    console.error(`[${now}] Total timeout: ${timeoutSeconds} seconds exceeded`);
    console.log('=== Health Check Failed ===');
    process.exit(1);
  }
  
  console.log(`[${now}] ⏳ Retrying in ${interval/1000} seconds... (${remaining}s remaining)`);
  setTimeout(check, interval);
}

console.log('Waiting for healthy service at', url);
check();
