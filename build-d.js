const fs = require('fs');
const js2 = `// ── Code Analyzer ──
function analyzeCode(code) {
  const findings = []; const iocs = []; const techniques = [];
  if (/['"].*['"].*\\+\\s*(username|password|query|input|req)/i.test(code) || /SELECT\\s+.*\\+\\s*/i.test(code)) {
    findings.push({ title: 'SQL Injection via String Concatenation', description: 'Raw string concatenation in SQL query allows full database extraction.', severity: 'Critical' });
    techniques.push('T1190'); iocs.push('SQL concat pattern detected');
  }
  if (/AKIA[A-Z0-9]{16}/i.test(code)) { const m = code.match(/AKIA[A-Z0-9]{16}/i); findings.push({ title: 'Hardcoded AWS Access Key', description: 'High-entropy AWS Access Key ID found directly in source code.', severity: 'Critical' }); iocs.push(m[0]); techniques.push('T1552'); }
  if (/['\"]wJalr[A-Za-z0-9+/=]{30,}['\"]/i.test(code)) { findings.push({ title: 'Hardcoded AWS Secret Access Key', description: 'AWS Secret Key detected in plaintext.', severity: 'Critical' }); techniques.push('T1552'); iocs.push('AWS_SECRET_ACCESS_KEY'); }
  if (/eval\\s*\\(/i.test(code)) { findings.push({ title: 'Use of eval()', description: 'eval() can execute arbitrary code.', severity: 'High' }); techniques.push('T1059'); }
  if (/os\\.system\\(|subprocess\\.(?:call|run)\\(/i.test(code)) { findings.push({ title: 'Potential Command Injection', description: 'System call detected. User input could enable RCE.', severity: 'High' }); techniques.push('T1059'); }
  if (findings.length === 0) findings.push({ title: 'No Critical Issues Detected', description: 'No known vulnerability patterns found.', severity: 'Low' });
  return { scanType: 'code', findings, iocs: [...new Set(iocs)], techniques: [...new Set(techniques)],
    attackVector: 'SQL Injection & Secret Exposure', classification: 'OWASP A03:2021 / CWE-89, CWE-798',
    remediationCode: \`# Parametrized query - secure replacement\\nimport os\\nimport psycopg2\\nfrom flask import Flask, request\\n\\napp = Flask(__name__)\\n\\n# Use environment variables\\nAWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")\\nAWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")\\n\\n@app.route("/login", methods=["POST"])\\ndef login():\\n    username = request.form["username"]\\n    password = request.form["password"]\\n    if not username or not password or len(username) > 64:\\n        return "Invalid input", 400\\n    conn = psycopg2.connect(host=os.getenv("DB_HOST"), database=os.getenv("DB_NAME"), user=os.getenv("DB_USER"), password=os.getenv("DB_PASS"))\\n    cursor = conn.cursor()\\n    cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))\\n    user = cursor.fetchone()\\n    cursor.close()\\n    conn.close()\\n    return "Login successful" if user else "Invalid credentials"\`,
    diff: { old: \`query = "SELECT * FROM users WHERE username = '" + username + "'"\ncursor.execute(query)\n\nAWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE"\nAWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"\`, new: `# Parameterized query\\ncursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))\\n\\n# Secrets from environment\\nAWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")\\nAWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")` },
    soar: generateCodeSOAR(findings, iocs) };
}

