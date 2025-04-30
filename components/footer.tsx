"use client";

import Link from "next/link";
import { Github, Twitter, Mail, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-8 md:py-10">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-serif text-xl">
                ExpressNotes
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              A simple note-taking application that helps you organize your
              thoughts and ideas.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://github.com/Anzar0211"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="mailto:info@noteservice.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-medium text-base mb-2">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/add"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Add Note
              </Link>
              <Link
                href="/notes"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                View Notes
              </Link>
            </nav>
          </div>

          {/* Legal & Info */}
          <div className="space-y-4">
            <h3 className="font-medium text-base mb-2">Legal & Info</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                About Us
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ExpressNotes. All rights reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground mt-3 sm:mt-0 flex items-center">
            Made with <Heart className="h-3 w-3 mx-1 text-pink-500 inline" /> by
            ExpressNotes Team
          </p>
        </div>
      </div>
    </footer>
  );
}
