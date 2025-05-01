export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">React Study</h1>
      {children}
    </div>
  );
}
