'use client';

export default function RecruiterDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* No Navbar here */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
