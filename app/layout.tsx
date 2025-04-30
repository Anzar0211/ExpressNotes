// Root Layout Component
// Why this architecture:
// 1. Provider Pattern: Wraps entire app with context providers for global access to state
// 2. Hierarchical Structure: Organized with semantic elements for better accessibility
// 3. Single Source of Truth: Centralized state management through NoteProvider
// 4. Responsive Design: Flexible layout that adapts to different screen sizes
// 5. Custom Font Integration: Satisfy font loaded with Next.js font optimization
// 6. Toast Notification System: Non-intrusive feedback mechanism positioned strategically

import type React from "react";
import { NoteProvider } from "@/lib/note-context";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Satisfy } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

// Custom font loading with Next.js font optimization
// - Prevents layout shifts by preloading fonts
// - Improves performance with font subsetting
// - Enhances brand identity with consistent typography
const satisfy = Satisfy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-satisfy",
});

export const metadata = {
  title: "ExpressNotes",
  description: "A simple note-taking application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={satisfy.variable}>
      <body>
        {/* Theme provider wraps the entire app to enable consistent theming */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Note provider gives access to note data and operations throughout the app */}
          <NoteProvider>
            {/* Flexbox-based layout with sticky header and footer */}
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            {/* Toast notifications positioned for optimal visibility without blocking content */}
            <Toaster position="bottom-right" closeButton />
          </NoteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
