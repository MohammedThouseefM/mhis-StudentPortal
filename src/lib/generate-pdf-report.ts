
'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { type SeatingArrangementOutput } from '@/ai/flows/seating-arrangement-flow';

export async function generateStudentPdfReport(elementId: string): Promise<Blob> {
    const reportElement = document.getElementById(elementId);
    if (!reportElement) {
      throw new Error(`Report element with ID '${elementId}' not found`);
    }

    const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = - (imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
    
    return pdf.output('blob');
}


export async function generateSeatingPlanPdf(plan: SeatingArrangementOutput, elementId: string): Promise<Blob> {
    const reportElement = document.getElementById(elementId);
    if (!reportElement) {
        throw new Error('Seating plan element not found');
    }

    // Temporarily make the element visible for capturing if it's hidden
    const originalDisplay = reportElement.style.display;
    reportElement.style.display = 'block';

    const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
    });
    
    // Restore original display
    reportElement.style.display = originalDisplay;


    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pdfWidth - margin * 2;

    // Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('Exam Seating Arrangement', pdfWidth / 2, margin + 5, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(plan.summary, pdfWidth / 2, margin + 12, { align: 'center' });
    
    // Add a line under header
    pdf.setLineWidth(0.5);
    pdf.line(margin, margin + 18, pdfWidth - margin, margin + 18);
    
    // Add captured image
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * contentWidth) / imgProps.width;
    const imageStartY = margin + 25;

    let heightLeft = imgHeight;
    let position = 0; // Negative offset for scrolling the image

    pdf.addImage(imgData, 'PNG', margin, imageStartY, contentWidth, imgHeight);
    heightLeft -= (pdfHeight - imageStartY);

    while (heightLeft > 0) {
      position -= (pdfHeight - margin * 2);
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Footer
    const pageCount = pdf.internal.pages.length;
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(
            `Page ${i} of ${pageCount}`,
            pdfWidth / 2,
            pdfHeight - 10,
            { align: 'center' }
        );
        pdf.text('AttendEase - Exam Seating Plan', margin, pdfHeight - 10);
    }
    
    return pdf.output('blob');
}
