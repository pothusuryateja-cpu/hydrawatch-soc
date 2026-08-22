const fs = require('fs');
// Read what we have so far
let html = fs.readFileSync('/project/index.html', 'utf8');
// Find the last script tag and check line count
const lines = html.split('\n');
console.log('Current lines:', lines.length);
console.log('Last line:', lines[lines.length-1].substring(0,80));
