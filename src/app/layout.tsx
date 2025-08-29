import type { Metadata } from "next";
import { Providers } from "../providers/Providers";
import "./globals.css";

import "@/data/global"; // for window.notify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            <main className="flex-1">{children}
              <ToastContainer />
            </main>
          </div>
        </Providers>
        
      </body>
    </html>
  );
}