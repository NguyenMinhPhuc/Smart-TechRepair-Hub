const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, TableOfContents } = require('docx');

const doc = new Document({
  sections: [
    {
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: 'MỤC LỤC', bold: true, size: 30, font: 'Times New Roman' })
          ]
        }),
        new TableOfContents('Mục lục hệ thống', {
          hyperlink: true,
          headingStyleRange: '1-3'
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun('Chương 1. TỔNG QUAN')]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun('1.1 Đặt vấn đề')]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [new TextRun('1.1.1 Tình hình trong nước')]
        })
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  const p = path.join(__dirname, 'test_toc.docx');
  fs.writeFileSync(p, buffer);

  const ps = `$w = New-Object -ComObject Word.Application; $w.Visible = $false; try { $d = $w.Documents.Open('${p.replace(/\\/g, '\\\\')}'); Write-Host "PASS TOC"; $d.Close() } catch { Write-Host "FAIL TOC: $($_.Exception.Message)" } finally { $w.Quit() }`;
  fs.writeFileSync(path.join(__dirname, 'ps_toc.ps1'), ps);
  const out = execSync('powershell -ExecutionPolicy Bypass -File ps_toc.ps1', { cwd: __dirname }).toString();
  console.log(out.trim());
});
