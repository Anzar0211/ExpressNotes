"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotes } from "@/lib/note-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";

// AddNoteForm Component
// Why this design:
// 1. Form-focused UX: Dedicated page for note creation minimizes distractions
// 2. Controlled inputs: All form elements use controlled pattern for predictable state management
// 3. Client-side validation: Immediate feedback without server roundtrips
// 4. Toast notifications: Non-blocking feedback that doesn't interrupt the user flow
// 5. Loading states: Visual feedback during async operations improves perceived performance

export function AddNoteForm() {
  // Form state management - using separate states for each field enables granular validation
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // Saving state for loading indicators - improves perceived performance
  const [isSaving, setIsSaving] = useState(false);
  // Local error state for form-specific errors - separates form validation from API errors
  const [localError, setLocalError] = useState<string | null>(null);

  // Notes context provides global state and operations - avoids prop drilling
  const { addNote, loading, error: contextError } = useNotes();
  const router = useRouter();

  // Combine local and context errors - provides a single source of truth for error display
  const error = localError || contextError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation - immediate feedback improves user experience
    if (!title.trim()) {
      setLocalError("Title is required");
      toast.error("Title is required", {
        description: "Please enter a title for your note.",
        icon: <AlertCircle className="h-4 w-4 text-white" />,
        style: {
          background: "linear-gradient(to right, #ef4444, #f87171)",
          color: "white",
        },
      });
      return;
    }

    if (!content.trim()) {
      setLocalError("Content is required");
      toast.error("Content is required", {
        description: "Please enter some content for your note.",
        icon: <AlertCircle className="h-4 w-4 text-white" />,
        style: {
          background: "linear-gradient(to right, #ef4444, #f87171)",
          color: "white",
        },
      });
      return;
    }

    setLocalError(null);
    setIsSaving(true);

    toast.loading("Saving note...", {
      id: "saving-note",
      style: {
        background: "linear-gradient(to right, #6366f1, #a78bfa)",
        color: "white",
      },
    });

    try {
      await addNote({ title, content });
      // Reset form
      setTitle("");
      setContent("");

      toast.success("Note saved successfully!", {
        id: "saving-note",
        icon: <FileText className="h-4 w-4 text-white" />,
        description: "Redirecting to notes...",
        style: {
          background: "linear-gradient(to right, #22c55e, #4ade80)",
          color: "white",
        },
      });

      // Redirect to notes list
      router.push("/notes");
    } catch {
      // Error is handled by context
      toast.error("Failed to save note", {
        id: "saving-note",
        icon: <AlertCircle className="h-4 w-4 text-white" />,
        style: {
          background: "linear-gradient(to right, #ef4444, #f87171)",
          color: "white",
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-2xl sm:text-2xl md:text-3xl">
              Create Note
            </CardTitle>
            <CardDescription className="text-center mx-auto max-w-md mt-2">
              Add a new note with a title and content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 sm:px-8">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                disabled={isSaving || loading}
                className="focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
                rows={8}
                disabled={isSaving || loading}
                className="focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 resize-y min-h-[150px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 px-6 sm:px-8 py-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/notes")}
              disabled={isSaving || loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || loading}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
            >
              {isSaving || loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Note"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
