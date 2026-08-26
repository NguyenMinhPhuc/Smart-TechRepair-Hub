const {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  BorderStyle,
  WidthType,
  ShadingType,
  VerticalAlign,
  HeightRule
} = require('docx');

// Colors palette matching professional academic report
const COLORS = {
  PRIMARY: '1F4E78',      // Deep navy blue
  SECONDARY: '2F5597',    // Slate blue
  ACCENT: '595959',       // Dark grey
  TEXT: '262626',         // Near black body text
  LIGHT_BG: 'F2F2F2',     // Table header / code block background
  ALT_ROW: 'F9FBFD',      // Alternate table row
  BORDER: 'D9D9D9',       // Border light grey
  CALLOUT_BG: 'EBF1F5',   // Soft blue callout
  CALLOUT_BORDER: '2F5597'
};

function getAlignment(align) {
  if (!align) return AlignmentType.JUSTIFY;
  if (typeof align === 'string') {
    const lower = align.toLowerCase();
    if (lower === 'center') return AlignmentType.CENTER;
    if (lower === 'left') return AlignmentType.LEFT;
    if (lower === 'right') return AlignmentType.RIGHT;
    if (lower === 'justify' || lower === 'both') return AlignmentType.JUSTIFY;
  }
  return align;
}

function createTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 36, // 18pt
        font: 'Times New Roman',
        color: COLORS.PRIMARY
      })
    ]
  });
}

function createSubtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 360 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        italic: true,
        size: 26, // 13pt
        font: 'Times New Roman',
        color: COLORS.SECONDARY
      })
    ]
  });
}

function createHeading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 30, // 15pt
        font: 'Times New Roman',
        color: COLORS.PRIMARY
      })
    ]
  });
}

function createHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 26, // 13pt
        font: 'Times New Roman',
        color: COLORS.SECONDARY
      })
    ]
  });
}

function createHeading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        italic: true,
        size: 24, // 12pt
        font: 'Times New Roman',
        color: COLORS.TEXT
      })
    ]
  });
}

function createParagraph(text, options = {}) {
  const runs = [];
  
  if (typeof text === 'string') {
    if (text.length > 0) {
      runs.push(new TextRun({
        text: text,
        bold: options.bold || false,
        italic: options.italic || false,
        size: options.size || 24, // 12pt default
        font: options.font || 'Times New Roman',
        color: options.color || COLORS.TEXT
      }));
    }
  } else if (Array.isArray(text)) {
    text.forEach(item => {
      if (typeof item === 'string') {
        if (item.length > 0) {
          runs.push(new TextRun({ text: item, size: options.size || 24, font: 'Times New Roman', color: COLORS.TEXT }));
        }
      } else {
        if (item.text && item.text.length > 0) {
          runs.push(new TextRun({
            text: item.text,
            bold: item.bold || false,
            italic: item.italic || false,
            size: item.size || options.size || 24,
            font: item.font || 'Times New Roman',
            color: item.color || COLORS.TEXT
          }));
        }
      }
    });
  }

  return new Paragraph({
    alignment: getAlignment(options.alignment),
    spacing: {
      before: options.spaceBefore !== undefined ? options.spaceBefore : 60,
      after: options.spaceAfter !== undefined ? options.spaceAfter : 120,
      line: options.lineSpacing || 280 // ~1.3 line spacing
    },
    indent: options.bullet ? { left: 360 } : (options.indent ? { left: options.indent } : undefined),
    children: runs
  });
}

function createBulletPoint(text, level = 0) {
  const runs = [];
  if (typeof text === 'string') {
    if (text.length > 0) {
      runs.push(new TextRun({ text: text, size: 24, font: 'Times New Roman', color: COLORS.TEXT }));
    }
  } else if (Array.isArray(text)) {
    text.forEach(item => {
      if (typeof item === 'string') {
        if (item.length > 0) {
          runs.push(new TextRun({ text: item, size: 24, font: 'Times New Roman', color: COLORS.TEXT }));
        }
      } else {
        if (item.text && item.text.length > 0) {
          runs.push(new TextRun({
            text: item.text,
            bold: item.bold || false,
            italic: item.italic || false,
            size: item.size || 24,
            font: item.font || 'Times New Roman',
            color: item.color || COLORS.TEXT
          }));
        }
      }
    });
  }

  return new Paragraph({
    bullet: { level: level },
    spacing: { before: 40, after: 80, line: 260 },
    children: runs
  });
}

