const fs = require('fs');

const body = `<!-- HEADER -->
<header class="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40">
  <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center glow-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <div>
        <h1 class="text-lg font-bold text-white tracking-tight">AegisSOC Enterprise <span class="text-xs font-normal text-slate-500">v2.0</span></h1>
        <p class="text-[11px] text-slate-500 font-mono">Autonomous AI-Tier 1 SOC Platform</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <span class="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-mono"><span class="w-2 h-2 rounded-full bg-emerald-400 live-dot"></span> Systems Online</span>
      <button onclick="openSettings()" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Settings">&#9881;</button>
    </div>
  </div>
</header>

<!-- HERO -->
<section class="border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/50 to-slate-900">
  <div class="max-w-5xl mx-auto px-4 py-12 text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-6">AEGIS SECURITY COPILOT &amp; SOC TRIAGE SUITE</div>
    <h2 class="text-3xl sm:text-4xl font-bold mb-3"><span class="shimmer">Next-Gen Automated Threat Triage</span></h2>
    <p class="text-slate-400 text-base max-w-2xl mx-auto mb-8">Static Analysis &amp; Real-Time Incident Remediation — powered by heuristic AI, MITRE ATT&CK mapping, CVSS v3.1 scoring, and autonomous SOAR playbooks.</p>
    <div class="flex flex-wrap justify-center gap-3 mb-8">
      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">Automated CWE / OWASP Mapping</span>
      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">Sub-second IOC Extraction</span>
      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">Context-Aware Remediation Agent</span>
    </div>
    <div class="flex justify-center gap-3">
      <button onclick="heroGetStarted()" class="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold text-sm hover:from-cyan-500 hover:to-indigo-500 transition-all glow-pulse">Get Started</button>
      <button onclick="heroTryDemo()" class="px-6 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-700 transition-all">Try Demo Scan</button>
    </div>
  </div>
</section>

<!-- INPUT CONSOLE -->
<section id="input-console" class="max-w-7xl mx-auto px-4 py-8">
  <div class="flex gap-1 border-b border-slate-800 mb-6">
    <button onclick="switchTab('code')" id="tab-code" class="px-4 py-2.5 text-sm font-medium text-cyan-400 border-b-2 border-cyan-400 transition-colors">Source Code Scanner</button>
    <button onclick="switchTab('email')" id="tab-email" class="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors">Phishing Email Analyzer</button>
    <button onclick="switchTab('logs')" id="tab-logs" class="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors">Server &amp; Firewall Logs</button>
  </div>
  <div class="flex flex-wrap gap-2 mb-4">
    <button onclick="loadDemo(1)" class="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium hover:bg-rose-500/20 transition">Demo 1: SQLi + AWS Keys</button>
    <button onclick="loadDemo(2)" class="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition">Demo 2: Phishing Email</button>
    <button onclick="loadDemo(3)" class="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition">Demo 3: SSH Brute-Force</button>
  </div>
  <div id="log-format-selector" class="hidden mb-4 flex flex-wrap gap-2">
    <span class="text-xs text-slate-500 font-mono self-center mr-2">FORMAT:</span>
    <button onclick="setLogFormat('auth')" class="log-fmt-btn px-2 py-1 rounded text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" data-fmt="auth">auth.log</button>
    <button onclick="setLogFormat('nginx')" class="log-fmt-btn px-2 py-1 rounded text-xs font-mono bg-slate-700 text-slate-400 border border-slate-600" data-fmt="nginx">Nginx/Apache</button>
    <button onclick="setLogFormat('cloudtrail')" class="log-fmt-btn px-2 py-1 rounded text-xs font-mono bg-slate-700 text-slate-400 border border-slate-600" data-fmt="cloudtrail">CloudTrail</button>
    <button onclick="setLogFormat('windows')" class="log-fmt-btn px-2 py-1 rounded text-xs font-mono bg-slate-700 text-slate-400 border border-slate-600" data-fmt="windows">Windows 4625</button>
  </div>
  <div class="relative">
    <textarea id="input-editor" rows="14" placeholder="Paste your source code, email headers, or server logs here..." class="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-sm text-slate-300 resize-y focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 placeholder-slate-600 transition-all"></textarea>
    <div class="absolute bottom-3 right-3 flex gap-2">
      <button onclick="clearInput()" class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs hover:bg-slate-700 transition">Clear</button>
      <button onclick="runAnalysis()" class="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-semibold hover:from-cyan-500 hover:to-indigo-500 transition">Analyze</button>
    </div>
  </div>
  <div id="live-stream-controls" class="hidden mt-3 flex items-center gap-3">
    <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" id="live-stream-toggle" class="w-4 h-4 accent-cyan-500 rounded" onchange="toggleLiveStream()"><span class="text-xs text-slate-400 font-mono">Simulate Live Ingestion</span></label>
    <div id="stream-progress" class="hidden flex-1 max-w-xs">
      <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div id="stream-bar" class="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all" style="width:0%"></div></div>
      <span id="stream-count" class="text-[10px] text-slate-500 font-mono mt-0.5">0 / 0 events</span>
    </div>
  </div>
</section>
`;

fs.appendFileSync('/project/index.html', body);
console.log('Phase 2: Body header + input written');
