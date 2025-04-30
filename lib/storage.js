// Storage utility for reading/writing notes to localStorage
// Why a separate storage module?
// 1. Abstraction: Isolates storage implementation details from business logic
// 2. Future-proofing: Makes it easier to switch from localStorage to a backend API later
// 3. Testability: Simplifies mocking for unit tests
// 4. Separation of concerns: Keeps data access logic separate from UI components

// Key for storing notes in localStorage - use a specific key to avoid conflicts with other apps
const STORAGE_KEY = "note-service-notes";

// Note type definition - provides a consistent structure for all notes
export const NOTE_TYPE = {
  id: "",
  title: "",
  content: "",
  createdAt: 0,
};

/**
 * Get all notes from localStorage
 * @returns {Array} Array of note objects
 */
export const getNotes = () => {
  // Why localStorage: Simple client-side persistence without backend, with browser compatibility
  // and works offline. Perfect for small to medium data volume applications like note taking.
  if (typeof window === "undefined") {
    // Safety check for SSR environments where localStorage isn't available
    return [];
  }

  try {
    const notes = localStorage.getItem(STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    // Error handling for corrupted localStorage data - gracefully degrade instead of crashing
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

/**
 * Save a new note to localStorage
 * @param {Object} note Note object with title and content
 * @returns {Object} Saved note with generated ID
 */
export const saveNote = (note) => {
  try {
    const notes = getNotes();
    // Generate timestamp-based ID and add metadata - ensures uniqueness and enables sorting
    const newNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };

    // Add new note to the beginning of the array - most recent notes appear first
    const updatedNotes = [newNote, ...notes];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));

    return newNote;
  } catch (error) {
    // Comprehensive error handling with descriptive messages for debugging
    console.error("Error saving to localStorage:", error);
    throw new Error("Failed to save note");
  }
};

/**
 * Delete a note from localStorage
 * @param {string} id ID of the note to delete
 * @returns {boolean} Success status
 */
export const deleteNote = (id) => {
  try {
    const notes = getNotes();
    // Filter out the note with the given ID - immutable approach prevents side effects
    const filteredNotes = notes.filter((note) => note.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
    return true;
  } catch (error) {
    // Error handling with descriptive messages
    console.error("Error deleting from localStorage:", error);
    throw new Error("Failed to delete note");
  }
};

/**
 * Update an existing note in localStorage
 * @param {string} id ID of the note to update
 * @param {Object} updatedNote Note object with updated title and content
 * @returns {Object} Updated note
 */
export const updateNote = (id, updatedNote) => {
  try {
    const notes = getNotes();
    const noteIndex = notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) {
      // Graceful error handling when note doesn't exist
      throw new Error("Note not found");
    }

    // Preserve original metadata while updating content - maintains data integrity
    const updatedNoteWithMeta = {
      ...notes[noteIndex],
      title: updatedNote.title,
      content: updatedNote.content,
      lastUpdated: Date.now(), // Add lastUpdated timestamp to track modifications
    };

    notes[noteIndex] = updatedNoteWithMeta;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));

    return updatedNoteWithMeta;
  } catch (error) {
    // Descriptive error messages for easier debugging
    console.error("Error updating in localStorage:", error);
    throw new Error("Failed to update note");
  }
};
