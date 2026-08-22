const fs = require('fs');
let html = fs.readFileSync('/project/index.html', 'utf8');

// FIX 1: Fix hero buttons - use single quotes inside onclick attributes
html = html.replace(
  `onclick="document.getElementById("input-console").scrollIntoView({behavior:"smooth",block:"start"});setTimeout(showWalkthrough,600)"`,
  `onclick="event.preventDefault();document.getElementById('input-console').scrollIntoView({behavior:'smooth',block:'start'});setTimeout(showWalkthrough,600);var ic=document.getElementById('input-console');if(ic){ic.classList.add('ring-2','ring-cyan-500');setTimeout(function(){ic.classList.remove('ring-2','ring-cyan-500')},2000)}"`
);

html = html.replace(
  `onclick="loadDemo(2);document.getElementById("input-console").scrollIntoView({behavior:"smooth",block:"start"})"`,
  `onclick="event.preventDefault();loadDemo(1);document.getElementById('input-console').scrollIntoView({behavior:'smooth',block:'start'});setTimeout(function(){runAnalysis()},500);setTimeout(function(){toggleAgentDrawer()},1200)"`
);

// FIX 2: Fix walkthrough dismiss button
html = html.replace(
  `onclick="document.getElementById("walkthrough").classList.add("hidden")"`,
  `onclick="event.preventDefault();document.getElementById('walkthrough').classList.add('hidden')"`
);

// FIX 3: Fix drawer container - add h-full max-h-screen for proper flex layout
html = html.replace(
  `id="agent-drawer" class="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] z-[70] bg-slate-900 border-l border-slate-700/60 shadow-2xl hidden flex-col"`,
  `id="agent-drawer" class="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] z-[70] bg-slate-900 border-l border-slate-700/60 shadow-2xl hidden flex-col h-full max-h-screen"`
);

// FIX 4: Fix close button with stopPropagation
html = html.replace(
  `<button onclick="closeAgentDrawer()" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition" title="Close"><i data-lucide="x" class="w-4 h-4"></i></button>`,
  `<button onclick="event.preventDefault();event.stopPropagation();closeAgentDrawer()" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition" title="Close"><i data-lucide="x" class="w-4 h-4"></i></button>`
);

// FIX 5: Fix clear chat button with stopPropagation
html = html.replace(
  `<button onclick="clearChat()" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition" title="Clear Chat"><i data-lucide="trash-2" class="w-4 h-4"></i></button>`,
  `<button onclick="event.preventDefault();event.stopPropagation();clearChat()" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition" title="Clear Chat"><i data-lucide="trash-2" class="w-4 h-4"></i></button>`
);

// FIX 6: Fix overlay click with stopPropagation
html = html.replace(
  `id="drawer-overlay" class="fixed inset-0 bg-black/40 z-[60] hidden" onclick="closeAgentDrawer()"`,
  `id="drawer-overlay" class="fixed inset-0 bg-black/40 z-[60] hidden" onclick="event.preventDefault();closeAgentDrawer()"`
);

// FIX 7: Fix FAB button with stopPropagation
html = html.replace(
  `id="agent-fab" onclick="toggleAgentDrawer()"`,
  `id="agent-fab" onclick="event.preventDefault();event.stopPropagation();toggleAgentDrawer()"`
);

// FIX 8: Fix chat input onkeydown - escape quotes properly
html = html.replace(
  `onkeydown="if(event.key==="Enter")sendChatMessage()"`,
  `onkeydown="if(event.key==='Enter')sendChatMessage()"`
);

// FIX 9: Add highlight pulse CSS to the style block
html = html.replace(
  `.chat-msg-user { background: #0e7490; border: 1px solid #06b6d4; border-radius: 12px 12px 4px 12px; }`,
  `.chat-msg-user { background: #0e7490; border: 1px solid #06b6d4; border-radius: 12px 12px 4px 12px; }\n  @keyframes highlight-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(6,182,212,0); } 50% { box-shadow: 0 0 0 4px rgba(6,182,212,0.5); } }\n  .code-block { white-space: pre-wrap; word-break: break-all; }\n  .code-block::-webkit-scrollbar { height: 6px; }\n  .code-block::-webkit-scrollbar-track { background: #1e293b; }\n  .code-block::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }\n  .agent-code-block { position: relative; }\n  .agent-code-block .copy-code-btn { position: absolute; top: 6px; right: 6px; opacity: 0; transition: opacity 0.2s; }\n  .agent-code-block:hover .copy-code-btn { opacity: 1; }`
);

fs.writeFileSync('/project/index.html', html, 'utf8');
console.log('HTML fixes applied.');
console.log('Has max-h-screen:', html.includes('max-h-screen'));
console.log('Has stopPropagation on close:', html.includes('event.stopPropagation();closeAgentDrawer'));
console.log('Has single-quote onclick:', html.includes("getElementById('input-console')"));
