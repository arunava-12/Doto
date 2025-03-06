import { Plus } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onNewNote: () => void;
}
export default function Header({ onNewNote }: HeaderProps) {
  return (
    <header className="border-b p-4 bg-card">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Browser Notes</h1>
        <Button onClick={onNewNote} size="sm" className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" /> New Note
        </Button>
      </div>
    </header>
  );
}
