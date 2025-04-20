'use client';

import { useEffect, useState } from 'react';

interface Metadata {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
}

interface LinkPreviewProps {
  url: string;
  className?: string;
}

export default function LinkPreview({ url, className }: LinkPreviewProps) {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [faviconError, setFaviconError] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        setMetadata(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metadata');
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [url]);

  if (loading) return <LinkPreviewSkeleton />;
  if (error) return <LinkPreviewError message={error} />;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block overflow-hidden rounded-lg border border-gray-200 transition-colors hover:bg-gray-50 ${className}`}
    >
      <div className="flex flex-col p-3 sm:flex-row sm:gap-4">
        {metadata?.image && (
          <div className="relative mb-3 h-32 flex-shrink-0 sm:mb-0 sm:h-20 sm:w-20">
            <img
              src={metadata.image}
              alt={metadata.title || 'Link preview'}
              className="h-full w-full rounded-md object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {metadata?.siteName && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {metadata.favicon && !faviconError && (
                <img
                  src={metadata.favicon}
                  alt={metadata.siteName}
                  width={12}
                  height={12}
                  onError={() => setFaviconError(true)}
                />
              )}
              {metadata.siteName}
            </div>
          )}
          <h3 className="truncate text-sm font-medium text-gray-900">{metadata?.title || url}</h3>
          {metadata?.description && (
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{metadata.description}</p>
          )}
        </div>
      </div>
    </a>
  );
}

function LinkPreviewSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 p-3">
      <div className="flex flex-col sm:flex-row sm:gap-4">
        <div className="mb-3 h-32 flex-shrink-0 rounded-md bg-gray-200 sm:mb-0 sm:h-20 sm:w-20" />
        <div className="flex-1">
          <div className="mb-2 h-3 w-1/4 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-full rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function LinkPreviewError({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
      <p className="text-xs text-red-600">{message}</p>
    </div>
  );
}
