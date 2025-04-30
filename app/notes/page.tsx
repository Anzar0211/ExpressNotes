import { NotesList } from "@/components/notes-list";

export default function NotesPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-200px)] py-12">
      <NotesList />
    </div>
  );
}
