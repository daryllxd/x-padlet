'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function ResumePage() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-lg bg-white p-4 shadow-lg">
        <Document
          file="/daryll-cv.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex flex-col items-center"
        >
          <Page
            pageNumber={pageNumber}
            width={800}
            className="my-4"
            renderTextLayer={true}
            renderAnnotationLayer={true}
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
            disabled={pageNumber >= (numPages || 1)}
            className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
