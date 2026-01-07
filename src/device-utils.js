// Utility functions for device identification and tracking

/**
 * Generate a device fingerprint based on various browser/device characteristics
 * This helps track which devices are used to edit items
 */
export function generateDeviceId() {
    try {
        // Basic user agent information
        const userAgent = navigator.userAgent;
        
        // Screen information
        const screenInfo = {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth
        };
        
        // Browser capabilities
        const capabilities = {
            cookiesEnabled: navigator.cookieEnabled,
            javaEnabled: navigator.javaEnabled(),
            language: navigator.language || navigator.userLanguage,
            platform: navigator.platform,
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            deviceMemory: navigator.deviceMemory || 'unknown',
            maxTouchPoints: navigator.maxTouchPoints || 0
        };
        
        // Create a fingerprint string
        const fingerprintData = {
            userAgent,
            screen: screenInfo,
            capabilities,
            timestamp: new Date().getTime()
        };
        
        // Convert to JSON and create a hash-like string
        const fingerprintString = JSON.stringify(fingerprintData);
        
        // Simple hash function for the fingerprint
        let hash = 0;
        for (let i = 0; i < fingerprintString.length; i++) {
            const char = fingerprintString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        // Return a formatted device ID
        return `DEV-${Math.abs(hash).toString(36).substring(0, 8).toUpperCase()}`;
        
    } catch (error) {
        console.error('Error generating device ID:', error);
        // Fallback to simple user agent if fingerprinting fails
        return navigator.userAgent || 'Unknown-Device';
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