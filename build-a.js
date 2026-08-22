const fs = require('fs');
const h = `<!-- RESULTS -->
<section id="results-section" class="hidden max-w-7xl mx-auto px-4 pb-12">
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
    <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center">
      <h3 class="text-xs font-mono text-slate-500 mb-3 uppercase tracking-wider">Threat Index</h3>
      <div class="relative w-32 h-32">
        <svg viewBox="0 0 120 120" class="w-full h-full -rotate-90"><circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" stroke-width="8"/><circle id="threat-arc" cx="60" cy="60" r="50" fill="none" stroke="#06b6d4" stroke-width="8" stroke-linecap="round" stroke-dasharray="0 314"/></svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center"><span id="threat-score" class="text-3xl font-bold text-white font-mono">0</span><span class="text-[10px] text-slate-500">/100</span></div>
      </div>
      <span id="severity-badge" class="mt-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-700 text-slate-400">N/A</span>
    </div>
    <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-5 lg:col-span-2">
      <div class="flex items-center justify-between mb-3"><h3 class="text-xs font-mono text-slate-500 uppercase tracking-wider">CVSS v3.1 Score</h3><span id="cvss-score" class="text-2xl font-bold font-mono text-white">0.0</span></div>
      <div id="cvss-vector" class="text-[11px] font-mono text-slate-500 mb-4 break-all">CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N</div>
      <div class="space-y-2">
        <div class="flex items-center gap-3"><span class="text-[11px] text-slate-400 w-28 font-mono">Confidentiality</span><div class="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden"><div id="cvss-c" class="cvss-bar h-full bg-red-500 rounded-full" style="width:0%"></div></div><span id="cvss-c-val" class="text-[10px] font-mono text-slate-500 w-8">None</span></div>
        <div class="flex items-center gap-3"><span class="text-[11px] text-slate-400 w-28 font-mono">Integrity</span><div class="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden"><div id="cvss-i" class="cvss-bar h-full bg-amber-500 rounded-full" style="width:0%"></div></div><span id="cvss-i-val" class="text-[10px] font-mono text-slate-500 w-8">None</span></div>
        <div class="flex items-center gap-3"><span class="text-[11px] text-slate-400 w-28 font-mono">Availability</span><div class="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden"><div id="cvss-a" class="cvss-bar h-full bg-rose-500 rounded-full" style="width:0%"></div></div><span id="cvss-a-val" class="text-[10px] font-mono text-slate-500 w-8">None</span></div>
        <div class="flex items-center gap-3"><span class="text-[11px] text-slate-400 w-28 font-mono">Exploitability</span><div class="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden"><div id="cvss-e" class="cvss-bar h-full bg-cyan-500 rounded-full" style="width:0%"></div></div><span id="cvss-e-val" class="text-[10px] font-mono text-slate-500 w-8">0.0</span></div>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
    <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
      <h3 class="text-xs font-mono text-slate-500 mb-3 uppercase tracking-wider">MITRE ATT&amp;CK / OWASP Classification</h3>
      <div id="classification-tags" class="flex flex-wrap gap-2"></div>
      <div class="mt-3"><span class="text-[11px] text-slate-500 font-mono">Attack Vector: </span><span id="attack-vector" class="text-sm text-slate-300">\u2014</span></div>
    </div>
    <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
      <div class="flex items-center justify-between mb-3"><h3 class="text-xs font-mono text-slate-500 uppercase tracking-wider">Indicators of Compromise</h3><button onclick="copyIOCs()" class="text-[10px] px-2 py-1 rounded bg-slate-700 text-slate-400 hover:bg-slate-600 transition font-mono">Copy IOCs</button></div>
      <div id="ioc-tags" class="flex flex-wrap gap-1.5"></div>
    </div>
  </div>
  <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6">
    <h3 class="text-xs font-mono text-slate-500 mb-4 uppercase tracking-wider">MITRE ATT&amp;CK Navigator</h3>
    <div id="mitre-matrix" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2"></div>
  </div>
  <div id="diff-section" class="hidden bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6">
    <div class="flex items-center justify-between mb-4"><h3 class="text-xs font-mono text-slate-500 uppercase tracking-wider">Secure Patch Viewer</h3><button onclick="applyPatch()" class="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition">Apply Secure Patch</button></div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><div class="flex items-center gap-2 mb-2"><span class="w-2 h-2 rounded-full bg-red-500"></span><span class="text-[11px] font-mono text-red-400">Vulnerable Code</span></div><pre id="diff-old" class="bg-slate-950 border border-red-500/20 rounded-lg p-3 text-xs font-mono text-slate-400 overflow-x-auto max-h-80 overflow-y-auto whitespace-pre-wrap"></pre></div>
      <div><div class="flex items-center gap-2 mb-2"><span class="w-2 h-2 rounded-full bg-emerald-500"></span><span class="text-[11px] font-mono text-emerald-400">Patched Code</span></div><pre id="diff-new" class="bg-slate-950 border border-emerald-500/20 rounded-lg p-3 text-xs font-mono text-slate-400 overflow-x-auto max-h-80 overflow-y-auto whitespace-pre-wrap"></pre></div>
    </div>
  </div>
  <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6"><h3 class="text-xs font-mono text-slate-500 mb-4 uppercase tracking-wider">Findings</h3><div id="findings-list" class="space-y-3"></div></div>
  <div class="bg-slate-800/50 border border-slate-700 rounded-xl mb-6">
    <div class="flex border-b border-slate-700">
      <button onclick="switchRemTab('remediation')" id="remtab-remediation" class="px-4 py-3 text-xs font-medium text-cyan-400 border-b-2 border-cyan-400 transition">Remediation</button>
      <button onclick="switchRemTab('soar')" id="remtab-soar" class="px-4 py-3 text-xs font-medium text-slate-500 hover:text-slate-300 transition">SOAR Playbooks</button>
      <button onclick="switchRemTab('sigma')" id="remtab-sigma" class="px-4 py-3 text-xs font-medium text-slate-500 hover:text-slate-300 transition">Sigma Rules</button>
    </div>
    <div id="rem-content-remediation" class="p-5"><div id="remediation-steps" class="space-y-2 mb-4"></div><div id="remediation-code" class="hidden"><div class="flex items-center justify-between mb-2"><span class="text-[11px] font-mono text-slate-500">REMEDIATION CODE</span><button onclick="copyRemCode()" class="text-[10px] px-2 py-1 rounded bg-slate-700 text-slate-400 hover:bg-slate-600 transition font-mono">Copy Fix</button></div><pre class="bg-slate-950 border border-slate-700 rounded-lg p-4 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap"><code id="rem-code-content"></code></pre></div></div>
    <div id="rem-content-soar" class="hidden p-5"><div id="soar-content" class="space-y-4"></div></div>
    <div id="rem-content-sigma" class="hidden p-5"><div id="sigma-content" class="space-y-4"></div></div>
  </div>
  <div class="flex gap-3 mb-6">
    <button onclick="exportTxt()" class="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-700 transition">Export Incident Report (.txt)</button>
    <button onclick="exportJson()" class="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-700 transition">Export Full Report (.json)</button>
  </div>
</section>
<section id="empty-state" class="max-w-3xl mx-auto px-4 py-20 text-center">
  <p class="text-slate-600 text-4xl mb-4">\u26A0</p>
  <p class="text-slate-500 text-sm">Paste security data above or load a demo sample to begin analysis.</p>
</section>
<footer class="border-t border-slate-800 mt-8"><div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-[11px] text-slate-600 font-mono"><span>AegisSOC Enterprise v2.0</span><span>Powered by Aegis AI Agent</span></div></footer>
`;
fs.appendFileSync('/project/index.html', h);
console.log('Phase A: Results + footer appended');
