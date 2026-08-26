const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Document, Packer, Header, Footer, Paragraph, TextRun, AlignmentType } = require('docx');

const { getCoverSection } = require('./content/cover');
const { getChapter1Section } = require('./content/chapter1');
const { getChapter2Section } = require('./content/chapter2');
const { getChapter3Section } = require('./content/chapter3');
const { getChapter4Section } = require('./content/chapter4');
const { getChapter5Section } = require('./content/chapter5');
const { getConclusionSection } = require('./content/conclusion');

function testDoc(name, elements) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1701, right: 1134 }
          }
        },
        children: elements
      }
    ]
  });

  return Packer.toBuffer(doc).then(buffer => {
    const testPath = path.join(__dirname, `test_${name}.docx`);
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
    fs.writeFileSync(path.join(__dirname, 'temp_test.ps1'), psScript);
    try {
      const out = execSync('powershell -ExecutionPolicy Bypass -File temp_test.ps1', { cwd: __dirname }).toString();
      console.log(out.trim());
    } catch (e) {
      console.log(`FAIL EXEC: ${name}`, e.stdout ? e.stdout.toString() : e.message);
    }
  });
}

async function runTests() {
  await testDoc('cover', getCoverSection());
  await testDoc('chap1', getChapter1Section());
  await testDoc('chap2', getChapter2Section());
  await testDoc('chap3', getChapter3Section());
  await testDoc('chap4', getChapter4Section());
  await testDoc('chap5', getChapter5Section());
  await testDoc('conclusion', getConclusionSection());
}

runTests();
