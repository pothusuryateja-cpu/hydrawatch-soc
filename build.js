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
  if (findings.some(f => /Privile

[FILE_TOO_LARGE]: The combined read_files output exceeded the 100,000 character hard limit. This file was truncated after 45,922 characters. Read it separately or use code_search for the relevant section.