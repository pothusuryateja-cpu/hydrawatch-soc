const fs = require('fs');
const h = `<!-- AGENT FAB -->
<button id="agent-fab" onclick="toggleAgentDrawer(event)" class="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all glow-pulse cursor-pointer">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
  <span class="text-sm font-semibold hidden sm:inline">Chat with Aegis</span>
  <span class="flex items-center gap-1 text-[10px] text-emerald-300"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot"></span> Ready</span>
</button>

<!-- OVERLAY -->
<div id="agent-overlay" class="hidden fixed inset-0 bg-black/50 z-50" onclick="closeAgentDrawer(event)"></div>

<!-- DRAWER -->
<div id="agent-drawer" class="fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-slate-900 z-50 flex flex-col overflow-hidden shadow-2xl border-l border-slate-800 translate-x-full transition-transform duration-300" style="display:none;">
  <div class="flex-none p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/></svg>
      </div>
      <div>
        <div class="text-sm font-semibold text-white">Aegis Copilot</div>
        <div id="agent-connection-status" class="text-[10px] text-emerald-400 font-mono flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot"></span> Connected \u2014 SOC Tier-1 Analyst</div>
      </div>
    </div>
    <div class="flex items-center gap-1">
      <button id="clear-chat-btn" onclick="clearChat(event)" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="Clear chat">\u2715</button>
      <button id="force-close-agent-btn" onclick="closeAgentDrawer(event)" type="button" aria-label="Close Agent" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors relative z-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  </div>
  <div id="agent-context-bar" class="flex-none p-2 px-4 bg-slate-950/80 border-b border-slate-800 text-[10px] font-mono text-slate-500">Active Context: <span id="context-label" class="text-slate-400">No scan loaded</span></div>
  <div class="flex-none px-4 py-2 border-b border-slate-800 overflow-x-auto flex gap-1.5">
    <button onclick="agentQuickAction('stix')" class="px-2 py-1 rounded bg-slate-800 text-[10px] text-cyan-400 border border-slate-700 hover:bg-slate-700 transition whitespace-nowrap">STIX Bundle</button>
    <button onclick="agentQuickAction('brief')" class="px-2 py-1 rounded bg-slate-800 text-[10px] text-amber-400 border border-slate-700 hover:bg-slate-700 transition whitespace-nowrap">Executive Brief</button>
    <button onclick="agentQuickAction('decode')" class="px-2 py-1 rounded bg-slate-800 text-[10px] text-rose-400 border border-slate-700 hover:bg-slate-700 transition whitespace-nowrap">Decode Payloads</button>
    <button onclick="agentQuickAction('fix')" class="px-2 py-1 rounded bg-slate-800 text-[10px] text-emerald-400 border border-slate-700 hover:bg-slate-700 transition whitespace-nowrap">Get Secure Code</button>
  </div>
  <div id="agent-chat-messages" class="flex-1 min-h-0 overflow-y-auto p-4 space-y-3"></div>
  <form id="agent-chat-form" onsubmit="sendAgentMessage(event)" class="flex-none p-4 border-t border-slate-800 bg-slate-950/60">
    <div class="flex gap-2">
      <input id="agent-chat-input" type="text" placeholder="Ask Aegis about the current scan..." class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50">
      <button type="submit" class="px-3 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition">\u27A4</button>
    </div>
  </form>
</div>

<!-- SETTINGS MODAL -->
<div id="settings-modal" class="hidden fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onclick="closeSettings(event)">
  <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl" onclick="event.stopPropagation()">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-bold text-white">Settings</h3>
      <button onclick="closeSettings(event)" class="p-1 text-slate-400 hover:text-white transition">\u2715</button>
    </div>
    <div class="space-y-4">
      <div>
        <label class="block text-xs font-mono text-slate-400 mb-1.5">OpenRouter API Key</label>
        <input id="settings-api-key" type="password" placeholder="sk-or-v1-..." class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500/50">
        <p class="text-[10px] text-slate-600 mt-1">Free models available \u2014 no payment required</p>
      </div>
      <div>
        <label class="block text-xs font-mono text-slate-400 mb-1.5">Model</label>
        <select id="settings-model" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50">
          <option value="meta-llama/llama-3.3-70b-instruct:free">Llama 3.3 70B (Free)</option>
          <option value="google/gemini-2.0-flash-exp:free">Gemini 2.0 Flash (Free)</option>
          <option value="mistralai/mistral-7b-instruct:free">Mistral 7B (Free)</option>
        </select>
      </div>
      <div class="flex gap-2 pt-2">
        <button onclick="saveSettings()" class="flex-1 px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-500 transition">Save</button>
        <button onclick="closeSettings(event)" class="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm hover:bg-slate-600 transition">Cancel</button>
      </div>
    </div>
  </div>
</div>

<!-- MITRE MODAL -->
<div id="mitre-modal" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onclick="closeMitreModal(event)">
  <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl" onclick="event.stopPropagation()">
    <div class="flex items-center justify-between mb-4">
      <h3 id="mitre-modal-title" class="text-lg font-bold text-white"></h3>
      <button onclick="closeMitreModal(event)" class="p-1 text-slate-400 hover:text-white transition">\u2715</button>
    </div>
    <div id="mitre-modal-body" class="text-sm text-slate-300 space-y-3"></div>
  </div>
</div>
`;
fs.appendFileSync('/project/index.html', h);
console.log('Phase B: Drawers + modals appended');
