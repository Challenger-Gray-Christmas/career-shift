"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Sample occupations for autocomplete (will be replaced by API)
const SAMPLE_OCCUPATIONS = [
  "Customer Service Representative",
  "Sales Representative",
  "Administrative Assistant",
  "HR Coordinator",
  "Account Manager",
  "Insurance Agent",
  "Retail Manager",
  "Bank Teller",
  "Receptionist",
  "Data Analyst",
  "Software Developer",
  "Project Manager",
  "Marketing Coordinator",
  "Financial Analyst",
  "Operations Manager",
];

interface OccupationSearchProps {
  value: string;
  onChange: (occupation: string) => void;
}

export function OccupationSearch({ value, onChange }: OccupationSearchProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = SAMPLE_OCCUPATIONS.filter((occ) =>
    occ.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSelect = (occupation: string) => {
    setQuery(occupation);
    onChange(occupation);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) => (i + 1) % filtered.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) => (i - 1 + filtered.length) % filtered.length);
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[highlightedIndex]) {
          handleSelect(filtered[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search any job title..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={handleKeyDown}
          className="pl-10"
        />
      </div>

      {isOpen && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filtered.map((occupation, index) => (
            <li
              key={occupation}
              className={cn(
                "px-4 py-2 cursor-pointer text-sm",
                index === highlightedIndex
                  ? "bg-gold/10 text-gold"
                  : "text-charcoal hover:bg-gray-50"
              )}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseDown={() => handleSelect(occupation)}
            >
              {occupation}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
