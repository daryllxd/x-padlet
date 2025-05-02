'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const PDFViewer = dynamic(() => import('./PDFViewer'), { ssr: false });

export default function ResumePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center lg:p-4">
      <div className="w-full max-w-4xl rounded-lg bg-white p-4 shadow-lg">
        <Suspense
          fallback={
            <div className="flex h-[800px] w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              <span className="ml-2">Loading PDF viewer...</span>
            </div>
          }
        >
          <PDFViewer />
        </Suspense>
      </div>
    </div>
  );
}
