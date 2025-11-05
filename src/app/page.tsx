import TimesheetGeneratorPage from '@/components/TimesheetGeneratorPage';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center  p-8 pb-20 gap-16 sm:p-20x font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <TimesheetGeneratorPage />
      </main>
    </div>
  );
}
// src/app/page.tsx
