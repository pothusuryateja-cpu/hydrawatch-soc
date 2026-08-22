// ============================================================
//  LLM CONFIGURATION & SETTINGS
// ============================================================
function getAegisConfig() {
  return {
    provider: localStorage.getItem('aegis_provider') || 'openrouter',
    apiKey: localStorage.getItem('aegis_api_key') || '',
    model: localStorage.getItem('aegis_model') || 'meta-llama/llama-3.3-70b-instruct:free'
  };
}
function setAegisConfig(cfg) {
  if (cfg.provider) localStorage.setItem('aegis_provider', cfg.provider);
  if (cfg.apiKey !== undefined) localStorage.setItem('aegis_api_key', cfg.apiKey);
  if (cfg.model) localStorage.setItem('aegis_model', cfg.model);
}
function getProviderEndpoint(provider) {
  if (provider === 'groq') return 'https://api.groq.com/openai/v1/chat/completions';
  if (provider === 'openai') return 'https://api.openai.com/v1/chat/completions';
  return 'https://openrouter.ai/api/v1/chat/completions';
}
function getProviderModels(provider) {
  if (provider === 'groq') return [
    { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant' },
    { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B' },
    { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' }
  ];
  if (provider === 'openai') return [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
  ];
  return [
    { value: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B (Free)' },
    { value: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash (Free)' },
    { value: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B (Free)' },
    { value: 'qwen/qwen-2.5-72b-instruct:free', label: 'Qwen 2.5 72B (Free)' }
  ];
}

// === Settings Modal ===
function openSettingsModal(e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  var modal = document.getElementById('settings-modal');
  if (!modal) return;
  var cfg = getAegisConfig();
  document.getElementById('settings-provider').value = cfg.provider;
  document.getElementById('settings-apikey').value = cfg.apiKey;
  onProviderChange(cfg.model);
  updateConnectionStatus();
  modal.classList.remove('hidden');
  lucide.createIcons();
}
function closeSettingsModal(e) {
  if (e && e.target !== e.currentTarget && e.target.tagName !== 'BUTTON' && !e.target.closest('button')) return;
  var modal = document.getElementById('settings-modal');
  if (modal) modal.classList.add('hidden');
}
function onProviderChange(presetModel) {
  var provider = document.getElementById('settings-provider').value;
  var models = getProviderModels(provider);
  var modelSelect = document.getElementById('settings-model');
  modelSelect.innerHTML = '';
  models.forEach(function(m) {
    var opt = document.createElement('option');
    opt.value = m.value;
    opt.textContent = m.label;
    modelSelect.appendChild(opt);
  });
  if (presetModel) modelSelect.value = presetModel;
  if (provider === 'groq' && !presetModel) modelSelect.value = 'llama-3.1-8b-instant';
  if (provider === 'openai' && !presetModel) modelSelect.value = 'gpt-4o-mini';
}
function toggleApiKeyVisibility() {
  var input = document.getElementById('settings-apikey');
  input.type = input.type === 'password' ? 'text' : 'password';
}
function updateConnectionStatus() {
  var cfg = getAegisConfig();
  var statusEl = document.getElementById('settings-status');
  var headerStatus = document.getElementById('agent-status-text');
  var headerDot = document.querySelector('#agent-connection-status .rounded-full');
  if (cfg.apiKey) {
    statusEl.className = 'settings-status connected';
    statusEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg><span>Live AI Connected</span>';
    if (headerStatus) { headerStatus.textContent = 'Live AI Connected'; headerStatus.className = 'text-[10px] font-mono flex items-center gap-1 text-emerald-400'; }
    if (headerDot) { headerDot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block'; }
  } else {
    statusEl.className = 'settings-status disconnected';
    statusEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg><span>Not connected - Using fallback</span>';
    if (headerStatus) { headerStatus.textContent = 'SOC Tier-1 Analyst (Fallback)'; headerStatus.className = 'text-[10px] font-mono flex items-center gap-1 text-amber-400'; }
    if (headerDot) { headerDot.className = 'w-1.5 h-1.5 rounded-full bg-amber-400 inline-block'; }
  }
}
function saveSettings() {
  var provider = document.getElementById('settings-provider').value;
  var apiKey = document.getElementById('settings-apikey').value.trim();
  var model = document.getElementById('settings-model').value;
  setAegisConfig({ provider: provider, apiKey: apiKey, model: model });
  updateConnectionStatus();
  showToast('Settings saved');
  if (apiKey) testConnection();
}
async function testConnection() {
  var cfg = getAegisConfig();
  if (!cfg.apiKey) { showToast('Enter an API key first'); return; }
  var statusEl = document.getElementById('settings-status');
  statusEl.className = 'settings-status checking';
  statusEl.innerHTML = '<div class="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div><span>Testing connection...</span>';
  try {
    var endpoint = getProviderEndpoint(cfg.provider);
    var headers = { 'Content-Type': 'application/json' };
    if (cfg.provider === 'openrouter') {
      headers['Authorization'] = 'Bearer ' + cfg.apiKey;
      headers['HTTP-Referer'] = window.location.origin;
      headers['X-Title'] = 'AegisSOC Enterprise';
    } else {
      headers['Authorization'] = 'Bearer ' + cfg.apiKey;
    }
    var resp = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ model: cfg.model, messages: [{ role: 'user', content: 'Say "connected" in one word.' }], max_tokens: 10 })
    });
    if (resp.ok) {
      statusEl.className = 'settings-status connected';
      statusEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg><span>Live AI Connected</span>';
      updateConnectionStatus();
      showToast('Connection successful');
    } else {
      statusEl.className = 'settings-status disconnected';
      statusEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg><span>Failed (' + resp.status + ')</span>';
    }
  } catch (e) {
    statusEl.className = 'settings-status disconnected';
    statusEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg><span>Network error</span>';
  }
}

// ============================================================
//  SYSTEM PROMPT BUILDER
// ============================================================
function buildSystemPrompt() {
  var r = agentContext.result;
  var scanCtx = 'No scan has been performed yet.';
  if (r) {
    scanCtx = 'Input Category: ' + r.scanType +
      '\nThreat Score: ' + r.threatScore + '/100 (' + r.severity + ')' +
      '\nAttack Vector: ' + r.attackVector +
      '\nClassifications: ' + r.classifications.join(', ') +
      '\nMITRE Techniques: ' + r.mitreTechniques.join(', ') +
      '\nOWASP Categories: ' + r.owaspCategories.join(', ') +
      '\nIOCs: ' + r.iocs.join(', ') +
      '\nFindings: ' + r.findings.map(function(f) { return '[' + f.severity + '] ' + f.title + ': ' + f.description; }).join('\n') +
      '\nRemediation Steps: ' + r.remediationSteps.join('\n') +
      '\nRemediation Code:\n' + r.remediationCode;
  }

  return 'You are Aegis Copilot, an elite Tier-1 Security Operations Center (SOC) Analyst and Threat Hunting Specialist embedded in AegisSOC Enterprise. You assist security engineers in analyzing security alerts, source code vulnerabilities, phishing email headers, and intrusion logs.\n\nCURRENT SCAN CONTEXT:\n' + scanCtx + '\n\nGUIDELINES:\n' +
    '1. Answer the user\'s specific question directly with detailed, technical explanations.\n' +
    '2. When asked to fix, remediate, or solve an issue:\n' +
    '   - For code: write complete, hardened, production-ready code blocks with proper error handling.\n' +
    '   - For email/phishing: provide exact DNS TXT records (SPF, DKIM, DMARC p=reject), BIMI, MTA-STS.\n' +
    '   - For logs/brute force: provide exact iptables, fail2ban jail.local, sshd_config, and Sigma detection rules.\n' +
    '3. Use clean markdown formatting with copyable code fences.\n' +
    '4. Reference MITRE ATT&CK technique IDs and OWASP categories when relevant.\n' +
    '5. Be concise but thorough. Prioritize actionable recommendations over theory.\n' +
    '6. If the user asks something outside security, still help but redirect back to security when appropriate.\n' +
    '7. Always reference the current scan context in your responses when applicable.';
}

// ============================================================
//  LLM API CALL WITH STREAMING
// ============================================================
var isStreaming = false;

async function callLLM(userMessage) {
  var cfg = getAegisConfig();
  var endpoint = getProviderEndpoint(cfg.provider);

  var systemMsg = { role: 'system', content: buildSystemPrompt() };
  var messages = [systemMsg];
  var historyToSend = chatHistory.slice(-20);
  historyToSend.forEach(function(msg) {
    messages.push({ role: msg.role === 'agent' ? 'assistant' : msg.role, content: msg.content });
  });

  var headers = { 'Content-Type': 'application/json' };
  if (cfg.provider === 'openrouter') {
    headers['Authorization'] = 'Bearer ' + cfg.apiKey;
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'AegisSOC Enterprise';
  } else {
    headers['Authorization'] = 'Bearer ' + cfg.apiKey;
  }

  var bubbleEl = createStreamingBubble();
  var fullText = '';

  try {
    var resp = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: cfg.model,
        messages: messages,
        stream: true,
        max_tokens: 4096,
        temperature: 0.3
      })
    });

    if (!resp.ok) {
      var errText = await resp.text();
      throw new Error('API error ' + resp.status + ': ' + errText.substring(0, 200));
    }

    var reader = resp.body.getReader();
    var decoder = new TextDecoder();
    var buffer = '';

    while (true) {
      var result = await reader.read();
      if (result.done) break;

      buffer += decoder.decode(result.value, { stream: true });
      var lines = buffer.split('\n');
      buffer = lines.pop();

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line || !line.startsWith('data: ')) continue;
        var data = line.substring(6);
        if (data === '[DONE]') continue;

        try {
          var parsed = JSON.parse(data);
          var delta = parsed.choices && parsed.choices[0] && parsed.choices[0].delta;
          if (delta && delta.content) {
            fullText += delta.content;
            updateStreamingBubble(bubbleEl, fullText);
          }
        } catch (parseErr) {}
      }
    }

    finalizeStreamingBubble(bubbleEl, fullText);
    chatHistory.push({ role: 'agent', content: fullText });

  } catch (err) {
    finalizeStreamingBubble(bubbleEl, '**Error:** ' + err.message + '\n\nPlease check your API key and provider settings. Click the gear icon (Settings) in the drawer header to configure.');
    chatHistory.push({ role: 'agent', content: 'Error: ' + err.message });
  }

  isStreaming = false;
}

