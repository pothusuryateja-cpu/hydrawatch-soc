const fs = require('fs');

const html = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AegisSOC Enterprise — Autonomous AI-Tier 1 Security Operations &amp; Threat Hunting Platform</title>
<script src="https://cdn.tailwindcss.com"><\/script>
<script>
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"','"Fira Code"','ui-monospace','SFMono-Regular','monospace'],
        sans: ['Inter','system-ui','sans-serif']
      },
      colors: {
        cyber: { 50:'#eef9ff', 100:'#d8f1ff', 200:'#b9e7ff', 300:'#89d9ff', 400:'#51c2ff', 500:'#29a4ff', 600:'#0d84ff', 700:'#066cf5', 800:'#0b56c6', 900:'#10499d', 950:'#0f2e60' },
        soc: { 800:'#1a1f2e', 850:'#151928', 900:'#0f1219', 950:'#0a0c10' }
      }
    }
  }
}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://unpkg.com/lucide@latest"><\/script>
<style>
body { font-family: 'Inter', system-ui, sans-serif; background: #0f1219; color: #e2e8f0; }
.font-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace !important; }
.glow-cyan { box-shadow: 0 0 20px rgba(34,211,238,0.3), 0 0 40px rgba(34,211,238,0.1); }
.glow-emerald { box-shadow: 0 0 20px rgba(52,211,153,0.3); }
.glow-rose { box-shadow: 0 0 20px rgba(251,113,133,0.3); }
.glow-pulse { animation: glowPulse 2s ease-in-out infinite; }
@keyframes glowPulse { 0%,100%{box-shadow:0 0 15px rgba(34,211,238,0.4)} 50%{box-shadow:0 0 30px rgba(34,211,238,0.7),0 0 60px rgba(34,211,238,0.2)} }
.shimmer { background: linear-gradient(110deg,#22d3ee 0%,#34d399 40%,#22d3ee 60%,#818cf8 80%,#22d3ee 100%); background-size:200% 100%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.scan-line { position:relative; overflow:hidden; }
.scan-line::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,#22d3ee,transparent); animation:scanLine 3s linear infinite; }
@keyframes scanLine { 0%{top:-2px} 100%{top:100%} }
#agent-chat-messages::-webkit-scrollbar { width:6px; }
#agent-chat-messages::-webkit-scrollbar-track { background:#1e293b; border-radius:4px; }
#agent-chat-messages::-webkit-scrollbar-thumb { background:#334155; border-radius:4px; }
#agent-chat-messages::-webkit-scrollbar-thumb:hover { background:#475569; }
.diff-line-add { background:rgba(34,197,94,0.1); border-left:3px solid #22c55e; }
.diff-line-del { background:rgba(239,68,68,0.1); border-left:3px solid #ef4444; }
/mitre-modal-backdrop { transition: opacity 0.2s ease; }
.mitre-badge:hover { transform:translateY(-1px); box-shadow: 0 4px 12px rgba(34,211,238,0.3); }
.input-glow:focus { box-shadow: 0 0 0 2px rgba(34,211,238,0.4), 0 0 20px rgba(34,211,238,0.1); }
.highlight-pulse { animation: highlightPulse 2s ease-out; }
@keyframes highlightPulse { 0%{box-shadow:0 0 0 4px rgba(34,211,238,0.6)} 100%{box-shadow:0 0 0 0 rgba(34,211,238,0)} }
.tab-active { border-bottom: 2px solid #22d3ee; color: #22d3ee; }
.soar-tab-active { background: rgba(34,211,238,0.15); color: #22d3ee; border-color: #22d3ee; }
</style>
</head>
<body class="min-h-screen bg-soc-900">
<!-- ═══════════════════════ HEADER ═══════════════════════ -->
<header class="sticky top-0 z-40 bg-soc-900/95 backdrop-blur border-b border-slate-800">
  <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center glow-cyan">
        <i data-lucide="shield-check" class="w-6 h-6 text-white"></i>
      </div>
      <div>
        <h1 class="text-lg font-bold tracking-tight text-white">AegisSOC <span class="text-cyan-400">Enterprise</span> <span class="text-[10px] font-mono bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded ml-1">v2.0</span></h1>
        <p class="text-[11px] text-slate-500 font-mono">Autonomous AI-Tier 1 SOC &amp; Threat Hunting Platform</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <div class="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>ENGINE ONLINE</span>
      </div>
      <div class="text-xs text-slate-600 font-mono hidden md:block">
        <span id="clock"></span>
      </div>
    </div>
  </div>
</header>

<!-- ═══════════════════════ WELCOME HERO ═══════════════════════ -->
<section id="welcome-hero" class="relative overflow-hidden border-b border-slate-800">
  <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5"></div>
  <div class="max-w-7xl mx-auto px-4 py-10 md:py-14 relative">
    <div class="text-center max-w-3xl mx-auto">
      <h2 class="text-3xl md:text-5xl font-extrabold mb-4">
        <span class="shimmer">Aegis Security Copilot</span><br>
        <span class="text-white">&amp; SOC Triage Suite</span>
      </h2>
      <p class="text-slate-400 text-sm md:text-base mb-8 max-w-2xl mx-auto">Next-Gen Automated Threat Triage, Static Analysis &amp; Real-Time Incident Remediation</p>
      <div class="flex flex-wrap justify-center gap-4 mb-8">
        <div class="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-full px-4 py-2 text-xs font-mono">
          <i data-lucide="target" class="w-4 h-4 text-cyan-400"></i>
          <span class="text-slate-300">Automated CWE / OWASP Mapping</span>
        </div>
        <div class="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-full px-4 py-2 text-xs font-mono">
          <i data-lucide="zap" class="w-4 h-4 text-amber-400"></i>
          <span class="text-slate-300">Sub-second IOC Extraction</span>
        </div>
        <div class="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-full px-4 py-2 text-xs font-mono">
          <i data-lucide="bot" class="w-4 h-4 text-emerald-400"></i>
          <span class="text-slate-300">Context-Aware Remediation Agent</span>
        </div>
      </div>
      <div class="flex flex-wrap justify-center gap-3">
        <button onclick="scrollToConsole(); showWalkthrough();" class="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-cyan-500 hover:to-cyan-400 transition-all glow-pulse text-sm">
          <span class="flex items-center gap-2"><i data-lucide="rocket" class="w-4 h-4"></i> Get Started</span>
        </button>
        <button onclick="loadDemo(1); setTimeout(()=>scrollToConsole(),200);" class="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-all text-sm">
          <span class="flex items-center gap-2"><i data-lucide="play" class="w-4 h-4"></i> Try Demo Scan</span>
        </button>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════ MAIN CONSOLE ═══════════════════════ -->
<main id="input-console" class="max-w-7xl mx-auto px-4 py-6">
  <!-- Walkthrough tooltip -->
  <div id="walkthrough" class="hidden mb-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-sm text-cyan-300 font-mono">
    <span class="font-bold">Quick Tour:</span> Select a scan type tab → Paste or load data → Click <strong>Analyze</strong>. The Aegis Copilot will automatically load context for interactive Q&amp;A.
    <button onclick="document.getElementById('walkthrough').classList.add('hidden')" class="ml-2 text-cyan-400 hover:text-white">✕</button>
  </div>

  <!-- Tab Navigation -->
  <div class="flex border-b border-slate-800 mb-4 overflow-x-auto">
    <button onclick="switchTab('code')" id="tab-code" class="tab-active px-5 py-3 text-sm font-mono font-medium whitespace-nowrap transition-colors hover:text-cyan-400">
      <span class="flex items-center gap-2"><i data-lucide="code-2" class="w-4 h-4"></i> Source Code Scanner</span>
    </button>
    <button onclick="switchTab('email')" id="tab-email" class="px-5 py-3 text-sm font-mono font-medium whitespace-nowrap text-slate-500 transition-colors hover:text-cyan-400">
      <span class="flex items-center gap-2"><i data-lucide="mail" class="w-4 h-4"></i> Phishing Email Analyzer</span>
    </button>
    <button onclick="switchTab('logs')" id="tab-logs" class="px-5 py-3 text-sm font-mono font-medium whitespace-nowrap text-slate-500 transition-colors hover:text-cyan-400">
      <span class="flex items-center gap-2"><i data-lucide="terminal" class="w-4 h-4"></i> Server Log Inspector</span>
    </button>
  </div>

  <!-- Demo Buttons -->
  <div class="flex flex-wrap gap-2 mb-4">
    <button onclick="loadDemo(1)" class="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono rounded hover:bg-amber-500/20 transition-colors">
      <i data-lucide="file-code" class="w-3 h-3 inline"></i> Demo: Vulnerable Code
    </button>
    <button onclick="loadDemo(2)" class="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono rounded hover:bg-rose-500/20 transition-colors">
      <i data-lucide="mail-warning" class="w-3 h-3 inline"></i> Demo: Phishing Header
    </button>
    <button onclick="loadDemo(3)" class="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded hover:bg-emerald-500/20 transition-colors">
      <i data-lucide="server" class="w-3 h-3 inline"></i> Demo: SSH Attack Log
    </button>
  </div>

  <!-- Input Area -->
  <div class="relative">
    <div id="log-format-bar" class="hidden mb-3 flex items-center gap-2">
      <span class="text-xs text-slate-500 font-mono">Log Format:</span>
      <select id="log-format" class="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1 font-mono" onchange="currentLogFormat=this.value">
        <option value="auth">Linux /var/log/auth.log</option>
        <option value="nginx">Nginx / Apache Access Log</option>
        <option value="cloudtrail">AWS CloudTrail JSON</option>
        <option value="windows">Windows Event ID 4625</option>
      </select>
      <label class="flex items-center gap-2 text-xs text-slate-500 font-mono ml-4 cursor-pointer">
        <input type="checkbox" id="live-toggle" class="accent-cyan-500" onchange="toggleLiveStreaming(this.checked)">
        <span>Simulate Live Ingestion</span>
      </label>
      <div id="stream-progress" class="hidden flex-1 h-1 bg-slate-800 rounded overflow-hidden ml-2">
        <div id="stream-bar" class="h-full bg-cyan-500 transition-all duration-100" style="width:0%"></div>
      </div>
      <span id="stream-count" class="hidden text-[10px] text-slate-600 font-mono"></span>
    </div>
    <textarea id="input-editor" class="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300 resize-y focus:outline-none focus:border-cyan-500/50 input-glow transition-all placeholder:text-slate-700" placeholder="Paste source code, email headers, or server logs here..."></textarea>
    <div class="absolute bottom-3 right-3 flex gap-2">
      <button onclick="clearInput()" class="px-3 py-1.5 bg-slate-800 text-slate-400 text-xs rounded hover:bg-slate-700 transition-colors font-mono">Clear</button>
      <button onclick="runAnalysis()" class="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white text-xs font-semibold rounded hover:from-cyan-500 hover:to-emerald-500 transition-all glow-cyan font-mono">
        <span class="flex items-center gap-1.5"><i data-lucide="scan-line" class="w-3 h-3"></i> Analyze</span>
      </button>
    </div>
  </div>

  <!-- ═══════════════════════ RESULTS AREA ═══════════════════════ -->
  <div id="results-area" class="hidden mt-8 space-y-6">
    <!-- Top Row: Threat Gauge + CVSS + Classification -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Threat Score Gauge -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 scan-line">
        <h3 class="text-xs font-mono text-slate-500 mb-3 uppercase tracking-wider">Threat Score</h3>
        <div class="flex items-center gap-4">
          <div class="relative w-24 h-24">
            <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" stroke-width="8"/>
              <circle id="gauge-arc" cx="50" cy="50" r="42" fill="none" stroke="#22d3ee" stroke-width="8" stroke-linecap="round" stroke-dasharray="0 264" class="transition-all duration-1000"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span id="gauge-number" class="text-2xl font-bold font-mono text-white">0</span>
              <span class="text-[10px] text-slate-500 font-mono">/100</span>
            </div>
          </div>
          <div>
            <div id="severity-badge" class="px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-slate-800 text-slate-500 mb-2 inline-block">—</div>
            <p id="attack-vector" class="text-sm text-slate-400">No scan yet</p>
          </div>
        </div>
      </div>

      <!-- CVSS v3.1 -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 class="text-xs font-mono text-slate-500 mb-3 uppercase tracking-wider">CVSS v3.1 Score</h3>
        <div class="text-3xl font-bold font-mono text-white mb-1" id="cvss-score">—</div>
        <div class="text-[10px] font-mono text-slate-600 mb-3 break-all" id="cvss-vector">No vector</div>
        <div class="space-y-2">
          <div>
            <div class="flex justify-between text-[10px] font-mono text-slate-500 mb-1"><span>Confidentiality</span><span id="cvss-c">—</span></div>
            <div class="h-1.5 bg-slate-800 rounded overflow-hidden"><div id="cvss-c-bar" class="h-full bg-cyan-500 transition-all" style="width:0%"></div></div>
          </div>
          <div>
            <div class="flex justify-between text-[10px] font-mono text-slate-500 mb-1"><span>Integrity</span><span id="cvss-i">—</span></div>
            <div class="h-1.5 bg-slate-800 rounded overflow-hidden"><div id="cvss-i-bar" class="h-full bg-emerald-500 transition-all" style="width:0%"></div></div>
          </div>
          <div>
            <div class="flex justify-between text-[10px] font-mono text-slate-500 mb-1"><span>Availability</span><span id="cvss-a">—</span></div>
            <div class="h-1.5 bg-slate-800 rounded overflow-hidden"><div id="cvss-a-bar" class="h-full bg-amber-500 transition-all" style="width:0%"></div></div>
          </div>
          <div>
            <div class="flex justify-between text-[10px] font-mono text-slate-500 mb-1"><span>Exploitability</span><span id="cvss-e">—</span></div>
            <div class="h-1.5 bg-slate-800 rounded overflow-hidden"><div id="cvss-e-bar" class="h-full bg-rose-500 transition-all" style="width:0%"></div></div>
          </div>
        </div>
      </div>

      <!-- Classification -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 class="text-xs font-mono text-slate-500 mb-3 uppercase tracking-wider">Classification</h3>
        <div id="classification-tags" class="flex flex-wrap gap-2 mb-3">
          <span class="text-xs text-slate-600 font-mono">No scan yet</span>
        </div>
        <h4 class="text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-2">IOCs Extracted</h4>
        <div id="ioc-tags" class="flex flex-wrap gap-1.5 mb-3"></div>
        <button id="copy-iocs-btn" onclick="copyIOCs()" class="hidden text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors">Copy IOCs ↗</button>
      </div>
    </div>

    <!-- MITRE ATT&CK Matrix -->
    <div id="mitre-section" class="hidden bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h3 class="text-xs font-mono text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
        <i data-lucide="crosshair" class="w-4 h-4 text-cyan-400"></i> MITRE ATT&CK Navigator
      </h3>
      <div id="mitre-matrix" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2"></div>
    </div>

    <!-- Code Diff Viewer (for code scans) -->
    <div id="diff-section" class="hidden bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <i data-lucide="git-compare" class="w-4 h-4 text-cyan-400"></i> Secure Code Diff
        </h3>
        <button onclick="applyPatch()" class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded hover:bg-emerald-500/20 transition-colors">
          <i data-lucide="check-circle" class="w-3 h-3 inline"></i> Apply Secure Patch
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2"><span class="w-2 h-2 rounded-full bg-red-500"></span><span class="text-[11px] font-mono text-red-400">Vulnerable Code</span></div>
          <div id="diff-vulnerable" class="bg-soc-950 border border-red-500/20 rounded-lg p-3 font-mono text-xs overflow-x-auto max-h-80 overflow-y-auto"></div>
        </div>
        <div>
          <div class="flex items-center gap-2 mb-2"><span class="w-2 h-2 rounded-full bg-emerald-500"></span><span class="text-[11px] font-mono text-emerald-400">Patched Code</span></div>
          <div id="diff-patched" class="bg-soc-950 border border-emerald-500/20 rounded-lg p-3 font-mono text-xs overflow-x-auto max-h-80 overflow-y-auto"></div>
        </div>
      </div>
    </div>

    <!-- Findings -->
    <div id="findings-section" class="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h3 class="text-xs font-mono text-slate-500 mb-3 uppercase tracking-wider">Findings</h3>
      <div id="findings-list" class="space-y-3"></div>
    </div>

    <!-- SOAR Playbook -->
    <div id="soar-section" class="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h3 class="text-xs font-mono text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
        <i data-lucide="shield-alert" class="w-4 h-4 text-amber-400"></i> SOAR Containment Playbook
      </h3>
      <div class="flex gap-1 mb-4 border-b border-slate-800 overflow-x-auto">
        <button onclick="switchSoarTab('firewall')" class="soar-tab-active px-3 py-2 text-xs font-mono border-b-2 border-transparent rounded-t transition-colors" id="soar-firewall">Firewall</button>
        <button onclick="switchSoarTab('fail2ban')" class="px-3 py-2 text-xs font-mono text-slate-500 border-b-2 border-transparent rounded-t transition-colors" id="soar-fail2ban">Fail2Ban</button>
        <button onclick="switchSoarTab('sigma')" class="px-3 py-2 text-xs font-mono text-slate-500 border-b-2 border-transparent rounded-t transition-colors" id="soar-sigma">Sigma Rule</button>
        <button onclick="switchSoarTab('suricata')" class="px-3 py-2 text-xs font-mono text-slate-500 border-b-2 border-transparent rounded-t transition-colors" id="soar-suricata">Suricata</button>
      </div>
      <div id="soar-content" class="bg-soc-950 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto relative group">
        <button onclick="copySoarContent()" class="absolute top-2 right-2 px-2 py-1 bg-slate-800 text-slate-400 text-[10px] rounded hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all font-mono">Copy</button>
      </div>
    </div>

    <!-- Remediation -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h3 class="text-xs font-mono text-slate-500 mb-3 uppercase tracking-wider">Remediation Steps</h3>
      <div id="remediation-steps" class="space-y-2 mb-4"></div>
      <div id="remediation-code" class="relative group">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-mono text-slate-600">REMEDiation CODE</span>
          <button onclick="copyRemediationCode()" class="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors">Copy Code ↗</button>
        </div>
        <pre class="bg-soc-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto"><code id="remediation-code-content"></code></pre>
      </div>
    </div>

    <!-- Export -->
    <div class="flex flex-wrap gap-3">
      <button onclick="exportTxt()" class="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono rounded hover:bg-slate-700 transition-colors flex items-center gap-2">
        <i data-lucide="download" class="w-3 h-3"></i> Export Incident Report (.txt)
      </button>
      <button onclick="exportJson()" class="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono rounded hover:bg-slate-700 transition-colors flex items-center gap-2">
        <i data-lucide="file-json" class="w-3 h-3"></i> Export Full JSON
      </button>
    </div>
  </div>
</main>

<!-- ═══════════════════════ FOOTER ═══════════════════════ -->
<footer class="border-t border-slate-800 mt-12">
  <div class="max-w-7xl mx-auto px-4 py-4 text-center text-[11px] text-slate-600 font-mono">
    AegisSOC Enterprise v2.0 — Autonomous AI-Tier 1 Security Operations Platform
  </div>
</footer>

<!-- ═══════════════════════ MITRE TECHNIQUE MODAL ═══════════════════════ -->
<div id="mitre-modal" class="fixed inset-0 z-[60] hidden">
  <div class="absolute inset-0 bg-black/70" onclick="closeMitreModal()"></div>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl">
    <div class="flex items-center justify-between mb-4">
      <h3 id="mitre-modal-title" class="text-lg font-bold text-white"></h3>
      <button onclick="closeMitreModal()" class="p-1 text-slate-400 hover:text-white transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div id="mitre-modal-body" class="text-sm text-slate-400 space-y-3"></div>
  </div>
</div>

<!-- ═══════════════════════ AEGIS FAB + DRAWER ═══════════════════════ -->
<button id="agent-fab" onclick="toggleAgentDrawer(event)" class="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-full shadow-lg hover:from-cyan-500 hover:to-indigo-500 transition-all glow-cyan cursor-pointer">
  <div class="relative">
    <i data-lucide="bot" class="w-5 h-5"></i>
    <span class="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
  </div>
  <span class="text-xs font-semibold hidden sm:inline">Chat with Aegis Copilot</span>
  <span class="text-[9px] font-mono text-cyan-200 hidden sm:inline">Agent Ready</span>
</button>

<div id="drawer-overlay" class="fixed inset-0 z-[55] hidden bg-black/50" onclick="closeAgentDrawer(event)"></div>

<div id="agent-drawer" class="fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-slate-900 z-[60] flex flex-col overflow-hidden shadow-2xl border-l border-slate-800 translate-x-full transition-transform duration-300">
  <!-- Header -->
  <div class="flex-none p-4 border-b border-slate-800 flex items-center gap-3">
    <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
      <i data-lucide="bot" class="w-5 h-5 text-white"></i>
    </div>
    <div class="flex-1 min-w-0">
      <div class="text-sm font-semibold text-white">Aegis Copilot</div>
      <div class="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
        <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> Connected — SOC Tier-1 Analyst
      </div>
    </div>
    <button onclick="clearChat()" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Clear Chat">
      <i data-lucide="trash-2" class="w-4 h-4"></i>
    </button>
    <button id="force-close-agent-btn" type="button" onclick="closeAgentDrawer(event)" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors relative z-50" aria-label="Close Agent">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>

  <!-- Context Bar -->
  <div id="agent-context-bar" class="flex-none p-2 px-4 bg-slate-950/80 border-b border-slate-800 text-[10px] font-mono text-slate-500">
    Active Context: <span id="context-label" class="text-cyan-400">No scan loaded</span>
  </div>

  <!-- Tool Quick Actions -->
  <div class="flex-none p-2 px-4 border-b border-slate-800 flex gap-1.5 overflow-x-auto">
    <button onclick="agentToolAction('stix')" class="px-2.5 py-1 bg-slate-800 border border-slate-700 text-[10px] text-slate-400 rounded-full hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 transition-all whitespace-nowrap font-mono flex items-center gap-1">
      <i data-lucide="file-json" class="w-3 h-3"></i> STIX Bundle
    </button>
    <button onclick="agentToolAction('briefing')" class="px-2.5 py-1 bg-slate-800 border border-slate-700 text-[10px] text-slate-400 rounded-full hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all whitespace-nowrap font-mono flex items-center gap-1">
      <i data-lucide="file-text" class="w-3 h-3"></i> Executive Brief
    </button>
    <button onclick="agentToolAction('decode')" class="px-2.5 py-1 bg-slate-800 border border-slate-700 text-[10px] text-slate-400 rounded-full hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 transition-all whitespace-nowrap font-mono flex items-center gap-1">
      <i data-lucide="binary" class="w-3 h-3"></i> Decode Payload
    </button>
    <button onclick="agentToolAction('securecode')" class="px-2.5 py-1 bg-slate-800 border border-slate-700 text-[10px] text-slate-400 rounded-full hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all whitespace-nowrap font-mono flex items-center gap-1">
      <i data-lucide="lock" class="w-3 h-3"></i> Secure Code
    </button>
  </div>

  <!-- Chat Messages -->
  <div id="agent-chat-messages" class="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
    <div class="flex gap-3">
      <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
        <i data-lucide="bot" class="w-4 h-4 text-white"></i>
      </div>
      <div class="bg-slate-800 rounded-lg rounded-tl-sm p-3 text-sm text-slate-300 max-w-[85%]">
        <p>Welcome to <strong class="text-cyan-400">Aegis Copilot</strong> — your autonomous Tier-1 SOC analyst.</p>
        <p class="mt-2 text-xs text-slate-500">I have full context of your scan results. Ask me about:</p>
        <ul class="mt-1 text-xs text-slate-500 space-y-0.5">
          <li>• Threat summary &amp; attack analysis</li>
          <li>• IOC details &amp; threat intelligence</li>
          <li>• Remediation &amp; secure code fixes</li>
          <li>• MITRE / OWASP classification deep-dive</li>
          <li>• STIX 2.1 bundles &amp; executive briefings</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Chat Input -->
  <div class="flex-none p-4 border-t border-slate-800 bg-slate-950/60">
    <form onsubmit="sendAgentMessage(event)" class="flex gap-2">
      <input id="agent-input" type="text" placeholder="Ask Aegis about the current scan..." class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 font-mono">
      <button type="submit" class="px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors">
        <i data-lucide="send" class="w-4 h-4"></i>
      </button>
    </form>
  </div>
</div>

<!-- ═══════════════════════ JAVASCRIPT ENGINE ═══════════════════════ -->
<script>
// ── Global State ──
let currentTab = 'code';
let currentLogFormat = 'auth';
let lastResult = null;
let agentContext = { scanType: null, result: null, input: null };
let soarData = {};
let agentChatCodeCounter = 0;

// ── Clock ──
function updateClock() {
  const el = document.getElementById('clock');
  if (el) el.textContent = new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC';
}
setInterval(updateClock, 1000);
updateClock();

// ── Tab Switching ──
function switchTab(tab) {
  currentTab = tab;
  ['code','email','logs'].forEach(t => {
    const btn = document.getElementById('tab-' + t);
    btn.className = t === tab ? 'tab-active px-5 py-3 text-sm font-mono font-medium whitespace-nowrap transition-colors hover:text-cyan-400' : 'px-5 py-3 text-sm font-mono font-medium whitespace-nowrap text-slate-500 transition-colors hover:text-cyan-400';
  });
  const logBar = document.getElementById('log-format-bar');
  logBar.classList.toggle('hidden', tab !== 'logs');
  const editor = document.getElementById('input-editor');
  if (tab === 'code') editor.placeholder = 'Paste source code (Python, JS, SQL, etc.)...';
  else if (tab === 'email') editor.placeholder = 'Paste raw email headers...';
  else editor.placeholder = 'Paste server logs (auth.log, nginx, CloudTrail, etc.)...';
}

// ── Scroll / Walkthrough ──
function scrollToConsole() {
  document.getElementById('input-console').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    document.getElementById('input-editor').classList.add('highlight-pulse');
    setTimeout(() => document.getElementById('input-editor').classList.remove('highlight-pulse'), 2000);
  }, 500);
}
function showWalkthrough() {
  document.getElementById('walkthrough').classList.remove('hidden');
}
function clearInput() {
  document.getElementById('input-editor').value = '';
}

// ── Demo Samples ──
const DEMOS = {
  1: `import os\nimport psycopg2\nfrom flask import Flask, request\n\napp = Flask(__name__)\n\n# Hardcoded AWS key (BAD!)\nAWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE"\nAWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"\n\n@app.route("/login", methods=["POST"])\ndef login():\n    username = request.form["username"]\n    password = request.form["password"]\n\n    conn = psycopg2.connect(\n        host=os.getenv("DB_HOST"),\n        database=os.getenv("DB_NAME"),\n        user=os.getenv("DB_USER"),\n        password=os.getenv("DB_PASS"),\n    )\n    cursor = conn.cursor()\n\n    # SQL Injection vulnerability\n    query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'"\n    cursor.execute(query)\n\n    user = cursor.fetchone()\n    cursor.close()\n    conn.close()\n\n    if user:\n        return "Login successful"\n    else:\n        return "Invalid credentials"`,
  2: `From: "Support" <support@paypa1-security.com>\nTo: "user@example.com"\nSubject: Urgent: Verify Your Account Now\nDate: Thu, 20 Aug 2026 08:15:00 +0530\nReceived: from mail.paypa1-security.com (unknown [185.234.219.42])\n          by mx.example.com (Postfix) with ESMTP id ABC123\n          for <user@example.com>; Thu, 20 Aug 2026 08:15:02 +0000 (UTC)\nAuthentication-Results: mx.example.com;\n       spf=fail (sender IP is 185.234.219.42) smtp.mailfrom=paypa1-security.com;\n       dkim=fail header.d=paypa1-security.com;\n       dmarc=fail action=none header.from=paypa1-security.com\nReceived-SPF: Fail (sender IP is 185.234.219.42)\nDKIM-Signature: v=1; a=rsa-sha256; d=paypa1-security.com; s=selector1;\n        h=from:to:subject:date;\n        bh=invalidhashhere==;\n        b=suspicious_signature_data_here\nReply-To: "Accounts Team" <accounts@secure-paypal-verify.net>\nReturn-Path: <bounce@secure-paypal-verify.net>\nX-Mailer: PHPMailer 6.0.2`,
  3: `Aug 20 07:50:01 server sshd[12345]: Failed password for invalid user admin from 192.168.1.105 port 54322 ssh2\nAug 20 07:50:03 server sshd[12346]: Failed password for invalid user root from 192.168.1.105 port 54323 ssh2\nAug 20 07:50:05 server sshd[12347]: Failed password for invalid user test from 192.168.1.105 port 54324 ssh2\nAug 20 07:50:07 server sshd[12348]: Failed password for invalid user ubuntu from 192.168.1.105 port 54325 ssh2\nAug 20 07:50:10 server sshd[12349]: Failed password for invalid user admin from 192.168.1.105 port 54326 ssh2\nAug 20 07:51:22 server sudo: pam_unix(sudo:auth): authentication failure; logname=www-data uid=33 euid=0 tty=/dev/pts/0 ruser=www-data rhost= user=www-data\nAug 20 07:51:25 server sudo: www-data : user NOT in sudoers ; TTY=pts/0 ; PWD=/var/www/html ; USER=root ; COMMAND=/bin/bash`
};

function loadDemo(n) {
  const tabMap = { 1: 'code', 2: 'email', 3: 'logs' };
  switchTab(tabMap[n]);
  document.getElementById('input-editor').value = DEMOS[n];
  setTimeout(() => runAnalysis(), 300);
}

// ── Analysis Engine ──
function runAnalysis() {
  const input = document.getElementById('input-editor').value.trim();
  if (!input) return;
  let result;
  if (currentTab === 'code') result = analyzeCode(input);
  else if (currentTab === 'email') result = analyzeEmail(input);
  else result = analyzeLogs(input);
  lastResult = result;
  renderResults(result);
  syncAgentContext(result, input);
  openAgentDrawer();
}

function analyzeCode(input) {
  const findings = [];
  const iocs = [];
  const mitre = new Set();

  // SQL Injection
  if (/query\s*=\s*["'].*['"]\s*\+/.test(input) || /SELECT.*\+\s*\w+/.test(input) || /execute\s*\(\s*["'].*['"].*\+/.test(input)) {
    findings.push({ title: 'SQL Injection (CWE-89)', description: 'String concatenation in SQL query allows full database extraction via unsanitized user input.', severity: 'Critical' });
    mitre.add('T1190');
    iocs.push('SQL CONCAT INJECTION');
  }
  // Hardcoded AWS Keys
  if (/AKIA[0-9A-Z]{16}/.test(input)) {
    const match = input.match(/AKIA[0-9A-Z]{16}/);
    findings.push({ title: 'Hardcoded AWS Access Key (CWE-798)', description: 'AWS access key detected directly in source code: ' + match[0].slice(0,6) + '***', severity: 'Critical' });
    iocs.push(match[0]);
    mitre.add('T1552');
  }
  if (/wJalrXUtnFEMI/.test(input) || /aws[_-]?secret[_-]?access[_-]?key.*=.*["'][A-Za-z0-9/+=]{30,}/.test(input)) {
    findings.push({ title: 'Hardcoded AWS Secret Key (CWE-798)', description: 'AWS secret access key detected in source code.', severity: 'Critical' });
    iocs.push('AWS_SECRET_KEY_EXPOSED');
    mitre.add('T1552');
  }
  // eval/exec
  if (/\beval\s*\(/.test(input) || /\bexec\s*\(/.test(input)) {
    findings.push({ title: 'Code Injection via eval()/exec() (CWE-94)', description: 'Dynamic code execution from untrusted input can lead to RCE.', severity: 'Critical' });
    mitre.add('T1059');
  }
  // Command injection
  if (/os\.system\s*\(/.test(input) || /subprocess\.call\s*\(\s*["']/.test(input)) {
    findings.push({ title: 'Command Injection (CWE-78)', description: 'OS command execution with potentially untrusted input.', severity: 'High' });
    mitre.add('T1059');
  }
  // Hardcoded passwords
  if (/password\s*=\s*["'][^"']+["']/.test(input) && !/os\.getenv/.test(input)) {
    findings.push({ title: 'Hardcoded Password (CWE-798)', description: 'Password string found in source code.', severity: 'High' });
    mitre.add('T1552');
  }

  if (findings.length === 0) {
    findings.push({ title: 'No Critical Issues Detected', description: 'The code passed heuristic checks. Consider manual review.', severity: 'Low' });
  }

  const score = computeThreatScore(findings);
  const cvss = computeCVSS(findings, 'code');

  return {
    scanType: 'code', threatScore: score, severity: scoreToSeverity(score),
    attackVector: deriveAttackVector(findings),
    classification: deriveClassification(findings, mitre),
    mitreTechniques: [...mitre], iocs, findings,
    remediationSteps: generateCodeRemediation(findings),
    remediationCode: generateSecureCode(findings),
    cvss, patchedCode: generatePatchedCode(input, findings)
  };
}

function analyzeEmail(input) {
  const findings = [];
  const iocs = [];
  const mitre = new Set();
  const lower = input.toLowerCase();

  if (/spf=fail/i.test(input)) {
    findings.push({ title: 'SPF Authentication Failure', description: 'Sender Policy Framework check failed — sender IP not authorized for domain.', severity: 'High' });
    mitre.add('T1566');
  }
  if (/dkim=fail/i.test(input)) {
    findings.push({ title: 'DKIM Authentication Failure', description: 'DomainKeys Identified Mail signature verification failed.', severity: 'High' });
    mitre.add('T1566');
  }
  if (/dmarc=fail/i.test(input)) {
    findings.push({ title: 'DMARC Policy Failure', description: 'Domain-based Message Authentication failed — possible domain spoofing.', severity: 'Critical' });
    mitre.add('T1566');
  }
  // Domain mismatches
  const fromMatch = input.match(/From:.*?@([^\s>]+)/i);
  const replyMatch = input.match(/Reply-To:.*?@([^\s>]+)/i);
  const returnMatch = input.match(/Return-Path:.*?@([^\s>]+)/i);
  if (fromMatch && replyMatch && fromMatch[1] !== replyMatch[1]) {
    findings.push({ title: 'From/Reply-To Domain Mismatch', description: 'Reply-To domain (' + replyMatch[1] + ') differs from From domain (' + fromMatch[1] + ') — likely phishing.', severity: 'Critical' });
    mitre.add('T1566');
    iocs.push(fromMatch[1], replyMatch[1]);
  }
  if (fromMatch && returnMatch && fromMatch[1] !== returnMatch[1]) {
    findings.push({ title: 'From/Return-Path Domain Mismatch', description: 'Return-Path domain differs from sender domain.', severity: 'High' });
    mitre.add('T1566');
    iocs.push(returnMatch[1]);
  }
  // Suspicious IP
  const ipMatch = input.match(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g);
  if (ipMatch) {
    ipMatch.forEach(ip => { if (!iocs.includes(ip)) iocs.push(ip); });
    findings.push({ title: 'Suspicious Sender IPs Detected', description: 'IP addresses found in headers: ' + ipMatch.join(', '), severity: 'Medium' });
  }
  // Urgency / social engineering
  if (/urgent|verify.*account|immediate.*action|suspended/i.test(input)) {
    findings.push({ title: 'Social Engineering Language Detected', description: 'Email contains urgency/scarcity phrases typical of phishing.', severity: 'Medium' });
  }
  // PHPMailer / suspicious X-Mailer
  if (/x-mailer.*phpmailer/i.test(input)) {
    findings.push({ title: 'Suspicious Mailer Software', description: 'PHPMailer detected — commonly used in phishing kits.', severity: 'Low' });
  }

  if (findings.length === 0) {
    findings.push({ title: 'No Phishing Indicators Detected', description: 'Email headers passed heuristic checks.', severity: 'Low' });
  }

  const score = computeThreatScore(findings);
  const cvss = computeCVSS(findings, 'email');

  return {
    scanType: 'email', threatScore: score, severity: scoreToSeverity(score),
    attackVector: deriveAttackVector(findings),
    classification: deriveClassification(findings, mitre),
    mitreTechniques: [...mitre], iocs, findings,
    remediationSteps: generateEmailRemediation(findings),
    remediationCode: generateEmailRemediationCode(),
    cvss
  };
}

function analyzeLogs(input) {
  const findings = [];
  const iocs = [];
  const mitre = new Set();
  const lines = input.split('\\n');

  // SSH Brute-force
  const failedLogins = lines.filter(l => /failed password/i.test(l));
  if (failedLogins.length >= 3) {
    const ips = [...new Set(failedLogins.map(l => { const m = l.match(/from (\d+\.\d+\.\d+\.\d+)/); return m ? m[1] : null; }).filter(Boolean))];
    const users = [...new Set(failedLogins.map(l => { const m = l.match(/for (invalid user )?(\S+)/); return m ? m[2] : null; }).filter(Boolean))];
    findings.push({ title: 'SSH Brute-Force Attack (' + failedLogins.length + ' attempts)', description: 'Multiple failed SSH logins detected from ' + ips.join(', ') + '. Targeted users: ' + users.join(', '), severity: 'Critical' });
    mitre.add('T1110');
    ips.forEach(ip => { if (!iocs.includes(ip)) iocs.push(ip); });
  }

  // Privilege escalation
  if (/sudo.*NOT in sudoers|USER=root.*COMMAND/i.test(input)) {
    findings.push({ title: 'Privilege Escalation Attempt (T1548)', description: 'User www-data attempted sudo but is NOT in sudoers list.', severity: 'Critical' });
    mitre.add('T1548');
  }

  // Successful login after failures
  if (failedLogins.length > 0 && /accepted.*password/i.test(input)) {
    findings.push({ title: 'Successful Login After Brute-Force', description: 'At least one login succeeded after multiple failures — account may be compromised.', severity: 'Critical' });
    mitre.add('T1078');
  }

  // Nginx/Apache
  if (/40[13]\s+\d+/.test(input) || /GET\s+.*\.\./.test(input)) {
    findings.push({ title: 'Path Traversal or Auth Bypass Attempt', description: 'HTTP requests containing path traversal patterns detected.', severity: 'High' });
    mitre.add('T1190');
  }
  // CloudTrail
  if (/ConsoleLogin.*Failure/i.test(input) || /UnauthorizedAccess/i.test(input)) {
    findings.push({ title: 'AWS Console Login Failure', description: 'Failed AWS console authentication detected.', severity: 'High' });
    mitre.add('T1110');
    const iamMatch = input.match(/userIdentity.*?"userName"\\s*:\\s*"([^"]+)"/g);
    if (iamMatch) iamMatch.forEach(m => { const n = m.match(/"userName"\\s*:\\s*"([^"]+)"/); if(n) iocs.push(n[1]); });
  }

  if (findings.length === 0) {
    findings.push({ title: 'No Threats Detected', description: 'Logs passed heuristic analysis.', severity: 'Low' });
  }

  const score = computeThreatScore(findings);
  const cvss = computeCVSS(findings, 'logs');

  return {
    scanType: 'logs', threatScore: score, severity: scoreToSeverity(score),
    attackVector: deriveAttackVector(findings),
    classification: deriveClassification(findings, mitre),
    mitreTechniques: [...mitre], iocs, findings,
    remediationSteps: generateLogRemediation(findings),
    remediationCode: generateLogRemediationCode(findings, iocs),
    cvss, sofar: generateSOAR(findings, iocs)
  };
}

// ── Scoring ──
function computeThreatScore(findings) {
  let score = 0;
  findings.forEach(f => {
    if (f.severity === 'Critical') score += 25;
    else if (f.severity === 'High') score += 15;
    else if (f.severity === 'Medium') score += 8;
    else score += 3;
  });
  return Math.min(100, score);
}

function scoreToSeverity(s) {
  if (s >= 70) return 'CRITICAL';
  if (s >= 40) return 'MEDIUM';
  return 'LOW';
}

function severityColor(sev) {
  if (sev === 'CRITICAL' || sev === 'Critical') return { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', gauge: '#fb7185' };
  if (sev === 'MEDIUM' || sev === 'Medium') return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', gauge: '#fbbf24' };
  return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', gauge: '#34d399' };
}

// ── CVSS v3.1 Calculator ──
function computeCVSS(findings, type) {
  let av = 'N', ac = 'L', pr = 'N', ui = 'N', s = 'U', c = 'H', i = 'H', a = 'N';
  const hasCrit = findings.some(f => f.severity === 'Critical');
  const hasHigh = findings.some(f => f.severity === 'High');

  if (type === 'code') {
    if (findings.some(f => /SQL Injection/i.test(f.title))) { av = 'N'; ac = 'L'; pr = 'N'; ui = 'N'; c = 'H'; i = 'H'; a = 'H'; s = 'U'; }
    else if (findings.some(f => /Hardcoded.*Key/i.test(f.title))) { av = 'L'; ac = 'L'; pr = 'L'; ui = 'N'; c = 'H'; i = 'H'; a = 'N'; s = 'U'; }
  } else if (type === 'email') {
    av = 'N'; ac = 'L'; pr = 'N'; ui = 'R'; c = 'H'; i = 'H'; a = 'N'; s = 'U';
    if (findings.some(f => /DMARC/i.test(f.title))) { s = 'C'; }
  } else {
    av = 'N'; ac = 'L'; pr = 'N'; ui = 'N'; c = 'H'; i = 'L'; a = 'H'; s = 'U';
    if (hasCrit) { c = 'H'; i = 'H'; a = 'H'; }
  }

  const iss = 1 - ((1 - {'N':0,'L':0.22,'H':0.56}[c]) * (1 - {'N':0,'L':0.22,'H':0.56}[i]) * (1 - {'N':0,'L':0.22,'H':0.56}[a]));
  const impactMult = s === 'C' ? 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15) : 6.42 * iss;
  const impact = Math.max(0, Math.min(impactMult, 6.42));

  const avW = {'L':0.2,'A':0.55,'N':0.85,'P':0}[av];
  const acW = {'H':0.44,'L':0.77}[ac];
  const prW = s === 'U' ? {'N':0.85,'L':0.62,'H':0.27}[pr] : {'N':0.85,'L':0.68,'H':0.50}[pr];
  const uiW = {'N':0.85,'R':0.62}[ui];
  const exploitability = 8.22 * avW * acW * prW * uiW;

  let base;
  if (impact <= 0) base = 0;
  else base = Math.min(1.08 * (impact + exploitability), 10);

  const vector = 'CVSS:3.1/AV:' + av + '/AC:' + ac + '/PR:' + pr + '/UI:' + ui + '/S:' + s + '/C:' + c + '/I:' + i + '/A:' + a;

  return {
    score: Math.round(base * 10) / 10,
    vector,
    impact: Math.round(impact * 10) / 10,
    exploitability: Math.round(exploitability * 10) / 10,
    c, i, a
  };
}

function deriveAttackVector(findings) {
  const parts = [];
  if (findings.some(f => /SQL Injection/i.test(f.title))) parts.push('SQL Injection');
  if (findings.some(f => /Brute-Force/i.test(f.title))) parts.push('SSH Brute-Force');
  if (findings.some(f => /Privilege/i.test(f.title))) parts.push('Privilege Escalation');
  if (findings.some(f => /Hardcoded.*Key/i.test(f.title))) parts.push('Secret Exposure');
  if (findings.some(f => /SPF|DKIM|DMARC|Phishing|Spoofing/i.test(f.title))) parts.push('Email Spoofing');
  if (findings.some(f => /Social Engineering/i.test(f.title))) parts.push('Social Engineering');
  if (findings.some(f => /Command Injection/i.test(f.title))) parts.push('Command Injection');
  return parts.length ? parts.join(' & ') : 'No active threat vector';
}

function deriveClassification(findings, mitre) {
  const parts = [];
  if (findings.some(f => /SQL Injection/i.test(f.title))) parts.push('OWASP A03:2021 / CWE-89');
  if (findings.some(f => /Hardcoded.*Key/i.test(f.title))) parts.push('CWE-798');
  if (findings.some(f => /Privilege/i.test(f.title))) parts.push('OWASP A07:2021');
  if (findings.some(f => /Brute-Force/i.test(f.title))) parts.push('MITRE T1110');
  if (findings.some(f => /SPF|DKIM|DMARC/i.test(f.title))) parts.push('Phishing / Domain Spoof');
  if (findings.some(f => /Command Injection/i.test(f.title))) parts.push('CWE-78');
  if (parts.length === 0 && mitre.size > 0) parts.push('MITRE ' + [...mitre].join(', '));
  return parts.length ? parts.join('; ') : 'General Security Finding';
}

// ── Remediation Generators ──
function generateCodeRemediation(findings) {
  const steps = [];
  if (findings.some(f => /SQL Injection/i.test(f.title))) steps.push('Use parameterized queries (PreparedStatement) instead of string concatenation.');
  if (findings.some(f => /Hardcoded.*Key/i.test(f.title))) steps.push('Revoke exposed credentials immediately. Migrate to environment variables or a secrets vault (AWS Secrets Manager, HashiCorp Vault).');
  if (findings.some(f => /Command Injection/i.test(f.title))) steps.push('Use subprocess.run with list arguments instead of shell=True.');
  if (findings.some(f => /eval/i.test(f.title))) steps.push('Remove eval()/exec() calls. Use safe alternatives like ast.literal_eval() or JSON.parse().');
  if (findings.some(f => /Hardcoded Password/i.test(f.title))) steps.push('Move all passwords to environment variables or a secrets manager.');
  steps.push('Add input validation and length limits on all user-supplied parameters.');
  steps.push('Deploy a Web Application Firewall (WAF) with SQL injection rules enabled.');
  return steps;
}

function generateSecureCode(findings) {
  if (findings.some(f => /SQL Injection/i.test(f.title) || /Hardcoded.*Key/i.test(f.title))) {
    return \`import os
import psycopg2
from flask import Flask, request
from functools import wraps

app = Flask(__name__)

# Load secrets from environment — NEVER hardcode
def get_aws_config():
    return {
        "access_key": os.environ["AWS_ACCESS_KEY_ID"],
        "secret_key": os.environ["AWS_SECRET_ACCESS_KEY"],
    }

def rate_limit(max_attempts=5):
    """Simple rate limiter decorator"""
    attempts = {}
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            ip = request.remote_addr
            attempts.setdefault(ip, [])
            import time
            now = time.time()
            attempts[ip] = [t for t in attempts[ip] if now - t < 60]
            if len(attempts[ip]) >= max_attempts:
                return "Rate limit exceeded", 429
            attempts[ip].append(now)
            return f(*args, **kwargs)
        return wrapped
    return decorator

@app.route("/login", methods=["POST"])
@rate_limit(max_attempts=10)
def login():
    username = request.form.get("username", "")
    password = request.form.get("password", "")

    # Input validation
    if not username or not password:
        return "Missing credentials", 400
    if len(username) > 128 or len(password) > 128:
        return "Input too long", 400

    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST"),
        database=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASS"),
    )
    cursor = conn.cursor()

    # Parameterized query — prevents SQL injection
    cursor.execute(
        "SELECT * FROM users WHERE username = %s AND password = %s",
        (username, password)
    )

    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return "Login successful"
    else:
        return "Invalid credentials"\`;
  }
  return '# No code fixes required for this scan type.';
}

function generatePatchedCode(input, findings) {
  return generateSecureCode(findings);
}

function generateEmailRemediation(findings) {
  const steps = [];
  if (findings.some(f => /SPF/i.test(f.title))) steps.push('Configure SPF DNS TXT record: v=spf1 include:_spf.google.com ip4:YOUR_IP -all');
  if (findings.some(f => /DKIM/i.test(f.title))) steps.push('Set up DKIM signing with 2048-bit RSA key. Publish public key as DNS TXT record.');
  if (findings.some(f => /DMARC/i.test(f.title))) steps.push('Deploy DMARC policy: v=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com; pct=100;');
  if (findings.some(f => /Domain Mismatch/i.test(f.title))) steps.push('Verify sender domains match Return-Path and Reply-To. Block lookalike domains.');
  if (findings.some(f => /Social Engineering/i.test(f.title))) steps.push('Train users to identify urgency/scarcity language in phishing emails.');
  steps.push('Implement email authentication for your domain (SPF + DKIM + DMARC).');
  steps.push('Deploy an anti-phishing gateway with URL sandboxing.');
  return steps;
}

function generateEmailRemediationCode() {
  return \`# DNS TXT Records for Email Authentication
# Add these to your domain's DNS zone file

# 1. SPF Record (TXT)
v=spf1 include:_spf.google.com ip4:203.0.113.0/24 -all

# 2. DMARC Record (TXT at _dmarc.domain.com)
v=DMARC1; p=reject; rua=mailto:dmarc-reports@yourdomain.com; ruf=mailto:dmarc-forensics@yourdomain.com; fo=1; adkim=s; aspf=s; pct=100;

# 3. DKIM Record (TXT at selector._domainkey.domain.com)
v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...YOUR_PUBLIC_KEY...

# 4. MTA-STS (TXT at _mta-sts.domain.com)
v=STSv1; id=20260820T000000;

# 5. TLSRPT (TXT at _smtp._tls.domain.com)
v=TLSRPTv1; rua=mailto:tls-reports@yourdomain.com;\`;
}

function generateLogRemediation(findings) {
  const steps = [];
  if (findings.some(f => /Brute-Force/i.test(f.title))) {
    steps.push('Install and configure fail2ban to automatically ban IPs after repeated failures.');
    steps.push('Set up rate limiting on SSH: MaxAuthTries 3 in /etc/ssh/sshd_config.');
    steps.push('Disable password authentication; use SSH key-based auth only.');
    steps.push('Block attacker IPs at the firewall level (iptables/ufw).');
  }
  if (findings.some(f => /Privilege/i.test(f.title))) {
    steps.push('Remove www-data from sudo access. Audit /etc/sudoers for unauthorized entries.');
    steps.push('Implement least-privilege principle for all service accounts.');
  }
  steps.push('Enable centralized log aggregation (ELK, Splunk, or CloudWatch).');
  steps.push('Set up real-time alerting for brute-force and privilege escalation events.');
  return steps;
}

function generateLogRemediationCode(findings, iocs) {
  const ips = iocs.filter(i => /^\d+\.\d+\.\d+\.\d+$/.test(i));
  const fail2banConfig = \`# /etc/fail2ban/jail.local
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 3
banaction = iptables-multiport

[sshd]
enabled = true
port    = ssh
logpath = /var/log/auth.log
maxretry = 3
bantime  = 86400

[sshd-aggressive]
enabled  = true
port     = ssh
logpath  = /var/log/auth.log
maxretry = 2
bantime  = 604800
filter   = sshd[mode=aggressive]\`;

  const sshdConfig = \`# /etc/ssh/sshd_config - Hardened Configuration
Port 2222
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers deploy admin
Protocol 2
X11Forwarding no
AllowTcpForwarding no\`;

  const iptablesRules = ips.length > 0
    ? '#!/bin/bash\\n# Block attacker IPs\\n' + ips.map(ip => 'iptables -A INPUT -s ' + ip + ' -j DROP\\nufw deny from ' + ip).join('\\n')
    : '#!/bin/bash\\n# Add IPs to block:\\n# iptables -A INPUT -s <ATTACKER_IP> -j DROP';

  return fail2banConfig + '\\n\\n' + sshdConfig + '\\n\\n' + iptablesRules;
}

// ── SOAR Playbook Generator ──
function generateSOAR(findings, iocs) {
  const ips = iocs.filter(i => /^\d+\.\d+\.\d+\.\d+$/.test(i));
  const firewall = ips.length > 0
    ? ips.map(ip => '#!/bin/bash\\n# Rate-limit & block ' + ip + '\\niptables -A INPUT -s ' + ip + ' -m recent --set --name SSH\\niptables -A INPUT -s ' + ip + ' -m recent --update --seconds 60 --hitcount 4 --name SSH -j DROP\\niptables -A INPUT -s ' + ip + ' -j DROP\\nufw deny from ' + ip + ' comment "AegisSOC auto-block"')
    : '# No attacker IPs detected for firewall blocking.';

  const fail2ban = \`[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 3

[sshd]
enabled  = true
port     = ssh
logpath  = /var/log/auth.log
maxretry = 3
bantime  = 86400

[sshd-aggressive]
enabled  = true
port     = ssh
logpath  = /var/log/auth.log
maxretry = 2
bantime  = 604800\`;

  const sigma = \`title: Potential Brute Force Attack Detected
id: aegis-t1110-bruteforce
status: experimental
description: Detects multiple failed authentication attempts indicative of brute force
references:
  - https://attack.mitre.org/techniques/T1110/
author: AegisSOC Enterprise
date: 2026/08/20
tags:
  - attack.credential_access
  - attack.t1110
logsource:
  product: linux
  service: sshd
detection:
  selection:
    EventID: 5
    EventName: Failed login
  condition: selection | count() > 5 within 5m
  level: high
falsepositives:
  - Legitimate password changes
  - Automated system health checks\`;

  const suricata = \`# Suricata IDS Rule for SSH Brute Force
alert ssh \$EXTERNAL_NET any -> \$HOME_NET 22 (
  msg:"AegisSOC - SSH Brute Force Attempt Detected";
  flow:to_server,established;
  detection_filter:track by_src, count 5, seconds 60;
  classtype:attempted-admin;
  sid:1000001; rev:1;
  metadata:severity high, mitre_attack T1110;
)
${ips.length > 0 ? '\\n# Targeted IOC Alerts\\n' + ips.map(ip => 'alert ip ' + ip + ' any -> any any (msg:"AegisSOC - Blocked IP ' + ip + '"; sid:1000100; rev:1;)').join('\\n') : ''}\`;

  return { firewall, fail2ban, sigma, suricata };
}

// ── MITRE ATT&CK Techniques DB ──
const MITRE_TECHNIQUES = {
  T1566: { name: 'Phishing', tactic: 'Initial Access', desc: 'Adversaries send phishing messages to gain access to victim systems.', subTechs: ['T1566.001 Spearphishing Attachment', 'T1566.002 Spearphishing Link', 'T1566.003 Spearphishing via Service'], detection: 'Monitor email gateway logs for SPF/DKIM/DMARC failures. Inspect attachments and URLs.' },
  T1190: { name: 'Exploit Public-Facing App', tactic: 'Initial Access', desc: 'Adversaries exploit vulnerabilities in internet-facing applications.', subTechs: ['SQL Injection', 'Command Injection', 'Path Traversal'], detection: 'Deploy WAF, monitor application logs for injection patterns, track error spikes.' },
  T1078: { name: 'Valid Accounts', tactic: 'Initial Access', desc: 'Adversaries use compromised credentials for initial access.', subTechs: ['T1078.001 Default Accounts', 'T1078.002 Domain Accounts', 'T1078.004 Cloud Accounts'], detection: 'Monitor for login anomalies, impossible travel, unusual source IPs.' },
  T1059: { name: 'Command and Scripting Interpreter', tactic: 'Execution', desc: 'Adversaries abuse command interpreters and scripting engines.', subTechs: ['T1059.001 PowerShell', 'T1059.003 Windows Command Shell', 'T1059.004 Unix Shell', 'T1059.006 Python'], detection: 'Monitor process creation, script execution logs, command-line arguments.' },
  T1053: { name: 'Scheduled Task/Job', tactic: 'Execution', desc: 'Adversaries abuse scheduling mechanisms for code execution.', subTechs: ['T1053.003 Cron', 'T1053.005 Scheduled Task'], detection: 'Monitor crontab changes, Windows Task Scheduler, and process creation.' },
  T1548: { name: 'Abuse Elevation Control', tactic: 'Privilege Escalation', desc: 'Adversaries circumvent mechanisms designed to control elevated privileges.', subTechs: ['T1548.001 Setuid and Setgid', 'T1548.003 Sudo and Sudo Caching', 'T1548.004 Elevated Execution with Prompt'], detection: 'Monitor sudo logs, setuid binaries, UAC bypass attempts.' },
  T1027: { name: 'Obfuscated Files', tactic: 'Defense Evasion', desc: 'Adversaries attempt to make malicious code difficult to analyze.', subTechs: ['T1027.001 Binary Padding', 'T1027.002 Software Packing', 'T1027.005 Indicator Removal'], detection: 'Analyze file entropy, monitor for packing tools, sandbox execution.' },
  T1110: { name: 'Brute Force', tactic: 'Credential Access', desc: 'Adversaries use brute force techniques to gain access.', subTechs: ['T1110.001 Password Guessing', 'T1110.002 Password Cracking', 'T1110.003 Password Spraying', 'T1110.004 Credential Stuffing'], detection: 'Count failed login attempts per source, monitor for distributed attacks.' },
  T1552: { name: 'Unsecured Credentials', tactic: 'Credential Access', desc: 'Adversaries search for unsecured credentials in files and memory.', subTechs: ['T1552.001 Credentials In Files', 'T1552.002 Registry Stored Credentials', 'T1552.004 Private Keys'], detection: 'Scan for hardcoded secrets in repos, monitor file access to credential stores.' },
  T1046: { name: 'Network Service Discovery', tactic: 'Discovery', desc: 'Adversaries scan for services to identify targets.', subTechs: ['T1046.001 Scanning IP Blocks', 'T1046.002 Vulnerability Scanning'], detection: 'Monitor port scan patterns, detect nmap/zmap usage, track new network connections.' },
  T1569: { name: 'System Services', tactic: 'Execution', desc: 'Adversaries abuse system services for execution.', subTechs: ['T1569.001 Launchctl', 'T1569.002 Service Execution'], detection: 'Monitor service creation, systemctl/service commands, unusual svchost activity.' }
};

function renderMitreMatrix(techniques) {
  const container = document.getElementById('mitre-matrix');
  const section = document.getElementById('mitre-section');
  if (!techniques || techniques.length === 0) { section.classList.add('hidden'); return; }
  section.classList.remove('hidden');
  const tactics = ['Initial Access', 'Execution', 'Privilege Escalation', 'Credential Access', 'Defense Evasion', 'Discovery'];
  const tacticIcons = { 'Initial Access': 'door-open', 'Execution': 'play', 'Privilege Escalation': 'arrow-up-right', 'Credential Access': 'key', 'Defense Evasion': 'shield', 'Discovery': 'search' };

  let html = '';
  tactics.forEach(tactic => {
    const techs = Object.entries(MITRE_TECHNIQUES).filter(([, v]) => v.tactic === tactic);
    if (techs.length === 0) return;
    html += '<div class="space-y-1.5">';
    html += '<div class="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 mb-2"><i data-lucide="' + (tacticIcons[tactic] || 'crosshair') + '" class="w-3 h-3"></i>' + tactic + '</div>';
    techs.forEach(([id, tech]) => {
      const active = techniques.includes(id);
      html += '<button onclick="showMitreModal(\\'' + id + '\\')" class="mitre-badge block w-full text-left px-2.5 py-2 rounded-lg text-[11px] font-mono transition-all ' +
        (active
          ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
          : 'bg-slate-800/50 border border-slate-700/30 text-slate-600 hover:bg-slate-800') + '">';
      html += '<div class="font-semibold">' + id + '</div>';
      html += '<div class="text-[9px] opacity-70">' + tech.name + '</div>';
      html += '</button>';
    });
    html += '</div>';
  });
  container.innerHTML = html;
  lucide.createIcons();
}

function showMitreModal(id) {
  const tech = MITRE_TECHNIQUES[id];
  if (!tech) return;
  document.getElementById('mitre-modal-title').textContent = id + ': ' + tech.name;
  let body = '<p class="text-slate-300">' + tech.desc + '</p>';
  body += '<div><span class="text-xs font-mono text-cyan-400">Tactic:</span> <span class="text-xs text-slate-400">' + tech.tactic + '</span></div>';
  body += '<div><span class="text-xs font-mono text-cyan-400">Sub-Techniques:</span></div><ul class="list-disc list-inside text-xs text-slate-400 space-y-1">';
  tech.subTechs.forEach(s => body += '<li>' + s + '</li>');
  body += '</ul>';
  body += '<div><span class="text-xs font-mono text-cyan-400">Detection Guidance:</span></div><p class="text-xs text-slate-400">' + tech.detection + '</p>';
  document.getElementById('mitre-modal-body').innerHTML = body;
  document.getElementById('mitre-modal').classList.remove('hidden');
}
function closeMitreModal() { document.getElementById('mitre-modal').classList.add('hidden'); }

// ── Render Results ──
function renderResults(result) {
  document.getElementById('results-area').classList.remove('hidden');
  const sevColors = severityColor(result.severity);

  // Threat gauge
  const arc = 264 * (result.threatScore / 100);
  const gaugeArc = document.getElementById('gauge-arc');
  gaugeArc.style.strokeDasharray = arc + ' 264';
  gaugeArc.style.stroke = sevColors.gauge;
  animateNumber('gauge-number', result.threatScore);

  // Severity badge
  const badge = document.getElementById('severity-badge');
  badge.textContent = result.severity;
  badge.className = 'px-3 py-1 rounded-full text-xs font-bold font-mono uppercase inline-block ' + sevColors.bg + ' ' + sevColors.text;

  document.getElementById('attack-vector').textContent = result.attackVector;

  // CVSS
  if (result.cvss) {
    document.getElementById('cvss-score').textContent = result.cvss.score.toFixed(1);
    document.getElementById('cvss-vector').textContent = result.cvss.vector;
    const levelMap = { H: 'High (0.56)', M: 'Med (0.22)', L: 'Low (0.22)', N: 'None (0.0)' };
    document.getElementById('cvss-c').textContent = levelMap[result.cvss.c] || result.cvss.c;
    document.getElementById('cvss-i').textContent = levelMap[result.cvss.i] || result.cvss.i;
    document.getElementById('cvss-a').textContent = levelMap[result.cvss.a] || result.cvss.a;
    document.getElementById('cvss-c-bar').style.width = ({ H: 100, M: 40, L: 15, N: 0 }[result.cvss.c] || 0) + '%';
    document.getElementById('cvss-i-bar').style.width = ({ H: 100, M: 40, L: 15, N: 0 }[result.cvss.i] || 0) + '%';
    document.getElementById('cvss-a-bar').style.width = ({ H: 100, M: 40, L: 15, N: 0 }[result.cvss.a] || 0) + '%';
    const exploitPct = Math.min(100, Math.round((result.cvss.exploitability / 8.22) * 100));
    document.getElementById('cvss-e').textContent = result.cvss.exploitability.toFixed(1) + '/8.22';
    document.getElementById('cvss-e-bar').style.width = exploitPct + '%';
  }

  // Classification & IOCs
  const classTags = document.getElementById('classification-tags');
  classTags.innerHTML = result.classification.split('; ').map(t => '<span class="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-300">' + t + '</span>').join('');

  const iocTags = document.getElementById('ioc-tags');
  iocTags.innerHTML = result.iocs.map(i => '<span class="px-2 py-0.5 bg-slate-800/80 border border-slate-700/50 rounded text-[10px] font-mono text-cyan-400">' + escHtml(i) + '</span>').join('');
  document.getElementById('copy-iocs-btn').classList.toggle('hidden', result.iocs.length === 0);

  // MITRE Matrix
  renderMitreMatrix(result.mitreTechniques);

  // Diff viewer (code scans only)
  const diffSection = document.getElementById('diff-section');
  if (result.scanType === 'code' && result.patchedCode) {
    diffSection.classList.remove('hidden');
    renderDiff(result.input || document.getElementById('input-editor').value, result.patchedCode);
  } else {
    diffSection.classList.add('hidden');
  }

  // Findings
  const findingsList = document.getElementById('findings-list');
  findingsList.innerHTML = result.findings.map(f => {
    const fc = severityColor(f.severity);
    return '<div class="bg-slate-800/50 border border-slate-700/30 rounded-lg p-4"><div class="flex items-start gap-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ' + fc.bg + ' ' + fc.text + ' flex-shrink-0">' + f.severity + '</span><div><h4 class="text-sm font-semibold text-white mb-1">' + escHtml(f.title) + '</h4><p class="text-xs text-slate-400">' + escHtml(f.description) + '</p></div></div></div>';
  }).join('');

  // SOAR
  if (result.soar) {
    soarData = result.soar;
    document.getElementById('soar-section').classList.remove('hidden');
    switchSoarTab('firewall');
  } else {
    document.getElementById('soar-section').classList.add('hidden');
  }

  // Remediation
  document.getElementById('remediation-steps').innerHTML = result.remediationSteps.map(s => '<div class="flex items-start gap-2 text-sm text-slate-300"><i data-lucide="check-circle" class="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5"></i><span>' + escHtml(s) + '</span></div>').join('');
  document.getElementById('remediation-code-content').textContent = result.remediationCode;

  lucide.createIcons();
  setTimeout(() => document.getElementById('results-area').scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
}

function renderDiff(original, patched) {
  const origLines = original.split('\\n');
  const patchedLines = patched.split('\\n');
  document.getElementById('diff-vulnerable').innerHTML = origLines.map(l => '<div class="diff-line-del px-2 py-0.5 text-red-400/80">' + escHtml(l) + '</div>').join('');
  document.getElementById('diff-patched').innerHTML = patchedLines.map(l => '<div class="diff-line-add px-2 py-0.5 text-emerald-400/80">' + escHtml(l) + '</div>').join('');
}

function switchSoarTab(tab) {
  ['firewall','fail2ban','sigma','suricata'].forEach(t => {
    const btn = document.getElementById('soar-' + t);
    if (btn) {
      btn.className = t === tab
        ? 'soar-tab-active px-3 py-2 text-xs font-mono border-b-2 border-cyan-400 rounded-t transition-colors'
        : 'px-3 py-2 text-xs font-mono text-slate-500 border-b-2 border-transparent rounded-t transition-colors hover:text-slate-300';
    }
  });
  const content = document.getElementById('soar-content');
  if (soarData[tab]) content.querySelector('code,pre,button') ? (content.innerHTML = '<button onclick="copySoarContent()" class="absolute top-2 right-2 px-2 py-1 bg-slate-800 text-slate-400 text-[10px] rounded hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all font-mono z-10">Copy</button><pre class="whitespace-pre-wrap">' + escHtml(soarData[tab]) + '</pre>') : null;
  content.innerHTML = '<button onclick="copySoarContent()" class="absolute top-2 right-2 px-2 py-1 bg-slate-800 text-slate-400 text-[10px] rounded hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all font-mono z-10">Copy</button><pre class="whitespace-pre-wrap">' + escHtml(soarData[tab] || 'No data') + '</pre>';
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  let current = 0;
  const step = Math.ceil(target / 30);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current;
  }, 20);
}

// ── Copy / Export ──
function copyIOCs() { navigator.clipboard.writeText(lastResult.iocs.join(', ')); }
function copySoarContent() { navigator.clipboard.writeText(soarData[currentSoarTab || 'firewall'] || ''); }
function copyRemediationCode() { navigator.clipboard.writeText(document.getElementById('remediation-code-content').textContent); }

let currentSoarTab = 'firewall';

function exportTxt() {
  if (!lastResult) return;
  const r = lastResult;
  let txt = 'AegisSOC Enterprise — Incident Report\\n';
  txt += '=' .repeat(50) + '\\n\\n';
  txt += 'Date: ' + new Date().toISOString() + '\\n';
  txt += 'Scan Type: ' + r.scanType + '\\n';
  txt += 'Threat Score: ' + r.threatScore + '/100 (' + r.severity + ')\\n';
  txt += 'Attack Vector: ' + r.attackVector + '\\n';
  txt += 'Classification: ' + r.classification + '\\n';
  if (r.cvss) txt += 'CVSS v3.1: ' + r.cvss.score + ' (' + r.cvss.vector + ')\\n';
  txt += '\\nFINDINGS\\n' + '-'.repeat(30) + '\\n';
  r.findings.forEach((f, i) => { txt += (i+1) + '. [' + f.severity.toUpperCase() + '] ' + f.title + '\\n   ' + f.description + '\\n\\n'; });
  txt += 'IOCs\\n' + '-'.repeat(30) + '\\n' + r.iocs.join(', ') + '\\n\\n';
  txt += 'REMEDIATION STEPS\\n' + '-'.repeat(30) + '\\n';
  r.remediationSteps.forEach((s, i) => { txt += (i+1) + '. ' + s + '\\n'; });
  txt += '\\nREMEDIATION CODE\\n' + '-'.repeat(30) + '\\n' + r.remediationCode + '\\n';
  downloadFile('aegis-soc-report.txt', txt, 'text/plain');
}

function exportJson() {
  if (!lastResult) return;
  const json = JSON.stringify(lastResult, null, 2);
  downloadFile('aegis-soc-report.json', json, 'application/json');
}

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function applyPatch() {
  if (lastResult && lastResult.patchedCode) {
    document.getElementById('input-editor').value = lastResult.patchedCode;
    runAnalysis();
  }
}

// ── Live Log Streaming ──
let liveStreamInterval = null;
function toggleLiveStreaming(enabled) {
  const bar = document.getElementById('stream-progress');
  const count = document.getElementById('stream-count');
  if (enabled) {
    bar.classList.remove('hidden');
    count.classList.remove('hidden');
    let idx = 0;
    const lines = document.getElementById('input-editor').value.split('\\n');
    liveStreamInterval = setInterval(() => {
      if (idx >= lines.length) { clearInterval(liveStreamInterval); return; }
      idx++;
      const pct = Math.round((idx / lines.length) * 100);
      document.getElementById('stream-bar').style.width = pct + '%';
      count.textContent = idx + '/' + lines.length + ' events';
      if (idx === lines.length) { runAnalysis(); }
    }, 200);
  } else {
    clearInterval(liveStreamInterval);
    bar.classList.add('hidden');
    count.classList.add('hidden');
  }
}

// ── Agent / Copilot ──
function syncAgentContext(result, input) {
  agentContext = { scanType: result.scanType, result, input };
  const label = document.getElementById('context-label');
  if (label) label.textContent = result.scanType.toUpperCase() + ' | ' + result.attackVector + ' | Score: ' + result.threatScore + '/100 [' + result.severity + ']';
}

function toggleAgentDrawer(e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  const drawer = document.getElementById('agent-drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer.classList.contains('translate-x-full')) {
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    overlay.classList.remove('hidden');
  } else {
    closeAgentDrawer();
  }
}

function openAgentDrawer() {
  const drawer = document.getElementById('agent-drawer');
  const overlay = document.getElementById('drawer-overlay');
  drawer.classList.remove('translate-x-full');
  drawer.classList.add('translate-x-0');
  overlay.classList.remove('hidden');
}

function closeAgentDrawer(e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  const drawer = document.getElementById('agent-drawer');
  const overlay = document.getElementById('drawer-overlay');
  drawer.classList.add('translate-x-full');
  drawer.classList.remove('translate-x-0');
  overlay.classList.add('hidden');
  drawer.style.display = '';
  overlay.style.display = '';
}

function clearChat() {
  const container = document.getElementById('agent-chat-messages');
  container.innerHTML = '';
  appendChat('bot', 'Chat cleared. I still have your scan context loaded. What would you like to know?');
}

function appendChat(role, text) {
  const container = document.getElementById('agent-chat-messages');
  const div = document.createElement('div');
  div.className = 'flex gap-3 ' + (role === 'user' ? 'justify-end' : '');
  if (role === 'bot') {
    div.innerHTML = '<div class="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center flex-shrink-0"><i data-lucide="bot" class="w-4 h-4 text-white"></i></div><div class="bg-slate-800 rounded-lg rounded-tl-sm p-3 text-sm text-slate-300 max-w-[85%]">' + formatAgentText(text) + '</div>';
  } else {
    div.innerHTML = '<div class="bg-cyan-600/20 border border-cyan-500/20 rounded-lg rounded-tr-sm p-3 text-sm text-slate-200 max-w-[85%]">' + escHtml(text) + '</div>';
  }
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  lucide.createIcons();
}

function formatAgentText(text) {
  return text.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, (match, code) => {
    agentChatCodeCounter++;
    return '<div class="relative mt-2 mb-1"><div class="bg-soc-950 border border-slate-700 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-x-auto group"><button onclick="copyAgentCode(' + agentChatCodeCounter + ')" class="absolute top-2 right-2 px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded hover:bg-slate-700 font-mono">Copy</button><pre id="agent-code-' + agentChatCodeCounter + '" class="whitespace-pre-wrap">' + escHtml(code.trim()) + '</pre></div></div>';
  }).replace(/\\*\\*(.+?)\\*\\*/g, '<strong class="text-white">$1</strong>').replace(/\\n/g, '<br>');
}

function copyAgentCode(id) {
  const el = document.getElementById('agent-code-' + id);
  if (el) navigator.clipboard.writeText(el.textContent);
}

function sendAgentMessage(e) {
  e.preventDefault();
  const input = document.getElementById('agent-input');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  appendChat('user', msg);
  setTimeout(() => {
    const response = generateAgentResponse(msg);
    appendChat('bot', response);
  }, 600 + Math.random() * 800);
}

function agentToolAction(tool) {
  if (tool === 'stix') {
    if (!agentContext.result) { appendChat('bot', 'No scan results loaded. Run a scan first, then I\\'ll generate the STIX 2.1 bundle.'); return; }
    appendChat('user', '[Tool: Generate STIX 2.1 Threat Intel Bundle]');
    setTimeout(() => { appendChat('bot', generateSTIXBundle()); }, 500);
  } else if (tool === 'briefing') {
    if (!agentContext.result) { appendChat('bot', 'No scan results loaded. Run a scan first, then I\\'ll draft the executive briefing.'); return; }
    appendChat('user', '[Tool: Draft Executive Briefing]');
    setTimeout(() => { appendChat('bot', generateExecutiveBriefing()); }, 500);
  } else if (tool === 'decode') {
    appendChat('user', '[Tool: Reverse-Engineer Shellcode/Payload]');
    setTimeout(() => { appendChat('bot', 'Paste any Base64, URL-encoded, or hex payload and I\\'ll decode it. Example patterns detected:\\n\\n• AWS Key: AKIA... (already extracted)\\n• IP addresses from logs\\n• Any encoded strings in your input.\\n\\nType a payload to decode, or I can analyze the IOCs from your current scan.'); }, 500);
  } else if (tool === 'securecode') {
    if (!agentContext.result) { appendChat('bot', 'No scan results loaded. Run a code scan first.'); return; }
    appendChat('user', '[Tool: Get Secure Code Fix]');
    setTimeout(() => { appendChat('bot', 'Here\\'s the production-ready, hardened code for your scan:\\n\\n\`\`\`' + (agentContext.result.remediationCode || '# Run a code scan to generate secure code') + '\`\`\`'); }, 500);
  }
}

function generateAgentResponse(msg) {
  const lower = msg.toLowerCase();
  const r = agentContext.result;

  if (/^(hi|hello|hey|help|what can|how do|guide)/.test(lower)) {
    return 'I\\'m **Aegis Copilot**, your Tier-1 SOC analyst. I have full context of your current scan. Ask me about:\\n\\n• **Threat summary** — overview of findings\\n• **IOCs** — extracted indicators of compromise\\n• **Remediation** — how to fix the issues\\n• **MITRE/OWASP** — classification details\\n• **Secure code** — production-ready fixes\\n• **STIX bundle** — threat intel export\\n• **Executive briefing** — CISO report\\n\\nType your question or use the tool buttons above.';
  }

  if (!r) return 'No scan results loaded yet. Run a scan (or load a demo) and I\\'ll have full context to answer your questions.';

  if (/summary|overview|what.*found|analyze|analysis/.test(lower)) {
    return '**Threat Summary**\\n\\n• **Attack Vector:** ' + r.attackVector + '\\n• **Threat Score:** ' + r.threatScore + '/100 (' + r.severity + ')' + (r.cvss ? '\\n• **CVSS v3.1:** ' + r.cvss.score + ' (' + r.cvss.vector + ')' : '') + '\\n\\n**Findings (' + r.findings.length + '):**\\n' + r.findings.map(f => '• [' + f.severity + '] ' + f.title).join('\\n') + '\\n\\n**IOCs (' + r.iocs.length + '):** ' + (r.iocs.length ? r.iocs.join(', ') : 'None extracted') + '\\n\\nWould you like me to go deeper on any finding?';
  }

  if (/ioc|indicator|evidence|ip|domain|extracted/.test(lower)) {
    if (r.iocs.length === 0) return 'No IOCs were extracted from this scan. Try a scan with network indicators (IPs, domains, URLs).';
    return '**Extracted IOCs:**\\n\\n' + r.iocs.map(i => '• `' + i + '`').join('\\n') + '\\n\\nThese have been mapped to the STIX 2.1 indicator format. Use the **STIX Bundle** button to export them.';
  }

  if (/remediat|fix|patch|secure|hardened|improve/.test(lower)) {
    let resp = '**Remediation Steps:**\\n\\n' + r.remediationSteps.map((s, i) => (i+1) + '. ' + s).join('\\n');
    if (r.scanType === 'code' && r.remediationCode) resp += '\\n\\n**Secure Code:**\\n\`\`\`' + r.remediationCode + '\`\`\`';
    resp += '\\n\\nWould you like me to explain any specific fix?';
    return resp;
  }

  if (/mitre|owasp|cwe|attack|technique|classification/.test(lower)) {
    let resp = '**Classification:** ' + r.classification + '\\n\\n**MITRE ATT&CK Techniques:**\\n';
    if (r.mitreTechniques.length) {
      r.mitreTechniques.forEach(id => {
        const tech = MITRE_TECHNIQUES[id];
        if (tech) resp += '\\n• **' + id + ' — ' + tech.name + '** (' + tech.tactic + ')\\n  ' + tech.desc + '\\n  Detection: ' + tech.detection;
      });
    } else resp += 'No specific techniques mapped.';
    return resp;
  }

  if (/score|severity|threat|risk|cvss/.test(lower)) {
    let resp = '**Threat Assessment:**\\n\\n• Score: **' + r.threatScore + '/100** (' + r.severity + ')';
    if (r.cvss) resp += '\\n• CVSS v3.1: **' + r.cvss.score + '/10**\\n• Vector: `' + r.cvss.vector + '`\\n• Exploitability: ' + r.cvss.exploitability + '/8.22\\n• Impact: ' + r.cvss.impact;
    resp += '\\n\\n' + (r.severity === 'CRITICAL' ? '⚠️ This is a **critical** severity finding. Immediate containment recommended.' : r.severity === 'MEDIUM' ? '⚡ Moderate severity. Schedule remediation within the current sprint.' : '✅ Low severity. Address during regular maintenance.');
    return resp;
  }

  if (/finding|detail|specific|explain|deep.?(?:dive|dive)/.test(lower)) {
    if (r.findings.length === 0) return 'No findings to detail.';
    return '**Detailed Findings:**\\n\\n' + r.findings.map(f => '**' + f.title + '** [' + f.severity + ']\\n' + f.description).join('\\n\\n');
  }

  if (/stix|threat.intel|indicator/.test(lower)) return generateSTIXBundle();
  if (/executive|ciso|brief|report|summary.report/.test(lower)) return generateExecutiveBriefing();
  if (/email.spoof|spf|dkim|dmarc|dns|domain.auth/.test(lower)) return generateEmailSecurityResponse();

  return 'I\\'m not sure how to answer that. Try asking about:\\n\\n• **Threat summary** or **findings**\\n• **IOCs** or **indicators**\\n• **Remediation** or **secure code**\\n• **MITRE/OWASP** classification\\n• **CVSS score** details\\n• **STIX bundle** export\\n• **Executive briefing**\\n• **Email security** (SPF/DKIM/DMARC)';
}

function generateSTIXBundle() {
  const r = agentContext.result;
  if (!r) return 'No scan context available.';
  const bundle = {
    type: 'bundle',
    id: 'bundle--aegis-' + Date.now(),
    spec_version: '2.1',
    created: new Date().toISOString(),
    objects: [
      {
        type: 'report',
        spec_version: '2.1',
        id: 'report--aegis-' + Date.now(),
        created: new Date().toISOString(),
        name: 'AegisSOC Incident Report - ' + r.attackVector,
        description: r.classification,
        published: new Date().toISOString(),
        object_refs: r.iocs.map((_, i) => 'indicator--aegis-' + i)
      },
      ...r.iocs.map((ioc, i) => ({
        type: 'indicator',
        spec_version: '2.1',
        id: 'indicator--aegis-' + i,
        created: new Date().toISOString(),
        name: 'IOC: ' + ioc,
        pattern: /^\d+\.\d+\.\d+\.\d+$/.test(ioc)
          ? '[ipv4-addr:value = \\'' + ioc + '\\']'
          : '[domain-name:value = \\'' + ioc + '\\']',
        pattern_type: 'stix',
        valid_from: new Date().toISOString(),
        labels: ['malicious-activity']
      }))
    ]
  };
  return '**STIX 2.1 Threat Intelligence Bundle:**\\n\\n\`\`\`' + JSON.stringify(bundle, null, 2) + '\`\`\`\\n\\n' + r.iocs.length + ' indicators mapped. Copy the JSON and import into your threat intelligence platform (MISP, OpenCTI, etc.).';
}

function generateExecutiveBriefing() {
  const r = agentContext.result;
  if (!r) return 'No scan context available.';
  return '**Executive Security Briefing**\\n\\n' +
    '**To:** Chief Information Security Officer\\n' +
    '**From:** AegisSOC Enterprise Automated Triage\\n' +
    '**Date:** ' + new Date().toLocaleDateString() + '\\n' +
    '**Subject:** Security Incident Assessment — ' + r.attackVector + '\\n\\n' +
    '**Severity Level:** ' + r.severity + ' (Score: ' + r.threatScore + '/100)' + (r.cvss ? '\\n**CVSS v3.1:** ' + r.cvss.score + '/10' : '') + '\\n\\n' +
    '**Executive Summary:**\\nThe automated security triage system identified ' + r.findings.length + ' security finding(s) of severity ' + r.severity + '. ' +
    'The primary attack vector is: ' + r.attackVector + '.\\n\\n' +
    '**Key Findings:**\\n' + r.findings.map(f => '• [' + f.severity + '] ' + f.title + ' — ' + f.description).join('\\n') + '\\n\\n' +
    '**Indicators of Compromise:** ' + (r.iocs.length ? r.iocs.join(', ') : 'None extracted') + '\\n\\n' +
    '**Immediate Containment Actions:**\\n' + r.remediationSteps.slice(0, 3).map((s, i) => (i+1) + '. ' + s).join('\\n') + '\\n\\n' +
    '**Recommended Timeline:**\\n• Containment: Immediate\\n• Remediation: ' + (r.severity === 'CRITICAL' ? 'Within 24 hours' : 'Within current sprint') + '\\n• Post-incident review: Within 1 week\\n\\n' +
    '**Report generated by AegisSOC Enterprise v2.0**';
}

function generateEmailSecurityResponse() {
  return '**Email Authentication & Anti-Spoofing Configuration:**\\n\\n' +
    '**1. SPF (Sender Policy Framework):**\\n\`\`\`\\n# DNS TXT record for your domain\\nv=spf1 include:_spf.google.com ip4:203.0.113.0/24 -all\\n\`\`\`\\n' +
    '**2. DKIM (DomainKeys Identified Mail):**\\n\`\`\`\\n# Generate 2048-bit RSA key pair\\nopenssl genrsa -out dkim-private.pem 2048\\nopenssl rsa -in dkim-private.pem -pubout -out dkim-public.pem\\n\\n# DNS TXT record (selector._domainkey.domain.com)\\nv=DKIM1; k=rsa; p=MIIBIjANBgkqhki...YOUR_PUB_KEY...\\n\`\`\`\\n' +
    '**3. DMARC (strict reject policy):**\\n\`\`\`\\n# DNS TXT record (_dmarc.domain.com)\\nv=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com; ruf=mailto:forensics@yourdomain.com; fo=1; adkim=s; aspf=s; pct=100;\\n\`\`\`\\n' +
    '**4. MTA-STS + TLSRPT:**\\n\`\`\`\\n# MTA-STS (_mta-sts.domain.com)\\nv=STSv1; id=20260820T000000;\\n\\n# TLSRPT (_smtp._tls.domain.com)\\nv=TLSRPTv1; rua=mailto:tls@yourdomain.com;\\n\`\`\`\\n' +
    '⚠️ Always test with a staging domain before enforcing reject policy.';
}

// ── Utilities ──
function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  // Attach close button handlers
  const closeBtn = document.getElementById('force-close-agent-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeAgentDrawer, true);
  const overlay = document.getElementById('drawer-overlay');
  if (overlay) overlay.addEventListener('click', closeAgentDrawer, true);
});
<\/script>
</body>
</html>`;

fs.writeFileSync('/project/index.html', html);
console.log('Written ' + html.length + ' bytes');
console.log('Lines: ' + html.split('\\n').length);
