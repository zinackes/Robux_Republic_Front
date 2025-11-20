import React, { useState, useCallback, useEffect } from 'react'
import { Input } from '@/components/ui/input.jsx'
import { Search, Loader2 } from 'lucide-react'

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return [debouncedValue];
}

const defaultFetchSuggestions = async (query, suggestionsList) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (!suggestionsList) return [];

    if (!query || query.trim() === '') return suggestionsList;

    return suggestionsList.filter((suggestion) =>
        suggestion?.toLowerCase().includes(query.toLowerCase()),
    )
}

export default function Autocomplete({
                                         value = '',
                                         onChange,
                                         suggestionsList = [],
                                         placeholder = "Search...",
                                         fetchSuggestionsFn
                                     }) {
    const [query, setQuery] = useState(value)
    const [debouncedQuery] = useDebounce(query, 300)
    const [suggestions, setSuggestions] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [isLoading, setIsLoading] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const fetchSuggestionsCallback = useCallback(async (q) => {

        setIsLoading(true)
        try {
            const fetcher = fetchSuggestionsFn || ((q) => defaultFetchSuggestions(q, suggestionsList));
            const results = await fetcher(q);
            setSuggestions(results || [])
        } catch (error) {
            console.error("Autocomplete error:", error);
            setSuggestions([]);
        } finally {
            setIsLoading(false)
        }
    }, [suggestionsList, fetchSuggestionsFn])

    useEffect(() => {
        setQuery(value);
    }, [value]);

    useEffect(() => {
        if (isFocused) {
            fetchSuggestionsCallback(debouncedQuery || '')
        } else {
            setSuggestions([])
        }
    }, [debouncedQuery, fetchSuggestionsCallback, isFocused])

    const handleInputChange = (e) => {
        const newValue = e.target.value
        setQuery(newValue)
        onChange?.(newValue)
        setSelectedIndex(-1)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : prev,
            )
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            const selected = suggestions[selectedIndex];
            setQuery(selected)
            onChange?.(selected)
            setSuggestions([])
            setSelectedIndex(-1)
            setIsFocused(false)
        } else if (e.key === 'Escape') {
            setSuggestions([])
            setSelectedIndex(-1)
            setIsFocused(false)
        }
    }

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion)
        onChange?.(suggestion)
        setSuggestions([])
        setSelectedIndex(-1)
    }

    const handleFocus = () => {
        setIsFocused(true)
        fetchSuggestionsCallback(query || '');
    }

    const handleBlur = () => {
        setTimeout(() => {
            setIsFocused(false)
            setSuggestions([])
            setSelectedIndex(-1)
        }, 200)
    }

    return (
        <div className="w-full relative group">
            <div className="relative">
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="pr-10 w-full bg-white dark:bg-gray-800"
                    aria-label="Search input"
                    aria-autocomplete="list"
                    aria-controls="suggestions-list"
                    aria-expanded={suggestions.length > 0}
                />
                <button
                    type="button"
                    className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700 flex items-center justify-center"
                    aria-label="Search"
                    tabIndex={-1}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </button>
            </div>

            {suggestions.length > 0 && isFocused && (
                <ul
                    id="suggestions-list"
                    className="mt-1 bg-white border border-gray-200 rounded-xl shadow-lg absolute z-50 w-full max-h-60 overflow-auto py-1 text-sm dark:bg-gray-800 dark:border-gray-700 "
                    role="listbox"
                >
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className={`px-4 py-2 cursor-pointer transition-colors dark:hover:bg-gray-700 hover:bg-gray-100${
                                index === selectedIndex ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                            }`}
                            onClick={() => handleSuggestionClick(suggestion)}
                            role="option"
                            aria-selected={index === selectedIndex}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}