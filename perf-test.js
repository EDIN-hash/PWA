import puppeteer from 'puppeteer';

const URL = process.env.URL || 'http://localhost:4173';
const ITERATIONS = 3;

async function measurePerformance() {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const results = [];
    
    for (let i = 0; i < ITERATIONS; i++) {
        const page = await browser.newPage();
        
        await page.goto(URL, { waitUntil: 'networkidle0' });
        
        const metrics = await page.evaluate(() => {
            return new Promise((resolve) => {
                // Wait a bit for LCP to be measured
                setTimeout(() => {
                    const perfData = {
                        // Basic timing
                        navigationStart: performance.timing.navigationStart,
                        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                        loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
                        domInteractive: performance.timing.domInteractive - performance.timing.navigationStart,
                        
                        // Paint timing (FCP)
                        fcp: null,
                        lcp: null,
                        
                        // Network
                        resources: performance.getEntriesByType('resource').length,
                    };
                    
                    // Get FCP
                    const paintEntries = performance.getEntriesByType('paint');
                    const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint');
                    if (fcpEntry) perfData.fcp = Math.round(fcpEntry.startTime);
                    
                    // Get LCP
                    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
                    if (lcpEntries.length > 0) {
                        perfData.lcp = Math.round(lcpEntries[lcpEntries.length - 1].startTime);
                    }
                    
                    resolve(perfData);
                }, 2000);
            });
        });
        
        results.push(metrics);
        await page.close();
        
        // Small delay between iterations
        await new Promise(r => setTimeout(r, 500));
    }
    
    await browser.close();
    
    // Calculate averages
    const avg = {
        domContentLoaded: Math.round(results.reduce((a, r) => a + r.domContentLoaded, 0) / ITERATIONS),
        loadComplete: Math.round(results.reduce((a, r) => a + r.loadComplete, 0) / ITERATIONS),
        domInteractive: Math.round(results.reduce((a, r) => a + r.domInteractive, 0) / ITERATIONS),
        fcp: Math.round(results.reduce((a, r) => a + (r.fcp || 0), 0) / ITERATIONS),
        lcp: Math.round(results.reduce((a, r) => a + (r.lcp || 0), 0) / ITERATIONS),
        resources: Math.round(results.reduce((a, r) => a + r.resources, 0) / ITERATIONS),
    };
    
    console.log('\n========== PERFORMANCE REPORT ==========\n');
    console.log(`URL: ${URL}`);
    console.log(`Iterations: ${ITERATIONS}\n`);
    console.log('📊 Average Metrics (ms):');
    console.log('─'.repeat(35));
    console.log(`  FCP (First Contentful Paint): ${avg.fcp} ms`);
    console.log(`  LCP (Largest Contentful Paint): ${avg.lcp} ms`);
    console.log(`  DOM Interactive: ${avg.domInteractive} ms`);
    console.log(`  DOM Content Loaded: ${avg.domContentLoaded} ms`);
    console.log(`  Page Load Complete: ${avg.loadComplete} ms`);
    console.log(`  Resources Loaded: ${avg.resources}\n`);
    
    // Score interpretation
    console.log('📈 Performance Score:');
    console.log('─'.repeat(35));
    
    const scoreFCP = avg.fcp < 1800 ? '✅ Good' : avg.fcp < 3000 ? '⚠️ Needs Improvement' : '❌ Poor';
    const scoreLCP = avg.lcp < 2500 ? '✅ Good' : avg.lcp < 4000 ? '⚠️ Needs Improvement' : '❌ Poor';
    const scoreTTI = avg.domInteractive < 3500 ? '✅ Good' : avg.domInteractive < 7000 ? '⚠️ Needs Improvement' : '❌ Poor';
    
    console.log(`  FCP: ${scoreFCP} ${avg.fcp < 1800 ? '' : `(target: <1800ms)`}`);
    console.log(`  LCP: ${scoreLCP} ${avg.lcp < 2500 ? '' : `(target: <2500ms)`}`);
    console.log(`  TTI: ${scoreTTI} ${avg.domInteractive < 3500 ? '' : `(target: <3500ms)`}`);
    console.log('\n==========================================\n');
    
    return avg;
}

measurePerformance().catch(console.error);
