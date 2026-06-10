
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { TarotReading } from '../types';

const MAGIC_DELIMITER = '%%ARCANUM_METADATA_START%%';

export const FileService = {
  /**
   * Captures a DOM element and exports it as a PDF with hidden metadata.
   * Handles long content by creating a high-resolution canvas and splitting it into pages.
   */
  exportToPDF: async (reading: TarotReading, element: HTMLElement) => {
    // 1. Prepare for high-quality capture
    const originalStyle = element.style.height;
    element.style.height = 'auto'; // Ensure we capture full height

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // High DPI for better readability
        useCORS: true,
        backgroundColor: '#0c0a09',
        logging: false,
        onclone: (clonedDoc) => {
          // Hide UI elements that shouldn't be in the report
          const noPrint = clonedDoc.querySelectorAll('.no-print');
          noPrint.forEach(el => (el as HTMLElement).style.display = 'none');
          
          // Ensure the background is captured correctly for dark theme
          const reportBody = clonedDoc.querySelector('.container') as HTMLElement;
          if (reportBody) reportBody.style.backgroundColor = '#0c0a09';
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      // Add extra pages if needed
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      // 2. Append Metadata for Restoration
      // We convert the JSON to a Base64 string and append it to the end of the file.
      // This is a common trick to hide data in a PDF without breaking its structure.
      const pdfArrayBuffer = pdf.output('arraybuffer');
      const metadata = MAGIC_DELIMITER + btoa(encodeURIComponent(JSON.stringify(reading)));
      const metadataBuffer = new TextEncoder().encode(metadata);
      
      const finalBuffer = new Uint8Array(pdfArrayBuffer.byteLength + metadataBuffer.byteLength);
      finalBuffer.set(new Uint8Array(pdfArrayBuffer), 0);
      finalBuffer.set(metadataBuffer, pdfArrayBuffer.byteLength);

      const finalBlob = new Blob([finalBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(finalBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `Arcanum_Reading_${reading.id.substring(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Generation failed:", error);
      throw error;
    } finally {
      element.style.height = originalStyle;
    }
  },

  /**
   * Reads a PDF file and extracts the hidden metadata string for restoration.
   */
  importFromPDF: async (file: File): Promise<TarotReading> => {
    const text = await file.text();
    const index = text.lastIndexOf(MAGIC_DELIMITER);
    
    if (index === -1) {
      throw new Error("此 PDF 不包含 Arcanum 占卜元數據，無法還原。");
    }

    const encodedData = text.substring(index + MAGIC_DELIMITER.length);
    try {
      const decodedData = decodeURIComponent(atob(encodedData));
      return JSON.parse(decodedData) as TarotReading;
    } catch (e) {
      throw new Error("數據解析失敗：PDF 內的元數據可能已損壞。");
    }
  }
};
