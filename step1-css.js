const fs = require('fs');
let html = fs.readFileSync('/project/index.html', 'utf8');

const newCSS = '\n' +
  '  .mitre-cell { transition: all 0.2s; cursor: pointer; }\n' +
  '  .mitre-cell:hover { transform: scale(1.05); z-index: 10; }\n' +
  '  .mitre-cell.active { box-shadow: 0 0 0 2px #06b6d4; }\n' +
  '  .mitre-cell.dimmed { opacity: 0.3; }\n' +
  '  .diff-add { background: rgba(16,185,129,0.15); border-left: 3px solid #10b981; }\n' +
  '  .diff-del { background: rgba(239,68,68,0.15); border-left: 3px solid #ef4444; }\n' +
  '  .diff-line { font-family: "JetBrains Mono", monospace; font-size: 12px; padding: 2px 8px; white-space: pre-wrap; }\n' +
  '  .cvss-gauge { transition: stroke-dashoffset 1s ease-out; }\n' +
  '  .soar-rule { font-family: "JetBrains Mono", monospace; }\n' +
  '  .log-stream-line { animation: log-fade-in 0.3s ease-out; }\n' +
  '  @keyframes log-fade-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }\n' +
  '  .modal-overlay { backdrop-filter: blur(4px); }\n' +
  '  .modal-content { animation: modal-in 0.25s ease-out; }\n' +
  '  @keyframes modal-in { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }\n';

html = html.replace('.agent-code-block:hover .copy-code-btn { opacity: 1; }', '.agent-code-block:hover .copy-code-btn { opacity: 1; }' + newCSS);
fs.writeFileSync('/project/index.html', html, 'utf8');
console.log('CSS added. Lines:', html.split('\n').length);
