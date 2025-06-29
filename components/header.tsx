import { Plus, Save } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";

interface HeaderProps {
  onNewNote: () => void;
  isSaving?: boolean;
}

export default function Header({ onNewNote, isSaving = false }: HeaderProps) {
  return (
    <header className="border-b p-4 bg-card">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/dot.png" alt="Doto" width={32} height={32} />
          <h1 className="text-2xl font-bold">Doto</h1>
          {isSaving && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground ml-4">
              <Save className="h-3 w-3 animate-pulse" />
              <span>Saving...</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+N</kbd>
            <span>New note</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+S</kbd>
            <span>Save</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
            <span>Cancel</span>
          </div>
          <ThemeToggle />
          <Button onClick={onNewNote} size="sm" className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" /> New Note
          </Button>
        </div>
      </div>
    </header>
  );
}
