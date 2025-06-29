import { Note } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatDate } from "@/lib/storage";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Edit, Clock, Calendar, FileText } from "lucide-react";

interface NoteViewProps {
  note: Note;
  onEdit: () => void;
}

export default function NoteView({ note, onEdit }: NoteViewProps) {
  const wordCount = note.content.trim() ? note.content.trim().split(/\s+/).length : 0;
  const charCount = note.content.length;
  const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{note.title || "Untitled Note"}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDate(note.createdAt)}</span>
              </div>
              {note.updatedAt && note.updatedAt !== note.createdAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Modified {formatDate(note.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
          <Button onClick={onEdit} size="sm" className="ml-4">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            {note.content ? (
              <div className="prose prose-sm max-w-none">
                {note.content.split('\n').map((line, index) => (
                  <p key={index} className="mb-3 leading-relaxed">
                    {line || '\u00A0'}
                  </p>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <FileText className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">No content</p>
                <p className="text-sm">This note is empty. Click edit to add some content.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
          {readingTime > 0 && <span>~{readingTime} min read</span>}
        </div>
        <Button variant="outline" onClick={onEdit} size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Note
        </Button>
      </CardFooter>
    </Card>
  );
}
