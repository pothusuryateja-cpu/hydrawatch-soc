const fs = require('fs');
let html = fs.readFileSync('/project/index.html', 'utf8');

// Add MITRE Matrix container after results div
const mitreHTML = '\n' +
'      <!-- MITRE ATT&CK Matrix -->\n' +
'      <div id="mitre-matrix-container" class="hidden mt-4 bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">\n' +
'        <div class="flex items-center gap-2 mb-3">\n' +
'          <i data-lucide="grid-3x3" class="w-4 h-4 text-cyan-400"></i>\n' +
'          <h3 class="text-sm font-semibold text-white">MITRE ATT&CK Kill Chain</h3>\n' +
'        </div>\n' +
'        <div id="mitre-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2"></div>\n' +
'      </div>\n' +
'      <!-- CVSS v3.1 Score -->\n' +
'      <div id="cvss-container" class="hidden mt-4 bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">\n' +
'        <div class="flex items-center gap-2 mb-3">\n' +
'          <i data-lucide="gauge" class="w-4 h-4 text-cyan-400"></i>\n' +
'          <h3 class="text-sm font-semibold text-white">CVSS v3.1 Base Score</h3>\n' +
'        </div>\n' +
'        <div class="flex flex-wrap gap-6 items-start">\n' +
'          <div class="relative w-28 h-28 shrink-0">\n' +
'            <svg class="w-28 h-28 -rotate-90" viewBox="0 0 100 100">\n' +
'              <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" stroke-width="8"/>\n' +
'              <circle id="cvss-arc" cx="50" cy="50" r="40" fill="none" stroke="#f43f5e" stroke-width="8" stroke-dasharray="251.3" stroke-dashoffset="251.3" stroke-linecap="round" class="cvss-gauge"/>\n' +
'            </svg>\n' +
'            <div class="absolute inset-0 flex flex-col items-center justify-center">\n' +
'              <span id="cvss-score" class="text-2xl font-bold font-mono text-white">0.0</span>\n' +
'              <span class="text-[9px] text-slate-500 font-mono">CVSS:3.1</span>\n' +
'            </div>\n' +
'          </div>\n' +
'          <div class="flex-1 min-w-0">\n' +
'            <div id="cvss-vector" class="font-mono text-xs text-cyan-400 mb-2 break-all"></div>\n' +
'            <div id="cvss-metrics" class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs"></div>\n' +
'          </div>\n' +
'        </div>\n' +
'      </div>\n' +
'      <!-- Code Diff Viewer -->\n' +
'      <div id="diff-container" class="hidden mt-4 bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">\n' +
'        <div class="flex items-center justify-between mb-3">\n' +
'          <div class="flex items-center gap-2">\n' +
'            <i data-lucide="git-compare" class="w-4 h-4 text-cyan-400"></i>\n' +
'            <h3 class="text-sm font-semibold text-white">Secure Code Diff</h3>\n' +
'          </div>\n' +
'          <button onclick="applySecurePatch()" class="text-xs font-mono bg-emerald-600 hover:bg-emerald-500 text-white rounded px-3 py-1.5 transition flex items-center gap-1">\n' +
'            <i data-lucide="check" class="w-3 h-3"></i>Apply Secure Patch\n' +
'          </button>\n' +
'        </div>\n' +
'        <div id="diff-view" class="rounded-lg border border-slate-600 overflow-hidden max-h-80 overflow-y-auto"></div>\n' +
'      </div>\n' +
'      <!-- SOAR Playbook -->\n' +
'      <div id="soar-container" class="hidden mt-4 bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">\n' +
'        <div class="flex items-center gap-2 mb-3">\n' +
'          <i data-lucide="shield" class="w-4 h-4 text-cyan-400"></i>\n' +
'          <h3 class="text-sm font-semibold text-white">SOAR Containment Playbook</h3>\n' +
'        </div>\n' +
'        <div id="soar-tabs" class="flex gap-1 mb-3 border-b border-slate-700/60 pb-2 overflow-x-auto">\n' +
'          <button onclick="switchSoarTab(\'firewall\')" class="soar-tab text-[11px] font-mono px-2.5 py-1 rounded bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">Firewall</button>\n' +
'          <button onclick="switchSoarTab(\'fail2ban\')" class="soar-tab text-[11px] font-mono px-2.5 py-1 rounded text-slate-400 hover:text-slate-200">Fail2Ban</button>\n' +
'          <button onclick="switchSoarTab(\'sigma\')" class="soar-tab text-[11px] font-mono px-2.5 py-1 rounded text-slate-400 hover:text-slate-200">Sigma Rule</button>\n' +
'          <button onclick="switchSoarTab(\'suricata\')" class="soar-tab text-[11px] font-mono px-2.5 py-1 rounded text-slate-400 hover:text-slate-200">Suricata</button>\n' +
'        </div>\n' +
'        <div id="soar-content" class="relative"><pre id="soar-code" class="soar-rule bg-slate-950 border border-slate-600 rounded-lg p-3 text-xs text-emerald-300 overflow-x-auto max-h-64 overflow-y-auto"></pre></div>\n' +
'        <div class="mt-2 flex justify-end"><button onclick="copySoarCode()" class="text-[11px] font-mono bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded px-2.5 py-1 text-slate-300 transition flex items-center gap-1"><i data-lucide="copy" class="w-3 h-3"></i>Copy</button></div>\n' +
'      </div>\n';

