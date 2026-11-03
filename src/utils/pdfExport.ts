import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LocationResolutionResult } from '../services/geocodingService';
import { TacticalWeatherState } from '../services/weatherTacticalService';
import { SeasonKey } from '../data/noaaClimateData';

export async function exportFichaToPdf(
  elementId: string,
  result: LocationResolutionResult,
  weather: TacticalWeatherState | null,
  season: SeasonKey
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Elemento de ficha no encontrado');
  }

  // Generate canvas
  const canvas = await html2canvas(element, {
    scale: 2, // 2x resolution for crisp text and graphics
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  
  // Standard A4 dimensions in mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Additional pages if content is taller than A4
  while (heightLeft > 5) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  const cleanName = result.matchedName.replace(/[^a-zA-Z0-9_-]/g, '_');
  pdf.save(`Ficha_Climatica_${cleanName}_${season}.pdf`);
}
