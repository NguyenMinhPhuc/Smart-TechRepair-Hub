const fs = require('fs');

const docXml = fs.readFileSync('scratch/output_unpacked/word/document.xml', 'utf8');

const numPrMatches = docXml.match(/<w:numPr>.*?<\/w:numPr>/g) || [];
console.log(`numPr tags count: ${numPrMatches.length}`);
if (numPrMatches.length > 0) {
  console.log('Sample numPr tags:');
  console.log(numPrMatches.slice(0, 5));
}

if (fs.existsSync('scratch/output_unpacked/word/numbering.xml')) {
  const numXml = fs.readFileSync('scratch/output_unpacked/word/numbering.xml', 'utf8');
  console.log(`numbering.xml length: ${numXml.length}`);
  console.log('Sample numbering.xml:');
  console.log(numXml.slice(0, 500));
} else {
  console.log('numbering.xml DOES NOT EXIST!');
}
