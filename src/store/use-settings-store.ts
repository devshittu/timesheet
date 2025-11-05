// src/store/use-settings-store.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logger } from '@/lib/logger';

interface SettingsState {
  name: string;
  position: string;
  siteName: string;
  pageBreakDay: number;
  payrollDeadlineOffset: number; // 0 = last working day, 1 = 2nd-to-last, 2 = 3rd-to-last, etc.
  setName: (name: string) => void;
  setPosition: (position: string) => void;
  setSiteName: (siteName: string) => void;
  setPageBreakDay: (day: number) => void;
  setPayrollDeadlineOffset: (offset: number) => void;
  useCygnetLogo: boolean; // New field for logo selection
  setUseCygnetLogo: (use: boolean) => void; // New setter
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      name: '',
      position: '',
      siteName: 'Cygnet Churchill',
      pageBreakDay: 16,
      payrollDeadlineOffset: 1, // Default to 2nd-to-last working day
      useCygnetLogo: false, // Default to placeholder logo
      setUseCygnetLogo: (use: boolean) => {
        logger.debug(`[Zustand] Setting useCygnetLogo to: ${use}`);
        set({ useCygnetLogo: use });
      },
      setName: (name) => {
        logger.debug(`[Zustand] Setting name to: ${name}`);
        set({ name });
      },
      setPosition: (position) => {
        logger.debug(`[Zustand] Setting position to: ${position}`);
        set({ position });
      },
      setSiteName: (siteName) => {
        logger.debug(`[Zustand] Setting siteName to: ${siteName}`);
        set({ siteName });
      },
      setPageBreakDay: (pageBreakDay) => {
        logger.debug(`[Zustand] Setting pageBreakDay to: ${pageBreakDay}`);
        set({ pageBreakDay });
      },
      setPayrollDeadlineOffset: (payrollDeadlineOffset) => {
        logger.debug(
          `[Zustand] Setting payrollDeadlineOffset to: ${payrollDeadlineOffset}`,
        );
        set({ payrollDeadlineOffset });
      },
    }),
    {
      name: 'timesheet-user-settings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
// src/store/use-settings-store.ts