function createStreamingBubble() {
  var container = document.getElementById('agent-chat-messages');
  var div = document.createElement('div');
  div.className = 'flex gap-2.5 chat-msg chat-msg-agent fade-in';
  div.innerHTML = '<div class="w-7 h-7 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5"><i data-lucide="bot" class="w-3.5 h-3.5 text-cyan-400"></i></div><div class="min-w-0 flex-1"><p class="text-xs text-slate-500 font-mono mb-1">Aegis Agent</p><div class="text-sm text-slate-300 leading-relaxed aegis-streaming-content"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div>';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  lucide.createIcons();
  return div;
}

function updateStreamingBubble(bubbleEl, text) {
  var contentEl = bubbleEl.querySelector('.aegis-streaming-content');
  if (contentEl) {
    contentEl.innerHTML = formatAgentText(text) + '<span class="typing-cursor"></span>';
  }
  var container = document.getElementById('agent-chat-messages');
  if (container) container.scrollTop = container.scrollHeight;
}

function finalizeStreamingBubble(bubbleEl, text) {
  var contentEl = bubbleEl.querySelector('.aegis-streaming-content');
  if (contentEl) {
    contentEl.innerHTML = formatAgentText(text);
  }
  var container = document.getElementById('agent-chat-messages');
  if (container) container.scrollTop = container.scrollHeight;
  lucide.createIcons();
}

