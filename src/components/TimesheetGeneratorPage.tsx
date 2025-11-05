// src/components/TimesheetGeneratorPage.tsx
'use client';

import React, { forwardRef, useId } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiLoader,
  FiSquare,
} from 'react-icons/fi';
import { useTimesheetGenerator } from '@/hooks/use-timesheet-generator';
import { useSettingsStore } from '@/store/use-settings-store';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import type {
  ActionControlsProps,
  UserSettingsProps,
  WeeklyTableProps,
  PrintableDocumentProps,
} from '@/types';
import Logo from '@/components/Logo';
import PlaceholderLogo from './PlaceholderLogo';
import {
  getLastWorkingDaysOfMonth,
  formatPayrollDeadline,
  getWorkingDayFromEnd,
  formatFullPayrollDeadline,
} from '@/utils/payrollUtils';

// --- UI Components with Strict Prop Types ---

const ActionControls: React.FC<ActionControlsProps> = ({
  currentDate,
  goToPreviousMonth,
  goToNextMonth,
  handleDownloadPdf,
  isGeneratingPdf,
}) => (
  <div className="no-print mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
    <div className="flex items-center gap-4">
      <button
        onClick={goToPreviousMonth}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Previous Month"
      >
        <FiChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
      </button>
      <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-gray-100 w-48">
        {format(currentDate, 'MMMM yyyy')}
      </h2>
      <button
        onClick={goToNextMonth}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Next Month"
      >
        <FiChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
    <button
      onClick={handleDownloadPdf}
      disabled={isGeneratingPdf}
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-2 text-white font-semibold rounded-md transition-colors w-full sm:w-auto',
        'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        'disabled:bg-gray-400 disabled:cursor-not-allowed',
      )}
    >
      {isGeneratingPdf ? (
        <>
          <FiLoader className="animate-spin h-5 w-5" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <FiDownload className="h-5 w-5" />
          <span>Download PDF</span>
        </>
      )}
    </button>
  </div>
);

