// This is a web worker that processes images and creates thumbnails

self.onmessage = async (e: MessageEvent) => {
  try {
    const { imageData } = e.data;

    // Create an image from the array buffer
    const blob = new Blob([imageData], { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);

    // Load the image
    const img = await createImageBitmap(blob);

    // Create a canvas for the thumbnail
    const canvas = new OffscreenCanvas(200, 200);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Calculate aspect ratio
    const aspectRatio = img.width / img.height;
    let drawWidth = 200;
    let drawHeight = 200;

    if (aspectRatio > 1) {
      // Image is wider than tall
      drawHeight = 200 / aspectRatio;
    } else {
      // Image is taller than wide
      drawWidth = 200 * aspectRatio;
    }

    // Center the image
    const x = (200 - drawWidth) / 2;
    const y = (200 - drawHeight) / 2;

    // Draw the image
    ctx.drawImage(img, x, y, drawWidth, drawHeight);

    // Add watermark
    ctx.save();
    ctx.globalAlpha = 0.5; // 50% opacity
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';

    // Add text shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    // Position in lower right with padding
    ctx.fillText('puglet', 190, 190);
    ctx.restore();

    // Convert to blob
    const thumbnailBlob = await canvas.convertToBlob({
      type: 'image/jpeg',
      quality: 0.8,
    });

    // Convert blob to array buffer
    const thumbnailArrayBuffer = await thumbnailBlob.arrayBuffer();

    // Send the thumbnail back to the main thread
    self.postMessage(thumbnailArrayBuffer, { transfer: [thumbnailArrayBuffer] });

    // Clean up
    URL.revokeObjectURL(imageUrl);
  } catch (error) {
    console.error('❗ Worker error:', error);
    self.postMessage({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
