const pptxgen = require('pptxgenjs');
const pres = new pptxgen();

pres.defineLayout({ name: 'WIDE_16_9', width: 13.33, height: 7.5 });
pres.layout = 'WIDE_16_9';

const slide = pres.addSlide();
slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: 'EBF1F5' } });
slide.addText('Test 13.33 x 7.5 Layout', { x: 1, y: 1, fontSize: 24 });

pres.writeFile({ fileName: 'd:/Projects/CongTy/gitproject/Smart-TechRepair-Hub/scratch/docx_gen/test_dim.pptx' }).then(() => {
  console.log('Saved test_dim.pptx');
});
