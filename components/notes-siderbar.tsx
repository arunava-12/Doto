import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "./empty-state";
import { Note } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { formatDate } from "@/lib/storage";
import { Trash2, Search, Clock, FileText } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useState, useMemo } from "react";

interface NotesSidebarProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  createNewNote: () => void;
  onDeleteNote: (id: string) => void;
  activeNoteId?: string;
}

type SortOption = 'updated' | 'created' | 'title';

export default function NotesSidebar({
  notes,
  onSelectNote,
  createNewNote,
  onDeleteNote,
  activeNoteId,
}: NotesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated');

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = notes.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }
    
    // Sort notes
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
        case 'created':
          return b.createdAt - a.createdAt;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [notes, searchQuery, sortBy]);

  const getSortIcon = (option: SortOption) => {
    switch (option) {
      case 'updated':
        return <Clock className="h-3 w-3" />;
      case 'created':
        return <FileText className="h-3 w-3" />;
      case 'title':
        return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>My Notes</span>
          <span className="text-sm font-normal text-muted-foreground">
            {filteredAndSortedNotes.length} note{filteredAndSortedNotes.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Sort Options */}
        <div className="flex gap-1">
          {(['updated', 'created', 'title'] as SortOption[]).map((option) => (
            <Button
              key={option}
              variant={sortBy === option ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy(option)}
              className="h-7 px-2 text-xs"
            >
              {getSortIcon(option)}
              <span className="ml-1 capitalize">{option}</span>
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        {notes.length === 0 ? (
          <EmptyState
            message="No notes yet"
            buttonText="Create your first note"
            onButtonClick={createNewNote}
            variant="default"
          />
        ) : filteredAndSortedNotes.length === 0 ? (
          <EmptyState
            message="No notes found"
            buttonText="Clear search"
            onButtonClick={() => setSearchQuery('')}
            variant="search"
          />
        ) : (
          <ScrollArea className="h-[calc(100vh-350px)]">
            <div className="p-3 space-y-2">
              {filteredAndSortedNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  className={`group p-3 rounded-lg cursor-pointer hover:bg-accent transition-all duration-200 border ${
                    activeNoteId === note.id 
                      ? "bg-accent border-primary/20 shadow-sm" 
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {note.title || "Untitled Note"}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {note.content || "No content"}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{formatDate(note.updatedAt || note.createdAt)}</span>
                        {note.updatedAt && note.updatedAt !== note.createdAt && (
                          <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            Modified
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
