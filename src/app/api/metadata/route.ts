import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ message: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const metadata = {
      title: $('meta[property="og:title"]').attr('content') || $('title').text(),
      description:
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content'),
      image: $('meta[property="og:image"]').attr('content'),
      favicon: $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href'),
      siteName: $('meta[property="og:site_name"]').attr('content'),
    };

    return NextResponse.json(metadata);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch metadata' }, { status: 500 });
  }
}
