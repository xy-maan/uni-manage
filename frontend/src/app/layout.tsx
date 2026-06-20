// // app/layout.tsx

// import "./globals.css";
import { ThemeProvider } from "next-themes";
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html suppressHydrationWarning >
//          <ThemeProvider attribute="class" defaultTheme="light">

//       <body suppressHydrationWarning>{children}</body>
//       </ThemeProvider>
//     </html>
//   );
// }
import "./globals.css";
// import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background text-foreground"
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}