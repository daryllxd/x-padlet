'use client';

import { Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';

export default function PDFViewer() {
  const [numPages, setNumPages] = useState<number>(2);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfFile, setPdfFile] = useState<string>('/daryll-cv.pdf');
  const [scale, setScale] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize observer for responsive width
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(Math.min(entry.contentRect.width - 32, 800));
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Cleanup function to revoke object URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfFile && pdfFile.startsWith('blob:')) {
        URL.revokeObjectURL(pdfFile);
      }
    };
  }, [pdfFile]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      // Revoke any previous object URL to avoid memory leaks
      if (pdfFile && pdfFile.startsWith('blob:')) {
        URL.revokeObjectURL(pdfFile);
        const fileUrl = URL.createObjectURL(file);
        setPdfFile(fileUrl);
        setPageNumber(1);
      }
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfFile;
    link.download = 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center">
      <div className="mb-4 flex w-full max-w-4xl items-center justify-between gap-4">
        <label className="flex cursor-pointer items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          <span>Select PDF File</span>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Select a PDF file to view"
            id="pdf-file-input"
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((prev) => Math.min(prev + 0.1, 2))}
            className="rounded bg-gray-200 p-2 hover:bg-gray-300"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}
            className="rounded bg-gray-200 p-2 hover:bg-gray-300"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={handleDownload}
            className="rounded bg-gray-200 p-2 hover:bg-gray-300"
            title="Download PDF"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex flex-col items-center"
        loading={
          <div className="flex h-[800px] w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          </div>
        }
      >
        <Page
          pageNumber={pageNumber}
          width={containerWidth * scale}
          className="my-4"
          renderTextLayer={true}
          renderAnnotationLayer={true}
          loading={
            <div className="flex h-[800px] w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
          }
        />
      </Document>
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
        >
          Previous
        </button>
        <p className="text-gray-600">
          Page {pageNumber} of {numPages}
        </p>
        <button
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={pageNumber >= (numPages ?? 1)}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
