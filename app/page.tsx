// Home Page Component
// Why this design:
// 1. Minimalist Landing: Focused on clear value proposition and simple call-to-actions
// 2. Card-based Layout: Visual hierarchy guides users to the two primary actions
// 3. Micro-interactions: Subtle animations (hover effects, transitions) enhance engagement
// 4. Progressive Disclosure: Simple overview with deeper functionality behind navigation
// 5. Consistent Branding: Gradient text and accent colors maintain visual identity
// 6. Mobile-first Grid: Responsive layout adapts from single to dual column based on screen size

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Pencil, Book } from "lucide-react";

export default function Home() {
  return (
    <div className="container max-w-5xl py-12 px-4 sm:px-6 mx-auto">
      {/* Hero section with brand identity and app purpose */}
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="flex items-center mb-4">
          <div className="relative">
            <Pencil className="h-10 w-10 text-purple-600 mr-2 animate-pulse" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-pink-500 rounded-full"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-serif">
            ExpressNotes
          </h1>
        </div>
        <p className="text-muted-foreground max-w-[600px] text-lg">
          A simple note-taking application that lets you create and manage your
          notes with ease. All data is stored locally in your browser.
        </p>
      </div>

      {/* Feature cards with clear CTAs - dual focus options for different user intents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Notes card - primary action for new users */}
        <Card className="border-t-4 border-t-purple-600 shadow-md transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Pencil className="h-5 w-5 mr-2 text-purple-600" />
              Create Notes
            </CardTitle>
            <CardDescription>
              Add new notes with titles and content
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Link href="/add">
              <Button className="group">
                Add Note{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* View Notes card - secondary action for returning users */}
        <Card className="border-t-4 border-t-pink-500 shadow-md transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Book className="h-5 w-5 mr-2 text-pink-500" />
              View Notes
            </CardTitle>
            <CardDescription>Browse through your saved notes</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Link href="/notes">
              <Button className="group">
                View Notes{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
