import { useMemo, useState } from "react";
import { CheckIcon, SearchIcon } from "lucide-react";
import { CITIES } from "../data/cities";

type Props = {
  value: string;
  onChange: (city: string) => void;
  error?: string;
};

export function CityPicker({ value, onChange, error }: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const selectedCity = CITIES.find((city) => city.name === value);

  const filteredCities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return CITIES;

    return CITIES.filter((city) =>
      city.name.toLowerCase().includes(normalizedQuery) ||
      city.country.toLowerCase().includes(normalizedQuery) ||
      city.code.toLowerCase().includes(normalizedQuery)
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="city-picker" style={{ color: "var(--mm-text-2)", fontSize: "13px", fontWeight: 600 }}>
          City
        </label>
        <span style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>Required for city ranks</span>
      </div>

      <div className="relative">
        <div className="relative">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            color="var(--mm-text-3)"
          />
          <input
            id="city-picker"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="city-picker-listbox"
            aria-autocomplete="list"
            autoComplete="off"
            value={isOpen ? query : selectedCity?.name ?? query}
            placeholder="Search city or country"
            onFocus={() => {
              setIsOpen(true);
              setQuery("");
            }}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
              if (value) onChange("");
            }}
            className="w-full rounded-xl py-3 pl-10 pr-4 outline-none transition-colors duration-200"
            style={{
              background: "var(--mm-surface-3)",
              border: `1px solid ${error ? "var(--mm-red)" : "var(--mm-border-2)"}`,
              color: "var(--mm-text)",
              fontSize: "14px",
              fontFamily: "var(--font-mabry)",
            }}
          />
        </div>

        {isOpen && (
          <div
            id="city-picker-listbox"
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-64 overflow-auto rounded-xl p-1"
            style={{
              background: "var(--mm-surface-1)",
              border: "1px solid var(--mm-border-2)",
              boxShadow: "0 18px 48px rgba(0,0,0,0.24)",
            }}
          >
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <button
                  key={`${city.code}-${city.name}`}
                  type="button"
                  role="option"
                  aria-selected={city.name === value}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange(city.name);
                    setQuery("");
                    setIsOpen(false);
                  }}
                  className="w-full rounded-lg px-3 py-2.5 text-left flex items-center gap-3 transition-colors duration-150"
                  style={{
                    background: city.name === value ? "var(--mm-nav-control-bg)" : "transparent",
                    color: "var(--mm-text)",
                    fontFamily: "var(--font-mabry)",
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: "17px" }}>{city.flag}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate" style={{ fontSize: "13px", fontWeight: 700 }}>{city.name}</span>
                    <span className="block truncate" style={{ color: "var(--mm-text-3)", fontSize: "11px" }}>{city.country}</span>
                  </span>
                  <span style={{ color: "var(--mm-text-3)", fontSize: "11px", fontWeight: 800 }}>{city.code}</span>
                  {city.name === value && <CheckIcon size={14} color="var(--mm-amber)" />}
                </button>
              ))
            ) : (
              <p className="px-3 py-4 text-center" style={{ color: "var(--mm-text-3)", fontSize: "12px" }}>
                No cities found
              </p>
            )}
          </div>
        )}
      </div>

      {error && <p style={{ color: "var(--mm-red)", fontSize: "12px" }}>{error}</p>}
    </div>
  );
}
