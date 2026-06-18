const fs = require('fs');
const files = [
  'index.html',
  'photos/index.html',
  'categories/index.html',
  'tags/index.html',
  'archives/index.html',
  'archives/2023/index.html',
  'archives/2023/12/index.html',
  'link/index.html',
  '2023/12/28/Zxl-first-blog/index.html',
  '2023/12/28/hello-world/index.html'
];

const root = 'D:\\personal_Blog\\ZxlDragonDoctor.github.io';

let allOk = true;
for (const f of files) {
  const p = root + '\\' + f.replace(/\//g, '\\');
  const c = fs.readFileSync(p, 'utf8');
  const title = (c.match(/花独[^<]+/) || ['?'])[0];
  const favicon = (c.match(/href="\/img\/netoal[^"]+"/) || ['?'])[0];
  const ok = favicon === 'href="/img/netoal.png"' && !title.includes('�');
  if (!ok) {
    console.log(`FAIL: ${f} -> title=${title}, favicon=${favicon}`);
    allOk = false;
  }
}
if (allOk) console.log('All 10 files OK - favicon=netoal.png, no encoding issues');
