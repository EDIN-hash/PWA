// Test script to verify device tracking functionality
import { generateDeviceId, getDeviceInfo } from './src/device-utils.js';

console.log('Testing device tracking functionality...\n');

// Test 1: Generate device ID
console.log('Test 1: Generate device ID');
const deviceId = generateDeviceId();
console.log('Generated Device ID:', deviceId);
console.log('Device ID format valid:', deviceId.startsWith('DEV-'));
console.log('Device ID length:', deviceId.length);

// Test 2: Get device info
console.log('\nTest 2: Get device info');
const deviceInfo = getDeviceInfo();
console.log('Device Info:', deviceInfo);
console.log('Device info contains browser:', deviceInfo.includes('Chrome') || deviceInfo.includes('Firefox') || deviceInfo.includes('Safari') || deviceInfo.includes('Edge'));

// Test 3: Verify consistency
console.log('\nTest 3: Verify consistency');
const deviceId2 = generateDeviceId();
console.log('Same device generates same ID:', deviceId === deviceId2);

console.log('\nтЭА All tests completed!');