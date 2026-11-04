import type { Metadata } from "next";
import { CodeCopyEnhancer } from "@/components/docs/code-copy";

export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function ReferenceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      {children}
      <CodeCopyEnhancer />
    </div>
  );
}
