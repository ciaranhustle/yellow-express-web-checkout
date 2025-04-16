"use client";

import type React from "react";

interface SuggestionBubbleProps {
  suggestions: string[];
  selected: string[];
  onSelect: (suggestion: string) => void;
}

export const SuggestionBubble: React.FC<SuggestionBubbleProps> = ({
  suggestions,
  selected,
  onSelect,
}) => {
  const handleSelect = (suggestion: string) => {
    onSelect(suggestion);
  };

  const availableSuggestions = suggestions.filter(
    (suggestion) => !selected.includes(suggestion)
  );

  if (availableSuggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {availableSuggestions.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => handleSelect(suggestion)}
          className="px-4 py-2 bg-white rounded-md text-gray-800 hover:bg-gray-200 transition-colors border border-gray-200"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};
