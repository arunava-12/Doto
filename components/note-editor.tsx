"use client";

import { Note } from "@/lib/types";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Save, X, Loader2 } from "lucide-react";

interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export default function NoteEditor({
  note,
  onCancel,
  onSave,
  isSaving = false,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const hasTitleChanged = title !== note.title;
    const hasContentChanged = content !== note.content;
    setHasChanges(hasTitleChanged || hasContentChanged);
  }, [title, content, note.title, note.content]);

  const handleSave = useCallback(() => {
    if (hasChanges) {
      onSave({
        ...note,
        title: title.trim() || "Untitled Note",
        content,
      });
      setHasChanges(false);
    }
  }, [note, title, content, hasChanges, onSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      
      // Escape: Cancel
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, onCancel]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="text-xl font-bold border-none px-0 focus-visible:ring-0 bg-transparent"
          />
          {hasChanges && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>Unsaved</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here... (Manual save)"
          className="h-full resize-none border-none focus-visible:ring-0 p-4 min-h-[calc(100vh-350px)]"
        />
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2">
        <div className="text-xs text-muted-foreground">
          {isSaving ? (
            <div className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <span>Press Ctrl+S to save manually</span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || isSaving}
            className="min-w-[80px]"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
