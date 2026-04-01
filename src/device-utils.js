// Utility functions for device identification and tracking

const DEVICE_ID_KEY = 'inventory_device_id';
const DEVICE_NAME_KEY = 'inventory_device_name';

/**
 * Generate a stable device fingerprint based on hardware characteristics
 * Only uses stable data that doesn't change between sessions
 */
function generateFingerprint() {
    try {
        const data = {
            platform: navigator.platform,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory,
            language: navigator.language,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            colorDepth: window.screen.colorDepth,
        };
        
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        return `DEV-${Math.abs(hash).toString(36).substring(0, 8).toUpperCase()}`;
    } catch (error) {
        return 'DEV-UNKNOWN';
    }
}

/**
 * Get or generate a stable device ID
 * Saved in localStorage so it persists across sessions
 */
export function generateDeviceId() {
    try {
        let deviceId = localStorage.getItem(DEVICE_ID_KEY);
        
        if (!deviceId) {
            deviceId = generateFingerprint();
            localStorage.setItem(DEVICE_ID_KEY, deviceId);
        }
        
        return deviceId;
    } catch (error) {
        return generateFingerprint();
    }
}

/**
 * Get or set device nickname
 */
export function getDeviceName() {
    return localStorage.getItem(DEVICE_NAME_KEY) || '';
}

export function setDeviceName(name) {
    localStorage.setItem(DEVICE_NAME_KEY, name);
}

/**
 * Get combined device identifier for history
 * Format: "DeviceName | Browser | OS"
 */
export function getDeviceDisplayId() {
    const deviceId = generateDeviceId();
    const deviceName = getDeviceName();
    
    let browser = 'Unknown';
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    
    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Win';
    else if (ua.includes('Mac')) os = 'Mac';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    
    if (deviceName) {
        return `${deviceName} (${browser}/${os})`;
    }
    return `${deviceId} (${browser}/${os})`;
}

/**
 * Reset device ID - generates new one
 */
export function resetDeviceId() {
    try {
        const newId = generateFingerprint();
        localStorage.setItem(DEVICE_ID_KEY, newId);
        return newId;
    } catch (error) {
        return generateFingerprint();
    }
}

/**
 * Get a more detailed device information string for display
 */
export function getDeviceId() {
    try {
        const info = [];
        
        // Browser info
        if (navigator.userAgent) {
            if (navigator.userAgent.includes('Chrome')) info.push('Chrome');
            else if (navigator.userAgent.includes('Firefox')) info.push('Firefox');
            else if (navigator.userAgent.includes('Safari')) info.push('Safari');
            else if (navigator.userAgent.includes('Edge')) info.push('Edge');
            else if (navigator.userAgent.includes('OPR')) info.push('Opera');
        }
        
        // Platform info
        if (navigator.platform) {
            if (navigator.platform.includes('Win')) info.push('Windows');
            else if (navigator.platform.includes('Mac')) info.push('Mac');
            else if (navigator.platform.includes('Linux')) info.push('Linux');
            else if (navigator.platform.includes('Android')) info.push('Android');
            else if (navigator.platform.includes('iPhone') || navigator.platform.includes('iPad')) info.push('iOS');
        }
        
        // Screen size
        if (window.screen) {
            info.push(`${window.screen.width}x${window.screen.height}`);
        }
        
        return info.join(' | ') || 'Unknown Device';
        
    } catch (error) {
        console.error('Error getting device info:', error);
        return 'Unknown Device';
    }
}

/**
 * Get optimized Cloudinary URL with transformations
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} - Optimized URL
 */
export function getOptimizedImageUrl(url, options = {}) {
    if (!url || !url.includes('cloudinary.com')) {
        return url;
    }
    
    const {
        width = 800,
        height,
        quality = 'auto',
        format = 'auto',
        crop = 'fill'
    } = options;
    
    const parts = url.split('/upload/');
    if (parts.length !== 2) {
        return url;
    }
    
    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);
    if (crop) transformations.push(`c_${crop}`);
    
    return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
}

/**
 * Get thumbnail URL for list view
 */
export function getThumbnailUrl(url) {
    if (!url) return url;
    
    if (url.includes('drive.google.com')) {
        const fileIdMatch = url.match(/\/d\/([^/]+)/);
        if (fileIdMatch) {
            return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w800`;
        }
        return url;
    }
    
    return getOptimizedImageUrl(url, { width: 800, quality: 'auto', height: 600 });
}

/**
 * Get full-size optimized URL for modal/lightbox
 */
export function getFullImageUrl(url) {
    if (!url) return url;
    
    if (url.includes('drive.google.com')) {
        const fileIdMatch = url.match(/\/d\/([^/]+)/);
        if (fileIdMatch) {
            return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
        }
        return url;
    }
    
    return getOptimizedImageUrl(url, { width: 1920, quality: 'auto' });
}