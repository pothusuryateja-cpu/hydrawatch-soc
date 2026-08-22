var fs = require('fs');
var js = fs.readFileSync('/project/js-render.txt', 'utf8');
fs.appendFileSync('/project/index.html', js);
console.log('Render JS injected, lines now:', fs.readFileSync('/project/index.html','utf8').split('\n').length);