function createCalloutBox(title, contentLines) {
  const cellChildren = [
    new Paragraph({
      spacing: { before: 60, after: 80 },
      children: [
        new TextRun({
          text: `📌 ${title}`,
          bold: true,
          size: 24,
          font: 'Times New Roman',
          color: COLORS.PRIMARY
        })
      ]
    })
  ];

  if (Array.isArray(contentLines)) {
    contentLines.forEach(line => {
      cellChildren.push(new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({
            text: line,
            size: 22,
            font: 'Times New Roman',
            color: COLORS.TEXT
          })
        ]
      }));
    });
  } else {
    cellChildren.push(new Paragraph({
      spacing: { before: 40, after: 40 },
      children: [
        new TextRun({
          text: contentLines,
          size: 22,
          font: 'Times New Roman',
          color: COLORS.TEXT
        })
      ]
    }));
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: cellChildren,
            shading: { fill: COLORS.CALLOUT_BG, type: ShadingType.CLEAR },
            borders: {
              left: { style: BorderStyle.SINGLE, size: 24, color: COLORS.CALLOUT_BORDER },
              top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' }
            },
            margins: { top: 120, bottom: 120, left: 200, right: 200 }
          })
        ]
      })
    ]
  });
}

function createCodeBlock(codeText) {
  const lines = codeText.split('\n');
  const paragraphs = lines.map(line => new Paragraph({
    spacing: { before: 20, after: 20, line: 220 },
    children: [
      new TextRun({
        text: line,
        size: 20, // 10pt
        font: 'Consolas',
        color: '1F2937'
      })
    ]
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: paragraphs,
            shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER },
              left: { style: BorderStyle.SINGLE, size: 12, color: COLORS.SECONDARY },
              right: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER }
            },
            margins: { top: 100, bottom: 100, left: 160, right: 160 }
          })
        ]
      })
    ]
  });
}

function createStyledTable(headers, rows, colWidths = []) {
  const tableRows = [];

  // Header Row
  const headerCells = headers.map((h, i) => new TableCell({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 80 },
        children: [
          new TextRun({
            text: h,
            bold: true,
            size: 22,
            font: 'Times New Roman',
            color: 'FFFFFF'
          })
        ]
      })
    ],
    shading: { fill: COLORS.PRIMARY, type: ShadingType.CLEAR },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: COLORS.PRIMARY },
      bottom: { style: BorderStyle.SINGLE, size: 12, color: COLORS.PRIMARY },
      left: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER },
      right: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER }
    },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
    width: colWidths[i] ? { size: colWidths[i], type: WidthType.PERCENTAGE } : undefined
  }));

  tableRows.push(new TableRow({ children: headerCells, height: { value: 360, rule: HeightRule.ATLEAST } }));

  // Data Rows
  rows.forEach((row, rowIndex) => {
    const isAlt = rowIndex % 2 === 1;
    const cells = row.map((cellText, colIndex) => {
      let textRuns = [];
      if (typeof cellText === 'string') {
        textRuns.push(new TextRun({ text: cellText, size: 22, font: 'Times New Roman', color: COLORS.TEXT }));
      } else if (Array.isArray(cellText)) {
        cellText.forEach(r => textRuns.push(new TextRun({
          text: r.text,
          bold: r.bold || false,
          italic: r.italic || false,
          size: 22,
          font: 'Times New Roman',
          color: COLORS.TEXT
        })));
      }

      return new TableCell({
        children: [
          new Paragraph({
            alignment: colIndex === 0 && row.length > 3 ? AlignmentType.CENTER : AlignmentType.LEFT,
            spacing: { before: 60, after: 60 },
            children: textRuns
          })
        ],
        shading: { fill: isAlt ? COLORS.ALT_ROW : 'FFFFFF', type: ShadingType.CLEAR },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER },
          left: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER },
          right: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER }
        },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        width: colWidths[colIndex] ? { size: colWidths[colIndex], type: WidthType.PERCENTAGE } : undefined
      });
    });

    tableRows.push(new TableRow({ children: cells, height: { value: 300, rule: HeightRule.ATLEAST } }));
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  });
}

function createPageBreak() {
  return new Paragraph({
    children: [new PageBreak()]
  });
}

module.exports = {
  COLORS,
  createTitle,
  createSubtitle,
  createHeading1,
  createHeading2,
  createHeading3,
  createParagraph,
  createBulletPoint,
  createCalloutBox,
  createCodeBlock,
  createStyledTable,
  createPageBreak
};
