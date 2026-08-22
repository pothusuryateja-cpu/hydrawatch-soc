const fs = require('fs');
let html = fs.readFileSync('/project/index.html', 'utf-8');
const newAgentJS = fs.readFileSync('/project/new-agent.js', 'utf-8');

// 1. ADD SETTINGS CSS (before </style>)
var settingsCSS = [
  '',
  '  /* === LLM Settings & Streaming === */',
  '  .typing-cursor { display: inline-block; width: 2px; height: 1em; background: #06b6d4; margin-left: 2px; animation: blink-cursor 0.8s step-end infinite; vertical-align: text-bottom; }',
  '  @keyframes blink-cursor { 0%,100% { opacity: 1; } 50% { opacity: 0; } }',
  '  @keyframes typing-dots { 0%,20% { opacity: 0.3; } 50% { opacity: 1; } 80%,100% { opacity: 0.3; } }',
  '  .typing-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #06b6d4; margin: 0 1px; }',
  '  .typing-dot:nth-child(1) { animation: typing-dots 1.4s infinite 0s; }',
  '  .typing-dot:nth-child(2) { animation: typing-dots 1.4s infinite 0.2s; }',
  '  .typing-dot:nth-child(3) { animation: typing-dots 1.4s infinite 0.4s; }',
  '  .settings-input { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 8px 12px; color: #e2e8f0; font-size: 13px; font-family: "JetBrains Mono", monospace; outline: none; transition: border-color 0.2s; width: 100%; }',
  '  .settings-input:focus { border-color: #06b6d4; box-shadow: 0 0 0 2px rgba(6,182,212,0.15); }',
  '  .settings-input::placeholder { color: #475569; }',
  '  .settings-select { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 8px 12px; color: #e2e8f0; font-size: 13px; font-family: "JetBrains Mono", monospace; outline: none; width: 100%; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 32px; }',
  '  .settings-select:focus { border-color: #06b6d4; }',
  '  .settings-label { font-size: 11px; font-family: "JetBrains Mono", monospace; color: #94a3b8; margin-bottom: 4px; display: block; }',
  '  .settings-status { font-size: 11px; font-family: "JetBrains Mono", monospace; padding: 6px 12px; border-radius: 8px; display: flex; align-items: center; gap: 6px; }',
  '  .settings-status.connected { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #34d399; }',
  '  .settings-status.disconnected { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #f87171; }',
  '  .settings-status.checking { background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.3); color: #22d3ee; }',
  ''
].join('\n');
html = html.replace('</style>', settingsCSS + '</style>');
console.log('1. Settings CSS added');

// 2. ADD SETTINGS BUTTON to drawer header
var oldBtns = '<button id="clear-chat-btn" type="button" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors" title="Clear Chat"><i data-lucide="trash-2" class="w-4 h-4"></i></button>';
var newBtns = [
  '<button id="aegis-settings-btn" type="button" onclick="openSettingsModal(event)" class="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors" title="LLM Settings">',
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
  '</button>',
  '<button id="clear-chat-btn" type="button" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors" title="Clear Chat"><i data-lucide="trash-2" class="w-4 h-4"></i></button>'
].join('');
if (html.indexOf(oldBtns) !== -1) {
  html = html.replace(oldBtns, newBtns);
  console.log('2. Settings button added');
} else {
  console.log('2. WARN: clear-chat-btn not found');
}

// 3. UPDATE DRAWER STATUS to show connection state
var oldStatus = '<p class="text-[10px] text-emerald-400 font-mono flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>Connected - SOC Tier-1 Analyst</p>';
var newStatus = '<p id="agent-connection-status" class="text-[10px] font-mono flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span><span id="agent-status-text">SOC Tier-1 Analyst</span></p>';
if (html.indexOf(oldStatus) !== -1) {
  html = html.replace(oldStatus, newStatus);
  console.log('3. Connection status updated');
} else {
  console.log('3. WARN: old status not found');
}

