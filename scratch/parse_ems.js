const fs = require('fs');

const xml = fs.readFileSync('scratch/ems_unpacked/word/document.xml', 'utf8');

// Simple regex to extract text and heading styles
const pRegex = /<w:p\b[^>]*>(.*?)<\/w:p>/gs;
let match;
let lines = [];

while ((match = pRegex.exec(xml)) !== null) {
  const pXml = match[1];
  // extract style
  const styleMatch = pXml.match(/<w:pStyle w:val="([^"]+)"\/>/);
  const style = styleMatch ? styleMatch[1] : '';
  
  // extract text
  const textMatches = pXml.match(/<w:t\b[^>]*>(.*?)<\/w:t>/g) || [];
  const text = textMatches.map(t => t.replace(/<[^>]+>/g, '')).join('');
  
  if (text.trim()) {
    lines.push({ style, text: text.trim() });
  }
}

console.log(`Total paragraphs found: ${lines.length}`);
console.log('Sample paragraphs / Headings:');
lines.filter(l => l.style.includes('Heading') || l.style.includes('Title') || l.style.includes('1') || l.style.includes('2') || l.style.includes('3') || l.style.includes('TOC') || lines.indexOf(l) < 30).slice(0, 80).forEach(l => {
  console.log(`[${l.style}] ${l.text}`);
});
