# Code Improvements - Srikosha Scripture Library

## Overview
This document outlines comprehensive improvements to enhance user-friendliness, accuracy, and performance of the Srikosha scripture search and browsing application.

## 1. SEARCH API IMPROVEMENTS (app/api/search/route.ts)

### Current Issues:
- No input validation or sanitization
- Case-sensitivity issues in some searches
- Limited error handling
- No rate limiting protection
- Missing search result deduplication
- Inefficient verse search (no indexing)

### Proposed Solutions:

#### A. Input Validation & Sanitization
```typescript
// Add to search route

function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .toLowerCase()
    .replace(/[<>"']/g, '') // Remove potentially harmful characters
    .replace(/\s+/g, ' '); // Normalize whitespace
}

function validateSearchQuery(query: string): boolean {
  if (!query || typeof query !== 'string') return false;
  if (query.length < 2 || query.length > 200) return false;
  return !/[^\w\s\u0900-\u097F]/g.test(query); // Allow Sanskrit characters
}
```

#### B. Improved Error Handling
```typescript
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let query = searchParams.get('q')?.trim();
    
    if (!query || !validateSearchQuery(query)) {
      return NextResponse.json(
        { error: 'Invalid search query. Min 2, max 200 characters.' },
        { status: 400 }
      );
    }
    
    query = sanitizeSearchQuery(query);
    
    // Rest of search logic...
    
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? error : undefined },
      { status: 500 }
    );
  }
}
```

#### C. Deduplication & Better Ranking
```typescript
function deduplicateResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  return results.filter(result => {
    const key = `${result.type}:${result.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Enhanced result sorting
function rankResults(results: SearchResult[], query: string) {
  return results.sort((a, b) => {
    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();
    
    // Exact match
    if (aTitle === query && bTitle !== query) return -1;
    if (bTitle === query && aTitle !== query) return 1;
    
    // Starts with query
    if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1;
    if (bTitle.startsWith(query) && !aTitle.startsWith(query)) return 1;
    
    // Word boundary match
    const aWords = aTitle.split(' ');
    const bWords = bTitle.split(' ');
    const aMatches = aWords.filter(w => w.includes(query)).length;
    const bMatches = bWords.filter(w => w.includes(query)).length;
    if (aMatches !== bMatches) return bMatches - aMatches;
    
    // Type priority: categories > scriptures > verses
    const typePriority = { category: 3, scripture: 2, verse: 1 };
    return typePriority[b.type] - typePriority[a.type];
  });
}
```

## 2. SEARCH COMMAND COMPONENT IMPROVEMENTS (components/search-command.tsx)

### Current Issues:
- No loading skeleton UI
- Poor error state feedback
- Limited keyboard navigation
- No search history
- Missing accessibility features
- No result count display

### Proposed Solutions:

#### A. Enhanced Loading & Error States
```typescript
export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setError(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Search failed');
      }
      
      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setError(error.message || 'Failed to perform search');
        console.error('Search failed:', error);
      }
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Debounced search
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      search(query);
    }, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query, search]);
  
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search scriptures, verses, and categories..."
        value={query}
        onValueChange={setQuery}
        aria-label="Search scriptures"
      />
      <CommandList>
        {loading && (
          <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
            <Search className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center py-6 text-sm text-destructive">
            <AlertCircle className="mr-2 h-4 w-4" />
            {error}
          </div>
        )}
        
        {!loading && query.length >= 2 && results.length === 0 && !error && (
          <CommandEmpty>No results found for "{query}"</CommandEmpty>
        )}
        
        {!loading && results.length > 0 && (
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </div>
        )}
        
        {Object.entries(groupResults(results)).map(([type, typeResults]) => (
          <CommandGroup key={type} heading={`${type.charAt(0).toUpperCase()}${type.slice(1)}s (${typeResults.length})`}>
            {typeResults.map((result, index) => (
              <CommandItem
                key={`${type}-${index}`}
                value={`${result.title} ${result.subtitle || ''}`}
                onSelect={() => handleSelect(result)}
                className="flex flex-col items-start space-y-1 cursor-pointer"
              >
                <div className="flex items-center w-full">
                  {getIcon(result.type)}
                  <span className="font-medium flex-1">{result.title}</span>
                </div>
                {result.subtitle && (
                  <span className="text-sm text-muted-foreground ml-6">{result.subtitle}</span>
                )}
                {result.content && (
                  <span className="text-xs text-muted-foreground ml-6 line-clamp-2">{result.content}</span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

function groupResults(results: SearchResult[]): Record<string, SearchResult[]> {
  return results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);
}
```

## 3. NEW UTILITY FILE (lib/search-utils.ts)

```typescript
export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function highlightMatches(text: string, query: string): string {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '**$1**');
}

export function calculateRelevanceScore(title: string, subtitle: string | undefined, query: string): number {
  let score = 0;
  const lowerQuery = query.toLowerCase();
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle === lowerQuery) score += 100;
  if (lowerTitle.startsWith(lowerQuery)) score += 50;
  if (lowerTitle.includes(lowerQuery)) score += 25;
  
  if (subtitle) {
    const lowerSubtitle = subtitle.toLowerCase();
    if (lowerSubtitle.includes(lowerQuery)) score += 10;
  }
  
  return score;
}

export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
```

## 4. TYPES IMPROVEMENTS (lib/types.ts)

```typescript
export interface SearchResult {
  type: 'scripture' | 'verse' | 'category';
  title: string;
  subtitle?: string;
  content?: string;
  url: string;
  scripture?: string;
  verseNumber?: number;
  category?: string;
  relevanceScore?: number; // NEW: for better sorting
  highlightedTitle?: string; // NEW: for UI rendering
}

export interface SearchError {
  message: string;
  code: 'INVALID_QUERY' | 'SEARCH_TIMEOUT' | 'SERVER_ERROR';
}

export interface SearchResponse {
  success: boolean;
  results?: SearchResult[];
  error?: SearchError;
  timestamp: number;
  query: string;
}
```

## 5. UI/UX IMPROVEMENTS

### A. Accessibility Enhancements
- Add proper ARIA labels to all interactive elements
- Implement keyboard shortcuts display
- Add screen reader announcements for search results

### B. Visual Feedback
- Add loading skeleton placeholders
- Show result counts
- Highlight matching text in results
- Display search suggestions

### C. Performance
- Implement result caching (5-minute TTL)
- Add search request debouncing (300ms)
- Lazy-load result content

## 6. IMPLEMENTATION CHECKLIST

- [ ] Update app/api/search/route.ts with validation & error handling
- [ ] Create lib/search-utils.ts with utility functions
- [ ] Update lib/types.ts with enhanced interfaces
- [ ] Improve components/search-command.tsx with UX enhancements
- [ ] Add comprehensive error logging
- [ ] Add integration tests for search functionality
- [ ] Update documentation with new features
- [ ] Test with accessibility tools
- [ ] Performance testing and optimization
- [ ] Deploy and monitor error rates

## 7. TESTING RECOMMENDATIONS

- Unit tests for search validation and sanitization
- Integration tests for API endpoints
- E2E tests for search workflow
- Accessibility testing (WCAG 2.1 AA)
- Performance testing with large datasets
- Load testing for concurrent searches

