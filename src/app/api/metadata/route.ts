import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

async function getTwitterMetadata(url: string) {
  try {
    // Twitter/X requires a different approach since they block regular fetches
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;
    const response = await fetch(oembedUrl);
    const data = await response.json();

    return {
      title: data.author_name ? `${data.author_name} on Twitter` : 'Twitter Post',
      description: data.html?.replace(/<[^>]*>/g, '').slice(0, 200) || '',
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ message: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const parsedUrl = new URL(url);

    const allowedHosts = ['twitter.com', 'x.com'];

    if (allowedHosts.includes(parsedUrl.hostname)) {
      const metadata = await getTwitterMetadata(url);
      return NextResponse.json(metadata);
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PugletBot/1.0; +http://puglet.com)',
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const allowedRedditHosts = ['reddit.com', 'www.reddit.com'];

    if (allowedRedditHosts.includes(parsedUrl.hostname)) {
      const metadata = await getRedditMetadata($);
      return NextResponse.json(metadata);
    }

    const metadata = {
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
        new URL(url).hostname.replace(/^www\./, ''),
    };

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json({ message: 'Failed to fetch metadata' }, { status: 500 });
  }
}
