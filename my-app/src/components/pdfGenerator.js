import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const generatePDF = async (problem) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const lineHeight = fontSize * 1.2;
  const margin = 20;
  const pageWidth = 600;
  const pageHeight = 800;
  const maxWidth = pageWidth - 2 * margin;
  const maxHeight = pageHeight - 2 * margin;

  const addPage = () => {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    return { page, y: pageHeight - margin };
  };

  let { page, y } = addPage();

  const drawText = (text) => {
    const paragraphs = text.split('\n');
    paragraphs.forEach(paragraph => {
      const words = paragraph.split(' ');
      let line = '';
      words.forEach((word) => {
        const testLine = line + word + ' ';
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth && line.length > 0) {
          if (y < margin + lineHeight) {
            ({ page, y } = addPage());
          }
          page.drawText(line, {
            x: margin,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });
          line = word + ' ';
          y -= lineHeight;
        } else {
          line = testLine;
        }
      });
      if (line.length > 0) {
        if (y < margin + lineHeight) {
          ({ page, y } = addPage());
        }
        page.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight;
      }
      // y -= lineHeight; // Add extra space between paragraphs
    });
  };

  const drawSection = (title, content) => {
    drawText(`\n${title}\n`);
    drawText(content);
    y -= lineHeight;
  };

  drawSection('Title:', problem.title);
  drawSection('Legend:', problem.legend);
  drawSection('Input:', problem.input);
  drawSection('Output:', problem.output);
  drawSection('Example:', problem.example);
  drawSection('Explanation:', problem.explanation);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

export default generatePDF;
