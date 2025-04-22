import { PugletDraggableState } from '@/lib/puglet-drag';

export function PugletDragIndicator({
  direction,
}: {
  direction: Exclude<PugletDraggableState['closestEdge'], null>;
}) {
  if (direction === 'left') {
    return (
      <div className="absolute top-[8px] left-[-10px] h-[calc(100%-16px)] w-1 -translate-x-full transform bg-blue-200">
        <div className="absolute -top-2 -left-[4px] h-3 w-3 rounded-xl bg-blue-200" />
        <div className="absolute -bottom-2 -left-[4px] h-3 w-3 rounded-xl bg-blue-200" />
      </div>
    );
  }

  if (direction === 'right') {
    return (
      <div className="absolute top-[8px] right-[-10px] h-[calc(100%-16px)] w-1 translate-x-full transform bg-blue-200">
        <div className="absolute -top-2 -left-[4px] h-3 w-3 rounded-xl bg-blue-200" />
        <div className="absolute -bottom-2 -left-[4px] h-3 w-3 rounded-xl bg-blue-200" />
      </div>
    );
  }

  if (direction === 'top') {
    return (
      <div className="absolute top-[-10px] left-[8px] h-1 w-[calc(100%-16px)] -translate-y-full transform bg-blue-200">
        <div className="absolute -bottom-1 -left-[4px] h-3 w-3 rounded-xl bg-blue-200" />
        <div className="absolute -right-[4px] -bottom-1 h-3 w-3 rounded-xl bg-blue-200" />
      </div>
    );
  }

  if (direction === 'bottom') {
    return (
      <div className="absolute bottom-[-10px] left-[8px] h-1 w-[calc(100%-16px)] -translate-y-full transform bg-blue-200">
        <div className="absolute -bottom-1 -left-[4px] h-3 w-3 rounded-xl bg-blue-200" />
        <div className="absolute -right-[4px] -bottom-1 h-3 w-3 rounded-xl bg-blue-200" />
      </div>
    );
  }
}
