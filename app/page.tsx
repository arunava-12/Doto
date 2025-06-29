"use client";

import EmptyState from "@/components/empty-state";
import Header from "@/components/header";
import NoteEditor from "@/components/note-editor";
import NoteView from "@/components/note-view";
import NotesSidebar from "@/components/notes-siderbar";
import ClickSpark from "@/components/click-spark";
import { loadNotes, saveNotes } from "@/lib/storage";
import { Note } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      setIsSaving(true);
      const timeoutId = setTimeout(() => {
        saveNotes(notes);
        setIsSaving(false);
      }, 500); // Reduced delay since NoteEditor already handles the main auto-save

      return () => clearTimeout(timeoutId);
    }
  }, [notes]);

  const createNewNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setIsEditing(true);
  }, [notes]);

  const selectNote = useCallback((note: Note) => {
    setActiveNote(note);
    setIsEditing(false);
  }, []);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const saveNote = useCallback((updatedNote: Note) => {
    const noteWithTimestamp = {
      ...updatedNote,
      updatedAt: Date.now(),
    };
    setNotes(
      notes.map((note) => (note.id === updatedNote.id ? noteWithTimestamp : note))
    );
    setActiveNote(noteWithTimestamp);
    setIsEditing(false);
  }, [notes]);

  const deleteNote = useCallback((id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (activeNote && activeNote.id === id) {
      setActiveNote(null);
      setIsEditing(false);
    }
  }, [notes, activeNote]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: New note
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createNewNote();
      }
      
      // Ctrl/Cmd + S: Save note (when editing)
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && isEditing) {
        e.preventDefault();
        // This will be handled by the NoteEditor component
      }
      
      // Escape: Cancel edit
      if (e.key === 'Escape' && isEditing) {
        e.preventDefault();
        cancelEdit();
      }
      
      // Ctrl/Cmd + K: Focus search (we'll add this later)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // TODO: Focus search input
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, createNewNote, cancelEdit]);

  const renderNoteContent = () => {
    if (!activeNote && notes.length === 0) {
      return (
        <EmptyState
          message="Welcome to Doto"
          buttonText="Create your first note"
          onButtonClick={createNewNote}
          variant="welcome"
        />
      );
    }

    if (activeNote && isEditing) {
      return (
        <NoteEditor 
          note={activeNote} 
          onSave={saveNote} 
          onCancel={cancelEdit}
          isSaving={isSaving}
        />
      );
    }

    if (activeNote) {
      return <NoteView note={activeNote} onEdit={() => setIsEditing(true)} />;
    }
    return null;
  };

  return (
    <ClickSpark
      sparkColor='#ffffff'
      sparkSize={8}
      sparkRadius={20}
      sparkCount={6}
      duration={500}
      easing="ease-out"
      extraScale={1.2}
    >
      <div className="flex flex-col min-h-screen">
        <Header onNewNote={createNewNote} isSaving={isSaving} />
        <main className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          <div className="md:col-span-1">
            <NotesSidebar
              createNewNote={createNewNote}
              notes={notes}
              onSelectNote={selectNote}
              onDeleteNote={deleteNote}
              activeNoteId={activeNote?.id}
            />
          </div>
          <div className="md:col-span-2">{renderNoteContent()}</div>
        </main>
      </div>
    </ClickSpark>
  );
}
