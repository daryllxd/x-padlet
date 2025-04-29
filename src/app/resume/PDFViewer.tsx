'use client';

import { useState } from 'react';
import { Document, Page } from 'react-pdf';

export default function PDFViewer() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfFile, setPdfFile] = useState<string>('/daryll-cv.pdf');

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);
      setPdfFile(fileUrl);
      setPageNumber(1);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <label className="flex cursor-pointer items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          <span>Select PDF File</span>
          <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
        </label>
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
          width={800}
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
          disabled={pageNumber >= (numPages || 1)}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
