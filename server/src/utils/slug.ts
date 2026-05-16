/**
 * Converts a sentence to an SEO-friendly URL slug format.
 * Replaces spaces with hyphens (-) and non-url-safe characters with underscores (_).
 * 
 * @param sentence The input title/sentence
 * @param max_words Maximum number of words to include in the slug
 */
export function sentence_to_url(sentence: string, max_words = 5): string {
  const words = sentence.trim().split(/\s+/);
  const limitedWords = words.slice(0, max_words);
  const cleanedWords = limitedWords.map(word => replace_urlsafe_characters(word));
  
  return cleanedWords.join("-");
}

/**
 * Extract the url number which is in the end of the url
 * @param slug The url slug to look for
 * @returns The number which is added to the end of the url, returns 0 if no number found
 */
export function extract_url_number(slug: string): number {
  const match = slug.match(/-(\d+)$/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return 0; 
}

function replace_urlsafe_characters(word: string): string {
  return word
    .toLowerCase()             // Good practice for URLs to be lowercase
    .replace(/[^\w.-]/g, "_")  // Non-urlsafe characters become underscores
    .replace(/_+/g, "_")       // Deduplicate multiple underscores
    .replace(/^_+|_+$/g, "");  // Clean trailing/leading underscores from the word
}
