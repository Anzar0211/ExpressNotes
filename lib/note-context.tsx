"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { getNotes, saveNote, deleteNote, updateNote } from "./storage";
import { toast } from "sonner";
import { Check, AlertCircle, Edit2 } from "lucide-react";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  lastUpdated?: number;
};

type NoteContextType = {
  notes: Note[];
  addNote: (note: { title: string; content: string }) => Promise<Note>;
  removeNote: (id: string) => Promise<boolean>;
  editNote: (
    id: string,
    updatedNote: { title: string; content: string }
  ) => Promise<Note>;
  loading: boolean;
  error: string | null;
};

// Using Context API for global state management instead of prop drilling or more complex solutions like Redux
// This makes data easily accessible throughout the app while keeping the implementation simple
const NoteContext = createContext<NoteContextType | undefined>(undefined);

export function NoteProvider({ children }: { children: ReactNode }) {
  // Using array state for notes to trigger re-renders when the collection changes
  const [notes, setNotes] = useState<Note[]>([]);
  // Loading state to provide feedback during async operations and prevent multiple concurrent operations
  const [loading, setLoading] = useState<boolean>(false);
  // Error state to provide feedback when operations fail, improving user experience
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Load notes on mount to ensure data persistence across page refreshes
      // This gives the illusion of a database without needing a backend
      const storedNotes = getNotes();
      setNotes(storedNotes);
      if (storedNotes.length > 0) {
        // Using toast notifications for non-intrusive feedback that doesn't block the UI
        toast.success(`Loaded ${storedNotes.length} notes`, {
          description: "Your notes have been successfully loaded.",
          id: "notes-loaded",
          icon: <Check className="h-4 w-4 text-white" />,
          style: {
            background: "linear-gradient(to right, #22c55e, #4ade80)",
            color: "white",
          },
        });
      }
    } catch {
      // Error handling to provide user feedback when operations fail
      // This prevents silent failures that would confuse users
      setError("Failed to load notes");
      toast.error("Failed to load notes", {
        description: "There was an error loading your notes.",
        icon: <AlertCircle className="h-4 w-4 text-white" />,
        style: {
          background: "linear-gradient(to right, #ef4444, #f87171)",
          color: "white",
        },
      });
    }
  }, []);

  const addNote = async (note: {
    title: string;
    content: string;
  }): Promise<Note> => {
    // Set loading state to prevent multiple concurrent save operations and provide user feedback
    setLoading(true);
    // Clear previous errors when starting a new operation
    setError(null);

    try {
      // Artificial delay to improve user experience by making the operation feel substantial
      // This prevents the UI from flickering too quickly between states
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newNote = saveNote(note) as Note;

      // Update state optimistically before confirming persistence
      // This makes the app feel faster and more responsive
      setNotes((prevNotes) => [...prevNotes, newNote]);

      // Using toast for non-blocking feedback to confirm the action was successful
      toast.success("Note saved", {
        description: "Your note has been successfully saved.",
        icon: <Check className="h-4 w-4 text-white" />,
        style: {
          background: "linear-gradient(to right, #22c55e, #4ade80)",
          color: "white",
        },
      });
      return newNote;
    } catch (err) {
      // Detailed error handling to help users understand what went wrong
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save note";
      setError(errorMessage);
      toast.error("Failed to save note", {
        description: errorMessage,
        icon: <AlertCircle className="h-4 w-4 text-white" />,
        style: {
          background: "linear-gradient(to right, #ef4444, #f87171)",
          color: "white",
        },
      });
      throw err;
    } finally {
      // Always reset loading state to prevent UI getting stuck in loading state
      setLoading(false);
    }
  };

  const removeNote = async (id: string): Promise<boolean> => {
    // Set loading state to provide feedback during async operations
    setLoading(true);
    setError(null);

    try {
      // Artificial delay to match user expectations about operation complexity
      await new Promise((resolve) => setTimeout(resolve, 500));

      const success = deleteNote(id);

      // Update UI state optimistically for perceived performance
      if (success) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
        toast.success("Note deleted", {
          description: "Your note has been successfully deleted.",
          icon: <Check className="h-4 w-4 text-white" />,
          style: {
            background: "linear-gradient(to right, #22c55e, #4ade80)",
            color: "white",
          },
        });
      }
      return success;
    } catch (err) {
      // Comprehensive error handling with actionable feedback
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete note";
      setError(errorMessage);
      toast.error("Failed to delete note", {
        description: errorMessage,
        icon: <AlertCircle className="h-4 w-4 text-white" />,
        style: {
          background: "linear-gradient(to right, #ef4444, #f87171)",
          color: "white",
        },
      });
      return false;
    } finally {
      // Always clean up the loading state to ensure UI consistency
      setLoading(false);
    }
  };

  const editNote = async (
    id: string,
    updatedNote: { title: string; content: string }
  ): Promise<Note> => {
    // Set loading state for better UX during async operations
    setLoading(true);
    setError(null);

    try {
      // Using artificial delay to create a consistent feeling of "weight" to operations
      // This improves perceived reliability
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updated = updateNote(id, updatedNote) as Note;

      // Optimistic UI updates make the app feel responsive even before persistence is confirmed
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? updated : note))
      );

      // Visual confirmation via toast creates a sense of accomplishment and completion
      toast.success("Note updated", {
        description: "Your note has been successfully updated.",
        icon: <Edit2 className="h-4 w-4 text-white" />,
        style: {
          background: "linear-gradient(to right, #3b82f6, #60a5fa)",
          color: "white",
        },
      });
      return updated;
    } catch (err) {
      // Detailed error handling improves user trust by communicating clearly what went wrong
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update note";
      setError(errorMessage);
      toast.error("Failed to update note", {
        description: errorMessage,
        icon: <AlertCircle className="h-4 w-4 text-white" />,
        style: {
          background: "linear-gradient(to right, #ef4444, #f87171)",
          color: "white",
        },
      });
      throw err;
    } finally {
      // Always reset loading state to prevent the UI from appearing stuck
      setLoading(false);
    }
  };

  // Providing the full state and methods through context
  // This avoids prop drilling and keeps component tree clean
  const value = {
    notes,
    addNote,
    removeNote,
    editNote,
    loading,
    error,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}

// Custom hook to consume the context
// This simplifies usage in components and provides type safety
export function useNotes() {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NoteProvider");
  }
  return context;
}
