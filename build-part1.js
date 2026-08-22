const fs = require('fs');

// Build the complete index.html
const html = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AegisSOC Enterprise — Autonomous AI-Tier 1 SOC Platform</title>
<script src="https://cdn.tailwindcss.com"><\/script>
<script>
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { mono: ['"JetBrains Mono"','"Fira Code"','ui-monospace','monospace'] },
    }
  }
}
<\/script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://unpkg.com/lucide@latest"><\/script>
<style>
  body{font-family:'Inter',sans-serif;background:#0f172a}
  .font-mono{font-family:'JetBrains Mono',monospace}
  .glow-pulse{animation:glowPulse 2s ease-in-out infinite}
  @keyframes glowPulse{0%,100%{box-shadow:0 0 8px rgba(6,182,212,.4)}50%{box-shadow:0 0 24px rgba(6,182,212,.8)}}
  .shimmer{background:linear-gradient(90deg,#06b6d4,#8b5cf6,#06b6d4);background-size:200% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s ease-in-out infinite}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  .agent-code-block{position:relative;background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:12px;margin:8px 0;overflow-x:auto;font-family:'JetBrains Mono',monospace;font-size:13px;color:#e2e8f0}
  .agent-code-block .copy-btn{position:absolute;top:6px;right:6px;opacity:0;transition:opacity .2s}
  .agent-code-block:hover .copy-btn{opacity:1}
  #agent-chat-messages::-webkit-scrollbar{width:6px}
  #agent-chat-messages::-webkit-scrollbar-track{background:transparent}
  #agent-chat-messages::-webkit-scrollbar-thumb{background:#334155;border-radius:4px}
  #agent-chat-messages::-webkit-scrollbar-thumb:hover{background:#475569}
  .cvss-bar{transition:width .8s ease-out}
  .live-dot{animation:livePulse 1s ease-in-out infinite}
  @keyframes livePulse{0%,100%{opacity:1}50%{opacity:.3}}
  .fade-in{animation:fadeIn .3s ease-out}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .highlight-pulse{animation:highlightPulse 1.5s ease-out}
  @keyframes highlightPulse{0%{box-shadow:0 0 0 0 rgba(6,182,212,.7)}70%{box-shadow:0 0 0 12px rgba(6,182,212,0)}100%{box-shadow:0 0 0 0 rgba(6,182,212,0)}}
  .mitre-cell{transition:all .2s}
  .mitre-cell.active{background:rgba(6,182,212,.15);border-color:#06b6d4}
</style>
</head>
<body class="bg-slate-900 text-slate-200 min-h-screen">
`;

fs.writeFileSync('/project/index.html', html);
console.log('Phase 1: Head written');
