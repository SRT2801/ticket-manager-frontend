export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mesh-gradient fixed inset-0 z-0" />
      <main className="relative z-10 flex min-h-screen items-start justify-center p-4 pt-12 md:p-6 md:pt-16">
        {children}
      </main>
    </>
  );
}
