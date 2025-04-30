import { AddNoteForm } from "@/components/add-note-form";

export default function AddNotePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
        Add New Note
      </h1>
      <AddNoteForm />
    </div>
  );
}