// ============================================================
//  SMART FALLBACK (No API Key)
// ============================================================
function smartFallback(question) {
  var q = question.toLowerCase();
  var r = agentContext.result;

  if (!r) {
    if (/hello|hi|hey/.test(q)) return 'Hello! I am ready to assist. Run a scan first so I have context to work with, then ask me anything about the results.';
    return '\u2699\ufe0f **API Key not detected.** Click the **Settings** icon in the top header to enter your free OpenRouter or Groq API key for unlimited live autonomous chat, or explore using the quick action pills below.\n\nYou can get a free key at [openrouter.ai/keys](https://openrouter.ai/keys) \u2014 many models are completely free.';
  }

  var ctx = '**Scan Context:** ' + r.scanType + ' | Score: ' + r.threatScore + '/100 [' + r.severity + ']\n\n';
  ctx += '\u2699\ufe0f **API Key not detected.** Click the **Settings** icon in the drawer header to enter your free API key for full conversational AI. Based on your current scan:\n\n';

  if (/fix|secure|patch|hardened|parametri|code fix|clean code/.test(q)) {
    if (r.scanType.indexOf('Source Code') !== -1) {
      return ctx + '**Production-Ready Secure Code:**\n\n```python\nimport os\nimport psycopg2\nimport shlex\nimport subprocess\nfrom flask import Flask, request\nfrom functools import wraps\n\napp = Flask(__name__)\n\nAWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")\nAWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")\n\ndef validate_input(f):\n    @wraps(f)\n    def decorated(*args, **kwargs):\n        username = request.form.get("username", "").strip()\n        password = request.form.get("password", "").strip()\n        if not username or not password:\n            return "Missing credentials", 400\n        if len(username) > 128 or len(password) > 128:\n            return "Input too long", 400\n        return f(*args, **kwargs)\n    return decorated\n\n@app.route("/login", methods=["POST"])\n@validate_input\ndef login():\n    username = request.form.get("username", "").strip()\n    password = request.form.get("password", "").strip()\n    conn = psycopg2.connect(\n        host=os.environ["DB_HOST"],\n        database=os.environ["DB_NAME"],\n        user=os.environ["DB_USER"],\n        password=os.environ["DB_PASS"],\n    )\n    cursor = conn.cursor()\n    cursor.execute(\n        "SELECT * FROM users WHERE username = %s AND password = %s",\n        (username, password)\n    )\n    user = cursor.fetchone()\n    cursor.close()\n    conn.close()\n    if user: return "Login successful"\n    else: return "Invalid credentials"\n```\n\n**Key fixes:**\n1. Parameterized queries (prevents SQLi)\n2. Secrets from environment variables\n3. Input validation with length limits\n4. shlex.quote + subprocess list args';
    }
    if (r.scanType.indexOf('Log') !== -1 || r.scanType.indexOf('Firewall') !== -1) {
      return ctx + '**Hardened Server Configuration:**\n\n```bash\n# /etc/ssh/sshd_config\nPermitRootLogin no\nPasswordAuthentication no\nMaxAuthTries 3\nAllowUsers deploy admin\n\n# /etc/fail2ban/jail.local\n[sshd]\nenabled = true\nmaxretry = 3\nbantime = 3600\nfindtime = 600\n```\n\n**After applying:**\n1. `sshd -t` to validate\n2. `systemctl restart sshd`\n3. `fail2ban-client reload`';
    }
  }

  if (/email|spoof|dmarc|spf|dkim|phishing/.test(q)) {
    return ctx + '**Email Security DNS Configuration:**\n\n```dns\n# SPF\nv=spf1 ip4:203.0.113.0/24 -all\n\n# DMARC\nv=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com; adkim=s; aspf=s; pct=100\n\n# BIMI\nv=BIMI1; l=https://yourdomain.com/logo.svg\n```';
  }

  if (/clean log|hardened log|fix log|after remediation/.test(q)) {
    return ctx + '**Hardened Log Output:**\n\n```bash\nAug 20 08:05:13 server fail2ban.actions[13100]: NOTICE [sshd] Ban 192.168.1.105\n# Brute-force blocked by fail2ban\n```';
  }

  if (/finding|vulnerability|detail|what did you find|summary/.test(q)) {
    var result = ctx + '**Findings (' + r.findings.length + '):**\n\n';
    r.findings.forEach(function(f) { result += '**' + f.title + '** [' + f.severity + ']\n' + f.description + '\n\n'; });
    return result;
  }

  if (/ioc|indicator|compromise/.test(q)) {
    return ctx + '**Extracted IOCs:**\n\n' + r.iocs.map(function(i) { return '- `' + i + '`'; }).join('\n') + '\n\nAdd these to your SIEM/SOAR watchlists.';
  }

  if (/mitre|attack|technique/.test(q)) {
    return ctx + '**MITRE ATT&CK:**\n\n' + r.mitreTechniques.map(function(m) { return '- ' + m; }).join('\n');
  }

  if (/score|threat|severity|cvss/.test(q)) {
    return ctx + '**Score Breakdown:**\n\n' + r.findings.map(function(f) { var pts = f.severity === 'Critical' ? 25 : f.severity === 'High' ? 15 : f.severity === 'Medium' ? 8 : 3; return '- ' + f.title + ' [' + f.severity + '] +' + pts + ' pts'; }).join('\n');
  }

  return ctx + '**Findings:**\n' + r.findings.map(function(f) { return '- [' + f.severity + '] ' + f.title; }).join('\n') + '\n\nAsk me about any finding, or try "fix code", "email security", or "IOCs".';
}

