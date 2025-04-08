import { ContactForm } from '@/components/about/contact-form';
import { FeatureCard } from '@/components/about/feature-card';
import { XPadletLink } from '@/components/ui/link/';
import { readFileSync } from 'fs';
import { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { join } from 'path';
import { RoughNotation } from 'react-rough-notation';

export const metadata: Metadata = {
  title: 'About | X-Padlet',
  description:
    'Learn more about X-Padlet and its mission to help you organize your work efficiently.',
};

const components = {
  FeatureCard,
  XPadletLink,
  RoughNotation,
};

export default function AboutPage() {
  const content = readFileSync(join(process.cwd(), 'src/content/about.mdx'), 'utf-8');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-slate mb-12">
            <MDXRemote source={content} components={components} />
          </div>

          <div className="mt-16 border-t border-slate-200 pt-8">
            <h2 className="mb-6 text-2xl font-semibold text-slate-800">Get in Touch</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
