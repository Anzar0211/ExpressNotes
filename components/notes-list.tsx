"use client";

import { useNotes } from "@/lib/note-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Trash2,
  PlusCircle,
  FileText,
  FileTextIcon,
  Calendar,
  ArrowLeft,
  Edit,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function NotesList() {
  // Using the note context to access shared state - avoids prop drilling and keeps components clean
  const { notes, removeNote, editNote, loading, error } = useNotes();
  // Local state for managing UI interactions - separate UI state from data state for better separation of concerns
  const [selectedNote, setSelectedNote] = useState<(typeof notes)[0] | null>(
    null
  );
  // Sheet visibility state - using a separate state for the sheet makes the component more maintainable
  const [isViewOpen, setIsViewOpen] = useState(false);
  // Edit mode state - separating edit mode from view mode makes the code easier to reason about
  const [isEditing, setIsEditing] = useState(false);
  // Form field states for controlled components - allows for validation and immediate feedback
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  // Saving state to provide user feedback during async operations - improves perceived performance
  const [isSaving, setIsSaving] = useState(false);

  // Format date for human-readable display - improves readability of timestamps
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Create a preview of content for cards - prevents large notes from breaking the UI layout
  const getContentPreview = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  // Confirmation pattern for destructive actions - prevents accidental deletions
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    // Prevent event bubbling to avoid triggering click events on parent elements
    e.stopPropagation();

    // Two-step confirmation pattern using toast - provides safety without modal dialogs
    toast("Delete note?", {
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await removeNote(id);
            toast.success("Note deleted successfully", {
              description: "Your note has been removed.",
              icon: <Trash2 className="h-4 w-4 text-white" />,
              style: {
                background: "linear-gradient(to right, #ff4b4b, #ff8080)",
                color: "white",
              },
            });
          } catch {
            toast.error("Failed to delete note", {
              description: "There was an error deleting your note.",
              style: {
                background: "linear-gradient(to right, #ff4b4b, #ff8080)",
                color: "white",
              },
            });
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          // Provide feedback for cancelled actions to improve user confidence
          toast.info("Deletion cancelled", {
            description: "The note was not deleted.",
            style: {
              background: "linear-gradient(to right, #3b82f6, #60a5fa)",
              color: "white",
            },
          });
        },
      },
      style: {
        background: "linear-gradient(to right, #f97316, #fdba74)",
        color: "white",
      },
    });
  };

  // Handle opening a note for detailed view - separates selection logic from rendering
  const handleNoteClick = (note: (typeof notes)[0]) => {
    // Set selected note and initialize form fields with current values
    setSelectedNote(note);
    setEditedTitle(note.title);
    setEditedContent(note.content);
    // Reset edit mode when opening a note - ensures consistent state
    setIsEditing(false);
    // Open the detail view sheet
    setIsViewOpen(true);
  };

  // Handle toggling edit mode - separates mode switching logic from UI rendering
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - revert to original values for a clean cancel experience
      if (selectedNote) {
        setEditedTitle(selectedNote.title);
        setEditedContent(selectedNote.content);
      }
      setIsEditing(false);
    } else {
      // Start editing - keep current values for a seamless transition
      setIsEditing(true);
    }
  };

  // Handle saving the edited note - centralizes save logic with validation
  const handleSaveEdit = async () => {
    if (!selectedNote) return;

    // Form validation - provide immediate feedback for invalid input
    if (!editedTitle.trim()) {
      toast.error("Title is required", {
        description: "Please enter a title for your note.",
        style: {
          background: "linear-gradient(to right, #ef4444, #f87171)",
          color: "white",
        },
      });
      return;
    }

    if (!editedContent.trim()) {
      toast.error("Content is required", {
        description: "Please enter some content for your note.",
        style: {
          background: "linear-gradient(to right, #ef4444, #f87171)",
          color: "white",
        },
      });
      return;
    }

    // Set saving state to provide visual feedback during async operations
    setIsSaving(true);

    try {
      // Update the note using the context function
      const updatedNote = await editNote(selectedNote.id, {
        title: editedTitle,
        content: editedContent,
      });

      // Update the selected note with the changes - ensures UI stays in sync with data
      setSelectedNote(updatedNote);
      // Exit edit mode after successful save
      setIsEditing(false);
    } catch (error) {
      // Log errors to console for debugging
      console.error("Failed to save edit:", error);
    } finally {
      // Always reset saving state regardless of success/failure
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header with title and add button - consistent across all views */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Your Notes
        </h1>
        <Link href="/add">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Note
          </Button>
        </Link>
      </div>

      {/* Error alert - shown when operations fail */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading state - centralized loader for better UX */}
      {loading && (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty state - provides guidance for users with no notes */}
      {!loading && notes.length === 0 && (
        <Card className="text-center py-12 shadow-md">
          <CardContent className="flex flex-col items-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-40" />
            <p className="text-muted-foreground mb-6 text-lg">
              You don&apos;t have any notes yet.
            </p>
            <Link href="/add">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Note
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Note grid - responsive layout for all screen sizes */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {notes.map((note) => (
          <Card
            key={note.id}
            className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer"
            onClick={() => handleNoteClick(note)}
          >
            <CardHeader>
              <CardTitle className="line-clamp-1">{note.title}</CardTitle>
              <CardDescription>
                Created on {formatDate(note.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="whitespace-pre-line line-clamp-4">
                {getContentPreview(note.content, 150)}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => handleDelete(note.id, e)}
                disabled={loading}
                className="transition-all hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Note Detail View Sheet - slide-in panel for detailed view/edit */}
      <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
        <SheetContent className="sm:max-w-xl w-full overflow-auto">
          <SheetHeader className="pb-4">
            {isEditing ? (
              <div className="space-y-2">
                <label htmlFor="edit-title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="edit-title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Note title"
                  className="focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  disabled={isSaving}
                />
              </div>
            ) : (
              <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                {selectedNote?.title}
              </SheetTitle>
            )}
            <SheetDescription className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              {selectedNote && formatDate(selectedNote.createdAt)}
              {selectedNote?.lastUpdated && (
                <span className="ml-2 text-xs">
                  (Edited: {formatDate(selectedNote.lastUpdated)})
                </span>
              )}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {isEditing ? (
              <div className="space-y-2">
                <label htmlFor="edit-content" className="text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="edit-content"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="Write your note here..."
                  rows={12}
                  className="focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 resize-y min-h-[200px]"
                  disabled={isSaving}
                />
              </div>
            ) : (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center mb-2 text-sm text-muted-foreground">
                  <FileTextIcon className="h-4 w-4 mr-1" />
                  Note Content
                </div>
                <div className="whitespace-pre-line text-foreground">
                  {selectedNote?.content}
                </div>
              </div>
            )}
          </div>
          <div className="mt-8 flex justify-between">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  className="gap-1"
                  onClick={handleEditToggle}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  className="gap-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <SheetClose asChild>
                  <Button variant="outline" className="gap-1">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Notes
                  </Button>
                </SheetClose>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="gap-1"
                    onClick={handleEditToggle}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      if (selectedNote) {
                        handleDelete(selectedNote.id, e);
                        setIsViewOpen(false);
                      }
                    }}
                    className="gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
