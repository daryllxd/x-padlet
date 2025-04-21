/**
 * Extracts URLs from text while ignoring markdown links [text](url)
 * @param text The text to extract URLs from
 * @returns Array of URLs found in the text
 */
export function extractUrls(text: string): string[] {
  // Match URLs that are not inside parentheses
  const urlRegex = /(?<!\()(?<!\[.*\]\()(https?:\/\/[^\s<]+[^<.,:;"')\]\s])(?!\))/g;
  return text.match(urlRegex) || [];
}
