"use client";

import Link from "next/link";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { MobileNav } from "./mobile-nav";

export function Navigation() {
  // Theme toggle state from context - for consistent theme across all pages
  const { theme, setTheme } = useTheme();
  // Mobile menu state - using a separate state for improved maintainability
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle mobile menu - simple state toggle to control mobile navigation
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle theme - switches between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Why used this simplistic nav design:
  // 1. Minimalist approach focuses user attention on content rather than navigation
  // 2. Simple horizontal layout works well for limited number of pages in the app
  // 3. Improves cognitive load by limiting choices and simplifying the UI
  // 4. Responsive design adapts to both mobile and desktop without complex interactions

  return (
    <nav className="border-b sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center">
                <span className="font-bold text-xl font-satisfy bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  ExpressNotes
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation - hidden on small screens */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/notes">
              <Button variant="ghost">Notes</Button>
            </Link>
            <Link href="/add">
              <Button variant="ghost">Add Note</Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile menu button - only visible on small screens */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-2"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation - slides in from right */}
      <MobileNav isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </nav>
  );
}