const UserSettings: React.FC<UserSettingsProps> = ({ currentDate }) => {
  const {
    name,
    setName,
    position,
    setPosition,
    siteName,
    setSiteName,
    pageBreakDay,
    setPageBreakDay,
    payrollDeadlineOffset,
    setPayrollDeadlineOffset,
    useCygnetLogo,
    setUseCygnetLogo,
  } = useSettingsStore();

  // Recalculate working days whenever currentDate changes
  const workingDays = getLastWorkingDaysOfMonth(currentDate, 5);

  const nameId = useId();
  const positionId = useId();
  const siteNameId = useId();
  const pageBreakId = useId();
  const payrollDeadlineId = useId();
  const logoSelectionId = useId();

  return (
    <div className="no-print space-y-4 mb-4">
      {/* Main Settings Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <div className="flex flex-col">
          <label
            htmlFor={siteNameId}
            className="mb-1 font-semibold text-gray-700 dark:text-gray-300"
          >
            Site Name:
          </label>
          <input
            id={siteNameId}
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="e.g., Cygnet Churchill"
            className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor={nameId}
            className="mb-1 font-semibold text-gray-700 dark:text-gray-300"
          >
            Employee Name:
          </label>
          <input
            id={nameId}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor={positionId}
            className="mb-1 font-semibold text-gray-700 dark:text-gray-300"
          >
            Position:
          </label>
          <input
            id={positionId}
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g., Permanent Staff"
            className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Advanced Settings Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Page Break Setting */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg">
          <div className="flex flex-col gap-2">
            <label
              htmlFor={pageBreakId}
              className="font-semibold text-gray-800 dark:text-gray-200 text-base"
            >
              📄 Page Break After Day:
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Split point for two pages
            </p>
            <select
              id={pageBreakId}
              value={pageBreakDay}
              onChange={(e) => setPageBreakDay(Number(e.target.value))}
              className="px-4 py-2.5 border-2 border-blue-400 rounded-lg bg-white dark:bg-gray-800 dark:text-white dark:border-blue-600 font-semibold text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              <option value={14}>Day 14</option>
              <option value={15}>Day 15</option>
              <option value={16}>Day 16 ⭐</option>
              <option value={17}>Day 17</option>
            </select>
          </div>
        </div>

        {/* Payroll Deadline Setting */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg">
          <div className="flex flex-col gap-2">
            <label
              htmlFor={payrollDeadlineId}
              className="font-semibold text-gray-800 dark:text-gray-200 text-base"
            >
              💰 Payroll Deadline:
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Submission deadline (working days only)
            </p>
            <select
              id={payrollDeadlineId}
              value={payrollDeadlineOffset}
              onChange={(e) => setPayrollDeadlineOffset(Number(e.target.value))}
              className="px-4 py-2.5 border-2 border-green-400 rounded-lg bg-white dark:bg-gray-800 dark:text-white dark:border-green-600 font-semibold text-base focus:ring-2 focus:ring-green-500 focus:border-green-600 cursor-pointer hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
            >
              {workingDays.map((day, index) => (
                <option key={day.toISOString()} value={index}>
                  {formatPayrollDeadline(day)} {index === 1 ? '⭐' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Logo Selection Setting */}
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-lg">
          <div className="flex flex-col gap-2">
            <label
              htmlFor={logoSelectionId}
              className="font-semibold text-gray-800 dark:text-gray-200 text-base"
            >
              🖼️ Logo Selection:
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose which logo to display
            </p>
            <div className="flex items-center gap-3 mt-2">
              <input
                id={logoSelectionId}
                type="checkbox"
                checked={useCygnetLogo}
                onChange={(e) => setUseCygnetLogo(e.target.checked)}
                className="w-5 h-5 text-purple-600 bg-white border-purple-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-purple-600 cursor-pointer"
              />
              <label
                htmlFor={logoSelectionId}
                className="text-base font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                Use Cygnet Logo
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {useCygnetLogo
                ? '✅ Cygnet logo enabled'
                : '📋 Using placeholder logo'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeeklyTable: React.FC<WeeklyTableProps> = ({
  week,
  weekNumber,
  date,
}) => {
  const headers = [
    'Day',
    'Start Time',
    'End Time',
    'Hours',
    'Overtime',
    'Bank Holiday',
    'Training Hours',
    'Annual Leave',
    'Sickness',
  ];
  const weekStart = format(week[0], 'do');
  const weekEnd = format(week[week.length - 1], 'do');
  const monthName = format(date, 'MMMM');

  return (
    <div className="break-inside-avoid mb-3">
      <h3 className="text-sm font-bold mb-1 text-black">
        Week {weekNumber}: {weekStart} – {weekEnd} {monthName}
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-400 text-[10px]">
          <thead>
            <tr className="bg-white">
              {headers.map((header) => (
                <th
                  key={header}
                  className={cn(
                    'text-left font-bold text-black py-1.5 px-2 border border-gray-400',
                    { 'bg-gray-300': header === 'Bank Holiday' },
                  )}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {week.map((day: Date) => (
              <tr
                key={day.toISOString()}
                className="[&>td]:border [&>td]:border-gray-400 [&>td]:px-2 [&>td]:py-2"
              >
                <td className="font-semibold text-black whitespace-nowrap">
                  {format(day, 'EEEE do')}
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="bg-gray-300"></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
            <tr className="font-bold bg-green-200">
              <td className="px-2 py-1.5 text-black border border-gray-400">
                TOTAL HOURS:
              </td>
              <td colSpan={8} className="border border-gray-400"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-2 text-[10px]">
        <div className="flex items-center gap-2">
          <span className="text-black">Authorised by:</span>
          <div className="border-b border-gray-500 w-40"></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-black">Date:</span>
          <div className="border-b border-gray-500 w-32"></div>
        </div>
      </div>
    </div>
  );
};

const PrintableDocument = forwardRef<HTMLDivElement, PrintableDocumentProps>(
  ({ weeks, currentDate, name, position, siteName }, ref) => {
    const monthName = format(currentDate, 'MMMM');
    const year = format(currentDate, 'yyyy');
    const { pageBreakDay, payrollDeadlineOffset, useCygnetLogo } =
      useSettingsStore();
    const PAGE_BREAK_DAY_COUNT = pageBreakDay;

    // Calculate the actual payroll deadline date
    const payrollDeadlineDate = getWorkingDayFromEnd(
      currentDate,
      payrollDeadlineOffset,
    );
    const formattedDeadline = payrollDeadlineDate
      ? formatFullPayrollDeadline(payrollDeadlineDate, parseInt(year))
      : `10.00am Thursday 30th of ${monthName}, ${year}`;

    const page1Weeks: { week: Date[]; weekNumber: number }[] = [];
    const page2Weeks: { week: Date[]; weekNumber: number }[] = [];
    let dayCount = 0;
    let hasSplit = false;

    weeks.forEach((week, index) => {
      const weekNumber = index + 1;
      const daysInWeek = week.length;

      if (!hasSplit && dayCount + daysInWeek > PAGE_BREAK_DAY_COUNT) {
        const remainingSpace = PAGE_BREAK_DAY_COUNT - dayCount;
        if (remainingSpace > 0) {
          page1Weeks.push({ week: week.slice(0, remainingSpace), weekNumber });
        }
        page2Weeks.push({ week: week.slice(remainingSpace), weekNumber });
        hasSplit = true;
      } else if (hasSplit) {
        page2Weeks.push({ week, weekNumber });
      } else {
        page1Weeks.push({ week, weekNumber });
        dayCount += daysInWeek;
      }
    });

    const Header = () => (
      <header className="flex justify-between items-start mb-4">
        {useCygnetLogo ? (
          <Logo className="w-28 h-auto" />
        ) : (
          <PlaceholderLogo className="w-28 h-auto" />
        )}
        <div className="text-right flex-1">
          <h1 className="text-xl font-bold text-black leading-tight">
            {siteName} – {monthName} Timesheet
          </h1>
        </div>
      </header>
    );

    const UserInfoSection = () => (
      <div className="mb-3">
        <div className="flex gap-6 text-xs text-black border-b-2 border-gray-400 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Name:</span>
            <span className="border-b border-gray-500 min-w-[200px]">
              {name || ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Position:</span>
            <span className="border-b border-gray-500 min-w-[150px]">
              {position || ''}
            </span>
          </div>
        </div>
        <div className="flex gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1.5">
            <FiSquare className="w-4 h-4 text-black" />
            <span className="text-black">Permanent Staff</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiSquare className="w-4 h-4 text-black" />
            <span className="text-black">Bank Staff</span>
          </div>
        </div>
      </div>
    );

    return (
      <div ref={ref} id="printable-document-container">
        <div id="pdf-render-container" className="pdf-render-container">
          {/* Page 1 */}
          <div id="pdf-page-1" className="pdf-page bg-white">
            <Header />
            <UserInfoSection />
            {page1Weeks.map(({ week, weekNumber }) => (
              <WeeklyTable
                key={`p1-w${weekNumber}`}
                week={week}
                weekNumber={weekNumber}
                date={currentDate}
              />
            ))}
          </div>

          {/* Page 2 */}
          {page2Weeks.length > 0 && (
            <div id="pdf-page-2" className="pdf-page bg-white">
              <Header />
              <div className="mb-3 text-xs text-black flex justify-between border-b-2 border-gray-400 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Name:</span>
                  <span>{name || '________________'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Position:</span>
                  <span>{position || '________________'}</span>
                </div>
              </div>

              {page2Weeks.map(({ week, weekNumber }) => (
                <WeeklyTable
                  key={`p2-w${weekNumber}`}
                  week={week}
                  weekNumber={weekNumber}
                  date={currentDate}
                />
              ))}

              <footer className="absolute bottom-[12mm] left-[12mm] right-[12mm] text-[9px] text-black pt-3 border-t-2 border-gray-400">
                <p className="mb-2 leading-tight">
                  These Timesheet needs to be signed by{' '}
                  <span className="text-red-600 font-semibold">
                    ({formattedDeadline})
                  </span>
                  . Please ensure all hours are in for last day of payroll as
                  stated above, it is your responsibility to ensure all hours
                  are completed by the deadline. Any hours submitted after the
                  allocated date will not be paid until the following month.
                </p>
                <p className="mb-3 leading-tight">
                  These Timesheets remain the property of{' '}
                  <span className="font-semibold">{siteName}</span> and must not
                  be taken off the premises.
                </p>
                <div className="flex justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-black whitespace-nowrap">
                      Employee Signature:
                    </span>
                    <div className="border-b border-gray-500 flex-1"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-black whitespace-nowrap">
                      Manager Signature:
                    </span>
                    <div className="border-b border-gray-500 flex-1"></div>
                  </div>
                </div>
              </footer>
            </div>
          )}
        </div>
      </div>
    );
  },
);
PrintableDocument.displayName = 'PrintableDocument';

export default function TimesheetGeneratorPage() {
  const { name, position, siteName } = useSettingsStore();
  const {
    currentDate,
    weeks,
    isGeneratingPdf,
    printableRef,
    goToPreviousMonth,
    goToNextMonth,
    handleDownloadPdf,
  } = useTimesheetGenerator();

  return (
    <div className="max-w-5xl mx-auto">
      <ActionControls
        currentDate={currentDate}
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}
        handleDownloadPdf={handleDownloadPdf}
        isGeneratingPdf={isGeneratingPdf}
      />

      <UserSettings currentDate={currentDate} />

      <div className="mt-8">
        <h3 className="no-print text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Timesheet Preview
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <PrintableDocument
            ref={printableRef}
            weeks={weeks}
            currentDate={currentDate}
            name={name}
            position={position}
            siteName={siteName}
          />
        </div>
      </div>
    </div>
  );
}

// src/components/TimesheetGeneratorPage.tsx
