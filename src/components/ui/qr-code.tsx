import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  url: string;
  size?: number;
  className?: string;
}

export function QRCode({ url, size = 128, className }: QRCodeProps) {
  return (
    <div className={className}>
      <QRCodeSVG
        value={url}
        size={size}
        level="H" // Highest error correction
        bgColor="transparent"
        fgColor="currentColor"
      />
    </div>
  );
}
