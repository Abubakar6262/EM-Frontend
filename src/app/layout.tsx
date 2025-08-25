import type { Metadata } from "next";
import { Providers } from "../providers/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventHub",
  description: "Event management frontend",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {/* only wraps children, no navbar/footer */}
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}