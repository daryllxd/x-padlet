import { cn } from '@/lib/utils';
import { getZIndex } from '@/lib/z-index';

const DEV_BANNER_LOCAL_ICON = '️☺️';
const DEV_BANNER_PROD_ICON = '⚒️❗️';

export function DevBanner() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const isLocalhost = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('localhost');

  return (
    <div
      className={cn(
        'fixed top-0 m-4 rounded-full px-3 py-1 text-xs font-medium max-md:right-0 md:left-0',
        isLocalhost ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600',
        'pointer-events-none',
        'md:px-4 md:py-1.5 md:text-sm',
        'shadow-sm',
        'font-mono'
      )}
      style={{ zIndex: getZIndex('devBanner') }}
    >
      <span className="md:hidden">
        {isLocalhost ? DEV_BANNER_LOCAL_ICON : DEV_BANNER_PROD_ICON}
      </span>
      <span className="hidden md:inline">{isLocalhost ? 'Dev|Local' : 'Dev|Prod DB❗'}</span>
    </div>
  );
}