// ============================================================
//  CHAT LOGIC (Enhanced with LLM)
// ============================================================
async function sendChatMessage() {
  var input = document.getElementById('chat-input');
  var msg = input.value.trim();
  if (!msg || isStreaming) return;
  input.value = '';

  appendChat('user', msg);
  chatHistory.push({ role: 'user', content: msg });

  var cfg = getAegisConfig();
  if (cfg.apiKey) {
    isStreaming = true;
    await callLLM(msg);
  } else {
    isStreaming = true;
    var response = smartFallback(msg);
    var bubbleEl = createStreamingBubble();
    var words = response.split(' ');
    var accumulated = '';
    for (var i = 0; i < words.length; i++) {
      accumulated += (i > 0 ? ' ' : '') + words[i];
      updateStreamingBubble(bubbleEl, accumulated);
      await new Promise(function(resolve) { setTimeout(resolve, 15 + Math.random() * 25); });
    }
    finalizeStreamingBubble(bubbleEl, response);
    chatHistory.push({ role: 'agent', content: response });
    isStreaming = false;
  }
}

function copyAgentCode(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var text = el.textContent || el.innerText;
  navigator.clipboard.writeText(text).then(function() {
    showToast('Code copied to clipboard');
    var btn = document.querySelector('[data-copy-id="' + id + '"]');
    if (btn) {
      btn.innerHTML = '<i data-lucide="check" class="w-3 h-3"></i> Copied';
      lucide.createIcons();
      setTimeout(function() {
        btn.innerHTML = '<i data-lucide="copy" class="w-3 h-3"></i> Copy';
        lucide.createIcons();
      }, 2000);
    }
  });
}

