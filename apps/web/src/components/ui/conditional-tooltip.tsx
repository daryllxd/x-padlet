'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import { ComponentProps, ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

interface ConditionalTooltipProps extends ComponentProps<typeof Tooltip> {
  content: ReactNode;
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

  const isTooltipContent = (node: ReactNode): node is ReactNode => {
    if (!node || typeof node !== 'object') return false;
    return 'type' in node && node.type === TooltipContent;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {isTooltipContent(content) ? content : <TooltipContent>{content}</TooltipContent>}
    </Tooltip>
  );
}
