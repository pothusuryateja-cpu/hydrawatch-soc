// === MITRE ATT&CK Data & Matrix ===
var MITRE_TACTICS = [
  { id: 'TA0001', name: 'Initial Access', icon: 'door-open' },
  { id: 'TA0002', name: 'Execution', icon: 'play' },
  { id: 'TA0003', name: 'Persistence', icon: 'anchor' },
  { id: 'TA0004', name: 'Privilege Escalation', icon: 'arrow-up' },
  { id: 'TA0005', name: 'Defense Evasion', icon: 'eye-off' },
  { id: 'TA0006', name: 'Credential Access', icon: 'key' },
  { id: 'TA0007', name: 'Discovery', icon: 'search' },
  { id: 'TA0008', name: 'Lateral Movement', icon: 'move' },
  { id: 'TA0009', name: 'Collection', icon: 'database' },
  { id: 'TA0010', name: 'Exfiltration', icon: 'upload' },
  { id: 'TA0011', name: 'Command and Control', icon: 'radio' },
  { id: 'TA0040', name: 'Impact', icon: 'zap' }
];

var MITRE_TECHNIQUES = {
  'T1566': { name: 'Phishing', tactic: 'TA0001', desc: 'Adversaries send phishing messages to gain access to victim systems. Spearphishing is a targeted variant.', subs: ['T1566.001 Spearphishing Attachment', 'T1566.002 Spearphishing Link', 'T1566.003 Spearphishing via Service'], detection: 'Monitor email gateway logs for suspicious attachments/links. Check SPF/DKIM/DMARC failures.' },
  'T1190': { name: 'Exploit Public-Facing Application', tactic: 'TA0001', desc: 'Adversaries exploit vulnerabilities in internet-facing applications to gain initial access.', subs: [], detection: 'Monitor WAF logs, application error rates, and unusual HTTP request patterns.' },
  'T1059': { name: 'Command and Scripting Interpreter', tactic: 'TA0002', desc: 'Adversaries execute commands, scripts, or binaries using command-line interpreters.', subs: ['T1059.001 PowerShell', 'T1059.003 Windows Command Shell', 'T1059.004 Unix Shell', 'T1059.006 Python'], detection: 'Monitor process creation logs, script block logging, and command-line audit trails.' },
  'T1548': { name: 'Abuse Elevation Control Mechanism', tactic: 'TA0004', desc: 'Adversaries circumvent mechanisms designed to control elevated privileges.', subs: ['T1548.001 Setuid and Setgid', 'T1548.003 Sudo and Sudo Caching', 'T1548.005 Temporary Elevated Cloud Access'], detection: 'Monitor sudo usage, setuid binary changes, and UAC bypass attempts.' },
  'T1027': { name: 'Obfuscated Files or Information', tactic: 'TA0005', desc: 'Adversaries attempt to make an executable or file difficult to discover or analyze.', subs: ['T1027.001 Binary Padding', 'T1027.002 Software Packing', 'T1027.005 Indicator Removal from Tools'], detection: 'Monitor for packed executables, base64-encoded payloads, and entropy anomalies.' },
  'T1110': { name: 'Brute Force', tactic: 'TA0006', desc: 'Adversaries use brute force techniques to gain access to accounts.', subs: ['T1110.001 Password Guessing', 'T1110.002 Password Cracking', 'T1110.003 Password Spraying', 'T1110.004 Credential Stuffing'], detection: 'Monitor for multiple failed login attempts from single source. Implement fail2ban thresholds.' },
  'T1552': { name: 'Unsecured Credentials', tactic: 'TA0006', desc: 'Adversaries search for unsecured credentials in files, registries, and memory.', subs: ['T1552.001 Credentials In Files', 'T1552.002 Registry Stored Credentials', 'T1552.004 Private Keys'], detection: 'Scan repositories for hardcoded secrets. Audit credential storage practices.' },
  'T1078': { name: 'Valid Accounts', tactic: 'TA0001', desc: 'Adversaries use stolen credentials to bypass authentication and maintain access.', subs: ['T1078.001 Default Accounts', 'T1078.002 Domain Accounts', 'T1078.004 Cloud Accounts'], detection: 'Monitor for logins from unusual locations, times, or devices. Implement MFA.' },
  'T1046': { name: 'Network Service Scanning', tactic: 'TA0007', desc: 'Adversaries scan for available services and ports on remote hosts.', subs: [], detection: 'Monitor for unusual port scanning activity, Nmap signatures, and connection spikes.' },
  'T1569': { name: 'System Services', tactic: 'TA0002', desc: 'Adversaries abuse system services or daemons to execute commands.', subs: ['T1569.002 Service Execution'], detection: 'Monitor service creation, modification, and unusual service process trees.' }
};

