const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Document, Packer } = require('docx');
const { getCoverSection } = require('./content/cover');

const all = getCoverSection();
// Split around PageBreak
const coverPage = all.slice(0, 11);
const introPage = all.slice(11);

function test(name, elements) {
  const doc = new Document({ sections: [{ children: elements }] });
  return Packer.toBuffer(doc).then(buf => {
    const p = path.join(__dirname, `test_${name}.docx`);
    fs.writeFileSync(p, buf);
    const ps = `$w = New-Object -ComObject Word.Application; $w.Visible = $false; try { $d = $w.Documents.Open('${p.replace(/\\/g, '\\\\')}'); Write-Host "PASS: ${name}"; $d.Close() } catch { Write-Host "FAIL: ${name}" } finally { $w.Quit() }`;
    fs.writeFileSync(path.join(__dirname, `ps_${name}.ps1`), ps);
    const out = execSync(`powershell -ExecutionPolicy Bypass -File ps_${name}.ps1`, { cwd: __dirname }).toString();
    console.log(out.trim());
  });
}

async function run() {
  await test('cover_page_only', coverPage);
  await test('intro_page_only', introPage);
}

run();
