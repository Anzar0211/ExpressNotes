"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  List,
  Home,
  Pencil,
  X,
  Mail,
  Github,
  Twitter,
} from "lucide-react";

// MobileNav Component
// Why this design:
// 1. Mobile-first approach: Optimized for small screens as mobile usage continues to grow
// 2. Slide-in pattern: Uses the familiar drawer navigation pattern that mobile users expect
// 3. Large touch targets: All interactive elements are properly sized for finger input
// 4. Visual feedback: Active states clearly show the current location in the app
// 5. Accessibility: Screen reader support with aria-labels and semantic HTML
// 6. Progressive disclosure: Secondary links are grouped separately to focus on primary navigation

export function MobileNav({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const pathname = usePathname();

  // Close menu after navigation - prevents lingering UI state after navigation
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Centralized navigation structure - easier to maintain and update
  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/add", label: "Add Note", icon: PlusCircle },
    { href: "/notes", label: "View Notes", icon: List },
  ];

  // Social links separated from main navigation - follows information hierarchy principles
  const socialLinks = [
    { href: "https://twitter.com", label: "Twitter", icon: Twitter },
    { href: "https://github.com", label: "GitHub", icon: Github },
    { href: "mailto:info@noteservice.com", label: "Contact", icon: Mail },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-[280px] sm:w-[350px] border-r">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 mt-2">
            <Link
              href="/"
              className="flex items-center space-x-2 transition-transform hover:scale-105"
              onClick={handleLinkClick}
            >
              <div className="relative mr-2">
                <Pencil className="h-6 w-6 text-purple-600" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-pink-500 rounded-full animate-pulse"></span>
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-serif text-xl font-satisfy">
                ExpressNotes
              </span>
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="rounded-full h-8 w-8 border-muted hover:bg-accent/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex flex-col space-y-1 mb-auto">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center rounded-md px-3 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "text-foreground bg-accent/80"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <div
                    className={cn(
                      "mr-3 p-1 rounded-md transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-br from-purple-600/20 to-pink-500/20"
                        : "bg-transparent group-hover:bg-gradient-to-br group-hover:from-purple-600/10 group-hover:to-pink-500/10"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive
                          ? "text-purple-600"
                          : "group-hover:text-purple-600"
                      )}
                    />
                  </div>
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t pt-6 mt-6">
            <p className="text-xs text-muted-foreground mb-4 px-3">
              Follow us on social media or get in touch
            </p>
            <div className="flex flex-wrap gap-2 px-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md hover:bg-accent/50 transition-colors group"
                    aria-label={link.label}
                  >
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
