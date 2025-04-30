"use client";

import Link from "next/link";
import { Moon, Sun, Menu, X, Pencil } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { MobileNav } from "./mobile-nav";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navigation() {
  // Theme toggle state from context - for consistent theme across all pages
  const { theme, setTheme } = useTheme();
  // Mobile menu state - using a separate state for improved maintainability
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Current path for highlighting active links
  const pathname = usePathname();

  // Toggle mobile menu - simple state toggle to control mobile navigation
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle theme - switches between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Navbar links configuration
  const navLinks = [
    { href: "/notes", label: "Notes" },
    { href: "/add", label: "Add Note" },
  ];

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
            <Link href="/" className="transition-transform hover:scale-105">
              <div className="flex items-center">
                <div className="relative mr-2">
                  <Pencil className="h-6 w-6 text-purple-600" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-pink-500 rounded-full animate-pulse"></span>
                </div>
                <span className="font-bold text-xl font-satisfy bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  ExpressNotes
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation - hidden on small screens */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></span>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600/70 to-pink-500/70 rounded-full transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="ml-2 rounded-full border-muted transition-colors hover:bg-accent/50 hover:border-accent"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-purple-600" />
              )}
            </Button>
          </div>

          {/* Mobile menu button - only visible on small screens */}
          <div className="flex md:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="mr-2 rounded-full border-muted transition-colors hover:bg-accent/50 hover:border-accent"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-purple-600" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMenu}
              className="rounded-full border-muted transition-colors hover:bg-accent/50 hover:border-accent"
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation - slides in from left */}
      <MobileNav isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </nav>
  );
}
