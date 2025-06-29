import { Plus, FileText, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  message: string;
  buttonText: string;
  onButtonClick?: () => void;
  variant?: 'default' | 'search' | 'welcome';
}

export default function EmptyState({
  message,
  buttonText,
  onButtonClick,
  variant = 'default',
}: EmptyStateProps) {
  const getIcon = () => {
    switch (variant) {
      case 'search':
        return <FileText className="h-16 w-16 text-muted-foreground/50" />;
      case 'welcome':
        return <FileText className="h-16 w-16 text-primary/50" />;
      default:
        return <FileText className="h-16 w-16 text-muted-foreground/50" />;
    }
  };

  const getSubtitle = () => {
    switch (variant) {
      case 'search':
        return "Try adjusting your search terms or browse all notes";
      case 'welcome':
        return "Start organizing your thoughts and ideas";
      default:
        return "Get started by creating your first note";
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-8 max-w-md">
        <div className="mb-6 animate-fade-in">
          {getIcon()}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">
          {message}
        </h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {getSubtitle()}
        </p>
        {onButtonClick && (
          <Button 
            onClick={onButtonClick}
            size="lg"
            className="animate-fade-in-up"
          >
            <Plus className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
        )}
        {variant === 'welcome' && (
          <div className="mt-8 text-xs text-muted-foreground space-y-1">
            <p>💡 <strong>Pro tip:</strong> Use Ctrl+N to quickly create new notes</p>
            <p>🔍 <strong>Search:</strong> Find notes instantly with Ctrl+K</p>
            <p>💾 <strong>Auto-save:</strong> Your notes are saved automatically</p>
          </div>
        )}
      </div>
    </div>
  );
}
