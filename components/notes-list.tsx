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
  const { notes, removeNote, editNote, loading, error } = useNotes();
  const [selectedNote, setSelectedNote] = useState<(typeof notes)[0] | null>(
    null
  );
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getContentPreview = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

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

  const handleNoteClick = (note: (typeof notes)[0]) => {
    setSelectedNote(note);
    setEditedTitle(note.title);
    setEditedContent(note.content);
    setIsEditing(false);
    setIsViewOpen(true);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (selectedNote) {
        setEditedTitle(selectedNote.title);
        setEditedContent(selectedNote.content);
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedNote) return;

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

    setIsSaving(true);

    try {
      const updatedNote = await editNote(selectedNote.id, {
        title: editedTitle,
        content: editedContent,
      });

      setSelectedNote(updatedNote);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save edit:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:max-w-full">
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

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

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

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card
            key={note.id}
            className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer overflow-hidden"
            onClick={() => handleNoteClick(note)}
          >
            <CardHeader>
              <CardTitle className="line-clamp-1 break-all overflow-hidden text-ellipsis">
                {note.title}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Created on {formatDate(note.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="whitespace-pre-line line-clamp-4 break-words text-sm sm:text-base overflow-hidden">
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

      <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
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
              <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent break-words overflow-hidden">
                {selectedNote?.title}
              </SheetTitle>
            )}
            <SheetDescription className="flex items-center text-muted-foreground flex-wrap text-xs sm:text-sm">
              <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="break-words">
                {selectedNote && formatDate(selectedNote.createdAt)}
              </span>
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
              <div className="bg-muted/50 rounded-lg p-4 max-w-full">
                <div className="flex items-center mb-2 text-sm text-muted-foreground">
                  <FileTextIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  Note Content
                </div>
                <div className="whitespace-pre-wrap break-words text-foreground max-w-full overflow-hidden">
                  {selectedNote?.content}
                </div>
              </div>
            )}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row justify-between gap-2">
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
                <div className="flex gap-2 mt-2 sm:mt-0">
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
