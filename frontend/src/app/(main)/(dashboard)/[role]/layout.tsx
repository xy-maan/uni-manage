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
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
}