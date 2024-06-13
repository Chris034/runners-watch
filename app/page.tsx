'use client';

import { StopWatch } from "@/components/stopWatch/stopWatch";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 max-h-screen box-border">
      <StopWatch /> 
    </main>
  );
}
