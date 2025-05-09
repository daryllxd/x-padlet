'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCallback, useState } from 'react';

interface ImageState {
  original: string;
  thumbnail: string;
}

export default function ImageUploadPage() {
  const [image, setImage] = useState<ImageState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      // Create object URL for the original image
      const originalUrl = URL.createObjectURL(file);

      // Create a new worker
      const worker = new Worker(new URL('./imageWorker.ts', import.meta.url));

      // Convert file to array buffer
      const arrayBuffer = await file.arrayBuffer();

      // Send the image data to the worker
      worker.postMessage({ imageData: arrayBuffer }, [arrayBuffer]);

      // Handle the worker's response
      worker.onmessage = (e) => {
        const thumbnailUrl = URL.createObjectURL(new Blob([e.data], { type: 'image/jpeg' }));
        setImage({
          original: originalUrl,
          thumbnail: thumbnailUrl,
        });
        setIsProcessing(false);
        worker.terminate();
      };

      worker.onerror = (error) => {
        console.error('❗ Worker error:', error);
        setIsProcessing(false);
        worker.terminate();
      };
    } catch (error) {
      console.error('❗ Error processing image:', error);
      setIsProcessing(false);
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Image Upload with Thumbnail</h1>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button asChild>
                <span>Choose Image</span>
              </Button>
            </label>
          </div>

          {isProcessing && <div className="text-sm text-gray-500">Processing image...</div>}

          {image && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="mb-2 text-sm font-medium">Original Image</h3>
                <img src={image.original} alt="Original" className="h-auto w-full rounded-lg" />
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium">Thumbnail</h3>
                <img
                  src={image.thumbnail}
                  alt="Thumbnail"
                  className="h-[200px] w-[200px] rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