var currentActiveMitre = [];

function renderMitreMatrix(activeTechniques) {
  currentActiveMitre = activeTechniques || [];
  var container = document.getElementById('mitre-matrix');
  if (!container) return;
  container.innerHTML = '';
  var activeTactics = {};
  currentActiveMitre.forEach(function(tid) {
    var tech = MITRE_TECHNIQUES[tid];
    if (tech) activeTactics[tech.tactic] = true;
  });
  MITRE_TACTICS.forEach(function(tactic) {
    var col = document.createElement('div');
    var isActive = activeTactics[tactic.id];
    col.className = 'rounded-lg p-2 ' + (isActive ? 'bg-slate-700/60 border border-cyan-500/30' : 'bg-slate-800/30 border border-slate-700/30');
    var header = document.createElement('div');
    header.className = 'text-[10px] font-mono font-semibold mb-2 ' + (isActive ? 'text-cyan-400' : 'text-slate-500');
    header.textContent = tactic.name;
    col.appendChild(header);
    var techs = Object.entries(MITRE_TECHNIQUES).filter(function(e) { return e[1].tactic === tactic.id; });
    techs.forEach(function(entry) {
      var tid = entry[0];
      var tech = entry[1];
      var isActive = currentActiveMitre.indexOf(tid) !== -1;
      var badge = document.createElement('button');
      badge.className = 'mitre-cell block w-full text-left text-[9px] font-mono px-2 py-1 rounded mb-1 transition ' + (isActive ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 active' : 'bg-slate-900/50 text-slate-500 border border-slate-700/20 dimmed');
      badge.textContent = tid;
      badge.title = tech.name;
      badge.onclick = function(e) { e.stopPropagation(); showMitreModal(tid); };
      col.appendChild(badge);
    });
    container.appendChild(col);
  });
}

function showMitreModal(tid) {
  var tech = MITRE_TECHNIQUES[tid];
  if (!tech) return;
  document.getElementById('mitre-modal-title').textContent = tech.name;
  document.getElementById('mitre-modal-id').textContent = tid + ' | ' + MITRE_TACTICS.find(function(t){return t.id===tech.tactic}).name;
  var body = document.getElementById('mitre-modal-body');
  var html = '<p>' + escHtml(tech.desc) + '</p>';
  if (tech.subs.length > 0) {
    html += '<div class="mt-2"><span class="text-white font-semibold">Sub-techniques:</span><ul class="list-disc list-inside mt-1 space-y-0.5">';
    tech.subs.forEach(function(s) { html += '<li class="font-mono">' + s + '</li>'; });
    html += '</ul></div>';
  }
  html += '<div class="mt-2 bg-slate-900/80 rounded-lg p-2 border border-slate-700/40"><span class="text-white font-semibold text-[10px] uppercase tracking-wider">Detection Guidance</span><p class="mt-1">' + escHtml(tech.detection) + '</p></div>';
  body.innerHTML = html;
  document.getElementById('mitre-modal').classList.remove('hidden');
  lucide.createIcons();
}

function closeMitreModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('mitre-modal').classList.add('hidden');
}

