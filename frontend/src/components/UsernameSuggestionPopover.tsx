import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface UsernameSuggestionPopoverProps {
  baseUsername: string;
  onSelect: (username: string) => void;
  onClose: () => void;
}

const UsernameSuggestionPopover = ({
  baseUsername,
  onSelect,
  onClose,
}: UsernameSuggestionPopoverProps) => {
  const generateSuggestions = (base: string): string[] => {
    const suggestions: string[] = [];
    const suffixes = [
      Math.floor(Math.random() * 999),
      "_aqua",
      `${new Date().getFullYear()}`,
      "_reef",
      Math.floor(Math.random() * 99) + "_fish",
    ];

    suffixes.forEach((suffix) => {
      suggestions.push(`${base}${suffix}`);
    });

    return suggestions;
  };

  const suggestions = generateSuggestions(baseUsername);

  const handleSelect = (username: string) => {
    onSelect(username);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-full md:left-full md:top-0 md:ml-3 md:mt-0 md:w-64 bg-popover border rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm">Suggestions</span>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="w-full justify-start text-left text-xs hover:bg-primary/10 hover:border-primary"
            onClick={() => handleSelect(suggestion)}
            type="button"
          >
            {suggestion}
          </Button>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full mt-2 text-xs"
        onClick={onClose}
        type="button"
      >
        Keep: {baseUsername}
      </Button>
    </div>
  );
};

export default UsernameSuggestionPopover;
