/**
 * sample.js - v1.022 Interactive Systems Diagnostic & Sales Dashboard
 * Manages dynamic simulation scanning, gauge animations, and real-time console logging.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get customer URL from query parameters or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    let targetUrl = urlParams.get('url') || localStorage.getItem('act_audit_url') || 'example.com';
    
    // Clean URL
    targetUrl = targetUrl.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    if (!targetUrl) targetUrl = 'example.com';
    
    // Save to localStorage just to be consistent
    localStorage.setItem('act_audit_url', targetUrl);

    // 2. Populate metadata on dashboard
    const metaDomain = document.getElementById('meta-domain');
    const metaTimestamp = document.getElementById('meta-timestamp');
    const metaScanId = document.getElementById('meta-scan-id');

    if (metaDomain) metaDomain.innerText = targetUrl;
    if (metaTimestamp) metaTimestamp.innerText = new Date().toLocaleString();
    if (metaScanId) {
        const randHex = (len) => Array.from({length: len}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
        metaScanId.innerText = `ACT-AUDIT-${randHex(4)}-${randHex(4)}`;
    }

    // 3. Define the scanning steps and logs
    const scanSteps = [
        { percentage: 2, text: `[INFRASTRUCTURE] Handshaking secure channel to target: ${targetUrl}...` },
        { percentage: 5, text: `[INFRASTRUCTURE] Connection established. Querying NS records...` },
        { percentage: 8, text: `[DNS] Found A record pointing to IPv4 endpoint. CNAME validation successful.` },
        { percentage: 12, text: `[SSL/TLS] Analyzing certificate handshake... RSA 2048-bit present.` },
        { percentage: 16, text: `[SSL/TLS] WARNING: TLS 1.3 not enforced. Older TLS 1.1 deprecation warning active.` },
        { percentage: 22, text: `[PERFORMANCE] Triggering virtual Headless Chrome viewport client...` },
        { percentage: 28, text: `[PERFORMANCE] Spawning core vitals profiling engines...` },
        { percentage: 33, text: `[PERFORMANCE] First Contentful Paint (FCP) evaluated: 2.4s (Average).` },
        { percentage: 38, text: `[PERFORMANCE] Largest Contentful Paint (LCP) evaluated: 4.9s (Critical Delay).` },
        { percentage: 44, text: `[PERFORMANCE] Cumulative Layout Shift (CLS) is 0.28 (Requires optimization).` },
        { percentage: 50, text: `[SECURITY] Initiating port vulnerability scanning protocols...` },
        { percentage: 56, text: `[SECURITY] Checking security headers: X-Frame-Options is missing.` },
        { percentage: 62, text: `[SECURITY] WARNING: Content-Security-Policy (CSP) is not defined.` },
        { percentage: 68, text: `[SECURITY] Server fingerprint detected: Outdated server engine stack exposed.` },
        { percentage: 74, text: `[SYNTHESIS] Scanning for neural synthesis layers & automated UI wrappers...` },
        { percentage: 80, text: `[SYNTHESIS] Evaluating automated prompt caches and predictive text metrics...` },
        { percentage: 86, text: `[SYNTHESIS] CRITICAL: No custom AI agent layers or neural pathways detected on ${targetUrl}.` },
        { percentage: 92, text: `[SYNTHESIS] Refactoring grade coefficients... Compiling audit summary...` },
        { percentage: 97, text: `[INFRASTRUCTURE] Generating final diagnostics package...` },
        { percentage: 100, text: `[SYSTEM] Audit scan 100% complete. Transitioning to architectural panel.` }
    ];

    // Dom elements
    const scanLabel = document.getElementById('scan-label');
    const scanPercentage = document.getElementById('scan-percentage');
    const scanBar = document.getElementById('scan-bar');
    const scanLogs = document.getElementById('scan-logs');

    const progressCard = document.getElementById('scan-progress-card');
    const resultsPanel = document.getElementById('results-panel');

    // 4. Run the scan animation
    let currentPercent = 0;
    let stepIndex = 0;
    
    // Add text log helper
    function appendTerminalLog(text, colorClass = '') {
        if (!scanLogs) return;
        const entry = document.createElement('div');
        entry.className = `mb-1 font-mono tracking-wide ${colorClass}`;
        entry.innerText = text;
        scanLogs.appendChild(entry);
        scanLogs.scrollTop = scanLogs.scrollHeight;
    }

    function runDiagnosticProgress() {
        const interval = setInterval(() => {
            if (currentPercent >= 100) {
                clearInterval(interval);
                setTimeout(revealResults, 800);
                return;
            }

            currentPercent += 1;
            
            // Update bar and number
            if (scanBar) scanBar.style.width = `${currentPercent}%`;
            if (scanPercentage) scanPercentage.innerText = `${currentPercent}%`;

            // Check if there's a log event at this percentage
            if (stepIndex < scanSteps.length && currentPercent >= scanSteps[stepIndex].percentage) {
                const currentStep = scanSteps[stepIndex];
                
                // Determine label status based on progress
                if (currentPercent >= 80) {
                    if (scanLabel) scanLabel.innerHTML = window.i18n.lang === 'zh' ? '正在合成定制 AI 图层...' : (window.i18n.lang === 'es' ? 'Sintetizando capa de IA...' : 'Synthesizing AI Synthesis layers...');
                } else if (currentPercent >= 50) {
                    if (scanLabel) scanLabel.innerHTML = window.i18n.lang === 'zh' ? '正在扫描目录漏洞...' : (window.i18n.lang === 'es' ? 'Escaneando vulnerabilidades...' : 'Scanning security vectors...');
                } else if (currentPercent >= 25) {
                    if (scanLabel) scanLabel.innerHTML = window.i18n.lang === 'zh' ? '正在评估性能指标...' : (window.i18n.lang === 'es' ? 'Evaluando rendimiento...' : 'Evaluating performance metrics...');
                } else {
                    if (scanLabel) scanLabel.innerHTML = window.i18n.lang === 'zh' ? '正在分析 DNS 与 SSL 协议...' : (window.i18n.lang === 'es' ? 'Analizando DNS y SSL...' : 'Analyzing DNS & SSL Stack...');
                }

                // Add log text
                let colorClass = 'text-white/60';
                if (currentStep.text.includes('WARNING')) colorClass = 'text-amber-400 font-bold';
                if (currentStep.text.includes('CRITICAL')) colorClass = 'text-red-500 font-black animate-pulse';
                if (currentStep.text.includes('complete')) colorClass = 'text-emerald-400 font-bold';

                appendTerminalLog(currentStep.text, colorClass);
                stepIndex++;
            }
        }, 65); // Takes about 6.5 seconds for complete simulation, perfect high-fidelity speed
    }

    // 5. Transition from scanning to dashboard results
    function revealResults() {
        if (progressCard) {
            progressCard.style.opacity = '0';
            progressCard.style.transform = 'scale(0.95)';
            progressCard.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                progressCard.classList.add('hidden');
                
                if (resultsPanel) {
                    resultsPanel.classList.remove('hidden');
                    resultsPanel.style.opacity = '0';
                    resultsPanel.style.transform = 'translateY(20px)';
                    
                    // Force repaint
                    resultsPanel.offsetHeight;
                    
                    resultsPanel.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    resultsPanel.style.opacity = '1';
                    resultsPanel.style.transform = 'translateY(0)';
                    
                    // Trigger gauge animations
                    animateGauges();
                    
                    // Start ambient log feed
                    startAmbientLogFeed();
                }
            }, 500);
        }
    }

    // 6. Animate SVG gauges to their scores
    function animateGauges() {
        // Define target values based on the target website's length/structure to feel dynamic
        const charCount = targetUrl.length;
        const seedValue = (charCount * 3) % 20; // 0-19 range
        
        const speedScore = 75 + seedValue; // Range 75-94 (Decent, typical GoDaddy/Hostinger templates)
        const vitalsScore = 60 + (seedValue % 15); // Range 60-74 (Average, bloated assets)
        const securityScore = 35 + (seedValue % 10); // Range 35-44 (Poor, missing header configurations)
        const aiScore = Math.max(3, seedValue % 6); // Range 3-8 (Absolutely zero neural optimization - Critical!)

        // Elements
        animateGaugeElement('gauge-speed', 'speed-value', speedScore, '#10b981');
        animateGaugeElement('gauge-vitals', 'vitals-value', vitalsScore, '#f59e0b');
        animateGaugeElement('gauge-security', 'security-value', securityScore, '#ef4444');
        animateGaugeElement('gauge-ai', 'ai-value', aiScore, '#dc2626');
    }

    function animateGaugeElement(gaugeId, labelId, targetScore, colorHex) {
        const gauge = document.getElementById(gaugeId);
        const label = document.getElementById(labelId);
        if (!gauge || !label) return;

        // Circumference is 2 * PI * r = 2 * 3.14159 * 40 = 251.2
        const circumference = 251.2;
        const targetOffset = circumference - (targetScore / 100) * circumference;
        
        // Trigger SVG transition
        setTimeout(() => {
            gauge.style.strokeDashoffset = targetOffset;
        }, 100);

        // Counter animation
        let count = 0;
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / targetScore));
        
        const timer = setInterval(() => {
            count += 1;
            label.innerText = count;
            if (count >= targetScore) {
                label.innerText = targetScore;
                clearInterval(timer);
            }
        }, stepTime);
    }

    // 7. Ambient feedback logs inside results panel to keep it feeling live
    const feed = document.getElementById('dash-log-feed');
    let feedIndex = 1;

    function addFeedLog(text, isAlert = false) {
        if (!feed) return;
        const time = new Date().toLocaleTimeString().split(' ')[0];
        const log = document.createElement('div');
        log.className = `mb-1.5 leading-relaxed ${isAlert ? 'text-red-400 font-bold' : 'text-slate-400'}`;
        log.innerHTML = `<span class="text-slate-600">[${time}]</span> ${text}`;
        feed.appendChild(log);
        feed.scrollTop = feed.scrollHeight;
    }

    function startAmbientLogFeed() {
        // Initial set
        addFeedLog(`Diagnostic session lock established.`);
        addFeedLog(`Background latency monitor activated for ${targetUrl}.`);
        addFeedLog(`System core integrity reports: 3 anomalies detected.`, true);

        const messages = [
            `Port 80/443 telemetry active. Average server delay: 284ms.`,
            `TCP socket connection heartbeat standard.`,
            `SSL layer healthcheck completed. A grade maintained.`,
            `Vulnerability scan warning: Missing Content-Security-Policy headers!`,
            `Lighthouse simulation: FCP/LCP metrics remaining in critical degradation zones.`,
            `Autonomous AI synthesis check: Target does not respond to neural API hooks.`,
            `Memory leak telemetry: Memory usage standard, high resource assets cached.`,
            `Diagnostic active: Waiting for partner refactoring inquiry.`,
            `DNS zone audit: Cloudflare proxy signature verified.`
        ];

        setInterval(() => {
            const randMsg = messages[Math.floor(Math.random() * messages.length)];
            const isAlert = randMsg.includes('warning') || randMsg.includes('CRITICAL') || randMsg.includes('degradation');
            addFeedLog(randMsg, isAlert);
        }, 4000);
    }

    // Kick off progress
    setTimeout(runDiagnosticProgress, 500);
});
