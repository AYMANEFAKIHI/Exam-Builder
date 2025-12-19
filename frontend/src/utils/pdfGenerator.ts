import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import katex from 'katex';
import { ExamComponent } from '../../../shared/src/types';

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

export const generatePDF = async (title: string, components: ExamComponent[]) => {
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
    const html = await renderComponentsToHTML(title, components);
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

    // Generate PDF
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeight = 297; // A4 height in mm
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
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

const renderComponentsToHTML = async (title: string, components: ExamComponent[]): Promise<string> => {
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
      </style>
  `;

  for (const component of components) {
    html += '<div class="component">';
    
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
            ${component.points ? `<span class="points">[${component.points} pts]</span>` : ''}
            <div>${component.content}</div>
          </div>
        `;
        break;

      case 'table':
        html += `
          ${component.points ? `<span class="points">[${component.points} pts]</span>` : ''}
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
        html += `
          <div>
            ${component.points ? `<span class="points">[${component.points} pts]</span>` : ''}
            <p style="font-weight: bold; margin-bottom: 10px;">${qcmQuestion}</p>
            <div>
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
            <div style="background: #4f46e5; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; font-size: 18px;">
              / ${component.points} pts
            </div>
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
