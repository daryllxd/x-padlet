'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

interface ConditionalTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  showOnMobile?: boolean;
}

export function ConditionalTooltip({
  children,
  content,
  showOnMobile = false,
}: ConditionalTooltipProps) {
  const { isMobile } = useIsMobile();

  if (isMobile && !showOnMobile) {
    return children;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
}
