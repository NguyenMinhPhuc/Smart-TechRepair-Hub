const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Document, Packer } = require('docx');
const helpers = require('./helpers');

const tests = {
  title: [helpers.createTitle('TITLE')],
  subtitle: [helpers.createSubtitle('SUBTITLE')],
  heading1: [helpers.createHeading1('H1')],
  heading2: [helpers.createHeading2('H2')],
  heading3: [helpers.createHeading3('H3')],
  paragraph_string: [helpers.createParagraph('Hello world')],
  paragraph_array: [helpers.createParagraph([{ text: 'Hello ', bold: true }, { text: 'world' }])],
  bullet_string: [helpers.createBulletPoint('Bullet 1')],
  bullet_array: [helpers.createBulletPoint([{ text: 'Bullet ', bold: true }, { text: '2' }])],
  callout_string: [helpers.createCalloutBox('CALLOUT', 'Text')],
  callout_array: [helpers.createCalloutBox('CALLOUT', ['Line 1', 'Line 2'])],
  code_block: [helpers.createCodeBlock('const x = 1;\nconsole.log(x);')],
  styled_table: [helpers.createStyledTable(['Col1', 'Col2'], [['Val1', 'Val2']])],
  page_break: [helpers.createPageBreak()]
};

async function generateAll() {
  const filePaths = [];
  for (const [name, elements] of Object.entries(tests)) {
    const doc = new Document({ sections: [{ children: elements }] });
    const buffer = await Packer.toBuffer(doc);
    const fp = path.join(__dirname, `single_${name}.docx`);
    fs.writeFileSync(fp, buffer);
    filePaths.push({ name, path: fp });
  }

  const psLines = [
    '$word = New-Object -ComObject Word.Application',
    '$word.Visible = $false'
  ];

  filePaths.forEach(f => {
    psLines.push(`
try {
    $doc = $word.Documents.Open('${f.path.replace(/\\/g, '\\\\')}')
    Write-Host "PASS: ${f.name}"
    $doc.Close()
} catch {
    Write-Host "FAIL: ${f.name} - $($_.Exception.Message)"
}
`);
  });

  psLines.push('$word.Quit()');

  fs.writeFileSync(path.join(__dirname, 'batch_test.ps1'), psLines.join('\n'));
  console.log('Running batch Word test...');
  const out = execSync('powershell -ExecutionPolicy Bypass -File batch_test.ps1', { cwd: __dirname }).toString();
  console.log(out);
}

generateAll();