// ── Email Analyzer ──
function analyzeEmailHeaders(headers) {
  const findings = []; const iocs = []; const techniques = [];
  if (/spf=fail/i.test(headers)) { findings.push({ title: 'SPF Authentication Failure', description: 'Sender IP not authorized to send on behalf of the domain.', severity: 'High' }); techniques.push('T1566'); }
  if (/dkim=fail/i.test(headers)) { findings.push({ title: 'DKIM Authentication Failure', description: 'Email signature verification failed.', severity: 'High' }); techniques.push('T1566'); }
  if (/dmarc=fail/i.test(headers)) { findings.push({ title: 'DMARC Policy Failure', description: 'Email failed DMARC alignment.', severity: 'Critical' }); techniques.push('T1566'); }
  const fromMatch = headers.match(/From:\\s*"?([^"<\\n]+)"?\\s*<?([^>\\n]*)>?/i);
  const replyMatch = headers.match(/Reply-To:\\s*"?[^"<]*"?\\s*<([^>]+)>/i);
  if (fromMatch && replyMatch) {
    const fd = (fromMatch[2]||fromMatch[1]).trim().split('@')[1]; const rd = replyMatch[1].split('@')[1];
    if (fd && rd && fd !== rd) { findings.push({ title: 'From/Reply-To Domain Mismatch', description: 'Reply-To domain differs from sender - phishing indicator.', severity: 'High' }); iocs.push(rd); techniques.push('T1566'); }
  }
  const returnMatch = headers.match(/Return-Path:\\s*<([^>]+)>/);
  if (returnMatch) { const rp = returnMatch[1].split('@')[1]; iocs.push(rp); }
  const ipMatch = headers.match(/\\b(\\d{1,3}(?:\\.\\d{1,3}){3})\\b/g);
  if (ipMatch) ipMatch.forEach(ip => { if (!iocs.includes(ip)) iocs.push(ip); });
  const fromDomain = fromMatch ? (fromMatch[2]||fromMatch[1]).trim().split('@')[1] : '';
  if (fromDomain && !iocs.includes(fromDomain)) iocs.push(fromDomain);
  if (findings.length === 0) findings.push({ title: 'No Phishing Indicators', description: 'No spoofing or auth failures found.', severity: 'Low' });
  return { scanType: 'email', findings, iocs: [...new Set(iocs)], techniques: [...new Set(techniques)],
    attackVector: 'Phishing Email with Spoofed Sender', classification: 'MITRE T1566; OWASP A07:2021',
    remediationCode: \`# DMARC/SPF/DKIM DNS Configuration\\n\\n# 1. SPF Record\\nv=spf1 include:_spf.google.com ip4:203.0.113.0/24 -all\\n\\n# 2. DKIM Record\\nselector._domainkey.yourdomain.com TXT "v=DKIM1; k=rsa; p=MIIBIjANBgkqh..."\\n\\n# 3. DMARC Record (strict)\\n_dmarc.yourdomain.com TXT "v=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com; fo=1; adkim=s; aspf=s"\\n\\n# 4. MTA-STS\\n_mta-sts.yourdomain.com TXT "v=STSv1; id=20260820"\`,
    diff: null, soar: generateEmailSOAR(findings, iocs) };
}

// ── Log Analyzer ──
function analyzeLogs(logs) {
  const findings = []; const iocs = []; const techniques = [];
  const failedSSH = logs.match(/Failed password.*from (\\S+)/gi);
  if (failedSSH && failedSSH.length >= 3) {
    const ips = [...new Set(failedSSH.map(l => { const m = l.match(/from (\\S+)/); return m ? m[1] : null; }).filter(Boolean))];
    const users = [...new Set(failedSSH.map(l => { const m = l.match(/for (?:invalid user )?(\\S+)/); return m ? m[1] : null; }).filter(Boolean))];
    findings.push({ title: 'SSH Brute-Force Detected (' + failedSSH.length + ' attempts)', description: 'Multiple failed SSH attempts from ' + ips.join(', ') + '. Targeted: ' + users.join(', '), severity: 'Critical' });
    ips.forEach(ip => iocs.push(ip)); techniques.push('T1110');
  }
  if (/user NOT in sudoers|COMMAND=.*\\/bin\\/(ba)?sh/i.test(logs)) { findings.push({ title: 'Privilege Escalation Attempt', description: 'Non-privileged user attempted sudo.', severity: 'High' }); techniques.push('T1548'); }
  if (/Accepted (?:password|publickey)/i.test(logs)) { findings.push({ title: 'Successful Login Post-Brute-Force', description: 'SSH login near brute-force attempts.', severity: 'Critical' }); techniques.push('T1078'); }
  if (findings.length === 0) findings.push({ title: 'No Critical Events', description: 'No brute-force or escalation patterns.', severity: 'Low' });
  return { scanType: 'logs', findings, iocs: [...new Set(iocs)], techniques: [...new Set(techniques)],
    attackVector: 'SSH Brute-Force & Privilege Escalation', classification: 'MITRE T1110; T1548',
    remediationCode: \`# /etc/ssh/sshd_config\\nPermitRootLogin no\\nPasswordAuthentication no\\nMaxAuthTries 3\\n\\n# /etc/fail2ban/jail.local\\n[sshd]\\nenabled = true\\nport = ssh\\nfilter = sshd\\nlogpath = /var/log/auth.log\\nmaxretry = 3\\nbantime = 3600\\n\\n# UFW\\nufw default deny incoming\\nufw allow ssh\\nufw enable\`,
    diff: null, soar: generateLogSOAR(findings, iocs) };
}

// ── CVSS v3.1 Calculator ──
function calculateCVSS(findings) {
  const hasRCE = findings.some(f => /injection|command|sql/i.test(f.title));
  const hasSecret = findings.some(f => /key|secret|credential|password/i.test(f.title));
  const hasPhishing = findings.some(f => /phishing|spoof|spf|dkim|dmarc/i.test(f.title));
  const hasBrute = findings.some(f => /brute|ssh.*fail/i.test(f.title));
  let C='N',I='N',A='N',AV='N',AC='H',PR='N',UI='R',S='U';
  if (hasRCE) { C='H';I='H';A='H';AV='N';AC='L';PR='N';UI='N'; }
  else if (hasSecret) { C='H';I='L';A='N';AV='L';AC='L';PR='L';UI='R'; }
  else if (hasPhishing) { C='L';I='L';A='N';AV='N';AC='H';PR='N';UI='R'; }
  else if (hasBrute) { C='N';I='L';A='L';AV='N';AC='L';PR='N';UI='N'; }
  const imp = {N:0,L:0.22,H:0.56}, exp = {N:0.20,L:0.55,H:0.85}, priv = {N:0.85,L:0.62,H:0.27};
  const iscBase = 1-((1-imp[C])*(1-imp[I])*(1-imp[A]));
  const isc = S==='S' ? 7.52*(iscBase-0.029)-3.25*Math.pow(iscBase-0.02,15) : 6.42*iscBase;
  const expScore = 8.22*exp[AV]*exp[AC]*priv[PR]*exp[UI];
  const base = Math.min(Math.max(Math.ceil((isc+expScore)*10)/10,0),10);
  return { score: base, vector: 'CVSS:3.1/AV:'+AV+'/AC:'+AC+'/PR:'+PR+'/UI:'+UI+'/S:'+S+'/C:'+C+'/I:'+I+'/A:'+A, impacts:{C,I,A}, exploitability: expScore.toFixed(1) };
}

// ── SOAR Generators ──
function generateCodeSOAR(f,i) { const ips=i.filter(x=>/^\\d/.test(x)); return { firewall: ips.map(ip=>'iptables -A INPUT -s '+ip+' -j DROP\\nufw deny from '+ip).join('\\n\\n')||'No attacker IPs', fail2ban: '[sshd]\\nenabled=true\\nport=ssh\\nfilter=sshd\\nlogpath=/var/log/auth.log\\nmaxretry=3\\nbantime=3600\\n\\n[recidive]\\nenabled=true\\nfilter=recidive\\nlogpath=/var/log/fail2ban.log\\nbantime=604800\\nmaxretry=3' }; }
function generateEmailSOAR(f,i) { const d=i.filter(x=>/[a-z]/i.test(x)&&!/^\\d/.test(x)); return { firewall: d.map(x=>'0.0.0.0 '+x).join('\\n'), fail2ban: '[postfix-spoof]\\nenabled=true\\nlogpath=/var/log/mail.log\\nmaxretry=1\\nbantime=86400' }; }
function generateLogSOAR(f,i) { const ips=i.filter(x=>/^\\d/.test(x)); return { firewall: ips.map(ip=>'iptables -A INPUT -s '+ip+' -j DROP\\nufw deny from '+ip).join('\\n\\n'), fail2ban: '[sshd]\\nenabled=true\\nport=ssh\\nfilter=sshd\\nlogpath=/var/log/auth.log\\nmaxretry=3\\nbantime=3600\\n\\n[recidive]\\nenabled=true\\nfilter=recidive\\nlogpath=/var/log/fail2ban.log\\nbantime=604800\\nmaxretry=3' }; }

// ── Sigma / Suricata ──
function genSigma(f,t,i) { return 'title: '+f[0].title+'\\nid: '+crypto.randomUUID()+'\\nstatus: experimental\\nauthor: AegisSOC\\ndate: '+new Date().toISOString().split('T')[0]+'\\ntags:\\n'+t.map(x=>'  - '+x).join('\\n')+'\\nlogsource:\\n  category: authentication\\n  product: linux\\ndetection:\\n  selection:\\n    EventID: '+(t.includes('T1110')?'4625':'syslog')+'\\n  condition: selection\\nlevel: '+(f.some(x=>x.severity==='Critical')?'critical':'high'); }
function genSuricata(f,i) { return i.filter(x=>/^\\d{1,3}(\\.\\d{1,3}){3}$/.test(x)).map(ip=>'alert tcp '+ip+' any -> $HOME_NET 22 (msg:"AegisSOC - SSH Brute Force from '+ip+'"; threshold:type both,track by_src,count 5,seconds 60; sid:1000001; rev:1;)').join('\\n')||'No network IOCs'; }
`;
fs.appendFileSync('/project/index.html', js2);
console.log('Phase D: Analyzers + CVSS + SOAR written');
