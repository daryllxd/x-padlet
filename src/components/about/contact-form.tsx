'use client';

import { useState } from 'react';

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Replace this with your actual Google Form embed URL
  const GOOGLE_FORM_URL = 'YOUR_GOOGLE_FORM_EMBED_URL';

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {!isSubmitted ? (
        <iframe
          src={GOOGLE_FORM_URL}
          width="100%"
          height="600px"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          className="mx-auto"
          onLoad={() => setIsSubmitted(true)}
        >
          Loading…
        </iframe>
      ) : (
        <div className="text-center">
          <h3 className="mb-2 text-xl font-semibold text-slate-800">Thank you for your message!</h3>
          <p className="text-slate-600">We'll get back to you as soon as possible.</p>
        </div>
      )}
    </div>
  );
}