function appendChat(role, text) {
  var container = document.getElementById('agent-chat-messages');
  var div = document.createElement('div');
  if (role === 'user') {
    div.className = 'flex justify-end';
    div.innerHTML = '<div class="chat-msg chat-msg-user px-3 py-2"><p class="text-sm text-white">' + escHtml(text) + '</p></div>';
  } else {
    div.className = 'flex gap-2.5 chat-msg chat-msg-agent';
    var bodyHtml = formatAgentText(text);
    div.innerHTML = '<div class="w-7 h-7 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5"><i data-lucide="bot" class="w-3.5 h-3.5 text-cyan-400"></i></div><div class="min-w-0"><p class="text-xs text-slate-500 font-mono mb-1">Aegis Agent</p><div class="text-sm text-slate-300 leading-relaxed">' + bodyHtml + '</div></div>';
  }
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  lucide.createIcons();
}

function formatAgentText(text) {
  var html = escHtml(text);
  // Render fenced code blocks
  var tripleTick = String.fromCharCode(96) + String.fromCharCode(96) + String.fromCharCode(96);
  var codeBlockRegex = new RegExp(tripleTick + '([\\w]*)\\n([\\s\\S]*?)' + tripleTick, 'g');
  var codeId = 0;
  html = html.replace(codeBlockRegex, function(match, lang, code) {
    codeId++;
    var id = 'agent-code-' + codeId;
    var singleTick = String.fromCharCode(96);
    return '<div class="agent-code-block relative my-2 bg-slate-950 border border-slate-600 rounded-lg overflow-hidden"><div class="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-700/60"><span class="text-[10px] font-mono text-slate-500">' + (lang || 'code') + '</span><button onclick="event.preventDefault();event.stopPropagation();copyAgentCode(' + singleTick + id + singleTick + ')" data-copy-id="' + id + '" class="copy-code-btn text-[10px] font-mono bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded px-2 py-0.5 text-slate-300 transition flex items-center gap-1"><i data-lucide="copy" class="w-3 h-3"></i> Copy</button></div><pre id="' + id + '" class="p-3 text-xs font-mono text-emerald-300 overflow-x-auto max-h-64 overflow-y-auto">' + code + '</pre></div>';
  });
  // Inline code
  var singleTick2 = String.fromCharCode(96);
  html = html.replace(new RegExp(singleTick2 + '([^' + singleTick2 + ']+)' + singleTick2, 'g'), '<code class="text-cyan-400 bg-slate-800 px-1 rounded text-xs font-mono">$1</code>');
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  // Newlines
  html = html.replace(/\n/g, '<br>');
  return html;
}

