import { ChangeEventHandler, useCallback, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface FileUploaderProps {
  onFileInputChange: ChangeEventHandler<HTMLInputElement>;
}

export function FileUploader({ onFileInputChange = () => {} }: FileUploaderProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<'idle' | 'potential' | 'over'>('idle');

  const inputRef = useRef<HTMLInputElement>(null);
  const onInputTriggerClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div>
      <div
        ref={ref}
        className={cn(
          'rounded-lg border-2 border-dashed p-8 text-center',
          state === 'over' ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
          'hover:cursor-pointer hover:bg-gray-50',
          'transition-colors duration-200'
        )}
        onClick={onInputTriggerClick}
        onDragOver={(e) => {
          e.preventDefault();
          setState('over');
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setState('potential');
        }}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();

          setState('idle');
          onFileInputChange({
            target: {
              // @ts-expect-error - need to convert a DragEvent to an InputChangeEvent
              files: Array.from(e.dataTransfer.files),
            },
          });
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500">Click or drag and drop to add a cover image</p>
          <p className="mt-1 text-xs text-gray-400">Max 5MB</p>
        </div>

        <input
          ref={inputRef}
          id="file-input"
          onChange={onFileInputChange}
          type="file"
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
}
