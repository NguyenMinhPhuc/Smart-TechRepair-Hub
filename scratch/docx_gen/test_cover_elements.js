const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Document, Packer } = require('docx');
const { getCoverSection } = require('./content/cover');

const elements = getCoverSection();

async function testEach() {
  for (let i = 0; i < elements.length; i++) {
    const doc = new Document({ sections: [{ children: [elements[i]] }] });
    const buf = await Packer.toBuffer(doc);
    const p = path.join(__dirname, `el_${i}.docx`);
    fs.writeFileSync(p, buf);
    const ps = `$w = New-Object -ComObject Word.Application; $w.Visible = $false; try { $d = $w.Documents.Open('${p.replace(/\\/g, '\\\\')}'); Write-Host "PASS: ${i}"; $d.Close() } catch { Write-Host "FAIL: ${i} - $($_.Exception.Message)" } finally { $w.Quit() }`;
    fs.writeFileSync(path.join(__dirname, `ps_el_${i}.ps1`), ps);
    try {
      const out = execSync(`powershell -ExecutionPolicy Bypass -File ps_el_${i}.ps1`, { cwd: __dirname }).toString();
      console.log(out.trim());
    } catch (e) {
      console.log(`ERR: ${i}`, e.stdout ? e.stdout.toString() : e.message);
    }
  }
}

testEach();