// 4. ADD SETTINGS MODAL before <!-- FOOTER -->
var settingsModal = [
  '',
  '<!-- LLM Settings Modal -->',
  '<div id="settings-modal" class="hidden fixed inset-0 z-[80] modal-overlay bg-black/60 flex items-center justify-center p-4" onclick="closeSettingsModal(event)">',
  '  <div class="modal-content bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl" onclick="event.stopPropagation()">',
  '    <div class="flex items-center justify-between mb-5">',
  '      <div class="flex items-center gap-2">',
  '        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
  '        <h3 class="text-sm font-bold text-white">LLM Configuration</h3>',
  '      </div>',
  '      <button onclick="closeSettingsModal(event)" class="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition">',
  '        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  '      </button>',
  '    </div>',
  '    <div class="space-y-4">',
  '      <div><label class="settings-label">API Provider</label>',
  '        <select id="settings-provider" class="settings-select" onchange="onProviderChange()">',
  '          <option value="openrouter">OpenRouter (Default)</option>',
  '          <option value="groq">Groq</option>',
  '          <option value="openai">OpenAI</option>',
  '        </select>',
  '      </div>',
  '      <div><label class="settings-label">API Key</label>',
  '        <div class="relative">',
  '          <input id="settings-apikey" type="password" class="settings-input pr-20" placeholder="sk-or-v1-... or gsk_..." autocomplete="off">',
  '          <button onclick="toggleApiKeyVisibility()" class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition p-1">',
  '            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
  '          </button>',
  '        </div>',
  '      </div>',
  '      <div><label class="settings-label">Model</label>',
  '        <select id="settings-model" class="settings-select">',
  '          <option value="meta-llama/llama-3.3-70b-instruct:free">Llama 3.3 70B (Free)</option>',
  '          <option value="google/gemini-2.0-flash-exp:free">Gemini 2.0 Flash (Free)</option>',
  '          <option value="mistralai/mistral-7b-instruct:free">Mistral 7B (Free)</option>',
  '        </select>',
  '      </div>',
  '      <div id="settings-status" class="settings-status disconnected">',
  '        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
  '        <span>Not connected</span>',
  '      </div>',
  '      <div class="flex gap-2">',
  '        <button onclick="testConnection()" class="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-mono rounded-lg px-4 py-2.5 transition flex items-center justify-center gap-1.5 border border-slate-600">Test Connection</button>',
  '        <button onclick="saveSettings()" class="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg px-4 py-2.5 transition flex items-center justify-center gap-1.5">Save &amp; Connect</button>',
  '      </div>',
  '      <p class="text-[10px] text-slate-500 font-mono leading-relaxed">API keys are stored locally in your browser. Get a free key at <a href="https://openrouter.ai/keys" target="_blank" rel="noopener" class="text-cyan-400 hover:underline">openrouter.ai/keys</a> or <a href="https://console.groq.com/keys" target="_blank" rel="noopener" class="text-cyan-400 hover:underline">console.groq.com</a></p>',
  '    </div>',
  '  </div>',
  '</div>',
  ''
].join('\n');
html = html.replace('<!-- FOOTER -->', settingsModal + '<!-- FOOTER -->');
console.log('4. Settings modal HTML added');

// 5. REPLACE THE JS SECTION from CHAT LOGIC onwards
var chatMarker = '// ============================================================\n//  CHAT LOGIC\n// ============================================================';
var chatStart = html.indexOf(chatMarker);
if (chatStart === -1) { console.error('Cannot find CHAT LOGIC section'); process.exit(1); }

// Find what comes before CHAT LOGIC (keep everything up to and including the line before)
var beforeChat = html.substring(0, chatStart);

// Build the new JS section from new-agent.js
var newJSSection = newAgentJS;

html = beforeChat + newJSSection;
console.log('5. JS section replaced with LLM-powered agent');

// FINALIZE
console.log('\nFinal: ' + html.split('\n').length + ' lines, ' + html.length + ' chars');
fs.writeFileSync('/project/index.html', html);
console.log('File written successfully!');
