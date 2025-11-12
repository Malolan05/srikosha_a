/**
 * Search Utilities - Reference Implementation
 * This file contains reusable utilities for search functionality
 * Copy these functions to: lib/search-utils.ts
 */

/**
 * Normalizes a search query for consistent matching
 * - Trims whitespace
 * - Converts to lowercase
 * - Normalizes multiple spaces
 */
export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Validates search query format and length
 */
export function validateSearchQuery(query: string): boolean {
  if (!query || typeof query !== 'string') return false;
  const trimmed = query.trim();
  // Min 2 chars, max 200 chars
  if (trimmed.length < 2 || trimmed.length > 200) return false;
  // Allow alphanumeric, spaces, and Sanskrit characters (U+0900-U+097F)
  return /^[\w\s\u0900-\u097F-]+$/u.test(trimmed);
}

/**
 * Sanitizes query to prevent injection attacks
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .toLowerCase()
    .replace(/[<>"'`]/g, '') // Remove dangerous characters
    .replace(/\s+/g, ' ')
    .substring(0, 200); // Enforce max length
}

/**
 * Calculates relevance score for search result ranking
 * Higher score = more relevant
 */
export function calculateRelevanceScore(
  title: string,
  subtitle: string | undefined,
  query: string
): number {
  let score = 0;
  const lowerQuery = query.toLowerCase();
  const lowerTitle = title.toLowerCase();

  // Exact match: 100 points
  if (lowerTitle === lowerQuery) return 100;

  // Starts with query: 50 points
  if (lowerTitle.startsWith(lowerQuery)) score += 50;

  // Contains query: 25 points
  if (lowerTitle.includes(lowerQuery)) score += 25;

  // Word boundary match: 15 points per word
  const words = lowerTitle.split(' ');
  const matchingWords = words.filter(w => w.startsWith(lowerQuery)).length;
  score += matchingWords * 15;

  // Subtitle contains query: 10 points
  if (subtitle) {
    if (subtitle.toLowerCase().includes(lowerQuery)) score += 10;
  }

  return score;
}

/**
 * Truncates text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Highlights search term in text (for display purposes)
 * Returns text with **query** markdown syntax
 */
export function highlightMatches(text: string, query: string): string {
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  return text.replace(regex, '**$1**');
}

/**
 * Deduplicates search results by URL
 */
export function deduplicateResults<T extends { url: string }>(
  results: T[]
): T[] {
  const seen = new Set<string>();
  return results.filter(result => {
    if (seen.has(result.url)) return false;
    seen.add(result.url);
    return true;
  });
}

/**
 * Groups search results by type
 */
export function groupResultsByType<T extends { type: string }>(
  results: T[]
): Record<string, T[]> {
  return results.reduce(
    (acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Extracts search keywords from query
 * Useful for advanced search features
 */
export function extractKeywords(query: string): string[] {
  return query
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 2);
}

/**
 * Creates a cache key for search results
 */
export function createCacheKey(query: string, filters?: Record<string, any>): string {
  const normalized = normalizeQuery(query);
  const filterString = filters ? JSON.stringify(filters) : '';
  return `search:${normalized}:${filterString}`;
}

/**
 * Formats search result for display
 */
export function formatSearchResult(result: any): string {
  const parts = [result.title];
  if (result.subtitle) parts.push(result.subtitle);
  if (result.content) parts.push(truncateText(result.content, 100));
  return parts.join(' | ');
}

/**
 * Validates search result structure
 */
export function isValidSearchResult(result: any): boolean {
  return (
    result &&
    typeof result === 'object' &&
    ['scripture', 'verse', 'category'].includes(result.type) &&
    typeof result.title === 'string' &&
    typeof result.url === 'string' &&
    result.title.length > 0
  );
}

/**
 * Rate limiting helper - returns true if request allowed
 */
export class SearchRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(clientId: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(clientId) || [];

    // Remove old requests outside window
    const recentRequests = requests.filter(time => now - time < this.windowMs);

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(clientId, recentRequests);
    return true;
  }
}
