"use client";

import Link from "next/link";
import { Github, Twitter, Mail, Heart, Pencil } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-8 md:py-10">
      <div className="container max-w-full mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-0 lg:justify-between">
          {/* Brand Section */}
          <div className="space-y-3 lg:flex-1 lg:max-w-sm">
            <div className="flex items-center">
              <div className="relative mr-2 lg:mr-3">
                <Pencil className="h-5 w-5 lg:h-7 lg:w-7 text-purple-600" />
                <span className="absolute -top-1 -right-1 h-1.5 w-1.5 lg:h-2 lg:w-2 bg-pink-500 rounded-full"></span>
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-serif text-xl lg:text-2xl xl:text-3xl">
                ExpressNotes
              </span>
            </div>
            <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">
              A simple note-taking application that helps you organize your
              thoughts and ideas.
            </p>
            <div className="flex space-x-3 lg:space-x-4 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-purple-600 transition-colors"
              >
                <Twitter className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://github.com/Anzar0211"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-purple-600 transition-colors"
              >
                <Github className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="mailto:info@noteservice.com"
                className="text-muted-foreground hover:text-purple-600 transition-colors"
              >
                <Mail className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4 lg:flex-1 lg:text-center lg:max-w-sm lg:mx-auto">
            <h3 className="font-medium text-base lg:text-lg xl:text-xl mb-2">Quick Links</h3>
            <nav className="flex flex-col space-y-2 lg:space-y-3">
              <Link
                href="/"
                className="text-sm lg:text-base xl:text-lg text-muted-foreground hover:text-purple-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/add"
                className="text-sm lg:text-base xl:text-lg text-muted-foreground hover:text-purple-600 transition-colors"
              >
                Add Note
              </Link>
              <Link
                href="/notes"
                className="text-sm lg:text-base xl:text-lg text-muted-foreground hover:text-purple-600 transition-colors"
              >
                View Notes
              </Link>
            </nav>
          </div>

          {/* Legal & Info */}
          <div className="space-y-4 lg:flex-1 lg:text-right lg:max-w-sm lg:ml-auto">
            <h3 className="font-medium text-base lg:text-lg xl:text-xl mb-2">Legal & Info</h3>
            <nav className="flex flex-col space-y-2 lg:space-y-3">
              <Link
                href="#"
                className="text-sm lg:text-base xl:text-lg text-muted-foreground hover:text-purple-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm lg:text-base xl:text-lg text-muted-foreground hover:text-purple-600 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm lg:text-base xl:text-lg text-muted-foreground hover:text-purple-600 transition-colors"
              >
                About Us
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-center text-sm lg:text-base xl:text-lg text-muted-foreground">
            © {new Date().getFullYear()} ExpressNotes. All rights reserved.
          </p>
          <p className="text-center text-sm lg:text-base xl:text-lg text-muted-foreground mt-3 sm:mt-0 flex items-center">
            Made with <Heart className="h-3 w-3 lg:h-4 lg:w-4 mx-1 text-pink-500 inline" /> by
            ExpressNotes Team
          </p>
        </div>
      </div>
    </footer>
  );
}
