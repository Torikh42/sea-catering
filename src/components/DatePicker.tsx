"use client";

import * as React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils"; // Pastikan Anda memiliki utility 'cn'
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | null;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  minDate?: Date;
}

export function DatePicker({
  date,
  setDate,
  placeholder = "Pilih tanggal",
  minDate,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex h-10 w-full items-center justify-start rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-800 transition-colors hover:bg-gray-50 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500",
            !date && "text-gray-500",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          {date ? format(date, "d MMMM yyyy", { locale: id }) : <span>{placeholder}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={setDate}
          initialFocus
          locale={id}
          fromDate={minDate}
        />
      </PopoverContent>
    </Popover>
  );
}