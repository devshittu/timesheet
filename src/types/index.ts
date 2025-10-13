// src/types/index.ts
export interface ActionControlsProps {
  currentDate: Date;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  handleDownloadPdf: () => void;
  isGeneratingPdf: boolean;
}

export interface UserSettingsProps {
  currentDate: Date;
}

export interface WeeklyTableProps {
  week: Date[];
  weekNumber: number;
  date: Date;
}

export interface PrintableDocumentProps {
  weeks: Date[][];
  currentDate: Date;
  name: string;
  position: string;
  siteName: string;
}

// src/types/index.ts
