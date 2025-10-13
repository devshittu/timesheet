// src/hooks/use-timesheet-generator.ts
import { useState, useRef, useCallback } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isMonday,
  format,
} from 'date-fns';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { logger } from '@/lib/logger';
import { generateSlug } from '@/utils/strings';

const getWeeksForTimesheet = (date: Date): Date[][] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (daysInMonth.length === 0) return [];

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  daysInMonth.forEach((day) => {
    if (currentWeek.length > 0 && isMonday(day)) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
};

export const useTimesheetGenerator = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // October 2025
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  const weeks = getWeeksForTimesheet(currentDate);

  const goToNextMonth = () =>
    setCurrentDate((current) => addMonths(current, 1));
  const goToPreviousMonth = () =>
    setCurrentDate((current) => subMonths(current, 1));

  const handleDownloadPdf = useCallback(async () => {
    const printableContainer = printableRef.current;
    if (!printableContainer) {
      logger.error('[PDF Generation] Printable element container not found.');
      return;
    }

    const contentToPrint = printableContainer.querySelector(
      '#pdf-render-container',
    ) as HTMLElement;
    if (!contentToPrint) {
      logger.error('[PDF Generation] PDF content element not found.');
      return;
    }

    setIsGeneratingPdf(true);
    const monthName = format(currentDate, 'MMMM');
    const year = format(currentDate, 'yyyy');
    const slug = generateSlug(`Timesheet ${monthName} ${year}`);
    logger.info(`[PDF Generation] Starting process for ${slug}...`);

    try {
      const doc = new jspdf({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        compress: true,
      });

      const pages = contentToPrint.querySelectorAll(
        '.pdf-page',
      ) as NodeListOf<HTMLElement>;
      const A4_WIDTH_MM = 210;
      const A4_HEIGHT_MM = 297;
      const SCALE = 2.5; // Higher scale for crisp text and borders

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        logger.debug(`[PDF Generation] Capturing page ${i + 1}...`);

        const canvas = await html2canvas(page, {
          scale: SCALE,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          width: page.scrollWidth,
          height: page.scrollHeight,
          windowWidth: page.scrollWidth,
          windowHeight: page.scrollHeight,
          onclone: (clonedDoc) => {
            const clonedPage = clonedDoc.querySelector(
              `#pdf-page-${i + 1}`,
            ) as HTMLElement;
            if (clonedPage) {
              // Ensure all styles are applied
              clonedPage.style.backgroundColor = '#ffffff';
              clonedPage.style.color = '#000000';
            }
          },
        });

        const imgData = canvas.toDataURL('image/png', 1.0);

        if (i > 0) {
          doc.addPage();
        }

        doc.addImage(
          imgData,
          'PNG',
          0,
          0,
          A4_WIDTH_MM,
          A4_HEIGHT_MM,
          undefined,
          'FAST',
        );
        logger.info(`[PDF Generation] Page ${i + 1} added to PDF.`);
      }

      doc.save(`${slug}.pdf`);
      logger.info(`[PDF Generation] PDF saved successfully as ${slug}.pdf`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(
          '[PDF Generation] A critical error occurred:',
          error.message,
        );
      } else {
        logger.error('[PDF Generation] An unknown error occurred:', error);
      }
    } finally {
      setIsGeneratingPdf(false);
      logger.info('[PDF Generation] Process finished.');
    }
  }, [currentDate]);

  return {
    currentDate,
    weeks,
    isGeneratingPdf,
    printableRef,
    goToNextMonth,
    goToPreviousMonth,
    handleDownloadPdf,
  };
};

// src/hooks/use-timesheet-generator.ts
