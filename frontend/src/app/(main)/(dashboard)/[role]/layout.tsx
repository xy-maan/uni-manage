// app/(main)/[role]/layout.tsx
export default async function RoleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {children}
    </div>
  );
}