html = html.replace('      <!-- Results (hidden initially) -->', mitreHTML + '\n      <!-- Results (hidden initially) -->');

// Add MITRE modal template before </body>
const modalHTML = '\n' +
'<!-- MITRE Technique Modal -->\n' +
'<div id="mitre-modal" class="hidden fixed inset-0 z-[80] modal-overlay bg-black/60 flex items-center justify-center p-4" onclick="closeMitreModal(event)">\n' +
'  <div class="modal-content bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-5" onclick="event.stopPropagation()">\n' +
'    <div class="flex items-center justify-between mb-3">\n' +
'      <div>\n' +
'        <h3 id="mitre-modal-title" class="text-sm font-bold text-white"></h3>\n' +
'        <p id="mitre-modal-id" class="text-xs font-mono text-cyan-400"></p>\n' +
'      </div>\n' +
'      <button onclick="closeMitreModal()" class="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition"><i data-lucide="x" class="w-4 h-4"></i></button>\n' +
'    </div>\n' +
'    <div id="mitre-modal-body" class="text-xs text-slate-300 leading-relaxed space-y-2"></div>\n' +
'  </div>\n' +
'</div>\n';

html = html.replace('<!-- FOOTER -->', modalHTML + '<!-- FOOTER -->');

// Add multi-log format selector to the Logs tab textarea area
const logFormatHTML = '\n' +
'        <div id="log-format-bar" class="hidden mb-2 flex items-center gap-2">\n' +
'          <span class="text-[10px] font-mono text-slate-500">Format:</span>\n' +
'          <button onclick="switchLogFormat(\'auth\')" class="logfmt-btn text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">auth.log</button>\n' +
'          <button onclick="switchLogFormat(\'nginx\')" class="logfmt-btn text-[10px] font-mono px-2 py-0.5 rounded text-slate-400">nginx</button>\n' +
'          <button onclick="switchLogFormat(\'cloudtrail\')" class="logfmt-btn text-[10px] font-mono px-2 py-0.5 rounded text-slate-400">CloudTrail</button>\n' +
'          <button onclick="switchLogFormat(\'windows\')" class="logfmt-btn text-[10px] font-mono px-2 py-0.5 rounded text-slate-400">Windows</button>\n' +
'          <div class="flex-1"></div>\n' +
'          <label class="flex items-center gap-1.5 cursor-pointer">\n' +
'            <span class="text-[10px] font-mono text-slate-500">Live Stream</span>\n' +
'            <button id="live-toggle" onclick="toggleLiveStream()" class="relative w-8 h-4 rounded-full bg-slate-700 transition-colors"><span id="live-dot" class="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-slate-500 transition-all"></span></button>\n' +
'          </label>\n' +
'        </div>\n';

html = html.replace('      <!-- Textareas -->', logFormatHTML + '\n      <!-- Textareas -->');

fs.writeFileSync('/project/index.html', html, 'utf8');
console.log('HTML sections added. Lines:', html.split('\n').length);
