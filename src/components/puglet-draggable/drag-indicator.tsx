export function PugletDragIndicator({ direction }: { direction: 'left' | 'right' }) {
  if (direction === 'left') {
    return (
      <div className="absolute top-[8px] left-[-10px] h-[calc(100%-16px)] w-1 -translate-x-full transform bg-blue-200">
        <div className="absolute -top-2 -left-[4px] h-3 w-3 rounded-xl bg-blue-200" />
        <div className="absolute -bottom-2 -left-[4px] h-3 w-3 rounded-xl bg-blue-200" />
      </div>
    );
  }

  return (
    <div className="absolute top-[8px] right-[-10px] h-[calc(100%-16px)] w-1 translate-x-full transform bg-blue-200">
      <div className="absolute -top-2 -left-[4px] h-3 w-3 rounded-xl bg-blue-200" />
      <div className="absolute -bottom-2 -left-[4px] h-3 w-3 rounded-xl bg-blue-200" />
    </div>
  );
}
