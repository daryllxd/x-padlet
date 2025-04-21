import * as cheerio from 'cheerio';
import DOMPurify from 'isomorphic-dompurify';
import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

// Constants for security limits
const MAX_RESPONSE_SIZE = 10 * 1024 * 1024; // 10MB
const FETCH_TIMEOUT = 5000; // 5 seconds
const ALLOWED_PROTOCOLS = ['http:', 'https:'];

// Basic URL validation
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return (
      ALLOWED_PROTOCOLS.includes(url.protocol) &&
      !url.hostname.includes('localhost') &&
      !url.hostname.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)
    ); // Block IP addresses
  } catch {
    return false;
  }
}

// Sanitize metadata fields
function sanitizeMetadata(metadata: Record<string, string | undefined>): Record<string, string> {
  return Object.entries(metadata).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value ? DOMPurify.sanitize(value.toString().slice(0, 1000)) : '',
    }),
    {}
  );
}

// Controller for fetching with timeout
async function fetchWithTimeout(url: string, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PugletBot/1.0; +http://puglet.com)',
      },
    });

    // Check response size
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_RESPONSE_SIZE) {
      throw new Error('Response too large');
    }

    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function getTwitterMetadata(url: string) {
  try {
    // Twitter/X requires a different approach since they block regular fetches
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;
    const response = await fetch(oembedUrl);
    const data = await response.json();

    return {
      title: data.author_name ? `${data.author_name} on Twitter` : 'Twitter Post',
      description: DOMPurify.sanitize(data.html).slice(0, 200),
      image: '/puglet.webp', // Twitter blocks image fetching, use fallback
      favicon: 'https://twitter.com/favicon.ico',
      siteName: 'Twitter',
    };
  } catch (error) {
    // Fallback if oembed fails
    return {
      title: 'Twitter Post',
      description: '',
      image: '/puglet.webp',
      favicon: 'https://twitter.com/favicon.ico',
      siteName: 'Twitter',
    };
  }
}

async function getRedditMetadata($: cheerio.CheerioAPI) {
  console.log('=== Reddit Metadata Debug ===');

  const shredditTitle = $('shreddit-title').attr('title');

  // Get the first paragraph from post content
  const postContent = $('[data-post-click-location="text-body"] p').first().text();

  // Trim to ~40 chars but preserve whole words
  const trimDescription = (text: string, maxLength: number = 40) => {
    if (!text || text.length <= maxLength) return text;
    const trimmed = text.substr(0, maxLength);
    // Find the last space before maxLength
    const lastSpace = trimmed.lastIndexOf(' ');
    return lastSpace > 0 ? trimmed.substr(0, lastSpace) + '...' : trimmed + '...';
  };

  return {
    title: shredditTitle?.split(' : ')[0],
    description: trimDescription(postContent),
    image:
      $('meta[property="og:image"]').attr('content') ||
      'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png',
    favicon: 'https://www.reddit.com/favicon.ico',
    siteName: 'Reddit',
  };
}

async function fetchMetadata(url: string) {
  const parsedUrl = new URL(url);

  if (['twitter.com', 'x.com'].includes(parsedUrl.hostname)) {
    return await getTwitterMetadata(url);
  }

  const response = await fetchWithTimeout(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  if (['reddit.com', 'www.reddit.com'].includes(parsedUrl.hostname)) {
    return await getRedditMetadata($);
  }

  return {
    title: $('meta[property="og:title"]').attr('content') || $('title').text(),
    description:
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content'),
    image: $('meta[property="og:image"]').attr('content') || '/puglet.webp',
    favicon:
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      new URL(url).origin + '/favicon.ico',
    siteName:
      $('meta[property="og:site_name"]').attr('content') ||
      parsedUrl.hostname.replace(/^www\./, ''),
  };
}

const getCachedMetadata = unstable_cache(
  async (url: string) => {
    const metadata = await fetchMetadata(url);
    return sanitizeMetadata(metadata);
  },
  ['link-metadata'],
  { revalidate: 3600 } // Cache for 1 hour
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    if (!isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
    }

    const metadata = await getCachedMetadata(url);
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching metadata:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 408 });
    }

    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}
