const fs = require('fs');

const xml = fs.readFileSync('scratch/output_unpacked/word/document.xml', 'utf8');

const pMatches = xml.match(/<w:p\b[^>]*>/g) || [];
const tblMatches = xml.match(/<w:tbl\b[^>]*>/g) || [];
const trMatches = xml.match(/<w:tr\b[^>]*>/g) || [];
const brMatches = xml.match(/<w:br\b[^>]*w:type="page"[^>]*\/>/g) || [];

// Extract all text content
const textMatches = xml.match(/<w:t\b[^>]*>(.*?)<\/w:t>/g) || [];
const fullText = textMatches.map(t => t.replace(/<[^>]+>/g, '')).join(' ');

const charCount = fullText.length;
const wordCount = fullText.split(/\s+/).filter(Boolean).length;

console.log('=== STATS FOR GENERATED DOCX ===');
console.log(`Total Paragraphs (w:p): ${pMatches.length}`);
console.log(`Total Tables (w:tbl): ${tblMatches.length}`);
console.log(`Total Table Rows (w:tr): ${trMatches.length}`);
console.log(`Explicit Page Breaks: ${brMatches.length}`);
console.log(`Total Character Count (with spaces): ${charCount}`);
console.log(`Total Word Count (Vietnamese): ${wordCount}`);

// In standard Microsoft Word thesis format (12pt Times New Roman, 1.3 line spacing, 2cm margins):
// 1 page averages ~300-350 words or ~20 lines + tables & page breaks.
const estimatedPages = Math.round(wordCount / 220) + brMatches.length + (trMatches.length * 0.8);
console.log(`Estimated Word Page Count: ~${Math.round(estimatedPages)} pages`);
