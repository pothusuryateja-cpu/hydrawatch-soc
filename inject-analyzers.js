var fs = require('fs');
var js = fs.readFileSync('/project/js-analyzers.txt', 'utf8');
fs.appendFileSync('/project/index.html', js);
console.log('Analyzers injected, lines now:', fs.readFileSync('/project/index.html','utf8').split('\n').length);
