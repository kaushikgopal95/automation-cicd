import { useState, useRef } from "react";
import countriesData from 'world-countries';
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CountrySelectProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

interface Country {
  code: string;
  name: string;
  emoji: string;
}

export function CountrySelect({ value, onChange, className }: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Map world-countries data to Country[]
  const countries: Country[] = countriesData.map((country: any) => ({
    code: country.cca2,
    name: country.name.common,
    emoji: country.flag || '',
  }));

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCountry = countries.find(country => country.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedCountry ? (
            <div className="flex items-center">
              <span className="mr-2 text-lg">{selectedCountry.emoji}</span>
              {selectedCountry.name}
            </div>
          ) : (
            <span className="text-muted-foreground">Select a country...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" ref={popoverRef}>
        <Command shouldFilter={false}>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <CommandInput
              placeholder="Search countries..."
              className="pl-8"
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
          </div>
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {filteredCountries.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No country found.
                </div>
              ) : (
                filteredCountries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={country.code}
                    onSelect={() => {
                      onChange(country.code);
                      setOpen(false);
                      setSearchTerm("");
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === country.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="mr-2 text-lg">{country.emoji}</span>
                    {country.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {country.code}
                    </span>
                  </CommandItem>
                ))
              )}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