// === CVSS v3.1 Calculator ===
function calculateCVSS(findings) {
  var hasNetwork = findings.some(function(f){ return /injection|sql|exploit|phishing|spoof/i.test(f.title); });
  var hasBrute = findings.some(function(f){ return /brute|password|credential|login/i.test(f.title); });
  var hasPrivEsc = findings.some(function(f){ return /privilege|sudo|escalation/i.test(f.title); });
  var hasSecrets = findings.some(function(f){ return /key|secret|hardcoded|credential/i.test(f.title); });
  var critCount = findings.filter(function(f){ return f.severity === 'Critical'; }).length;
  var highCount = findings.filter(function(f){ return f.severity === 'High'; }).length;

  var av = hasNetwork ? 'N' : 'L';
  var ac = (critCount > 1) ? 'L' : 'H';
  var pr = (hasPrivEsc || critCount > 0) ? 'N' : 'L';
  var ui = 'N';
  var s = 'U';
  var cia = (critCount >= 2 || (critCount === 1 && highCount >= 2)) ? 'H' : (critCount >= 1 || highCount >= 1) ? 'H' : 'L';
  var impact = Math.min(1 - ((1 - (cia === 'H' ? 0.56 : cia === 'L' ? 0.22 : 0)) * (1 - (cia === 'H' ? 0.56 : 0.22)) * (1 - (cia === 'H' ? 0.56 : 0.22))), 0.915);
  var exploit = 0.82;
  var baseScore = Math.min(1.08 * (impact + exploit), 10);
  baseScore = Math.round(baseScore * 10) / 10;

  var vector = 'CVSS:3.1/AV:' + av + '/AC:' + ac + '/PR:' + pr + '/UI:' + ui + '/S:' + s + '/C:' + cia + '/I:' + cia + '/A:' + cia;
  var metrics = {
    'Attack Vector': av === 'N' ? 'Network' : 'Local',
    'Attack Complexity': ac === 'L' ? 'Low' : 'High',
    'Privileges Required': pr === 'N' ? 'None' : 'Low',
    'User Interaction': 'None',
    'Scope': 'Unchanged',
    'Confidentiality': cia === 'H' ? 'High' : 'Low',
    'Integrity': cia === 'H' ? 'High' : 'Low',
    'Availability': cia === 'H' ? 'High' : 'Low'
  };
  return { score: baseScore, vector: vector, metrics: metrics };
}

function renderCVSS(cvss) {
  var container = document.getElementById('cvss-container');
  container.classList.remove('hidden');
  var arc = document.getElementById('cvss-arc');
  var circumference = 2 * Math.PI * 40;
  var offset = circumference - (cvss.score / 10) * circumference;
  var color = cvss.score >= 9.0 ? '#f43f5e' : cvss.score >= 7.0 ? '#f97316' : cvss.score >= 4.0 ? '#f59e0b' : '#10b981';
  arc.style.stroke = color;
  setTimeout(function() { arc.style.strokeDashoffset = offset; }, 100);
  document.getElementById('cvss-score').textContent = cvss.score.toFixed(1);
  document.getElementById('cvss-score').style.color = color;
  document.getElementById('cvss-vector').textContent = cvss.vector;
  var metricsDiv = document.getElementById('cvss-metrics');
  metricsDiv.innerHTML = '';
  Object.entries(cvss.metrics).forEach(function(entry) {
    metricsDiv.innerHTML += '<div class="flex justify-between"><span class="text-slate-500">' + entry[0] + ':</span><span class="text-white font-medium">' + entry[1] + '</span></div>';
  });
}

