const fs = require('fs');
const js1 = `<script>
// ══════════════════════════════════════════════════════════════
// AegisSOC Enterprise v2.0 — Core Engine
// ══════════════════════════════════════════════════════════════

let activeTab = 'code';
let lastResult = null;
let lastInput = '';
let agentContext = { scanType: null, result: null, input: null };
let codeBlockCounter = 0;
let liveStreamInterval = null;
let currentLogFormat = 'auth';
const originalInput = { code: '', email: '', logs: '' };
const chatHistory = [];

// ── Demo Samples ──
const DEMOS = {
  code: \`import os
import psycopg2
from flask import Flask, request

app = Flask(__name__)

# Hardcoded AWS key (BAD!)
AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"

@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
    )
    cursor = conn.cursor()

    # SQL Injection vulnerability
    query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'"
    cursor.execute(query)

    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return "Login successful"
    else:
        return "Invalid credentials"\`,
  email: \`From: "Support <support@paypa1-security.com>"
To: "user@example.com"
Subject: Urgent: Verify Your Account Now
Date: Thu, 20 Aug 2026 08:15:00 +0530
Received: from mail.paypa1-security.com (unknown [185.234.219.42])
          by mx.example.com (Postfix) with ESMTP id ABC123
          for <user@example.com>; Thu, 20 Aug 2026 08:15:02 +0000 (UTC)
Authentication-Results: mx.example.com;
       spf=fail (sender IP is 185.234.219.42) smtp.mailfrom=paypa1-security.com;
       dkim=fail header.d=paypa1-security.com;
       dmarc=fail action=none header.from=paypa1-security.com
Received-SPF: Fail (sender IP is 185.234.219.42)
DKIM-Signature: v=1; a=rsa-sha256; d=paypa1-security.com; s=selector1;
        h=from:to:subject:date;
        bh=invalidhashhere==;
        b=suspicious_signature_data_here
Reply-To: "Accounts Team <accounts@secure-paypal-verify.net>"
Return-Path: <bounce@secure-paypal-verify.net>\`,
  logs: \`Aug 20 07:50:01 server sshd[12345]: Failed password for invalid user admin from 192.168.1.105 port 54322 ssh2
Aug 20 07:50:03 server sshd[12346]: Failed password for invalid user root from 192.168.1.105 port 54323 ssh2
Aug 20 07:50:05 server sshd[12347]: Failed password for invalid user test from 192.168.1.105 port 54324 ssh2
Aug 20 07:50:07 server sshd[12348]: Failed password for invalid user ubuntu from 192.168.1.105 port 54325 ssh2
Aug 20 07:50:10 server sshd[12349]: Failed password for invalid user admin from 192.168.1.105 port 54326 ssh2
Aug 20 07:51:22 server sudo: pam_unix(sudo:auth): authentication failure; logname=www-data uid=33 euid=0 tty=/dev/pts/0 ruser=www-data rhost= user=www-data
Aug 20 07:51:25 server sudo: www-data : user NOT in sudoers ; TTY=pts/0 ; PWD=/var/www/html ; USER=root ; COMMAND=/bin/bash\`
};

// ── Tab Switching ──
function switchTab(tab) {
  activeTab = tab;
  ['code','email','logs'].forEach(t => {
    const btn = document.getElementById('tab-' + t);
    if (t === tab) { btn.className = 'px-4 py-2.5 text-sm font-medium text-cyan-400 border-b-2 border-cyan-400 transition-colors'; }
    else { btn.className = 'px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors'; }
  });
  const placeholders = { code: 'Paste your source code here...', email: 'Paste raw email headers here...', logs: 'Paste server/firewall logs here...' };
  document.getElementById('input-editor').placeholder = placeholders[tab];
  document.getElementById('log-format-selector').classList.toggle('hidden', tab !== 'logs');
  document.getElementById('live-stream-controls').classList.toggle('hidden', tab !== 'logs');
  if (originalInput[tab]) document.getElementById('input-editor').value = originalInput[tab];
}

function loadDemo(n) {
  const tab = n === 1 ? 'code' : n === 2 ? 'email' : 'logs';
  switchTab(tab);
  document.getElementById('input-editor').value = DEMOS[tab];
  originalInput[tab] = DEMOS[tab];
  runAnalysis();
  document.getElementById('input-console').scrollIntoView({ behavior: 'smooth' });
}

function heroGetStarted() {
  document.getElementById('input-console').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => { const ed = document.getElementById('input-editor'); ed.classList.add('highlight-pulse'); setTimeout(() => ed.classList.remove('highlight-pulse'), 2000); }, 500);
}
function heroTryDemo() { switchTab('code'); document.getElementById('input-editor').value = DEMOS.code; originalInput.code = DEMOS.code; setTimeout(() => runAnalysis(), 600); }

function setLogFormat(fmt) {
  currentLogFormat = fmt;
  document.querySelectorAll('.log-fmt-btn').forEach(b => {
    if (b.dataset.fmt === fmt) b.className = 'log-fmt-btn px-2 py-1 rounded text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
    else b.className = 'log-fmt-btn px-2 py-1 rounded text-xs font-mono bg-slate-700 text-slate-400 border border-slate-600';
  });
}

function clearInput() { document.getElementById('input-editor').value = ''; }

// ═══ ANALYSIS ENGINE ═══
function runAnalysis() {
  const input = document.getElementById('input-editor').value.trim();
  if (!input) return;
  lastInput = input;
  originalInput[activeTab] = input;
  let result;
  if (activeTab === 'code') result = analyzeCode(input);
  else if (activeTab === 'email') result = analyzeEmailHeaders(input);
  else result = analyzeLogs(input);
  lastResult = result;
  renderResults(result);
  syncAgentContext(result, input);
  document.getElementById('empty-state').classList.add('hidden');
  document.getElementById('results-section').classList.remove('hidden');
  document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
`;
fs.appendFileSync('/project/index.html', js1);
console.log('Phase C: Core engine part 1 written');
