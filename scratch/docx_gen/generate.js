const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Header,
  Footer,
  Paragraph,
  TextRun,
  PageNumber,
  AlignmentType
} = require('docx');

const { getCoverSection } = require('./content/cover');
const { getChapter1Section } = require('./content/chapter1');
const { getChapter2Section } = require('./content/chapter2');
const { getChapter3Section } = require('./content/chapter3');
const { getChapter4Section } = require('./content/chapter4');
const { getChapter5Section } = require('./content/chapter5');
const { getConclusionSection } = require('./content/conclusion');

async function buildDocument() {
  console.log('Building Smart TechRepair Hub Report (.docx)...');

  const allElements = [
    ...getCoverSection(),
    ...getChapter1Section(),
    ...getChapter2Section(),
    ...getChapter3Section(),
    ...getChapter4Section(),
    ...getChapter5Section(),
    ...getConclusionSection()
  ];

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 24, // 12pt
            color: '262626'
          },
          paragraph: {
            alignment: AlignmentType.JUSTIFY,
            spacing: { line: 280, after: 120 }
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134,    // 2cm
              bottom: 1134, // 2cm
              left: 1701,   // 3cm
              right: 1134   // 2cm
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'BÁO CÁO PHÂN TÍCH & THIẾT KẾ HỆ THỐNG SMART TECHREPAIR HUB',
                    italic: true,
                    size: 18, // 9pt
                    color: '595959',
                    font: 'Times New Roman'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Trang ',
                    size: 20,
                    font: 'Times New Roman',
                    color: '595959'
                  }),
                  PageNumber.CURRENT,
                  new TextRun({
                    text: ' / ',
                    size: 20,
                    font: 'Times New Roman',
                    color: '595959'
                  }),
                  PageNumber.TOTAL_PAGES
                ]
              })
            ]
          })
        },
        children: allElements
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, '../../docs/Smart_TechRepair_Hub_BaoCaoPhanTichHeThong.docx');
  fs.writeFileSync(outputPath, buffer);

  console.log(`Report successfully generated at: ${outputPath}`);
  console.log(`Buffer size: ${(buffer.length / 1024).toFixed(2)} KB`);
}

buildDocument().catch(err => {
  console.error('Error generating document:', err);
  process.exit(1);
});
