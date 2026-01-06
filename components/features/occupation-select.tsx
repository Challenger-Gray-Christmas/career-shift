"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OccupationSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  occupations: { id: string; name: string }[];
}

export function OccupationSelect({ value, onValueChange, occupations }: OccupationSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[320px]">
        <SelectValue placeholder="Select an occupation" />
      </SelectTrigger>
      <SelectContent>
        {occupations.map((occ) => (
          <SelectItem key={occ.id} value={occ.id}>
            {occ.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
