import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import katex from 'katex';
import { ExamComponent } from '../../../shared/src/types';

// PDF Export Options interface
interface PDFExportOptions {
  hidePoints?: boolean;
  watermark?: string;
  autoNumbering?: boolean;
}

// Helper function to process LaTeX in text
const processLatex = (text: string): string => {
  let result = text;
  
  // Process display math first ($$...$$)
  result = result.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false,
        output: 'html',
      });
    } catch (e) {
      return `<span style="color: red;">Error: ${match}</span>`;
    }
  });

  // Process inline math ($...$)
  result = result.replace(/\$([^\$]+?)\$/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
        output: 'html',
      });
    } catch (e) {
      return `<span style="color: red;">Error: ${match}</span>`;
    }
  });

  return result;
};

export const generatePDF = async (title: string, components: ExamComponent[], options: PDFExportOptions = {}) => {
  const { hidePoints = false, watermark = '', autoNumbering = true } = options;
  
  try {
    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '210mm'; // A4 width
    container.style.padding = '20mm';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(container);

    // Render components to HTML
    const html = await renderComponentsToHTML(title, components, { hidePoints, watermark, autoNumbering });
    container.innerHTML = html;

    // Wait for MathJax to render if present
    if (window.MathJax && window.MathJax.typesetPromise) {
      await window.MathJax.typesetPromise([container]);
    }

    // Wait for images to load
    const images = container.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve(null);
            else {
              img.onload = () => resolve(null);
              img.onerror = () => resolve(null);
            }
          })
      )
    );

    // Handle page breaks - split content into pages
    const pageBreaks = container.querySelectorAll('.page-break');
    const pages: HTMLElement[] = [];
    
    if (pageBreaks.length > 0) {
      // Split content by page breaks
      let currentPage = document.createElement('div');
      currentPage.style.width = '210mm';
      currentPage.style.padding = '20mm';
      currentPage.style.backgroundColor = 'white';
      
      const children = Array.from(container.children);
      for (const child of children) {
        if ((child as HTMLElement).classList.contains('page-break')) {
          pages.push(currentPage);
          currentPage = document.createElement('div');
          currentPage.style.width = '210mm';
          currentPage.style.padding = '20mm';
          currentPage.style.backgroundColor = 'white';
        } else {
          currentPage.appendChild(child.cloneNode(true));
        }
      }
      pages.push(currentPage);
    } else {
      pages.push(container);
    }

    // Generate PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    for (let i = 0; i < pages.length; i++) {
      const pageContainer = pages[i];
      if (pageContainer !== container) {
        document.body.appendChild(pageContainer);
      }

      const canvas = await html2canvas(pageContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 297; // A4 height in mm
      let heightLeft = imgHeight;
      let position = 0;

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Add watermark to all pages if specified
      if (watermark) {
        const totalPages = pdf.getNumberOfPages();
        for (let page = 1; page <= totalPages; page++) {
          pdf.setPage(page);
          pdf.setTextColor(200, 200, 200);
          pdf.setFontSize(60);
          pdf.saveGraphicsState();
          // Rotate text for diagonal watermark
          const centerX = 105;
          const centerY = 148.5;
          pdf.text(watermark, centerX, centerY, {
            align: 'center',
            angle: 45,
          });
          pdf.restoreGraphicsState();
          pdf.setTextColor(0, 0, 0);
        }
      }

      if (pageContainer !== container) {
        document.body.removeChild(pageContainer);
      }
    }

    // Clean up
    document.body.removeChild(container);

    // Download PDF
    const fileName = `${title.replace(/[^a-z0-9]/gi, '_')}_exam.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

const renderComponentsToHTML = async (
  title: string, 
  components: ExamComponent[], 
  options: PDFExportOptions = {}
): Promise<string> => {
  const { hidePoints = false, autoNumbering = true } = options;
  let questionNumber = 0;
  
  // Include KaTeX CSS
  const katexCSS = Array.from(document.querySelectorAll('link[href*="katex"]'))
    .map(link => {
      const href = (link as HTMLLinkElement).href;
      return `<link rel="stylesheet" href="${href}">`;
    })
    .join('');

  let html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      ${katexCSS}
      <style>
        table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f0f0f0; font-weight: bold; }
        .qcm-option { margin: 8px 0; display: flex; align-items: flex-start; }
        .qcm-checkbox { width: 15px; height: 15px; border: 1px solid #000; display: inline-block; margin-right: 10px; flex-shrink: 0; margin-top: 2px; }
        .qcm-checkbox.checked::after { content: '✓'; display: block; text-align: center; line-height: 15px; }
        img { max-width: 100%; height: auto; }
        .component { margin: 20px 0; page-break-inside: avoid; }
        .header { border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
        .points { float: right; font-weight: bold; }
        .page-break { page-break-after: always; height: 0; margin: 0; padding: 0; }
        .question-number { font-weight: bold; margin-right: 8px; }
        .qcm-options-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      </style>
  `;

  for (const component of components) {
    // Handle page break component
    if (component.type === 'pageBreak') {
      html += '<div class="page-break"></div>';
      continue;
    }
    
    html += '<div class="component">';
    
    // Auto-numbering for question types
    const isQuestion = ['text', 'qcm', 'trueFalse', 'fillInBlanks'].includes(component.type) && 
                       'points' in component && (component as any).points > 0;
    if (autoNumbering && isQuestion) {
      questionNumber++;
    }
    
    switch (component.type) {
      case 'header':
        html += `
          <div class="header">
            ${component.logo ? `<img src="${component.logo}" style="max-width: 100px; max-height: 100px; float: left; margin-right: 20px;" />` : ''}
            <div style="text-align: center;">
              <h1 style="margin: 0;">${component.examTitle || title}</h1>
              <p style="margin: 5px 0;"><strong>Academic Year:</strong> ${component.academicYear}</p>
              <p style="margin: 5px 0;"><strong>Semester:</strong> ${component.semester}</p>
              <p style="margin: 5px 0;"><strong>Duration:</strong> ${component.duration}</p>
            </div>
            <div style="clear: both;"></div>
          </div>
        `;
        break;

      case 'text':
        html += `
          <div>
            ${!hidePoints && component.points ? `<span class="points">[${component.points} pts]</span>` : ''}
            ${autoNumbering && isQuestion ? `<span class="question-number">Q${questionNumber}.</span>` : ''}
            <div>${component.content}</div>
          </div>
        `;
        break;

      case 'table':
        html += `
          ${!hidePoints && component.points ? `<span class="points">[${component.points} pts]</span>` : ''}
          <table>
            <thead>
              <tr>
                ${component.headers.map(h => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${component.data.map(row => `
                <tr>
                  ${row.map(cell => `<td>${cell || '&nbsp;'}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
        break;

      case 'qcm':
        const qcmQuestion = component.latex ? processLatex(component.question) : component.question;
        const columnsClass = component.columns === 2 ? 'qcm-options-2col' : '';
        html += `
          <div>
            ${!hidePoints && component.points ? `<span class="points">[${component.points} pts]</span>` : ''}
            <p style="font-weight: bold; margin-bottom: 10px;">
              ${autoNumbering && isQuestion ? `<span class="question-number">Q${questionNumber}.</span>` : ''}
              ${qcmQuestion}
            </p>
            <div class="${columnsClass}">
              ${component.options.map((option, idx) => {
                const optionText = option.latex ? processLatex(option.text) : option.text;
                return `
                  <div class="qcm-option">
                    <span class="qcm-checkbox"></span>
                    <span>${String.fromCharCode(65 + idx)}. ${optionText}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
        break;

      case 'image':
        html += `
          <div style="text-align: center;">
            <img src="${component.imageUrl}" 
                 ${component.width ? `width="${component.width}"` : ''}
                 ${component.height ? `height="${component.height}"` : ''}
                 style="max-width: 100%; height: auto;" />
            ${component.caption ? `<p style="font-style: italic; margin-top: 5px;">${component.caption}</p>` : ''}
          </div>
        `;
        break;

      case 'exerciseHeader':
        html += `
          <div style="margin: 30px 0 15px 0; padding: 15px; background: linear-gradient(to right, #e0e7ff, #c7d2fe); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; border: 2px solid #6366f1;">
            <h2 style="margin: 0; font-size: 20px; font-weight: bold;">
              Exercice ${component.exerciseNumber}${component.title ? ` : ${component.title}` : ''}
            </h2>
            ${!hidePoints ? `
              <div style="background: #4f46e5; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; font-size: 18px;">
                / ${component.points} pts
              </div>
            ` : ''}
          </div>
        `;
        break;

      case 'trueFalse':
        html += `
          <div>
            ${component.points ? `<span class="points">[${component.points} pts]</span>` : ''}
            <p style="font-weight: bold; margin-bottom: 10px;">Vrai ou Faux</p>
            <table style="width: 100%; border: 1px solid #000;">
              <thead>
                <tr>
                  <th style="width: 70%;">Énoncé</th>
                  ${component.displayStyle === 'circles' 
                    ? '<th style="width: 15%; text-align: center;">Vrai</th><th style="width: 15%; text-align: center;">Faux</th>'
                    : '<th style="width: 15%; text-align: center;">V</th><th style="width: 15%; text-align: center;">F</th>'}
                </tr>
              </thead>
              <tbody>
                ${component.statements.map(stmt => {
                  const stmtText = stmt.latex ? processLatex(stmt.text) : stmt.text;
                  return `
                    <tr>
                      <td>${stmtText}</td>
                      ${component.displayStyle === 'circles'
                        ? '<td style="text-align: center;">○</td><td style="text-align: center;">○</td>'
                        : '<td style="text-align: center; font-size: 20px; font-weight: bold;">V</td><td style="text-align: center; font-size: 20px; font-weight: bold;">F</td>'}
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;

      case 'fillInBlanks':
        const processedContent = component.content.replace(/\[([^\]]+)\]/g, '<span style="text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px;">___________</span>');
        html += `
          <div>
            ${component.points ? `<span class="points">[${component.points} pts]</span>` : ''}
            <p style="line-height: 2; white-space: pre-wrap;">${processedContent}</p>
          </div>
        `;
        break;

      case 'writingArea':
        const lineHeight = 24; // pixels
        const totalHeight = component.lineCount * lineHeight;
        const backgroundStyle = component.lineStyle === 'ruled'
          ? `repeating-linear-gradient(0deg, transparent, transparent ${lineHeight - 1}px, #d1d5db ${lineHeight - 1}px, #d1d5db ${lineHeight}px)`
          : `repeating-linear-gradient(0deg, transparent, transparent 19px, #d1d5db 19px, #d1d5db 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #d1d5db 19px, #d1d5db 20px)`;
        
        html += `
          <div>
            ${component.points ? `<span class="points">[${component.points} pts]</span>` : ''}
            <div style="
              border: 2px solid #9ca3af;
              min-height: ${totalHeight}px;
              background: ${backgroundStyle};
              margin: 10px 0;
              padding: 10px;
            "></div>
          </div>
        `;
        break;

      case 'geometry':
        const gWidth = component.width || 100;
        const gHeight = component.height || 100;
        const gridType = component.gridType || 'millimeter';
        
        let gridPattern = '';
        if (gridType === 'millimeter') {
          gridPattern = `
            <defs>
              <pattern id="smallGrid" width="3.78" height="3.78" patternUnits="userSpaceOnUse">
                <path d="M 3.78 0 L 0 0 0 3.78" fill="none" stroke="#ccc" stroke-width="0.3"/>
              </pattern>
              <pattern id="grid" width="37.8" height="37.8" patternUnits="userSpaceOnUse">
                <rect width="37.8" height="37.8" fill="url(#smallGrid)"/>
                <path d="M 37.8 0 L 0 0 0 37.8" fill="none" stroke="#999" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          `;
        } else if (gridType === 'dots') {
          gridPattern = `
            <defs>
              <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="0.8" fill="#666"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)"/>
          `;
        } else if (gridType === 'squares') {
          gridPattern = `
            <defs>
              <pattern id="squares" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ccc" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#squares)"/>
          `;
        } else if (gridType === 'isometric') {
          gridPattern = `
            <defs>
              <pattern id="iso" width="28" height="48" patternUnits="userSpaceOnUse">
                <path d="M14 0 L0 24 L14 48 L28 24 Z" fill="none" stroke="#ccc" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#iso)"/>
          `;
        }
        
        html += `
          <div style="text-align: center;">
            <svg width="${gWidth * 3.78}" height="${gHeight * 3.78}" style="border: 1px solid #333; background: white;">
              ${gridPattern}
            </svg>
          </div>
        `;
        break;

      case 'timeline':
        const events = component.events || [];
        const timelineWidth = 600;
        const eventSpacing = events.length > 1 ? timelineWidth / (events.length + 1) : timelineWidth / 2;
        
        html += `
          <div style="margin: 20px 0;">
            <svg width="100%" height="150" viewBox="0 0 ${timelineWidth + 40} 150">
              <!-- Main timeline line -->
              <line x1="20" y1="75" x2="${timelineWidth + 20}" y2="75" stroke="#4f46e5" stroke-width="3"/>
              <!-- Arrow at end -->
              <polygon points="${timelineWidth + 20},75 ${timelineWidth + 10},70 ${timelineWidth + 10},80" fill="#4f46e5"/>
              
              ${events.map((event, idx) => {
                const x = 20 + (idx + 1) * eventSpacing;
                const isTop = idx % 2 === 0;
                const y = isTop ? 30 : 120;
                const lineY1 = isTop ? 50 : 100;
                return `
                  <line x1="${x}" y1="75" x2="${x}" y2="${lineY1}" stroke="#4f46e5" stroke-width="2"/>
                  <circle cx="${x}" cy="75" r="6" fill="#4f46e5"/>
                  <text x="${x}" y="${y}" text-anchor="middle" font-size="12" fill="#333">
                    ${event.showDate ? event.date : '________'}
                  </text>
                  <text x="${x}" y="${y + 15}" text-anchor="middle" font-size="10" fill="#666">
                    ${event.showLabel ? event.label : '________'}
                  </text>
                `;
              }).join('')}
            </svg>
          </div>
        `;
        break;

      case 'matching':
        const leftItems = component.leftColumn || [];
        const rightItems = component.rightColumn || [];
        const shuffledRight = component.shuffleRight ? [...rightItems].sort(() => Math.random() - 0.5) : rightItems;
        
        html += `
          <div style="margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="width: 45%; padding: 10px; border: 1px solid #333; background: #f3f4f6;">Colonne A</th>
                  <th style="width: 10%; padding: 10px; border: 1px solid #333; background: #f3f4f6;">Réponse</th>
                  <th style="width: 45%; padding: 10px; border: 1px solid #333; background: #f3f4f6;">Colonne B</th>
                </tr>
              </thead>
              <tbody>
                ${leftItems.map((item, idx) => `
                  <tr>
                    <td style="padding: 10px; border: 1px solid #333;"><strong>${idx + 1}.</strong> ${item}</td>
                    <td style="padding: 10px; border: 1px solid #333; text-align: center;">____</td>
                    <td style="padding: 10px; border: 1px solid #333;"><strong>${String.fromCharCode(65 + idx)}.</strong> ${shuffledRight[idx] || ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;
    }

    html += '</div>';
  }

  html += '</div>';
  return html;
};

export const generateCorrectionGrid = async (title: string, components: ExamComponent[]) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let y = 20;
  const pageHeight = 297;
  const margin = 20;

  // Title
  pdf.setFontSize(18);
  pdf.text(`Correction Grid: ${title}`, margin, y);
  y += 15;

  pdf.setFontSize(12);
  pdf.text('Student Name: _______________________________', margin, y);
  y += 10;
  pdf.text('Date: _____________', margin, y);
  y += 15;

  // Table header
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Question', margin, y);
  pdf.text('Max Points', margin + 100, y);
  pdf.text('Score', margin + 140, y);
  pdf.text('Comments', margin + 170, y);
  y += 5;
  pdf.line(margin, y, 190, y);
  y += 8;

  pdf.setFont('helvetica', 'normal');

  let questionNumber = 1;
  let totalPoints = 0;

  components.forEach((component) => {
    if ('points' in component && component.points) {
      if (y > pageHeight - 30) {
        pdf.addPage();
        y = 20;
      }

      const points = component.points || 0;
      totalPoints += points;

      let label = `Q${questionNumber}`;
      if (component.type === 'exerciseHeader') {
        label = `Ex${component.exerciseNumber}`;
      }

      pdf.text(label, margin, y);
      pdf.text(points.toString(), margin + 100, y);
      pdf.text('_____', margin + 140, y);
      pdf.line(margin + 170, y - 2, 190, y - 2);
      
      questionNumber++;
      y += 10;
    }
  });

  // Total
  y += 5;
  pdf.line(margin, y, 190, y);
  y += 8;
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL', margin, y);
  pdf.text(totalPoints.toString(), margin + 100, y);
  pdf.text('_____', margin + 140, y);

  const fileName = `${title.replace(/[^a-z0-9]/gi, '_')}_correction_grid.pdf`;
  pdf.save(fileName);
};