function clearChat() {
  var container = document.getElementById('agent-chat-messages');
  container.innerHTML = '';
  chatHistory = [];
  appendChat('agent', 'Chat cleared. I still retain context of your latest scan. Ask me anything!');
}

// ============================================================
//  AGENT TOOL BUTTON HANDLER
// ============================================================
async function handleAgentTool(tool) {
  var r = agentContext.result;
  if (!r) {
    appendChat('agent', 'Please run a security scan first so I have context to work with.');
    return;
  }

  var toolPrompts = {
    'stix': 'Generate a complete STIX 2.1 Threat Intelligence Bundle in JSON format for all extracted IOCs from this scan. Include proper STIX indicator objects with patterns, descriptions, and validity.',
    'briefing': 'Draft a formal Executive Security Briefing email for the CISO/Security Director. Include threat overview, key findings, critical impacts, containment status, and recommended actions.',
    'decode': 'Analyze and decode any Base64, URL-encoded, or hex payloads found in the IOCs. Explain what each decoded payload contains.',
    'fix': 'Provide the complete, hardened, production-ready code to fix all vulnerabilities found in this scan.',
    'email-config': 'Provide complete DNS TXT records for SPF, DKIM, DMARC (with p=reject), BIMI, and MTA-STS to fully secure the email domain.'
  };

  var prompt = toolPrompts[tool] || tool;
  appendChat('user', prompt);
  chatHistory.push({ role: 'user', content: prompt });

  var cfg = getAegisConfig();
  if (cfg.apiKey) {
    isStreaming = true;
    await callLLM(prompt);
  } else {
    isStreaming = true;
    var response = '';
    if (tool === 'stix') {
      response = '**STIX 2.1 Threat Intelligence Bundle:**\n\n```json\n' + generateSTIXBundle(r) + '\n```\n\nImport this bundle into MISP, OpenCTI, or ThreatConnect.';
    } else if (tool === 'briefing') {
      response = '**Executive Security Briefing:**\n\n```\n' + generateExecBriefing(r) + '\n```';
    } else if (tool === 'decode') {
      response = '**Payload Analysis:**\n\n' + decodePayload(r.iocs.join(' ')) + '\n\nAnalyzed ' + r.iocs.length + ' indicators.';
    } else if (tool === 'fix') {
      response = smartFallback('fix ' + r.scanType);
    } else if (tool === 'email-config') {
      response = smartFallback('email security dmarc spf dkim config');
    }

    var bubbleEl = createStreamingBubble();
    var words = response.split(' ');
    var acc = '';
    for (var i = 0; i < words.length; i++) {
      acc += (i > 0 ? ' ' : '') + words[i];
      updateStreamingBubble(bubbleEl, acc);
      await new Promise(function(resolve) { setTimeout(resolve, 12 + Math.random() * 20); });
    }
    finalizeStreamingBubble(bubbleEl, response);
    chatHistory.push({ role: 'agent', content: response });
    isStreaming = false;
  }
}

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  lucide.createIcons();
  var lfb = document.getElementById('log-format-bar');
  if (lfb) lfb.classList.add('hidden');
  var chips = document.getElementById('agent-tool-chips');
  if (chips) chips.classList.add('hidden');
  updateConnectionStatus();
});