// === Code Diff Viewer ===
var VULNERABLE_SNIPPETS = {
  sql: [
    { type: 'del', code: '    query = "SELECT * FROM users WHERE username = \'" + username + "\' AND password = \'" + password + "\'" },
    { type: 'del', code: '    cursor.execute(query)' },
    { type: 'add', code: '    cursor.execute(' },
    { type: 'add', code: '        "SELECT * FROM users WHERE username = %s AND password = %s",' },
    { type: 'add', code: '        (username, password)' },
    { type: 'add', code: '    )' }
  ],
  secrets: [
    { type: 'del', code: 'AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE"' },
    { type: 'del', code: 'AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"' },
    { type: 'add', code: 'AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")' },
    { type: 'add', code: 'AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")' }
  ],
  cmdi: [
    { type: 'del', code: '    cmd = request.form["command"]' },
    { type: 'del', code: '    os.system(cmd)' },
    { type: 'add', code: '    cmd = shlex.quote(request.form.get("command", ""))' },
    { type: 'add', code: '    subprocess.run(["/usr/bin/safe-tool", cmd], capture_output=True)' }
  ]
};

function renderDiff(findings) {
  var container = document.getElementById('diff-container');
  var diffView = document.getElementById('diff-view');
  var hasCodeVuln = findings.some(function(f){ return /sql injection|hardcoded|command injection|eval/i.test(f.title); });
  if (!hasCodeVuln) { container.classList.add('hidden'); return; }
  container.classList.remove('hidden');
  diffView.innerHTML = '';
  var allLines = [];
  if (findings.some(function(f){ return /sql injection/i.test(f.title); })) allLines = allLines.concat(VULNERABLE_SNIPPETS.sql);
  if (findings.some(function(f){ return /hardcoded|aws|key|secret/i.test(f.title); })) allLines = allLines.concat(VULNERABLE_SNIPPETS.secrets);
  if (findings.some(function(f){ return /command injection|os.system|subprocess/i.test(f.title); })) allLines = allLines.concat(VULNERABLE_SNIPPETS.cmdi);
  allLines.forEach(function(line) {
    var div = document.createElement('div');
    div.className = 'diff-line ' + (line.type === 'add' ? 'diff-add text-emerald-300' : 'diff-del text-rose-300');
    div.textContent = (line.type === 'add' ? '+ ' : '- ') + line.code;
    diffView.appendChild(div);
  });
}

function applySecurePatch() {
  var input = document.getElementById('input-code');
  if (input && agentContext.result && agentContext.result.scanType.indexOf('Source Code') !== -1) {
    var fixed = 'import os\nimport psycopg2\nimport shlex\nimport subprocess\nfrom flask import Flask, request\nfrom functools import wraps\n\napp = Flask(__name__)\n\n# Secrets from environment\nAWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")\nAWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")\n\ndef validate_input(f):\n    @wraps(f)\n    def decorated(*args, **kwargs):\n        username = request.form.get("username", "").strip()\n        password = request.form.get("password", "").strip()\n        if not username or not password:\n            return "Missing credentials", 400\n        return f(*args, **kwargs)\n    return decorated\n\n@app.route("/login", methods=["POST"])\n@validate_input\ndef login():\n    username = request.form.get("username", "").strip()\n    password = request.form.get("password", "").strip()\n    conn = psycopg2.connect(\n        host=os.environ["DB_HOST"],\n        database=os.environ["DB_NAME"],\n        user=os.environ["DB_USER"],\n        password=os.environ["DB_PASS"],\n    )\n    cursor = conn.cursor()\n    cursor.execute(\n        "SELECT * FROM users WHERE username = %s AND password = %s",\n        (username, password)\n    )\n    user = cursor.fetchone()\n    cursor.close()\n    conn.close()\n    if user:\n        return "Login successful"\n    else:\n        return "Invalid credentials"\n\n@app.route("/exec", methods=["POST"])\ndef exec_cmd():\n    cmd = shlex.quote(request.form.get("command", ""))\n    subprocess.run(["/usr/bin/safe-tool", cmd], capture_output=True)\n    return "done"';
    input.value = fixed;
    showToast('Secure patch applied to editor');
  }
}

// === SOAR Playbook Generator ===
var currentSoarTab = 'firewall';
var soarData = {};

function generateSOAR(result) {
  soarData = {};
  var ips = result.iocs.filter(function(i){ return /^\d+\.\d+\.\d+\.\d+$/.test(i); });
  var hasSSH = result.findings.some(function(f){ return /brute|ssh|password/i.test(f.title); });
  var hasPhish = result.findings.some(function(f){ return /phishing|spoof|spf|dkim|email/i.test(f.title); });

  // Firewall rules
  var fw = '#!/bin/bash\n# AegisSOC SOAR - Auto-generated Firewall Containment\n# Generated: ' + new Date().toISOString() + '\n\n';
  fw += '# --- UFW Rules ---\n';
  ips.forEach(function(ip) { fw += 'ufw deny from ' + ip + ' to any\n'; });
  fw += '\n# --- iptables Rules ---\n';
  ips.forEach(function(ip) { fw += 'iptables -A INPUT -s ' + ip + ' -j DROP\n'; });
  fw += 'iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT\n';
  fw += '\n# Rate limiting for SSH\niptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set\niptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP\n';
  soarData.firewall = fw;

  // Fail2ban config
  var f2b = '# AegisSOC SOAR - Fail2Ban Configuration\n# Custom jail for this incident\n\n[sshd]\nenabled = true\nport = ssh\nfilter = sshd\nlogpath = /var/log/auth.log\nmaxretry = 3\nbantime = 3600\nfindtime = 600\n\n';
  if (hasPhish) {
    f2b += '[postfix-spoof]\nenabled = true\nfilter = postfix\nlogpath = /var/log/mail.log\nmaxretry = 3\nbantime = 86400\nfindtime = 3600\n';
  }
  f2b += '\n# Aggressive ban for repeated offenders\n[recidive]\nenabled = true\nfilter = recidive\nlogpath = /var/log/fail2ban.log\nmaxretry = 3\nbantime = 604800\nfindtime = 86400\n';
  soarData.fail2ban = f2b;

  // Sigma rule
  var sigma = 'title: AegisSOC Detection - ' + result.attackVector + '\nstatus: stable\n' +
    'description: Auto-generated Sigma detection rule for detected threats\n' +
    'references:\n  - https://attack.mitre.org/\nauthor: AegisSOC AI Engine\n' +
    'date: ' + new Date().toISOString().split('T')[0] + '\n' +
    'logsource:\n  category: ' + (hasSSH ? 'authentication' : 'network') + '\n' +
    'detection:\n';
  if (hasSSH) {
    sigma += '  selection:\n    EventID: 4625\n    LogName: Security\n  condition: selection | count(TargetUserName) by IpAddress > 3\n  level: high\n  tags:\n    - attack.credential_access\n    - attack.t1110\n';
  } else if (hasPhish) {
    sigma += '  selection:\n    EventID: 1\n    LogName: Microsoft-Windows-Sysmon/Operational\n  filter:\n    Image|endswith:\n      - "\\\\outlook.exe"\n  condition: selection and not filter\n  level: medium\n  tags:\n    - attack.initial_access\n    - attack.t1566\n';
  } else {
    sigma += '  selection:\n    EventID: [4688, 1]\n  condition: selection\n  level: medium\n  tags:\n    - attack.execution\n    - attack.t1059\n';
  }
  soarData.sigma = sigma;

  // Suricata rule
  var suri = '# AegisSOC SOAR - Suricata/Snort Detection Rule\n';
  if (hasSSH) {
    suri += 'alert tcp any any -> $HOME_NET 22 (msg:"AegisSOC SSH Brute Force Detected"; flow:to_server,established; threshold: type both, track by_src, count 5, seconds 60; sid:1000001; rev:1;)\n';
  } else if (hasPhish) {
    suri += 'alert smtp any any -> $HOME_NET any (msg:"AegisSOC Suspicious Email - Failed Auth"; content:"spf=fail"; content:"dkim=fail"; classtype:policy-violation; sid:1000002; rev:1;)\n';
  } else {
    suri += 'alert http any any -> $HOME_NET any (msg:"AegisSOC Suspicious HTTP Activity"; flow:to_server,established; content:"POST"; http_method; threshold: type threshold, track by_src, count 10, seconds 60; sid:1000003; rev:1;)\n';
  }
  suri += '# Alert on any IOC-matched traffic\n';
  ips.forEach(function(ip) {
    suri += 'alert ip ' + ip + ' any -> $HOME_NET any (msg:"AegisSOC IOC Match - ' + ip + '"; sid:' + (1000010 + ips.indexOf(ip)) + '; rev:1;)\n';
  });
  soarData.suricata = suri;

  renderSoarContent();
}

function switchSoarTab(tab) {
  currentSoarTab = tab;
  document.querySelectorAll('.soar-tab').forEach(function(btn) {
    btn.className = 'soar-tab text-[11px] font-mono px-2.5 py-1 rounded ' + (btn.textContent.toLowerCase() === tab ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200');
  });
  renderSoarContent();
}

function renderSoarContent() {
  var code = document.getElementById('soar-code');
  if (code && soarData[currentSoarTab]) code.textContent = soarData[currentSoarTab];
}

function copySoarCode() {
  var code = document.getElementById('soar-code');
  if (code) { navigator.clipboard.writeText(code.textContent).then(function(){ showToast('SOAR rule copied'); }); }
}

// === Multi-Log Format & Live Streaming ===
var LOG_FORMATS = {
  auth: 'Aug 20 07:50:01 server sshd[12345]: Failed password for invalid user admin from 192.168.1.105 port 54322 ssh2\nAug 20 07:50:03 server sshd[12346]: Failed password for invalid user root from 192.168.1.105 port 54323 ssh2\nAug 20 07:50:05 server sshd[12347]: Failed password for invalid user test from 192.168.1.105 port 54324 ssh2\nAug 20 07:51:22 server sudo: pam_unix(sudo:auth): authentication failure; logname=www-data uid=33 euid=0 tty=/dev/pts/0 ruser=www-data\nAug 20 07:51:25 server sudo: www-data : user NOT in sudoers ; TTY=pts/0 ; PWD=/var/www/html ; USER=root ; COMMAND=/bin/bash',
  nginx: '192.168.1.105 - - [20/Aug/2026:07:50:01 +0000] "GET /admin/config.php HTTP/1.1" 403 287\n192.168.1.105 - - [20/Aug/2026:07:50:02 +0000] "POST /wp-login.php HTTP/1.1" 403 1234\n192.168.1.105 - - [20/Aug/2026:07:50:03 +0000] "GET /../../etc/passwd HTTP/1.1" 400 150\n10.0.0.5 - - [20/Aug/2026:07:50:04 +0000] "GET /api/users HTTP/1.1" 200 4521',
  cloudtrail: '{"eventVersion":"1.05","eventTime":"2026-08-20T07:50:01Z","eventName":"ConsoleLogin","userIdentity":{"type":"IAMUser","userName":"compromised-user"},"eventSource":"signin.amazonaws.com","errorCode":"AccessDenied","sourceIPAddress":"203.0.113.42"}\n{"eventVersion":"1.05","eventTime":"2026-08-20T07:50:02Z","eventName":"GetPasswordData","userIdentity":{"type":"IAMUser","userName":"compromised-user"},"eventSource":"ec2.amazonaws.com","sourceIPAddress":"203.0.113.42"}\n{"eventVersion":"1.05","eventTime":"2026-08-20T07:50:03Z","eventName":"AssumeRole","userIdentity":{"type":"AssumedRole","sessionContext":{"sessionIssuer":{"userName":"compromised-user"}}},"eventSource":"sts.amazonaws.com","sourceIPAddress":"203.0.113.42"}',
  windows: 'Log Name: Security\nSource: Microsoft-Windows-Security-Auditing\nEvent ID: 4625\nTask Category: Logon\nAn account failed to log on.\nSubject: NT AUTHORITY\\SYSTEM\nTarget User: Administrator\nLogon Type: 10\nFailure Reason: Unknown user name or bad password.\nSource Network Address: 192.168.1.105\n\nEvent ID: 4625\nTarget User: admin\nSource Network Address: 192.168.1.105\n\nEvent ID: 4672\nSpecial privileges assigned to new logon\nSubject: NT AUTHORITY\\SYSTEM'
};

var currentLogFormat = 'auth';
var liveStreamInterval = null;
var liveStreamActive = false;

function switchLogFormat(fmt) {
  currentLogFormat = fmt;
  document.querySelectorAll('.logfmt-btn').forEach(function(btn) {
    var isActive = btn.textContent.toLowerCase().indexOf(fmt) !== -1;
    btn.className = 'logfmt-btn text-[10px] font-mono px-2 py-0.5 rounded ' + (isActive ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400');
  });
  var input = document.getElementById('input-logs');
  if (input) input.value = LOG_FORMATS[fmt] || '';
}

function toggleLiveStream() {
  liveStreamActive = !liveStreamActive;
  var dot = document.getElementById('live-dot');
  var toggle = document.getElementById('live-toggle');
  if (liveStreamActive) {
    dot.style.left = '16px';
    dot.style.background = '#10b981';
    toggle.style.background = '#065f46';
    startLiveStream();
  } else {
    dot.style.left = '2px';
    dot.style.background = '#64748b';
    toggle.style.background = '#334155';
    stopLiveStream();
  }
}

function startLiveStream() {
  var input = document.getElementById('input-logs');
  var lines = (input.value || LOG_FORMATS[currentLogFormat]).split('\n').filter(function(l){ return l.trim(); });
  var idx = 0;
  liveStreamInterval = setInterval(function() {
    if (idx >= lines.length) idx = 0;
    var line = lines[idx];
    input.value += '\n' + line;
    input.scrollTop = input.scrollHeight;
    idx++;
  }, 800);
}

function stopLiveStream() {
  if (liveStreamInterval) { clearInterval(liveStreamInterval); liveStreamInterval = null; }
}

// === Enhanced Agent Copilot Tools ===
function generateSTIXBundle(result) {
  var stix = {
    type: 'bundle',
    id: 'bundle--' + crypto.randomUUID().substring(0, 8),
    spec_version: '2.1',
    created: new Date().toISOString(),
    objects: []
  };
  result.iocs.forEach(function(ioc) {
    var obj = { type: 'indicator', spec_version: '2.1', id: 'indicator--' + crypto.randomUUID().substring(0, 8), created: new Date().toISOString(), name: ioc, pattern: '', pattern_type: 'stix' };
    if (/^\d+\.\d+\.\d+\.\d+$/.test(ioc)) {
      obj.pattern = "[ipv4-addr:value = '" + ioc + "']";
      obj.indicator_types = ['malicious-activity'];
    } else if (ioc.indexOf('Domain:') !== -1) {
      obj.pattern = "[domain-name:value = '" + ioc.replace('Domain: ', '') + "']";
      obj.indicator_types = ['malicious-activity'];
    } else {
      obj.pattern = "[artifact:payload_bin = '" + ioc + "']";
      obj.indicator_types = ['anomalous-activity'];
    }
    stix.objects.push(obj);
  });
  return JSON.stringify(stix, null, 2);
}

function generateExecBriefing(result) {
  var crits = result.findings.filter(function(f){ return f.severity === 'Critical'; });
  return 'SUBJECT: Security Incident Briefing - ' + result.attackVector + '\n\n' +
    'DATE: ' + new Date().toLocaleDateString() + '\n' +
    'CLASSIFICATION: Internal - Confidential\n\n' +
    'Dear Security Director,\n\n' +
    'The AegisSOC autonomous triage engine has completed analysis of a security incident. Below is the executive summary.\n\n' +
    '--- THREAT OVERVIEW ---\n' +
    'Threat Level: ' + result.severity + ' (Score: ' + result.threatScore + '/100)\n' +
    'Attack Vector: ' + result.attackVector + '\n' +
    'Scan Type: ' + result.scanType + '\n\n' +
    '--- KEY FINDINGS ---\n' +
    result.findings.map(function(f) { return '[' + f.severity.toUpperCase() + '] ' + f.title; }).join('\n') + '\n\n' +
    '--- CRITICAL IMPACTS ---\n' +
    (crits.length > 0 ? crits.map(function(f) { return '- ' + f.description; }).join('\n') : 'No critical impacts identified.') + '\n\n' +
    '--- CONTAINMENT STATUS ---\n' +
    'SOAR playbooks have been auto-generated and are ready for deployment.\n' +
    'IOC watchlist contains ' + result.iocs.length + ' indicators.\n\n' +
    '--- RECOMMENDED ACTIONS ---\n' +
    result.remediationSteps.map(function(s, i) { return (i+1) + '. ' + s; }).join('\n') + '\n\n' +
    'This report was auto-generated by the AegisSOC AI-Tier 1 Triage Engine.\n' +
    'No data was transmitted externally during analysis.\n\n' +
    'Regards,\nAegisSOC Autonomous Triage System';
}

function decodePayload(input) {
  var results = [];
  // Base64 detection
  var b64Match = input.match(/[A-Za-z0-9+/]{20,}={0,2}/g);
  if (b64Match) {
    b64Match.forEach(function(b64) {
      try {
        var decoded = atob(b64);
        if (/[\x20-\x7E]{5,}/.test(decoded)) results.push({ type: 'Base64', input: b64.substring(0, 40) + '...', output: decoded });
      } catch(e) {}
    });
  }
  // URL encoding
  var urlMatch = input.match(/%[0-9A-Fa-f]{2}(%[0-9A-Fa-f]{2}){2,}/g);
  if (urlMatch) {
    urlMatch.forEach(function(ue) {
      try { results.push({ type: 'URL-Encoded', input: ue, output: decodeURIComponent(ue) }); } catch(e) {}
    });
  }
  // Hex
  var hexMatch = input.match(/\\x[0-9a-fA-F]{2}(\\x[0-9a-fA-F]{2}){3,}/g);
  if (hexMatch) {
    hexMatch.forEach(function(hex) {
      var decoded = hex.replace(/\\x/g, '').match(/.{2}/g).map(function(h){ return String.fromCharCode(parseInt(h,16)); }).join('');
      results.push({ type: 'Hex', input: hex.substring(0, 40) + '...', output: decoded });
    });
  }
  return results.length > 0 ? results.map(function(r){ return '[' + r.type + '] ' + r.input + ' -> ' + r.output; }).join('\n') : 'No decodable payloads found in input.';
}
