const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Document, Packer } = require('docx');
const helpers = require('./helpers');

function testElements(name, elements) {
  const doc = new Document({
    sections: [{ children: elements }]
  });

  return Packer.toBuffer(doc).then(buffer => {
    const testPath = path.join(__dirname, `h_test_${name}.docx`);
    fs.writeFileSync(testPath, buffer);

    const psScript = `
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open('${testPath.replace(/\\/g, '\\\\')}')
    Write-Host "PASS: ${name}"
    $doc.Close()
} catch {
    Write-Host "FAIL: ${name} - $($_.Exception.Message)"
} finally {
    $word.Quit()
}
`;
    fs.writeFileSync(path.join(__dirname, 'h_temp.ps1'), psScript);
    try {
      const out = execSync('powershell -ExecutionPolicy Bypass -File h_temp.ps1', { cwd: __dirname }).toString();
      console.log(out.trim());
    } catch (e) {
      console.log(`FAIL EXEC: ${name}`, e.stdout ? e.stdout.toString() : e.message);
    }
  });
}

async function run() {
  await testElements('title', [helpers.createTitle('TEST TITLE')]);
  await testElements('heading1', [helpers.createHeading1('TEST H1')]);
  await testElements('paragraph', [helpers.createParagraph('Test plain paragraph')]);
  await testElements('bullet', [helpers.createBulletPoint('Test bullet')]);
  await testElements('callout', [helpers.createCalloutBox('TITLE', 'Callout text')]);
  await testElements('code', [helpers.createCodeBlock('console.log("hello");')]);
  await testElements('table', [helpers.createStyledTable(['H1', 'H2'], [['D1', 'D2']])]);
}

run();
